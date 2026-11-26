import { useId } from 'react';

interface LogoProps {
  /** 'light' для світлої шапки сайту, 'dark' для темного футера */
  variant?: 'light' | 'dark';
  className?: string;
}

/**
 * Офіційний векторний логотип «The Harmony Project» (чиста англійська версія):
 * — Емблема «Квітка життя» (6 симетричних кіл і центральне коло у зовнішньому контурі, strokeWidth="2")
 * — Двоколірний природний градієнт (верхній лівий — глибокий бірюзово-зелений, нижній правий — трав'янисто-зелений)
 * — Трирядкова назва: The / Harmony / Project
 */
export function Logo({ variant = 'light', className = '' }: LogoProps) {
  const uniqueId = useId();
  const gradientId = `harmony-logo-grad-${uniqueId.replace(/:/g, '')}`;
  const isDark = variant === 'dark';

  return (
    <span
      className={`inline-flex items-center gap-3 select-none bg-transparent logo-hover-organic ${className}`}
    >
      {/* Геометрична емблема «Квітка життя» */}
      <svg
        viewBox="0 0 100 100"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-11 h-11 sm:w-12 sm:h-12 shrink-0"
        aria-hidden="true"
      >
        <defs>
          <linearGradient
            id={gradientId}
            x1="14"
            y1="14"
            x2="86"
            y2="86"
            gradientUnits="userSpaceOnUse"
          >
            {isDark ? (
              <>
                <stop offset="0%" stopColor="#FFFFFF" />
                <stop offset="46%" stopColor="#ECFDF5" />
                <stop offset="60%" stopColor="#6EE7B7" />
                <stop offset="100%" stopColor="#34D399" />
              </>
            ) : (
              <>
                <stop offset="0%" stopColor="#184E48" />
                <stop offset="46%" stopColor="#184E48" />
                <stop offset="60%" stopColor="#479E4C" />
                <stop offset="100%" stopColor="#22A06B" />
              </>
            )}
          </linearGradient>
        </defs>

        <g
          stroke={`url(#${gradientId})`}
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          {/* Зовнішнє коло */}
          <circle cx="50" cy="50" r="44" />
          {/* Центральне коло */}
          <circle cx="50" cy="50" r="22" />
          {/* 6 симетричних кіл-пелюсток (кут 60°, дотичні до зовнішнього кола r=44) */}
          <circle cx="50" cy="28" r="22" />
          <circle cx="69.05" cy="39" r="22" />
          <circle cx="69.05" cy="61" r="22" />
          <circle cx="50" cy="72" r="22" />
          <circle cx="30.95" cy="61" r="22" />
          <circle cx="30.95" cy="39" r="22" />
        </g>
      </svg>

      {/* Трирядковий текстовий знак: The / Harmony / Project */}
      <span className="font-ui flex flex-col items-start justify-center leading-none">
        <span
          className={`text-[11px] sm:text-[12px] font-medium tracking-[0.02em] mb-[2px] ${
            isDark ? 'text-emerald-50/90' : 'text-[#184E48]'
          }`}
        >
          The
        </span>
        <span
          className={`text-[18px] sm:text-[20px] font-semibold tracking-[-0.02em] leading-[1.02] ${
            isDark ? 'text-white' : 'text-[#184E48]'
          }`}
        >
          Harmony
        </span>
        <span
          className={`text-[17px] sm:text-[19px] font-semibold tracking-[-0.015em] leading-[1.05] ${
            isDark ? 'text-emerald-300' : 'text-[#479E4C]'
          }`}
        >
          Project
        </span>
      </span>
    </span>
  );
}
