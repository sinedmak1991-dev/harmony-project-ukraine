import { useEffect, useRef, useState } from 'react';

interface ImpactCounterProps {
  target: number;
  suffix?: string;
  durationMs?: number;
}

function formatUkrainianNumber(value: number): string {
  return value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '\u00A0');
}

/**
 * Нативний анімований лічильник на базі IntersectionObserver та requestAnimationFrame.
 * Плавно набігає від 0 до цільового значення за 1.75 секунди у момент появи в полі зору.
 */
export function ImpactCounter({
  target,
  suffix = '',
  durationMs = 1750,
}: ImpactCounterProps) {
  const ref = useRef<HTMLSpanElement>(null);
  const hasAnimatedRef = useRef(false);
  const [displayValue, setDisplayValue] = useState(0);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    const prefersReducedMotion = window.matchMedia(
      '(prefers-reduced-motion: reduce)'
    ).matches;

    if (prefersReducedMotion || typeof IntersectionObserver === 'undefined') {
      setDisplayValue(target);
      return;
    }

    let frameId = 0;

    const startCounting = () => {
      if (hasAnimatedRef.current) return;
      hasAnimatedRef.current = true;

      const startTime = performance.now();

      const tick = (now: number) => {
        const elapsed = now - startTime;
        const progress = Math.min(elapsed / durationMs, 1);
        // Органічне уповільнення (ease-out quartic)
        const eased = 1 - Math.pow(1 - progress, 4);
        setDisplayValue(Math.round(target * eased));

        if (progress < 1) {
          frameId = requestAnimationFrame(tick);
        } else {
          setDisplayValue(target);
        }
      };

      frameId = requestAnimationFrame(tick);
    };

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            startCounting();
            observer.unobserve(entry.target);
          }
        });
      },
      {
        threshold: 0.25,
      }
    );

    observer.observe(element);

    return () => {
      observer.disconnect();
      if (frameId) cancelAnimationFrame(frameId);
    };
  }, [target, durationMs]);

  return (
    <span ref={ref} className="tabular-nums">
      {formatUkrainianNumber(displayValue)}
      {suffix}
    </span>
  );
}
