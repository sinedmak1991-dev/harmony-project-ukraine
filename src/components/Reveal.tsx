import { type ReactNode, useEffect, useRef, useState } from 'react';

type StaggerDelayMs = 0 | 100 | 200 | 300 | 400 | 500;

interface RevealProps {
  children: ReactNode;
  delayMs?: StaggerDelayMs;
  className?: string;
}

const DELAY_CLASS_MAP: Record<StaggerDelayMs, string> = {
  0: '',
  100: 'reveal-delay-100',
  200: 'reveal-delay-200',
  300: 'reveal-delay-300',
  400: 'reveal-delay-400',
  500: 'reveal-delay-500',
};

/**
 * Нативний Scroll Reveal на базі IntersectionObserver + CSS-класів `.reveal` / `.is-visible`.
 * Без сторонніх важких бібліотек; коректно працює на десктопі та мобільних пристроях.
 */
export function Reveal({
  children,
  delayMs = 0,
  className = '',
}: RevealProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    const prefersReducedMotion = window.matchMedia(
      '(prefers-reduced-motion: reduce)'
    ).matches;
    if (prefersReducedMotion || typeof IntersectionObserver === 'undefined') {
      setIsVisible(true);
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsVisible(true);
            observer.unobserve(entry.target);
          }
        });
      },
      {
        threshold: 0.08,
        rootMargin: '0px 0px -36px 0px',
      }
    );

    observer.observe(element);
    return () => observer.disconnect();
  }, []);

  const delayClass = DELAY_CLASS_MAP[delayMs];

  return (
    <div
      ref={ref}
      className={`reveal ${delayClass} ${isVisible ? 'is-visible' : ''} ${className}`.trim()}
    >
      {children}
    </div>
  );
}
