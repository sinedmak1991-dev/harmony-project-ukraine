import { useEffect, useRef, useState } from 'react';
import {
  Contrast,
  Link2,
  PauseCircle,
  RotateCcw,
  Type,
  X,
} from 'lucide-react';

type FontScale = 'normal' | 'large' | 'xlarge';

interface AccessibilitySettings {
  fontScale: FontScale;
  highContrast: boolean;
  readableFont: boolean;
  highlightLinks: boolean;
  reduceMotion: boolean;
}

const STORAGE_KEY = 'harmony-a11y-settings-v1';

const DEFAULT_SETTINGS: AccessibilitySettings = {
  fontScale: 'normal',
  highContrast: false,
  readableFont: false,
  highlightLinks: false,
  reduceMotion: false,
};

const FONT_SCALE_OPTIONS: { value: FontScale; label: string; short: string }[] = [
  { value: 'normal', label: 'Звичайний (100%)', short: '100%' },
  { value: 'large', label: 'Збільшений (115%)', short: '115%' },
  { value: 'xlarge', label: 'Великий (130%)', short: '130%' },
];

function loadSavedSettings(): AccessibilitySettings {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return DEFAULT_SETTINGS;
    const parsed = JSON.parse(raw) as Partial<AccessibilitySettings>;
    const validScale: FontScale =
      parsed.fontScale === 'large' || parsed.fontScale === 'xlarge'
        ? parsed.fontScale
        : 'normal';

    return {
      fontScale: validScale,
      highContrast: Boolean(parsed.highContrast),
      readableFont: Boolean(parsed.readableFont),
      highlightLinks: Boolean(parsed.highlightLinks),
      reduceMotion: Boolean(parsed.reduceMotion),
    };
  } catch {
    return DEFAULT_SETTINGS;
  }
}

function applySettingsToDocument(settings: AccessibilitySettings) {
  const root = document.documentElement;

  root.classList.remove('a11y-font-115', 'a11y-font-130');
  if (settings.fontScale === 'large') {
    root.classList.add('a11y-font-115');
  } else if (settings.fontScale === 'xlarge') {
    root.classList.add('a11y-font-130');
  }

  root.classList.toggle('a11y-high-contrast', settings.highContrast);
  root.classList.toggle('a11y-readable-font', settings.readableFont);
  root.classList.toggle('a11y-highlight-links', settings.highlightLinks);
  root.classList.toggle('a11y-reduce-motion', settings.reduceMotion);
}

/** Іконка універсальної доступності (людина в колі) */
function AccessibilityIcon({ className = 'w-6 h-6' }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.85"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
    >
      <circle cx="12" cy="12" r="10" />
      <circle cx="12" cy="7.2" r="1.35" fill="currentColor" stroke="none" />
      <path d="M7.5 10.2c1.5.55 3 .8 4.5.8s3-.25 4.5-.8" />
      <path d="M12 11v3.2" />
      <path d="M12 14.2 9.4 18" />
      <path d="M12 14.2 14.6 18" />
    </svg>
  );
}

export function AccessibilityWidget() {
  const [settings, setSettings] = useState<AccessibilitySettings>(() =>
    loadSavedSettings()
  );
  const [isOpen, setIsOpen] = useState(false);
  const [announcement, setAnnouncement] = useState('');

  const panelRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);

  const hasActiveSettings =
    settings.fontScale !== 'normal' ||
    settings.highContrast ||
    settings.readableFont ||
    settings.highlightLinks ||
    settings.reduceMotion;

  // Застосування налаштувань до <html> та збереження у localStorage
  useEffect(() => {
    applySettingsToDocument(settings);
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(settings));
    } catch {
      // Ігноруємо помилку сховища у середовищах з обмеженнями cookie/storage
    }
  }, [settings]);

  // Закриття панелі клавішею Escape або кліком зовні + керування фокусом
  useEffect(() => {
    if (!isOpen) return;

    closeButtonRef.current?.focus();

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setIsOpen(false);
        triggerRef.current?.focus();
      }
    };

    const handlePointerDown = (event: MouseEvent) => {
      const target = event.target as Node;
      if (
        panelRef.current &&
        !panelRef.current.contains(target) &&
        triggerRef.current &&
        !triggerRef.current.contains(target)
      ) {
        setIsOpen(false);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    document.addEventListener('mousedown', handlePointerDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      document.removeEventListener('mousedown', handlePointerDown);
    };
  }, [isOpen]);

  const handleReset = () => {
    setSettings(DEFAULT_SETTINGS);
    setAnnouncement('Налаштування доступності скинуто до стандартних.');
  };

  const toggleSetting = (
    key: 'highContrast' | 'readableFont' | 'highlightLinks' | 'reduceMotion',
    label: string
  ) => {
    setSettings((prev) => {
      const nextValue = !prev[key];
      setAnnouncement(`${label}: ${nextValue ? 'увімкнено' : 'вимкнено'}.`);
      return { ...prev, [key]: nextValue };
    });
  };

  const toggleRows: {
    key: 'highContrast' | 'readableFont' | 'highlightLinks' | 'reduceMotion';
    label: string;
    description: string;
    icon: typeof Contrast;
  }[] = [
    {
      key: 'highContrast',
      label: 'Високий контраст',
      description: 'Чіткіший текст, насичені межі та контрастний фон',
      icon: Contrast,
    },
    {
      key: 'readableFont',
      label: 'Зручне читання',
      description: 'Більші інтервали тексту та вирівнювання по лівому краю',
      icon: Type,
    },
    {
      key: 'highlightLinks',
      label: 'Підсвітити посилання й кнопки',
      description: 'Додає помітний контур усім інтерактивним елементам',
      icon: Link2,
    },
    {
      key: 'reduceMotion',
      label: 'Зупинити анімації',
      description: 'Вимикає рух елементів і плавні переходи',
      icon: PauseCircle,
    },
  ];

  return (
    <div className="a11y-widget-root fixed bottom-5 right-5 z-50 flex flex-col items-end">
      {/* Прихований live-регіон для озвучення змін скрінрідером */}
      <span className="sr-only" role="status" aria-live="polite">
        {announcement}
      </span>

      {/* Панель налаштувань доступності */}
      {isOpen && (
        <div
          ref={panelRef}
          id="accessibility-panel"
          role="dialog"
          aria-modal="false"
          aria-labelledby="a11y-panel-title"
          className="mb-3 w-[calc(100vw-2.5rem)] max-w-[340px] max-h-[calc(100vh-6.5rem)] overflow-y-auto rounded-3xl bg-white border border-emerald-900/15 shadow-[0_24px_60px_-18px_rgba(24,78,72,0.32)] text-harmony-ink"
        >
          {/* Шапка панелі */}
          <div className="sticky top-0 z-10 flex items-center justify-between gap-3 bg-[#184E48] text-white px-5 py-4 rounded-t-3xl">
            <div className="flex items-center gap-2.5 min-w-0">
              <AccessibilityIcon className="w-5 h-5 text-emerald-200 shrink-0" />
              <div className="min-w-0">
                <h2
                  id="a11y-panel-title"
                  className="font-ui text-[15px] font-bold leading-tight truncate"
                >
                  Налаштування доступності
                </h2>
                <p className="text-[11px] text-emerald-100/85 mt-0.5">
                  Безбар’єрний режим сайту
                </p>
              </div>
            </div>

            <button
              ref={closeButtonRef}
              type="button"
              onClick={() => {
                setIsOpen(false);
                triggerRef.current?.focus();
              }}
              aria-label="Закрити панель налаштувань доступності"
              className="w-8 h-8 rounded-full bg-white/15 hover:bg-white/25 text-white flex items-center justify-center transition-colors shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-200"
            >
              <X className="w-4 h-4" aria-hidden="true" />
            </button>
          </div>

          {/* Основні налаштування */}
          <div className="p-4 space-y-4">
            {/* Розмір шрифту (3 режими) */}
            <div className="rounded-2xl bg-[#F7FBF9] border border-emerald-900/10 p-3.5">
              <div className="flex items-center justify-between gap-2 mb-2.5">
                <span
                  id="a11y-font-scale-label"
                  className="font-ui text-xs font-bold uppercase tracking-wider text-[#184E48]"
                >
                  Розмір шрифту
                </span>
                <span className="font-ui text-xs font-semibold text-[#22A06B]">
                  {
                    FONT_SCALE_OPTIONS.find((opt) => opt.value === settings.fontScale)
                      ?.short
                  }
                </span>
              </div>

              <div
                role="radiogroup"
                aria-labelledby="a11y-font-scale-label"
                className="grid grid-cols-3 gap-1.5"
              >
                {FONT_SCALE_OPTIONS.map((option) => {
                  const selected = settings.fontScale === option.value;
                  return (
                    <button
                      key={option.value}
                      type="button"
                      role="radio"
                      aria-checked={selected}
                      aria-label={option.label}
                      onClick={() => {
                        setSettings((prev) => ({ ...prev, fontScale: option.value }));
                        setAnnouncement(`Розмір шрифту: ${option.label}.`);
                      }}
                      className={`font-ui px-2 py-2 rounded-xl text-xs font-semibold transition-all duration-200 focus-visible:ring-2 focus-visible:ring-[#22A06B] ${
                        selected
                          ? 'bg-[#22A06B] text-white shadow-xs'
                          : 'bg-white border border-emerald-900/12 text-[#184E48] hover:bg-[#EAF4EE]'
                      }`}
                    >
                      <span className="block leading-tight">
                        {option.value === 'normal'
                          ? 'Звичайний'
                          : option.value === 'large'
                            ? 'Збільшений'
                            : 'Великий'}
                      </span>
                      <span
                        className={`block text-[11px] mt-0.5 ${
                          selected ? 'text-emerald-50' : 'text-harmony-ink/75'
                        }`}
                      >
                        {option.short}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Перемикачі режимів доступності */}
            <div className="space-y-2">
              {toggleRows.map(({ key, label, description, icon: Icon }) => {
                const enabled = settings[key];
                return (
                  <button
                    key={key}
                    type="button"
                    role="switch"
                    aria-checked={enabled}
                    onClick={() => toggleSetting(key, label)}
                    className={`w-full text-left flex items-center justify-between gap-3 p-3 rounded-2xl border transition-all duration-200 focus-visible:ring-2 focus-visible:ring-[#22A06B] ${
                      enabled
                        ? 'bg-[#EAF4EE] border-[#22A06B]/45'
                        : 'bg-white border-emerald-900/10 hover:bg-[#F7FBF9] hover:border-[#22A06B]/30'
                    }`}
                  >
                    <span className="flex items-start gap-2.5 min-w-0">
                      <span
                        className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 mt-0.5 transition-colors ${
                          enabled
                            ? 'bg-[#22A06B] text-white'
                            : 'bg-[#E6F5EE] text-[#22A06B]'
                        }`}
                        aria-hidden="true"
                      >
                        <Icon className="w-4 h-4" strokeWidth={1.85} aria-hidden="true" />
                      </span>
                      <span className="min-w-0">
                        <span className="block font-ui text-[13px] font-semibold text-[#184E48] leading-snug">
                          {label}
                        </span>
                        <span className="block text-[11px] text-harmony-ink/80 leading-snug mt-0.5">
                          {description}
                        </span>
                      </span>
                    </span>

                    {/* Візуальний тумблер */}
                    <span
                      aria-hidden="true"
                      className={`relative inline-flex h-6 w-11 shrink-0 rounded-full border-2 border-transparent transition-colors duration-200 ${
                        enabled ? 'bg-[#22A06B]' : 'bg-emerald-900/20'
                      }`}
                    >
                      <span
                        className={`pointer-events-none inline-block h-5 w-5 rounded-full bg-white shadow-xs transform transition-transform duration-200 ${
                          enabled ? 'translate-x-5' : 'translate-x-0'
                        }`}
                      />
                    </span>
                  </button>
                );
              })}
            </div>

            {/* Кнопка скидання налаштувань */}
            <button
              type="button"
              onClick={handleReset}
              disabled={!hasActiveSettings}
              className="w-full font-ui inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-full border border-[#184E48]/20 bg-[#F7FBF9] hover:bg-[#EAF4EE] text-[#184E48] text-xs font-semibold transition-colors disabled:opacity-45 disabled:pointer-events-none focus-visible:ring-2 focus-visible:ring-[#22A06B]"
            >
              <RotateCcw className="w-3.5 h-3.5" aria-hidden="true" />
              <span>Скинути налаштування</span>
            </button>
          </div>
        </div>
      )}

      {/* Плаваюча кругла кнопка доступності з підказкою при наведенні */}
      <div className="relative group">
        <span
          aria-hidden="true"
          className="pointer-events-none absolute right-full mr-3 top-1/2 -translate-y-1/2 whitespace-nowrap rounded-full bg-[#184E48] text-white font-ui text-xs font-semibold px-3.5 py-2 shadow-md opacity-0 translate-x-1 group-hover:opacity-100 group-hover:translate-x-0 group-focus-within:opacity-100 group-focus-within:translate-x-0 transition-all duration-200"
        >
          Налаштування доступності
        </span>

        <button
          ref={triggerRef}
          type="button"
          onClick={() => setIsOpen((prev) => !prev)}
          aria-expanded={isOpen}
          aria-controls="accessibility-panel"
          aria-label="Налаштування доступності"
          title="Налаштування доступності"
          className="relative w-13 h-13 sm:w-14 sm:h-14 rounded-full bg-[#184E48] hover:bg-[#22A06B] text-white shadow-lg flex items-center justify-center transition-all duration-200 hover:-translate-y-0.5 hover:shadow-xl active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#22A06B] focus-visible:ring-offset-2"
        >
          <AccessibilityIcon className="w-7 h-7" />
          {hasActiveSettings && (
            <span
              aria-hidden="true"
              className="absolute top-0.5 right-0.5 w-3.5 h-3.5 rounded-full bg-[#22A06B] ring-2 ring-white"
            />
          )}
        </button>
      </div>
    </div>
  );
}
