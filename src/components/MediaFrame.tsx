import { useState } from 'react';
import { Sprout } from 'lucide-react';

interface MediaFrameProps {
  src: string;
  alt: string;
  placeholderPath?: string;
  className?: string;
  imgClassName?: string;
  priority?: boolean;
}

/**
 * Надійний контейнер для фотографій.
 * Якщо локальний файл за шляхом `images/...` ще не додано,
 * показує охайну ботанічну заглушку замість зламаного зображення.
 */
export function MediaFrame({
  src,
  alt,
  placeholderPath,
  className = '',
  imgClassName = '',
  priority = false,
}: MediaFrameProps) {
  const [hasError, setHasError] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);

  if (hasError || !src) {
    return (
      <div
        className={`relative flex flex-col items-center justify-center bg-gradient-to-br from-harmony-sage via-harmony-sand to-harmony-sage/80 text-harmony-dark/70 p-6 text-center ${className}`}
        role="img"
        aria-label={alt}
      >
        <div className="w-11 h-11 rounded-full bg-white/80 flex items-center justify-center text-harmony-emerald mb-3">
          <Sprout className="w-5 h-5" strokeWidth={1.75} />
        </div>
        <p className="text-xs font-medium text-harmony-dark/80 max-w-[220px] leading-relaxed">
          {alt}
        </p>
        {placeholderPath && (
          <p className="text-[11px] text-harmony-primary/80 mt-1.5 font-mono">
            {placeholderPath}
          </p>
        )}
      </div>
    );
  }

  return (
    <div className={`relative overflow-hidden bg-harmony-sage/70 ${className}`}>
      <img
        src={src}
        alt={alt}
        loading={priority ? 'eager' : 'lazy'}
        decoding={priority ? 'sync' : 'async'}
        referrerPolicy="no-referrer"
        onLoad={() => setIsLoaded(true)}
        onError={() => setHasError(true)}
        className={`w-full h-full object-cover transition-opacity duration-500 ease-out ${
          isLoaded ? 'opacity-100' : 'opacity-0'
        } ${imgClassName}`}
      />
    </div>
  );
}
