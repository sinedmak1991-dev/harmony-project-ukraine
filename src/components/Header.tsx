import { useEffect, useState } from 'react';
import { Menu, X } from 'lucide-react';
import { NAV_ITEMS } from '../data/harmonyContent';
import { Logo } from './Logo';

interface HeaderProps {
  activeSection: string;
  onOpenJoinModal: () => void;
}

export function SeedOfLifeMark({ className = 'w-7 h-7' }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 100 100"
      fill="none"
      stroke="currentColor"
      strokeWidth="3.2"
      aria-hidden="true"
    >
      <circle cx="50" cy="50" r="45" />
      <circle cx="50" cy="27.5" r="22.5" />
      <circle cx="50" cy="72.5" r="22.5" />
      <circle cx="30.5" cy="38.75" r="22.5" />
      <circle cx="69.5" cy="61.25" r="22.5" />
      <circle cx="69.5" cy="38.75" r="22.5" />
      <circle cx="30.5" cy="61.25" r="22.5" />
    </svg>
  );
}

export function Header({ activeSection, onOpenJoinModal }: HeaderProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => {
      setScrolled(window.scrollY > 18);
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && mobileMenuOpen) {
        setMobileMenuOpen(false);
      }
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [mobileMenuOpen]);

  const handleNavClick = () => {
    setMobileMenuOpen(false);
  };

  return (
    <header
      className={`sticky top-0 z-50 transition-all duration-300 ${
        scrolled
          ? 'bg-harmony-cream/95 backdrop-blur-md border-b border-emerald-900/10 shadow-[0_6px_24px_-16px_rgba(24,78,72,0.16)]'
          : 'bg-harmony-cream/95 backdrop-blur-sm border-b border-emerald-900/10'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between gap-4 lg:gap-6 h-[4.75rem] sm:h-20">
          {/* Зона 1: Чистий векторний логотип The Harmony Project */}
          <a
            href="#top"
            onClick={handleNavClick}
            className="inline-flex items-center py-1 shrink-0 bg-transparent group focus-visible:rounded-xl"
            aria-label="The Harmony Project — на початок сторінки"
          >
            <Logo variant="light" />
          </a>

          {/* Зона 2: Однорядкова навігація у вигляді сучасних кнопок-капсул */}
          <nav
            aria-label="Головна навігація"
            className="hidden lg:flex items-center gap-2 xl:gap-2.5 font-ui"
          >
            {NAV_ITEMS.map((item) => {
              const isActive = activeSection === item.id;
              return (
                <a
                  key={item.id}
                  href={item.href}
                  aria-current={isActive ? 'page' : undefined}
                  className={`font-ui inline-flex items-center justify-center rounded-full px-4 py-2 text-[15px] font-semibold tracking-tight whitespace-nowrap shrink-0 transition-all duration-200 ${
                    isActive
                      ? 'bg-[#22A06B] border border-[#22A06B] text-white shadow-sm'
                      : 'bg-[#EAF4EE]/90 border border-[#22A06B]/20 text-[#184E48] hover:bg-[#D5ECE0] hover:border-[#22A06B]/50 hover:-translate-y-0.5'
                  }`}
                >
                  {item.label}
                </a>
              );
            })}
          </nav>

          {/* Зона 3: Основна кнопка дії + кнопка мобільного меню */}
          <div className="flex items-center gap-3 shrink-0">
            <button
              type="button"
              onClick={onOpenJoinModal}
              className="hidden lg:inline-flex items-center justify-center font-ui bg-[#184E48] hover:bg-[#22A06B] text-white text-[15px] font-semibold tracking-tight px-5 py-2.5 rounded-full shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md active:scale-[0.98] whitespace-nowrap shrink-0"
            >
              Долучитися
            </button>

            <button
              type="button"
              onClick={() => setMobileMenuOpen((prev) => !prev)}
              aria-expanded={mobileMenuOpen}
              aria-controls="mobile-navigation"
              aria-label={mobileMenuOpen ? 'Закрити меню' : 'Відкрити меню'}
              className="lg:hidden inline-flex items-center justify-center w-11 h-11 rounded-full bg-[#EAF4EE]/90 border border-[#22A06B]/20 text-[#184E48] hover:bg-[#D5ECE0] hover:border-[#22A06B]/50 transition-all duration-200"
            >
              <span
                className={`inline-flex transition-transform duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] ${
                  mobileMenuOpen ? 'rotate-90' : 'rotate-0'
                }`}
              >
                {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </span>
            </button>
          </div>
        </div>
      </div>

      {/* Плавне розкриття/згортання мобільного меню через CSS Grid */}
      <div
        id="mobile-navigation"
        aria-hidden={!mobileMenuOpen}
        className={`lg:hidden grid transition-[grid-template-rows,opacity] duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] ${
          mobileMenuOpen
            ? 'grid-rows-[1fr] opacity-100 pointer-events-auto'
            : 'grid-rows-[0fr] opacity-0 pointer-events-none'
        }`}
      >
        <div className="overflow-hidden">
          <nav
            aria-label="Мобільна навігація"
            className="font-ui bg-white/98 backdrop-blur-md border-b border-emerald-900/10 px-4 pt-3 pb-6 shadow-md"
          >
            <div className="flex flex-col space-y-2.5">
              {NAV_ITEMS.map((item) => {
                const isActive = activeSection === item.id;
                return (
                  <a
                    key={item.id}
                    href={item.href}
                    tabIndex={mobileMenuOpen ? 0 : -1}
                    aria-current={isActive ? 'page' : undefined}
                    onClick={handleNavClick}
                    className={`font-ui flex items-center justify-center min-h-[44px] px-4 py-2 rounded-full text-[15px] font-semibold tracking-tight transition-all duration-200 ${
                      isActive
                        ? 'bg-[#22A06B] border border-[#22A06B] text-white shadow-sm'
                        : 'bg-[#EAF4EE]/90 border border-[#22A06B]/20 text-[#184E48] hover:bg-[#D5ECE0] hover:border-[#22A06B]/50'
                    }`}
                  >
                    {item.label}
                  </a>
                );
              })}
              <button
                type="button"
                tabIndex={mobileMenuOpen ? 0 : -1}
                onClick={() => {
                  handleNavClick();
                  onOpenJoinModal();
                }}
                className="mt-2 font-ui flex items-center justify-center min-h-[46px] bg-[#184E48] hover:bg-[#22A06B] text-white text-[15px] font-semibold tracking-tight px-5 py-2.5 rounded-full shadow-sm transition-all duration-200"
              >
                Долучитися
              </button>
            </div>
          </nav>
        </div>
      </div>
    </header>
  );
}
