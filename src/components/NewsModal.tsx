import { useEffect, useRef, useState } from 'react';
import { ArrowLeft, ArrowRight, X } from 'lucide-react';
import { NEWS_ARTICLES, type NewsArticle } from '../data/harmonyContent';
import { MediaFrame } from './MediaFrame';

interface NewsModalProps {
  article: NewsArticle | null;
  onClose: () => void;
  onSelectArticle: (article: NewsArticle) => void;
}

/**
 * Модальне вікно новин із плавним CSS-відкриттям та закриттям
 * (backdrop-blur + scale-95 -> scale-100 + opacity).
 */
export function NewsModal({ article, onClose, onSelectArticle }: NewsModalProps) {
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const [renderedArticle, setRenderedArticle] = useState<NewsArticle | null>(article);
  const [isEntered, setIsEntered] = useState(false);

  useEffect(() => {
    if (article) {
      setRenderedArticle(article);
      // Запускаємо перехід на наступному кадрі для плавного scale-95 -> scale-100
      const frame = requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          setIsEntered(true);
        });
      });
      return () => cancelAnimationFrame(frame);
    } else {
      setIsEntered(false);
      const timer = window.setTimeout(() => {
        setRenderedArticle(null);
      }, 280);
      return () => window.clearTimeout(timer);
    }
  }, [article]);

  useEffect(() => {
    if (!article) return;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    closeButtonRef.current?.focus();

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [article, onClose]);

  if (!renderedArticle) return null;

  const currentIndex = NEWS_ARTICLES.findIndex(
    (item) => item.id === renderedArticle.id
  );
  const prevArticle =
    currentIndex > 0 ? NEWS_ARTICLES[currentIndex - 1] : null;
  const nextArticle =
    currentIndex >= 0 && currentIndex < NEWS_ARTICLES.length - 1
      ? NEWS_ARTICLES[currentIndex + 1]
      : null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="news-modal-title"
      onClick={onClose}
      className={`fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 transition-all duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] ${
        isEntered
          ? 'bg-harmony-dark/60 backdrop-blur-sm opacity-100'
          : 'bg-harmony-dark/0 backdrop-blur-none opacity-0 pointer-events-none'
      }`}
    >
      <div
        onClick={(event) => event.stopPropagation()}
        className={`bg-white rounded-3xl max-w-2xl w-full relative shadow-2xl border border-emerald-900/10 max-h-[90vh] overflow-y-auto transition-all duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] ${
          isEntered
            ? 'opacity-100 scale-100 translate-y-0'
            : 'opacity-0 scale-95 translate-y-3'
        }`}
      >
        {/* Кнопка закриття */}
        <button
          ref={closeButtonRef}
          type="button"
          onClick={onClose}
          aria-label="Закрити новину"
          className="absolute top-4 right-4 z-10 w-10 h-10 rounded-full bg-white/95 hover:bg-harmony-sand text-harmony-heading border border-emerald-900/10 flex items-center justify-center transition-all duration-200 hover:scale-105 shadow-sm"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Фото статті */}
        <MediaFrame
          src={renderedArticle.image}
          alt={renderedArticle.imageAlt}
          placeholderPath={renderedArticle.placeholderPath}
          className="h-56 sm:h-64 w-full"
        />

        {/* Текст статті */}
        <div className="p-6 sm:p-8 lg:p-10">
          <div className="flex flex-wrap items-center gap-2 text-xs font-medium text-harmony-sky mb-3">
            <span>{renderedArticle.category}</span>
            <span aria-hidden="true" className="text-harmony-ink/35">
              ·
            </span>
            <time className="text-harmony-ink/70">{renderedArticle.date}</time>
            <span aria-hidden="true" className="text-harmony-ink/35">
              ·
            </span>
            <span className="text-harmony-ink/70">{renderedArticle.readTime}</span>
          </div>

          <h3
            id="news-modal-title"
            className="font-serif text-2xl sm:text-3xl font-bold text-harmony-heading leading-snug mb-6"
          >
            {renderedArticle.title}
          </h3>

          <div className="space-y-4 text-harmony-ink text-sm sm:text-base leading-relaxed">
            {renderedArticle.paragraphs.map((paragraph, idx) => (
              <p key={idx}>{paragraph}</p>
            ))}
          </div>

          <div className="mt-6 p-5 rounded-2xl bg-harmony-sage/85 border border-emerald-900/10 text-sm text-harmony-heading leading-relaxed">
            {renderedArticle.highlight}
          </div>

          <div className="mt-8 pt-6 border-t border-emerald-900/10 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              {prevArticle && (
                <button
                  type="button"
                  onClick={() => onSelectArticle(prevArticle)}
                  className="inline-flex items-center gap-1.5 text-xs font-medium text-harmony-ink hover:text-harmony-heading px-3.5 py-2 rounded-full border border-emerald-900/15 hover:bg-harmony-cream transition-colors"
                >
                  <ArrowLeft className="w-3.5 h-3.5" />
                  Попередня
                </button>
              )}
              {nextArticle && (
                <button
                  type="button"
                  onClick={() => onSelectArticle(nextArticle)}
                  className="inline-flex items-center gap-1.5 text-xs font-medium text-harmony-ink hover:text-harmony-heading px-3.5 py-2 rounded-full border border-emerald-900/15 hover:bg-harmony-cream transition-colors"
                >
                  Наступна
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

            <a
              href="#contacts"
              onClick={onClose}
              className="inline-flex items-center justify-center gap-2 bg-harmony-primary hover:bg-harmony-primary-hover text-white text-sm font-semibold px-5 py-2.5 rounded-full shadow-xs transition-colors whitespace-nowrap"
            >
              Зв’язатися з командою
              <ArrowRight className="w-4 h-4" />
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
