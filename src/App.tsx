import { type FormEvent, useEffect, useMemo, useState } from 'react';
import {
  AlertCircle,
  ArrowRight,
  BookOpen,
  CheckCircle2,
  ChevronRight,
  Compass,
  Flower2,
  Focus,
  Globe,
  Heart,
  HeartHandshake,
  Hexagon,
  Leaf,
  Link2,
  Loader2,
  Mail,
  MapPin,
  Phone,
  RefreshCw,
  School,
  Send,
  ShieldCheck,
  Sparkles,
  Sprout,
  Sun,
  Users,
  Wind,
} from 'lucide-react';
import { AccessibilityWidget } from './components/AccessibilityWidget';
import { Header, SeedOfLifeMark } from './components/Header';
import { ImpactCounter } from './components/ImpactCounter';
import { JoinModal } from './components/JoinModal';
import { Logo } from './components/Logo';
import { MediaFrame } from './components/MediaFrame';
import { NewsModal } from './components/NewsModal';
import { Reveal } from './components/Reveal';
import {
  type HarmonyPrincipleItem,
  type Language,
  MEDIA_ASSETS,
  type NewsArticle,
  type NewsCategory,
  SITE_CONTENT,
} from './data/harmonyContent';
import {
  fetchNewsFromSheet,
  localizeNewsArticle,
  submitContactToSheet,
} from './services/googleSheetsApi';

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const LANG_STORAGE_KEY = 'harmony_lang';
const STAGGER_DELAYS = [100, 200, 300, 400, 500] as const;

function loadSavedLanguage(): Language {
  try {
    const saved = window.localStorage.getItem(LANG_STORAGE_KEY);
    if (saved === 'en' || saved === 'uk') {
      return saved;
    }
  } catch {
    // Ігноруємо помилку сховища у середовищах з обмеженнями
  }
  return 'uk';
}

function getStaggerDelay(index: number): 0 | 100 | 200 | 300 | 400 | 500 {
  return STAGGER_DELAYS[Math.min(index, STAGGER_DELAYS.length - 1)];
}

function renderPillarIcon(name: 'heart' | 'compass' | 'flower' | 'sparkles') {
  switch (name) {
    case 'heart':
      return <Heart className="w-5 h-5" strokeWidth={1.75} aria-hidden="true" />;
    case 'compass':
      return <Compass className="w-5 h-5" strokeWidth={1.75} aria-hidden="true" />;
    case 'flower':
      return <Flower2 className="w-5 h-5" strokeWidth={1.75} aria-hidden="true" />;
    case 'sparkles':
      return <Sparkles className="w-5 h-5" strokeWidth={1.75} aria-hidden="true" />;
  }
}

function renderImpactIcon(name: 'users' | 'school' | 'globe') {
  switch (name) {
    case 'users':
      return <Users className="w-5 h-5" strokeWidth={1.75} aria-hidden="true" />;
    case 'school':
      return <School className="w-5 h-5" strokeWidth={1.75} aria-hidden="true" />;
    case 'globe':
      return <Globe className="w-5 h-5" strokeWidth={1.75} aria-hidden="true" />;
  }
}

function renderSchoolFeatureIcon(name: 'users' | 'leaf' | 'book' | 'heart' | 'sprout') {
  switch (name) {
    case 'users':
      return <Users className="w-6 h-6" strokeWidth={1.6} aria-hidden="true" />;
    case 'leaf':
      return <Leaf className="w-6 h-6" strokeWidth={1.6} aria-hidden="true" />;
    case 'book':
      return <BookOpen className="w-6 h-6" strokeWidth={1.6} aria-hidden="true" />;
    case 'heart':
      return <HeartHandshake className="w-6 h-6" strokeWidth={1.6} aria-hidden="true" />;
    case 'sprout':
      return <Sprout className="w-6 h-6" strokeWidth={1.6} aria-hidden="true" />;
  }
}

function renderWellbeingIcon(name: 'wind' | 'handshake' | 'focus' | 'shield' | 'sun') {
  switch (name) {
    case 'wind':
      return <Wind className="w-5 h-5" strokeWidth={1.7} aria-hidden="true" />;
    case 'handshake':
      return <HeartHandshake className="w-5 h-5" strokeWidth={1.7} aria-hidden="true" />;
    case 'focus':
      return <Focus className="w-5 h-5" strokeWidth={1.7} aria-hidden="true" />;
    case 'shield':
      return <ShieldCheck className="w-5 h-5" strokeWidth={1.7} aria-hidden="true" />;
    case 'sun':
      return <Sun className="w-5 h-5" strokeWidth={1.7} aria-hidden="true" />;
  }
}

function renderHarmonyPrincipleIcon(name: HarmonyPrincipleItem['iconName']) {
  switch (name) {
    case 'link':
      return <Link2 className="w-5 h-5" strokeWidth={1.6} aria-hidden="true" />;
    case 'cycle':
      return <RefreshCw className="w-5 h-5" strokeWidth={1.6} aria-hidden="true" />;
    case 'flower':
      return <Flower2 className="w-5 h-5" strokeWidth={1.6} aria-hidden="true" />;
    case 'leaf':
      return <Leaf className="w-5 h-5" strokeWidth={1.6} aria-hidden="true" />;
    case 'heart':
      return <Heart className="w-5 h-5" strokeWidth={1.6} aria-hidden="true" />;
    case 'geometry':
      return <Hexagon className="w-5 h-5" strokeWidth={1.6} aria-hidden="true" />;
    case 'unity':
      return <Sun className="w-5 h-5" strokeWidth={1.6} aria-hidden="true" />;
  }
}

type ContactTopicKey = 'school' | 'training' | 'partnership' | 'other';
type ContactErrorKey = 'name' | 'email' | 'message' | 'network';

export default function App() {
  const [lang, setLang] = useState<Language>(() => loadSavedLanguage());
  const content = SITE_CONTENT[lang];

  const [activeSection, setActiveSection] = useState<string>('');
  const [newsArticles, setNewsArticles] = useState<NewsArticle[]>([]);
  const [isLoadingNews, setIsLoadingNews] = useState<boolean>(true);
  const [selectedNewsId, setSelectedNewsId] = useState<string | number | null>(null);
  const [activeCategory, setActiveCategory] = useState<NewsCategory>(
    SITE_CONTENT[loadSavedLanguage()].newsSection.allCategory
  );
  const [isJoinModalOpen, setIsJoinModalOpen] = useState<boolean>(false);

  // Стан форми зворотного зв'язку
  const [contactForm, setContactForm] = useState<{
    name: string;
    email: string;
    phone: string;
    organization: string;
    topic: ContactTopicKey;
    message: string;
  }>({
    name: '',
    email: '',
    phone: '',
    organization: '',
    topic: 'school',
    message: '',
  });
  const [isContactSubmitting, setIsContactSubmitting] = useState(false);
  const [contactErrorKey, setContactErrorKey] = useState<ContactErrorKey | null>(null);
  const [contactSubmitted, setContactSubmitted] = useState(false);

  // Збереження мови в localStorage + оновлення <html lang> та <title>
  useEffect(() => {
    document.documentElement.lang = lang;
    document.title = SITE_CONTENT[lang].pageTitle;
    try {
      window.localStorage.setItem(LANG_STORAGE_KEY, lang);
    } catch {
      // Ігноруємо помилку сховища у середовищах з обмеженнями
    }
  }, [lang]);

  const handleChangeLang = (nextLang: Language) => {
    setLang(nextLang);
    setActiveCategory(SITE_CONTENT[nextLang].newsSection.allCategory);
  };

  // Динамічне завантаження новин виключно з Google Таблиці
  useEffect(() => {
    const controller = new AbortController();

    async function loadNews() {
      try {
        const fetched = await fetchNewsFromSheet(controller.signal);
        if (!controller.signal.aborted) {
          setNewsArticles(fetched);
        }
      } catch {
        if (!controller.signal.aborted) {
          setNewsArticles([]);
        }
      } finally {
        if (!controller.signal.aborted) {
          setIsLoadingNews(false);
        }
      }
    }

    loadNews();
    return () => controller.abort();
  }, []);

  // Відстеження активної секції при скролі
  useEffect(() => {
    const sectionIds = SITE_CONTENT.uk.navItems.map((item) => item.id);
    const elements = sectionIds
      .map((id) => document.getElementById(id))
      .filter((el): el is HTMLElement => el !== null);

    if (elements.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio);
        if (visible[0]) {
          setActiveSection(visible[0].target.id);
        }
      },
      {
        rootMargin: '-25% 0px -55% 0px',
        threshold: [0.1, 0.3, 0.6],
      }
    );

    elements.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  // Локалізований масив новин для поточної мови (плавний fallback на український оригінал)
  const localizedNews = useMemo(
    () => newsArticles.map((article) => localizeNewsArticle(article, lang)),
    [newsArticles, lang]
  );

  const selectedNews = useMemo(
    () =>
      selectedNewsId !== null
        ? localizedNews.find((article) => article.id === selectedNewsId) ?? null
        : null,
    [localizedNews, selectedNewsId]
  );

  const allCategoryLabel = content.newsSection.allCategory;

  const newsCategories: NewsCategory[] = useMemo(
    () => [
      allCategoryLabel,
      ...Array.from(
        new Set(localizedNews.map((article) => article.category).filter(Boolean))
      ),
    ],
    [allCategoryLabel, localizedNews]
  );

  const effectiveCategory = newsCategories.includes(activeCategory)
    ? activeCategory
    : allCategoryLabel;

  const filteredNews =
    effectiveCategory === allCategoryLabel
      ? localizedNews
      : localizedNews.filter((article) => article.category === effectiveCategory);

  const handleContactSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (isContactSubmitting) return;

    const trimmedName = contactForm.name.trim();
    const trimmedEmail = contactForm.email.trim();
    const trimmedMessage = contactForm.message.trim();

    if (trimmedName.length < 2) {
      setContactErrorKey('name');
      return;
    }
    if (!EMAIL_PATTERN.test(trimmedEmail)) {
      setContactErrorKey('email');
      return;
    }
    if (trimmedMessage.length < 6) {
      setContactErrorKey('message');
      return;
    }

    setContactErrorKey(null);
    setIsContactSubmitting(true);

    try {
      await submitContactToSheet({
        name: trimmedName,
        email: trimmedEmail,
        phone: contactForm.phone,
        organization: contactForm.organization,
        topic: content.contactsSection.fields.topics[contactForm.topic],
        message: trimmedMessage,
      });

      setContactSubmitted(true);
      setContactForm({
        name: '',
        email: '',
        phone: '',
        organization: '',
        topic: 'school',
        message: '',
      });
    } catch {
      setContactErrorKey('network');
    } finally {
      setIsContactSubmitting(false);
    }
  };

  return (
    <div id="top" className="min-h-screen flex flex-col bg-harmony-cream text-harmony-ink">
      {/* Швидкий перехід для клавіатурної навігації (WCAG 2.1 AA) */}
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-[60] focus:inline-flex focus:items-center focus:gap-2 focus:px-5 focus:py-3 focus:rounded-full focus:bg-[#184E48] focus:text-white focus:font-ui focus:text-sm focus:font-semibold focus:shadow-lg focus:outline-none focus:ring-2 focus:ring-[#22A06B] focus:ring-offset-2"
      >
        {content.skipToContent}
      </a>

      {/* НАВІГАЦІЯ */}
      <Header
        activeSection={activeSection}
        lang={lang}
        onChangeLang={handleChangeLang}
        content={content}
        onOpenJoinModal={() => setIsJoinModalOpen(true)}
      />

      <main id="main-content" tabIndex={-1} className="flex-1 focus:outline-none">
        {/* 1. HERO СЕКЦІЯ (Освіта в гармонії з життям + макрофото пухнастої кульбаби праворуч) */}
        <section className="relative overflow-hidden bg-[#F7FBF9] border-b border-emerald-900/10">
          <div
            aria-hidden="true"
            className="hidden lg:block absolute inset-y-0 right-0 w-[64%] xl:w-[62%] overflow-hidden pointer-events-none select-none"
          >
            <MediaFrame
              src={MEDIA_ASSETS.heroDandelion}
              alt={content.hero.imageAlt}
              placeholderPath="images/dandelion-hero.jpg"
              priority
              className="w-full h-full"
              imgClassName="object-right dandelion-breeze"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-[#F7FBF9] via-[#F7FBF9]/80 via-[34%] to-transparent" />
            <div className="absolute inset-x-0 top-0 h-14 bg-gradient-to-b from-[#F7FBF9]/70 to-transparent" />
            <div className="absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-[#F7FBF9]/75 to-transparent" />
          </div>

          <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-12 pb-10 sm:pt-16 sm:pb-16 lg:py-24 xl:py-28">
            <div className="grid lg:grid-cols-12 gap-8 lg:gap-10 items-center">
              {/* Ліва текстова частина поверх світлої зони банера */}
              <div className="hero-enter lg:col-span-6 xl:col-span-6 space-y-6">
                <h1 className="font-serif text-4xl sm:text-5xl lg:text-[3.5rem] font-semibold text-harmony-heading leading-[1.12] tracking-tight">
                  {content.hero.titleStart}{' '}
                  <span className="text-harmony-primary">{content.hero.titleHighlight}</span>
                </h1>

                <p className="text-base sm:text-[17px] text-harmony-ink max-w-xl leading-relaxed text-justify hyphens-auto">
                  {content.hero.description}
                </p>

                <div className="flex flex-wrap items-center gap-3.5 pt-2">
                  <a
                    href="#approach"
                    className="group font-ui inline-flex items-center justify-center gap-2 bg-harmony-primary hover:bg-harmony-primary-hover text-white text-sm sm:text-base font-semibold tracking-tight px-6 py-3.5 rounded-full shadow-xs transition-all duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] hover:-translate-y-0.5 hover:shadow-md active:scale-[0.98] whitespace-nowrap"
                  >
                    {content.hero.primaryCta}
                    <ChevronRight
                      className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-0.5"
                      aria-hidden="true"
                    />
                  </a>
                  <a
                    href="#schools"
                    className="font-ui inline-flex items-center justify-center bg-white/95 hover:bg-harmony-sand text-harmony-heading border border-emerald-900/15 text-sm sm:text-base font-semibold tracking-tight px-6 py-3.5 rounded-full transition-all duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] hover:-translate-y-0.5 whitespace-nowrap backdrop-blur-xs"
                  >
                    {content.hero.secondaryCta}
                  </a>
                </div>

                {/* Слоган під кнопками */}
                <div className="pt-5 border-t border-emerald-900/10 flex items-center gap-2.5 text-xs sm:text-sm text-harmony-ink max-w-lg">
                  <Sprout
                    className="w-4 h-4 text-harmony-primary shrink-0"
                    strokeWidth={2}
                    aria-hidden="true"
                  />
                  <span>
                    <strong className="font-semibold text-harmony-heading">
                      {content.hero.sloganBold}
                    </strong>{' '}
                    {content.hero.sloganRest}
                  </span>
                </div>
              </div>

              {/* Мобільна та планшетна версія фото кульбаби */}
              <div className="hero-enter-delayed lg:hidden relative rounded-3xl overflow-hidden border border-emerald-900/10 aspect-[16/10] bg-[#F7FBF9]">
                <MediaFrame
                  src={MEDIA_ASSETS.heroDandelion}
                  alt={content.hero.imageAlt}
                  placeholderPath="images/dandelion-hero.jpg"
                  priority
                  className="w-full h-full"
                  imgClassName="object-right dandelion-breeze"
                />
                <div
                  aria-hidden="true"
                  className="pointer-events-none absolute inset-0 bg-gradient-to-r from-[#F7FBF9]/65 via-transparent to-transparent"
                />
              </div>
            </div>
          </div>
        </section>

        {/* 2. ЧОТИРИ ОПОРИ ПІДХОДУ ГАРМОНІЇ */}
        <section
          id="approach"
          className="py-14 sm:py-18 lg:py-22 bg-harmony-sand border-y border-emerald-900/10"
        >
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <Reveal className="flex flex-col lg:flex-row lg:items-end justify-between gap-4 mb-10 lg:mb-12">
              <div className="max-w-2xl">
                <p className="text-xs sm:text-sm font-medium text-[#22A06B] mb-2">
                  {content.pillarsSection.eyebrow}
                </p>
                <h2 className="font-serif text-3xl sm:text-4xl font-bold text-harmony-heading leading-tight">
                  {content.pillarsSection.titleStart}{' '}
                  <span className="text-harmony-primary">
                    {content.pillarsSection.titleHighlight}
                  </span>
                </h2>
              </div>
              <p className="text-sm sm:text-base text-harmony-ink max-w-md leading-relaxed text-justify hyphens-auto">
                {content.pillarsSection.description}
              </p>
            </Reveal>

            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 items-stretch">
              {content.pillarsSection.items.map((pillar, index) => (
                <Reveal
                  key={pillar.number}
                  delayMs={getStaggerDelay(index)}
                  className="h-full"
                >
                  <article className="group h-full bg-white rounded-3xl overflow-hidden border border-emerald-900/10 flex flex-col justify-between transition-all duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] hover:-translate-y-1.5 hover:shadow-[0_18px_38px_-18px_rgba(24,78,72,0.16)] hover:border-harmony-emerald/50">
                    <div className="p-6 pb-5 flex-1 flex flex-col">
                      <div
                        className={`w-12 h-12 rounded-full ${pillar.badgeTone} text-white flex items-center justify-center mb-5 shrink-0 transition-transform duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-110`}
                      >
                        {renderPillarIcon(pillar.iconName)}
                      </div>

                      <h3 className="font-serif text-xl font-bold text-harmony-heading mb-2">
                        {pillar.title}
                      </h3>

                      <p className="text-sm text-harmony-ink leading-relaxed text-justify hyphens-auto">
                        {pillar.description}
                      </p>
                    </div>

                    <MediaFrame
                      src={pillar.image}
                      alt={pillar.imageAlt}
                      placeholderPath={pillar.placeholderPath}
                      className="aspect-[4/3] w-full shrink-0 mt-auto"
                      imgClassName="transition-transform duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-105"
                    />
                  </article>
                </Reveal>
              ))}
            </div>
          </div>
        </section>

        {/* 3. РЕАЛЬНИЙ ВПЛИВ ТА ДОБРОБУТ */}
        <section id="impact" className="py-16 sm:py-20 lg:py-24 bg-harmony-cream">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid lg:grid-cols-3 gap-6 lg:gap-7 items-stretch">
              {/* Картка 1 */}
              <Reveal delayMs={100} className="h-full">
                <article className="group h-full bg-white rounded-3xl overflow-hidden border border-emerald-900/10 flex flex-col justify-between transition-all duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] hover:-translate-y-1.5 hover:shadow-[0_18px_38px_-18px_rgba(24,78,72,0.16)] hover:border-harmony-emerald/45">
                  <div className="p-7 sm:p-8 pb-6 flex-1 flex flex-col">
                    <h2 className="font-serif text-2xl sm:text-[1.65rem] font-bold text-harmony-heading leading-snug mb-3.5">
                      {content.impactSection.card1.title}
                    </h2>
                    <p className="text-harmony-ink text-sm sm:text-[15px] leading-relaxed mb-5 text-justify hyphens-auto">
                      {content.impactSection.card1.description}
                    </p>
                    <a
                      href="#schools"
                      className="mt-auto inline-flex items-center gap-1.5 text-sm font-semibold text-[#22A06B] hover:text-[#1A7F56] transition-colors"
                    >
                      {content.impactSection.card1.cta}
                      <ArrowRight
                        className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1"
                        aria-hidden="true"
                      />
                    </a>
                  </div>
                  <MediaFrame
                    src={MEDIA_ASSETS.natureDetail}
                    alt={content.impactSection.card1.imageAlt}
                    placeholderPath="images/nature-detail.jpg"
                    className="aspect-[16/11] w-full shrink-0 mt-auto"
                    imgClassName="transition-transform duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-105"
                  />
                </article>
              </Reveal>

              {/* Картка 2 */}
              <Reveal delayMs={200} className="h-full">
                <article className="group h-full bg-white rounded-3xl overflow-hidden border border-emerald-900/10 flex flex-col justify-between transition-all duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] hover:-translate-y-1.5 hover:shadow-[0_18px_38px_-18px_rgba(24,78,72,0.16)] hover:border-harmony-emerald/45">
                  <div className="p-7 sm:p-8 pb-6 flex-1 flex flex-col">
                    <h2 className="font-serif text-2xl sm:text-[1.65rem] font-bold text-harmony-heading leading-snug mb-3.5">
                      {content.impactSection.card2.title}
                    </h2>
                    <p className="text-harmony-ink text-sm sm:text-[15px] leading-relaxed mb-5 text-justify hyphens-auto">
                      {content.impactSection.card2.description}
                    </p>
                    <a
                      href="#wellbeing"
                      className="mt-auto inline-flex items-center gap-1.5 text-sm font-semibold text-[#22A06B] hover:text-[#1A7F56] transition-colors"
                    >
                      {content.impactSection.card2.cta}
                      <ArrowRight
                        className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1"
                        aria-hidden="true"
                      />
                    </a>
                  </div>
                  <MediaFrame
                    src={MEDIA_ASSETS.wellbeing}
                    alt={content.impactSection.card2.imageAlt}
                    placeholderPath="images/wellbeing.jpg"
                    className="aspect-[16/11] w-full mt-auto"
                    imgClassName="transition-transform duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-105"
                  />
                </article>
              </Reveal>

              {/* Картка 3: Контрастний блок «Реальний вплив» з анімованими лічильниками */}
              <Reveal delayMs={300} className="h-full">
                <div className="group relative overflow-hidden h-full bg-harmony-dark text-white rounded-3xl p-7 sm:p-8 flex flex-col justify-between transition-all duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] hover:-translate-y-1.5 hover:shadow-[0_22px_42px_-16px_rgba(29,91,87,0.32)]">
                  <div
                    aria-hidden="true"
                    className="pointer-events-none absolute -bottom-16 -right-16 w-56 h-56 text-white/[0.08] seed-spin-hover"
                  >
                    <SeedOfLifeMark className="w-full h-full" />
                  </div>

                  <div className="relative">
                    <p className="text-xs font-medium text-emerald-200 tracking-wide mb-1.5">
                      {content.impactSection.statsCard.eyebrow}
                    </p>
                    <h2 className="font-serif text-2xl sm:text-[1.75rem] font-bold tracking-wide mb-8">
                      {content.impactSection.statsCard.title}
                    </h2>

                    <div className="space-y-6">
                      {content.impactSection.statsCard.metrics.map((metric, idx) => (
                        <div key={metric.iconName} className="flex items-center gap-4">
                          <div
                            className={`w-12 h-12 rounded-full bg-white/12 border border-white/18 flex items-center justify-center shrink-0 transition-transform duration-300 group-hover:scale-105 ${
                              idx === 1 ? 'text-emerald-200' : 'text-harmony-sun'
                            }`}
                          >
                            {renderImpactIcon(metric.iconName)}
                          </div>
                          <div>
                            <div className="text-3xl font-bold font-serif tracking-tight text-harmony-sun">
                              <ImpactCounter
                                target={metric.value}
                                suffix={metric.suffix}
                                durationMs={1800}
                              />
                            </div>
                            <div className="text-sm text-emerald-50/90 mt-0.5">
                              {metric.label}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="relative pt-8 mt-8 border-t border-white/15">
                    <a
                      href="#news"
                      className="inline-flex items-center gap-2 text-sm font-medium text-emerald-200 hover:text-white transition-colors"
                    >
                      {content.impactSection.statsCard.cta}
                      <ArrowRight
                        className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1"
                        aria-hidden="true"
                      />
                    </a>
                  </div>
                </div>
              </Reveal>
            </div>
          </div>
        </section>

        {/* 4. ДЛЯ ШКІЛ В УКРАЇНІ */}
        <section
          id="schools"
          className="py-16 sm:py-20 lg:py-24 bg-harmony-sand border-y border-emerald-900/10"
        >
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16 lg:space-y-20">
            {/* 4.1 Як ми працюємо зі школами */}
            <div>
              <Reveal className="max-w-2xl mb-10">
                <p className="text-xs sm:text-sm font-medium text-[#22A06B] mb-2">
                  {content.schoolsSection.eyebrow}
                </p>
                <h2 className="font-serif text-3xl sm:text-4xl font-bold text-harmony-heading leading-tight">
                  {content.schoolsSection.titleStart}{' '}
                  <span className="text-harmony-primary">
                    {content.schoolsSection.titleHighlight}
                  </span>
                </h2>
                <p className="text-harmony-ink mt-3 text-base leading-relaxed text-justify hyphens-auto">
                  {content.schoolsSection.description}
                </p>
              </Reveal>

              <div className="grid sm:grid-cols-2 lg:grid-cols-5 gap-4 lg:gap-5 items-stretch">
                {content.schoolsSection.features.map((feature, index) => (
                  <Reveal
                    key={feature.iconName}
                    delayMs={getStaggerDelay(index)}
                    className="h-full"
                  >
                    <div className="group h-full bg-white rounded-2xl p-5 sm:p-6 border border-emerald-900/10 text-left lg:text-center flex flex-col lg:items-center transition-all duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] hover:-translate-y-1.5 hover:shadow-[0_16px_32px_-16px_rgba(24,78,72,0.15)] hover:border-harmony-emerald/45">
                      <div className="w-12 h-12 rounded-2xl bg-[#E6F5EE] text-[#22A06B] flex items-center justify-center mb-4 transition-transform duration-300 group-hover:scale-110">
                        {renderSchoolFeatureIcon(feature.iconName)}
                      </div>
                      <h3 className="font-serif font-bold text-base sm:text-lg text-harmony-heading mb-2">
                        {feature.title}
                      </h3>
                      <p className="text-xs sm:text-[13px] text-harmony-ink leading-relaxed text-justify hyphens-auto w-full">
                        {feature.description}
                      </p>
                    </div>
                  </Reveal>
                ))}
              </div>
            </div>

            {/* 4.2 Навчання, що підтримує добробут і стійкість */}
            <div id="wellbeing" className="scroll-mt-24">
              <Reveal className="bg-white rounded-3xl p-7 sm:p-10 border border-emerald-900/10">
                <div className="max-w-3xl mb-8">
                  <h3 className="font-serif text-2xl sm:text-3xl font-bold text-harmony-heading leading-tight">
                    {content.wellbeingSection.title}
                  </h3>
                  <p className="text-harmony-ink text-sm sm:text-base mt-3 leading-relaxed text-justify hyphens-auto">
                    {content.wellbeingSection.description}
                  </p>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4 sm:gap-5">
                  {content.wellbeingSection.benefits.map((benefit) => (
                    <div
                      key={benefit.iconName}
                      className="group flex flex-col items-center text-center p-4 rounded-2xl bg-harmony-cream border border-emerald-900/10 transition-all duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] hover:-translate-y-1 hover:shadow-sm hover:border-harmony-emerald/40"
                    >
                      <div className="w-11 h-11 rounded-full bg-[#E6F5EE] text-[#22A06B] flex items-center justify-center mb-3 transition-transform duration-300 group-hover:scale-110">
                        {renderWellbeingIcon(benefit.iconName)}
                      </div>
                      <p className="text-xs sm:text-sm font-medium text-harmony-heading leading-snug">
                        {benefit.title}
                      </p>
                    </div>
                  ))}
                </div>

                <div className="mt-6 p-4 sm:p-5 rounded-2xl bg-harmony-sand/85 border border-harmony-emerald/20 flex items-center gap-3.5 text-xs sm:text-sm text-harmony-heading">
                  <Sprout
                    className="w-5 h-5 text-harmony-primary shrink-0"
                    strokeWidth={1.85}
                    aria-hidden="true"
                  />
                  <p className="leading-relaxed text-justify hyphens-auto">
                    <strong className="font-semibold">
                      {content.wellbeingSection.highlightBold}
                    </strong>{' '}
                    {content.wellbeingSection.highlightRest}
                  </p>
                </div>
              </Reveal>
            </div>

            {/* 4.3 Ваш шлях упровадження */}
            <div>
              <Reveal className="max-w-2xl mb-10">
                <h3 className="font-serif text-2xl sm:text-3xl font-bold text-harmony-heading">
                  {content.stepsSection.title}
                </h3>
                <p className="text-harmony-ink text-sm sm:text-base mt-2 leading-relaxed text-justify hyphens-auto">
                  {content.stepsSection.description}
                </p>
              </Reveal>

              <div className="grid sm:grid-cols-2 lg:grid-cols-5 gap-5 relative">
                <div
                  aria-hidden="true"
                  className="hidden lg:block absolute top-5 left-[10%] right-[10%] border-t border-dashed border-harmony-emerald/55"
                />

                {content.stepsSection.steps.map((item, index) => (
                  <Reveal
                    key={item.step}
                    delayMs={getStaggerDelay(index)}
                    className={
                      index === content.stepsSection.steps.length - 1
                        ? 'sm:col-span-2 lg:col-span-1 h-full'
                        : 'h-full'
                    }
                  >
                    <div className="group relative h-full bg-white p-6 rounded-2xl border border-emerald-900/10 flex flex-col items-start lg:items-center lg:text-center transition-all duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] hover:-translate-y-1.5 hover:shadow-[0_18px_36px_-18px_rgba(24,78,72,0.16)] hover:border-harmony-emerald/50">
                      <span className="relative z-10 inline-flex items-center justify-center w-10 h-10 rounded-full bg-harmony-primary text-white font-serif font-bold text-base tabular-nums mb-4 ring-4 ring-white transition-transform duration-300 group-hover:scale-110">
                        {item.step}
                      </span>
                      <h4 className="font-serif font-bold text-lg text-harmony-heading mb-2">
                        {item.title}
                      </h4>
                      <p className="text-xs sm:text-[13px] text-harmony-ink leading-relaxed text-justify hyphens-auto w-full">
                        {item.description}
                      </p>
                    </div>
                  </Reveal>
                ))}
              </div>
            </div>

            {/* 4.4 Темний банер «Готові розпочати?» */}
            <Reveal delayMs={100}>
              <div className="group relative overflow-hidden bg-harmony-dark rounded-3xl p-8 sm:p-11 lg:p-12 text-white flex flex-col md:flex-row items-start md:items-center justify-between gap-7">
                <div
                  aria-hidden="true"
                  className="pointer-events-none absolute -right-10 -bottom-14 w-64 h-64 text-white/[0.08] seed-spin-hover"
                >
                  <SeedOfLifeMark className="w-full h-full" />
                </div>

                <div className="relative max-w-2xl space-y-3">
                  <p className="text-xs font-medium text-harmony-sun tracking-wide">
                    {content.ctaBanner.eyebrow}
                  </p>
                  <h3 className="font-serif text-2xl sm:text-3xl font-bold tracking-wide text-white">
                    {content.ctaBanner.title}
                  </h3>
                  <p className="text-sm sm:text-base text-emerald-50/90 leading-relaxed text-justify hyphens-auto">
                    {content.ctaBanner.description}
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() => setIsJoinModalOpen(true)}
                  className="relative shrink-0 inline-flex items-center gap-2 bg-harmony-primary hover:bg-harmony-primary-hover text-white font-semibold text-sm sm:text-base px-7 py-3.5 rounded-full shadow-xs transition-all duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] hover:-translate-y-0.5 hover:shadow-md active:scale-[0.98] whitespace-nowrap"
                >
                  {content.ctaBanner.button}
                  <ArrowRight
                    className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1"
                    aria-hidden="true"
                  />
                </button>
              </div>
            </Reveal>
          </div>
        </section>

        {/* 5. РОЗДІЛ «НОВИНИ» */}
        <section id="news" className="py-16 sm:py-20 lg:py-24 bg-harmony-cream">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <Reveal className="flex flex-col lg:flex-row lg:items-end justify-between mb-10 lg:mb-12 gap-6">
              <div className="max-w-xl">
                <p className="text-xs sm:text-sm font-medium text-[#22A06B] mb-2">
                  {content.newsSection.eyebrow}
                </p>
                <h2 className="font-serif text-3xl sm:text-4xl font-bold text-harmony-heading leading-tight">
                  {content.newsSection.title}
                </h2>
                <p className="text-sm sm:text-base text-harmony-ink mt-3 leading-relaxed text-justify hyphens-auto">
                  {content.newsSection.description}
                </p>
              </div>

              {/* Інтерактивний фільтр категорій новин (показується лише за наявності новин) */}
              {!isLoadingNews && localizedNews.length > 0 && (
                <div
                  role="tablist"
                  aria-label={content.newsSection.filterAriaLabel}
                  className="inline-flex flex-wrap items-center gap-1 p-1 bg-harmony-sand rounded-xl border border-emerald-900/10 self-start lg:self-end"
                >
                  {newsCategories.map((category) => {
                    const isSelected = effectiveCategory === category;
                    return (
                      <button
                        key={category}
                        type="button"
                        role="tab"
                        aria-selected={isSelected}
                        onClick={() => setActiveCategory(category)}
                        className={`px-3.5 py-2 text-xs sm:text-sm font-medium rounded-lg transition-all duration-200 whitespace-nowrap ${
                          isSelected
                            ? 'bg-white text-harmony-heading shadow-xs'
                            : 'text-harmony-ink hover:text-harmony-heading'
                        }`}
                      >
                        {category}
                      </button>
                    );
                  })}
                </div>
              )}
            </Reveal>

            {isLoadingNews ? (
              <div role="status" aria-live="polite" className="space-y-6">
                <div className="inline-flex items-center gap-2.5 text-sm font-medium text-harmony-heading bg-harmony-sand/80 border border-emerald-900/10 px-4 py-2 rounded-full">
                  <Loader2
                    className="w-4 h-4 text-harmony-primary animate-spin"
                    aria-hidden="true"
                  />
                  <span>{content.newsSection.loadingText}</span>
                </div>

                <div className="grid md:grid-cols-3 gap-7 lg:gap-8">
                  {[0, 1, 2].map((skeleton) => (
                    <div
                      key={skeleton}
                      aria-hidden="true"
                      className="bg-white rounded-3xl overflow-hidden border border-emerald-900/10 animate-pulse"
                    >
                      <div className="aspect-[16/10] w-full bg-harmony-sage/60" />
                      <div className="p-6 space-y-3.5">
                        <div className="h-3 w-36 bg-harmony-sand rounded-full" />
                        <div className="h-5 w-full bg-harmony-sand rounded-lg" />
                        <div className="h-5 w-3/4 bg-harmony-sand rounded-lg" />
                        <div className="space-y-2 pt-1">
                          <div className="h-3.5 w-full bg-harmony-cream rounded" />
                          <div className="h-3.5 w-5/6 bg-harmony-cream rounded" />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ) : localizedNews.length === 0 ? (
              <Reveal>
                <div className="max-w-2xl mx-auto rounded-3xl bg-harmony-sand border border-emerald-900/10 px-7 sm:px-10 py-10 sm:py-12 text-center shadow-[0_10px_30px_-24px_rgba(24,78,72,0.14)]">
                  <div className="w-12 h-12 rounded-2xl bg-white border border-emerald-900/10 text-harmony-primary flex items-center justify-center mx-auto mb-5">
                    <Sparkles className="w-5 h-5" strokeWidth={1.75} aria-hidden="true" />
                  </div>
                  <h3 className="font-serif text-2xl font-bold text-harmony-heading mb-2.5">
                    {content.newsSection.emptyTitle}
                  </h3>
                  <p className="text-sm sm:text-base text-harmony-ink leading-relaxed max-w-lg mx-auto">
                    {content.newsSection.emptyDescription}
                  </p>
                </div>
              </Reveal>
            ) : (
              <div className="grid md:grid-cols-3 gap-7 lg:gap-8 items-stretch">
                {filteredNews.map((article, index) => (
                  <Reveal
                    key={`${lang}-${effectiveCategory}-${article.id}`}
                    delayMs={getStaggerDelay(index)}
                    className="h-full"
                  >
                    <article className="group h-full bg-white rounded-3xl overflow-hidden border border-emerald-900/10 flex flex-col transition-all duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] hover:-translate-y-1.5 hover:shadow-[0_18px_38px_-18px_rgba(24,78,72,0.16)] hover:border-harmony-emerald/45">
                      {article.image && (
                        <button
                          type="button"
                          onClick={() => setSelectedNewsId(article.id)}
                          className="block w-full text-left focus-visible:outline-none shrink-0"
                          aria-label={`${content.newsSection.openArticleAriaPrefix} ${article.title}`}
                        >
                          <MediaFrame
                            src={article.image}
                            alt={article.imageAlt}
                            placeholderPath={article.placeholderPath}
                            className="aspect-[16/10] w-full"
                            imgClassName="transition-transform duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-105"
                          />
                        </button>
                      )}

                      <div className="p-6 flex-1 flex flex-col justify-between">
                        <div>
                          <div className="flex flex-wrap items-center gap-2 text-xs text-harmony-ink/70 mb-3">
                            <span className="font-semibold text-[#22A06B]">
                              {article.category}
                            </span>
                            {article.date && (
                              <>
                                <span aria-hidden="true">·</span>
                                <time>{article.date}</time>
                              </>
                            )}
                            {article.readTime && (
                              <>
                                <span aria-hidden="true">·</span>
                                <span>{article.readTime}</span>
                              </>
                            )}
                          </div>

                          <h3 className="font-serif text-xl font-bold text-harmony-heading leading-snug mb-3 group-hover:text-harmony-primary transition-colors">
                            <button
                              type="button"
                              onClick={() => setSelectedNewsId(article.id)}
                              className="text-left focus-visible:underline"
                            >
                              {article.title}
                            </button>
                          </h3>

                          <p className="text-sm text-harmony-ink leading-relaxed line-clamp-3 text-justify hyphens-auto">
                            {article.excerpt}
                          </p>
                        </div>

                        <div className="pt-5 mt-5 border-t border-emerald-900/10">
                          <button
                            type="button"
                            onClick={() => setSelectedNewsId(article.id)}
                            className="inline-flex items-center gap-1.5 text-sm font-semibold text-harmony-primary hover:text-harmony-primary-hover transition-colors"
                          >
                            {content.newsSection.readMore}
                            <ArrowRight
                              className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1"
                              aria-hidden="true"
                            />
                          </button>
                        </div>
                      </div>
                    </article>
                  </Reveal>
                ))}
              </div>
            )}
          </div>
        </section>

        {/* 6. КОНТАКТИ ТА ФОРМА ЗВОРОТНОГО ЗВ'ЯЗКУ */}
        <section
          id="contacts"
          className="py-16 sm:py-20 lg:py-24 bg-harmony-sand border-t border-emerald-900/10"
        >
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid lg:grid-cols-12 gap-10 lg:gap-12 items-start">
              {/* Ліва частина: Контакти */}
              <Reveal delayMs={100} className="lg:col-span-5 space-y-6">
                <div>
                  <p className="text-xs sm:text-sm font-medium text-[#22A06B] mb-2">
                    {content.contactsSection.eyebrow}
                  </p>
                  <h2 className="font-serif text-3xl sm:text-4xl font-bold text-harmony-heading leading-tight">
                    {content.contactsSection.titleStart}{' '}
                    <span className="text-harmony-primary">
                      {content.contactsSection.titleHighlight}
                    </span>
                  </h2>
                </div>

                <p className="text-harmony-ink leading-relaxed text-base text-justify hyphens-auto">
                  {content.contactsSection.description}
                </p>

                <div className="space-y-4 pt-2">
                  <div className="flex items-start gap-4">
                    <div className="w-11 h-11 rounded-full bg-white text-[#22A06B] border border-emerald-900/10 flex items-center justify-center shrink-0">
                      <Mail className="w-5 h-5" strokeWidth={1.8} aria-hidden="true" />
                    </div>
                    <div>
                      <p className="text-xs text-harmony-ink/70">
                        {content.contactsSection.emailLabel}
                      </p>
                      <a
                        href="mailto:info@harmonyproject.org.ua"
                        className="font-medium text-harmony-heading hover:text-harmony-primary transition-colors"
                      >
                        info@harmonyproject.org.ua
                      </a>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <div className="w-11 h-11 rounded-full bg-white text-[#22A06B] border border-emerald-900/10 flex items-center justify-center shrink-0">
                      <Phone className="w-5 h-5" strokeWidth={1.8} aria-hidden="true" />
                    </div>
                    <div>
                      <p className="text-xs text-harmony-ink/70">
                        {content.contactsSection.phoneLabel}
                      </p>
                      <a
                        href="tel:+380000000000"
                        className="font-medium text-harmony-heading hover:text-harmony-primary transition-colors tabular-nums"
                      >
                        +38 (0XX) XXX-XX-XX
                      </a>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <div className="w-11 h-11 rounded-full bg-white text-harmony-emerald border border-emerald-900/10 flex items-center justify-center shrink-0">
                      <MapPin className="w-5 h-5" strokeWidth={1.8} aria-hidden="true" />
                    </div>
                    <div>
                      <p className="text-xs text-harmony-ink/70">
                        {content.contactsSection.locationLabel}
                      </p>
                      <p className="font-medium text-harmony-heading">
                        {content.contactsSection.locationValue}
                      </p>
                    </div>
                  </div>
                </div>
              </Reveal>

              {/* Права частина: Форма зворотного зв'язку */}
              <Reveal delayMs={200} className="lg:col-span-7">
                <div className="bg-white rounded-3xl p-7 sm:p-10 border border-emerald-900/10 shadow-[0_12px_34px_-24px_rgba(24,78,72,0.16)]">
                  <h3 className="font-serif text-2xl font-bold text-harmony-heading mb-2">
                    {content.contactsSection.formTitle}
                  </h3>
                  <p className="text-sm text-harmony-ink/70 mb-6">
                    {content.contactsSection.formRequiredNote}
                  </p>

                  {contactSubmitted ? (
                    <div
                      role="status"
                      className="p-6 rounded-2xl bg-harmony-sand border border-harmony-emerald/30 space-y-4"
                    >
                      <div className="flex items-start gap-3 text-harmony-heading">
                        <CheckCircle2
                          className="w-6 h-6 text-harmony-emerald shrink-0 mt-0.5"
                          aria-hidden="true"
                        />
                        <div>
                          <p className="font-serif font-bold text-lg text-harmony-heading">
                            {content.contactsSection.successTitle}
                          </p>
                          <p className="text-sm text-harmony-ink mt-1 leading-relaxed">
                            {content.contactsSection.successDescription}
                          </p>
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={() => setContactSubmitted(false)}
                        className="inline-flex items-center gap-2 text-sm font-semibold text-harmony-primary hover:text-harmony-primary-hover transition-colors"
                      >
                        {content.contactsSection.sendAnother}
                      </button>
                    </div>
                  ) : (
                    <form onSubmit={handleContactSubmit} noValidate className="space-y-5">
                      <div className="grid sm:grid-cols-2 gap-5">
                        <div>
                          <label
                            htmlFor="contact-name"
                            className="block text-sm font-medium text-harmony-ink mb-1.5"
                          >
                            {content.contactsSection.fields.nameLabel}
                          </label>
                          <input
                            type="text"
                            id="contact-name"
                            required
                            disabled={isContactSubmitting}
                            value={contactForm.name}
                            onChange={(e) => {
                              setContactForm((prev) => ({ ...prev, name: e.target.value }));
                              if (contactErrorKey) setContactErrorKey(null);
                            }}
                            placeholder={content.contactsSection.fields.namePlaceholder}
                            className="w-full px-4 py-3 rounded-xl border border-emerald-900/15 bg-harmony-cream/60 focus:bg-white focus:border-harmony-primary focus:ring-2 focus:ring-harmony-emerald/20 outline-none transition-all text-sm text-harmony-heading placeholder:text-slate-400 disabled:opacity-60"
                          />
                        </div>

                        <div>
                          <label
                            htmlFor="contact-email"
                            className="block text-sm font-medium text-harmony-ink mb-1.5"
                          >
                            {content.contactsSection.fields.emailLabel}
                          </label>
                          <input
                            type="email"
                            id="contact-email"
                            required
                            disabled={isContactSubmitting}
                            value={contactForm.email}
                            onChange={(e) => {
                              setContactForm((prev) => ({ ...prev, email: e.target.value }));
                              if (contactErrorKey) setContactErrorKey(null);
                            }}
                            placeholder={content.contactsSection.fields.emailPlaceholder}
                            className="w-full px-4 py-3 rounded-xl border border-emerald-900/15 bg-harmony-cream/60 focus:bg-white focus:border-harmony-primary focus:ring-2 focus:ring-harmony-emerald/20 outline-none transition-all text-sm text-harmony-heading placeholder:text-slate-400 disabled:opacity-60"
                          />
                        </div>
                      </div>

                      <div className="grid sm:grid-cols-2 gap-5">
                        <div>
                          <label
                            htmlFor="contact-phone"
                            className="block text-sm font-medium text-harmony-ink mb-1.5"
                          >
                            {content.contactsSection.fields.phoneLabel}
                          </label>
                          <input
                            type="tel"
                            id="contact-phone"
                            disabled={isContactSubmitting}
                            value={contactForm.phone}
                            onChange={(e) =>
                              setContactForm((prev) => ({
                                ...prev,
                                phone: e.target.value,
                              }))
                            }
                            placeholder={content.contactsSection.fields.phonePlaceholder}
                            className="w-full px-4 py-3 rounded-xl border border-emerald-900/15 bg-harmony-cream/60 focus:bg-white focus:border-harmony-primary focus:ring-2 focus:ring-harmony-emerald/20 outline-none transition-all text-sm text-harmony-heading placeholder:text-slate-400 disabled:opacity-60"
                          />
                        </div>

                        <div>
                          <label
                            htmlFor="contact-organization"
                            className="block text-sm font-medium text-harmony-ink mb-1.5"
                          >
                            {content.contactsSection.fields.orgLabel}
                          </label>
                          <input
                            type="text"
                            id="contact-organization"
                            disabled={isContactSubmitting}
                            value={contactForm.organization}
                            onChange={(e) =>
                              setContactForm((prev) => ({
                                ...prev,
                                organization: e.target.value,
                              }))
                            }
                            placeholder={content.contactsSection.fields.orgPlaceholder}
                            className="w-full px-4 py-3 rounded-xl border border-emerald-900/15 bg-harmony-cream/60 focus:bg-white focus:border-harmony-primary focus:ring-2 focus:ring-harmony-emerald/20 outline-none transition-all text-sm text-harmony-heading placeholder:text-slate-400 disabled:opacity-60"
                          />
                        </div>
                      </div>

                      <div>
                        <label
                          htmlFor="contact-topic"
                          className="block text-sm font-medium text-harmony-ink mb-1.5"
                        >
                          {content.contactsSection.fields.topicLabel}
                        </label>
                        <select
                          id="contact-topic"
                          disabled={isContactSubmitting}
                          value={contactForm.topic}
                          onChange={(e) =>
                            setContactForm((prev) => ({
                              ...prev,
                              topic: e.target.value as ContactTopicKey,
                            }))
                          }
                          className="w-full px-4 py-3 rounded-xl border border-emerald-900/15 bg-harmony-cream/60 focus:bg-white focus:border-harmony-primary focus:ring-2 focus:ring-harmony-emerald/20 outline-none transition-all text-sm text-harmony-heading disabled:opacity-60"
                        >
                          <option value="school">
                            {content.contactsSection.fields.topics.school}
                          </option>
                          <option value="training">
                            {content.contactsSection.fields.topics.training}
                          </option>
                          <option value="partnership">
                            {content.contactsSection.fields.topics.partnership}
                          </option>
                          <option value="other">
                            {content.contactsSection.fields.topics.other}
                          </option>
                        </select>
                      </div>

                      <div>
                        <label
                          htmlFor="contact-message"
                          className="block text-sm font-medium text-harmony-ink mb-1.5"
                        >
                          {content.contactsSection.fields.messageLabel}
                        </label>
                        <textarea
                          id="contact-message"
                          rows={4}
                          required
                          disabled={isContactSubmitting}
                          value={contactForm.message}
                          onChange={(e) => {
                            setContactForm((prev) => ({ ...prev, message: e.target.value }));
                            if (contactErrorKey) setContactErrorKey(null);
                          }}
                          placeholder={content.contactsSection.fields.messagePlaceholder}
                          className="w-full px-4 py-3 rounded-xl border border-emerald-900/15 bg-harmony-cream/60 focus:bg-white focus:border-harmony-primary focus:ring-2 focus:ring-harmony-emerald/20 outline-none transition-all text-sm text-harmony-heading placeholder:text-slate-400 resize-y disabled:opacity-60"
                        />
                      </div>

                      {contactErrorKey && (
                        <div
                          role="alert"
                          className="flex items-center gap-2.5 p-3.5 rounded-xl bg-red-50 border border-red-200 text-red-800 text-sm"
                        >
                          <AlertCircle
                            className="w-4 h-4 shrink-0 text-red-600"
                            aria-hidden="true"
                          />
                          <span>{content.contactsSection.errors[contactErrorKey]}</span>
                        </div>
                      )}

                      <button
                        type="submit"
                        disabled={isContactSubmitting}
                        className="group w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-harmony-primary hover:bg-harmony-primary-hover text-white font-semibold text-sm sm:text-base px-8 py-3.5 rounded-full shadow-xs transition-all duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] hover:-translate-y-0.5 hover:shadow-md active:scale-[0.98] whitespace-nowrap disabled:opacity-70 disabled:pointer-events-none"
                      >
                        {isContactSubmitting ? (
                          <>
                            <Loader2 className="w-4 h-4 animate-spin" aria-hidden="true" />
                            {content.contactsSection.submitLoading}
                          </>
                        ) : (
                          <>
                            {content.contactsSection.submitIdle}
                            <Send
                              className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-0.5"
                              aria-hidden="true"
                            />
                          </>
                        )}
                      </button>
                    </form>
                  )}
                </div>
              </Reveal>
            </div>
          </div>
        </section>
      </main>

      {/* ФУТЕР */}
      <footer className="bg-harmony-dark text-white">
        {/* Верхня смуга: цитата + 7 природних принципів Гармонії */}
        <div className="border-b border-white/15">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-11 lg:py-12">
            <Reveal className="grid lg:grid-cols-12 gap-8 lg:gap-8 items-center">
              <div className="lg:col-span-4 lg:pr-7 lg:border-r lg:border-white/15">
                <blockquote className="font-serif italic text-base sm:text-lg leading-relaxed text-emerald-50">
                  {content.footer.quote}
                </blockquote>
                <p className="text-xs font-medium tracking-wider text-harmony-sun mt-3">
                  {content.footer.quoteAuthor}
                </p>
              </div>

              <div className="lg:col-span-8 grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-x-2.5 gap-y-5">
                {content.footer.principles.map((principle, idx) => (
                  <div
                    key={principle.iconName}
                    className="group flex flex-col items-center text-center gap-2.5"
                  >
                    <div
                      className={`w-11 h-11 rounded-full bg-white/12 border border-white/18 flex items-center justify-center transition-transform duration-300 group-hover:scale-110 ${
                        idx === 4 || idx === 6 ? 'text-harmony-sun' : 'text-emerald-200'
                      }`}
                    >
                      {renderHarmonyPrincipleIcon(principle.iconName)}
                    </div>
                    <span className="text-[11px] xl:text-xs font-medium text-emerald-50/90 leading-snug">
                      {principle.label}
                    </span>
                  </div>
                ))}
              </div>
            </Reveal>
          </div>
        </div>

        {/* Нижня частина: логотип + спільнота для практики + навігація */}
        <div className="relative overflow-hidden">
          <div
            aria-hidden="true"
            className="pointer-events-none absolute -left-20 -bottom-24 w-72 h-72 text-white/[0.06]"
          >
            <SeedOfLifeMark className="w-full h-full" />
          </div>

          <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-12 pb-8">
            <div className="grid md:grid-cols-12 gap-10 pb-10 border-b border-white/15 items-center">
              <div className="md:col-span-6 space-y-4">
                <a
                  href="#top"
                  className="inline-flex items-center py-1 bg-transparent group focus-visible:rounded-xl"
                  aria-label={content.header.logoAriaLabel}
                >
                  <Logo variant="dark" />
                </a>
                <p className="text-sm text-emerald-50/85 max-w-md leading-relaxed text-justify hyphens-auto">
                  {content.footer.description}
                </p>
              </div>

              <div className="md:col-span-6">
                <h4 className="font-serif text-xl font-bold tracking-wide mb-2">
                  {content.footer.communityTitle}
                </h4>
                <p className="text-sm text-emerald-50/85 leading-relaxed max-w-lg mb-5 text-justify hyphens-auto">
                  {content.footer.communityDescription}
                </p>
                <a
                  href="#contacts"
                  className="font-ui inline-flex items-center gap-2 bg-harmony-primary hover:bg-harmony-primary-hover text-white text-[15px] font-semibold tracking-tight px-6 py-3 rounded-full shadow-xs transition-all duration-200 hover:-translate-y-0.5"
                >
                  <span>{content.footer.contactButton}</span>
                  <ArrowRight className="w-4 h-4" aria-hidden="true" />
                </a>
              </div>
            </div>

            <div className="pt-7 flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-emerald-100/75">
              <p>{content.footer.copyright}</p>
              <nav
                aria-label={content.footer.navAriaLabel}
                className="font-ui flex flex-wrap items-center justify-center gap-2"
              >
                {content.navItems.map((item) => {
                  const isActive = activeSection === item.id;
                  return (
                    <a
                      key={item.id}
                      href={item.href}
                      className={`font-ui inline-flex items-center justify-center rounded-full px-3.5 py-1.5 text-[13px] font-semibold tracking-tight whitespace-nowrap transition-all duration-200 ${
                        isActive
                          ? 'bg-[#22A06B] border border-[#22A06B] text-white shadow-sm'
                          : 'bg-white/10 border border-white/20 text-emerald-50 hover:bg-white/20 hover:border-white/40 hover:text-white hover:-translate-y-0.5'
                      }`}
                    >
                      {item.label}
                    </a>
                  );
                })}
              </nav>
            </div>
          </div>
        </div>
      </footer>

      {/* МОДАЛЬНЕ ВІКНО ДЛЯ ЧИТАННЯ ПОВНОГО ТЕКСТУ НОВИНИ */}
      <NewsModal
        article={selectedNews}
        articles={localizedNews}
        labels={content.newsSection.modal}
        onClose={() => setSelectedNewsId(null)}
        onSelectArticle={(articleId) => setSelectedNewsId(articleId)}
      />

      {/* МОДАЛЬНА ФОРМА «ДОЛУЧИТИСЯ» */}
      <JoinModal
        isOpen={isJoinModalOpen}
        onClose={() => setIsJoinModalOpen(false)}
        labels={content.joinModal}
        errors={content.contactsSection.errors}
      />

      {/* МОДУЛЬ ВЕБДОСТУПНОСТІ (ACCESSIBILITY WIDGET) */}
      <AccessibilityWidget labels={content.accessibility} />
    </div>
  );
}
