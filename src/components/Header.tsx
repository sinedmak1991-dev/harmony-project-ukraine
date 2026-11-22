import { useEffect, useState } from 'react';
import { Menu, X } from 'lucide-react';
import { MEDIA_ASSETS, NAV_ITEMS } from '../data/harmonyContent';

interface HeaderProps {
  activeSection: string;
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

export function Header({ activeSection }: HeaderProps) {
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
          ? 'bg-harmony-cream/95 backdrop-blur-md border-b border-teal-900/10 shadow-[0_6px_24px_-16px_rgba(18,52,59,0.18)]'
          : 'bg-harmony-cream/95 backdrop-blur-sm border-b border-teal-900/10'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between gap-6 lg:gap-8 h-[4.75rem] sm:h-20">
          {/* Зона 1: Прозорий PNG-логотип без білого фону чи рамок */}
          <a
            href="#top"
            onClick={handleNavClick}
            className="inline-flex items-center py-1.5 shrink-0 bg-transparent group focus-visible:rounded-xl"
            aria-label="The Harmony Project for Ukraine — на початок сторінки"
          >
            <img
              src={MEDIA_ASSETS.logo}
              alt="The Harmony Project for Ukraine"
              className="h-12 sm:h-14 w-auto object-contain bg-transparent logo-hover-organic"
            />
          </a>

          {/* Зона 2: Однорядкова навігація */}
          <nav
            aria-label="Головна навігація"
            className="hidden md:flex items-center gap-6 lg:gap-8 text-sm font-medium text-harmony-ink"
          >
            {NAV_ITEMS.map((item) => {
              const isActive = activeSection === item.id;
              return (
                <a
                  key={item.id}
                  href={item.href}
                  className={`relative py-1 whitespace-nowrap shrink-0 transition-colors duration-200 hover:text-harmony-primary ${
                    isActive ? 'text-harmony-dark font-semibold' : 'text-harmony-ink'
                  }`}
                >
                  {item.label}
                  <span
                    aria-hidden="true"
                    className={`absolute left-0 right-0 -bottom-0.5 h-[2px] rounded-full bg-harmony-primary transition-transform duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] origin-left ${
                      isActive ? 'scale-x-100' : 'scale-x-0'
                    }`}
                  />
                </a>
              );
            })}
          </nav>

          {/* Зона 3: Основна кнопка дії + кнопка мобільного меню */}
          <div className="flex items-center gap-3 shrink-0">
            <a
              href="#contacts"
              className="hidden md:inline-flex items-center justify-center bg-harmony-primary hover:bg-harmony-dark text-white text-sm font-medium px-5 py-2.5 rounded-full transition-all duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] hover:-translate-y-0.5 hover:shadow-md active:scale-[0.98] whitespace-nowrap shrink-0"
            >
              Долучитися
            </a>

            <button
              type="button"
              onClick={() => setMobileMenuOpen((prev) => !prev)}
              aria-expanded={mobileMenuOpen}
              aria-controls="mobile-navigation"
              aria-label={mobileMenuOpen ? 'Закрити меню' : 'Відкрити меню'}
              className="md:hidden inline-flex items-center justify-center w-11 h-11 rounded-xl text-harmony-dark hover:bg-harmony-sand transition-colors"
            >
              <span
                className={`inline-flex transition-transform duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] ${
                  mobileMenuOpen ? 'rotate-90' : 'rotate-0'
                }`}
              >
                {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </span>
            </button>
          </div>
        </div>
      </div>

      {/* Плавне розкриття/згортання мобільного меню через CSS Grid */}
      <div
        id="mobile-navigation"
        aria-hidden={!mobileMenuOpen}
        className={`md:hidden grid transition-[grid-template-rows,opacity] duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] ${
          mobileMenuOpen
            ? 'grid-rows-[1fr] opacity-100 pointer-events-auto'
            : 'grid-rows-[0fr] opacity-0 pointer-events-none'
        }`}
      >
        <div className="overflow-hidden">
          <nav
            aria-label="Мобільна навігація"
            className="bg-white/98 backdrop-blur-md border-b border-teal-900/10 px-4 pt-2 pb-6 shadow-md"
          >
            <div className="flex flex-col space-y-1">
              {NAV_ITEMS.map((item) => {
                const isActive = activeSection === item.id;
                return (
                  <a
                    key={item.id}
                    href={item.href}
                    tabIndex={mobileMenuOpen ? 0 : -1}
                    onClick={handleNavClick}
                    className={`flex items-center justify-between min-h-[44px] px-3 rounded-xl text-base font-medium transition-colors ${
                      isActive
                        ? 'bg-harmony-sand text-harmony-dark font-semibold'
                        : 'text-harmony-ink hover:bg-harmony-sand/70 hover:text-harmony-dark'
                    }`}
                  >
                    {item.label}
                  </a>
                );
              })}
              <a
                href="#contacts"
                tabIndex={mobileMenuOpen ? 0 : -1}
                onClick={handleNavClick}
                className="mt-3 flex items-center justify-center min-h-[46px] bg-harmony-primary hover:bg-harmony-dark text-white font-medium px-5 py-3 rounded-full transition-colors text-sm"
              >
                Долучитися
              </a>
            </div>
          </nav>
        </div>
      </div>
    </header>
  );
}
