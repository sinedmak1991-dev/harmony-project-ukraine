import { type FormEvent, useEffect, useRef, useState } from 'react';
import { AlertCircle, CheckCircle2, Loader2, Send, X } from 'lucide-react';
import type { SiteContent } from '../data/harmonyContent';
import { submitContactToSheet } from '../services/googleSheetsApi';

interface JoinModalProps {
  isOpen: boolean;
  onClose: () => void;
  labels: SiteContent['joinModal'];
  errors: SiteContent['contactsSection']['errors'];
}

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/**
 * Модальна форма «Долучитися / Join Us» з відправкою заявок у Google Таблицю через Apps Script.
 */
export function JoinModal({ isOpen, onClose, labels, errors }: JoinModalProps) {
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const [shouldRender, setShouldRender] = useState(isOpen);
  const [isEntered, setIsEntered] = useState(false);

  const [form, setForm] = useState({
    name: '',
    email: '',
    phone: '',
    organization: '',
    message: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorKey, setErrorKey] = useState<keyof typeof errors | null>(null);
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setShouldRender(true);
      setErrorKey(null);
      const frame = requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          setIsEntered(true);
        });
      });
      return () => cancelAnimationFrame(frame);
    } else {
      setIsEntered(false);
      const timer = window.setTimeout(() => {
        setShouldRender(false);
        setSubmitted(false);
      }, 280);
      return () => window.clearTimeout(timer);
    }
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen) return;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    closeButtonRef.current?.focus();

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && !isSubmitting) {
        onClose();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, isSubmitting, onClose]);

  if (!shouldRender) return null;

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (isSubmitting) return;

    const trimmedName = form.name.trim();
    const trimmedEmail = form.email.trim();
    const trimmedMessage = form.message.trim();

    if (trimmedName.length < 2) {
      setErrorKey('name');
      return;
    }
    if (!EMAIL_PATTERN.test(trimmedEmail)) {
      setErrorKey('email');
      return;
    }
    if (trimmedMessage.length < 6) {
      setErrorKey('message');
      return;
    }

    setErrorKey(null);
    setIsSubmitting(true);

    try {
      await submitContactToSheet({
        name: trimmedName,
        email: trimmedEmail,
        phone: form.phone,
        organization: form.organization,
        topic: labels.topicForSheet,
        message: trimmedMessage,
      });

      setSubmitted(true);
      setForm({
        name: '',
        email: '',
        phone: '',
        organization: '',
        message: '',
      });
    } catch {
      setErrorKey('network');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="join-modal-title"
      onClick={() => {
        if (!isSubmitting) onClose();
      }}
      className={`fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 transition-all duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] ${
        isEntered
          ? 'bg-harmony-dark/60 backdrop-blur-sm opacity-100'
          : 'bg-harmony-dark/0 backdrop-blur-none opacity-0 pointer-events-none'
      }`}
    >
      <div
        onClick={(event) => event.stopPropagation()}
        className={`bg-white rounded-3xl max-w-xl w-full relative shadow-2xl border border-emerald-900/10 max-h-[90vh] overflow-y-auto p-6 sm:p-8 lg:p-9 transition-all duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] ${
          isEntered
            ? 'opacity-100 scale-100 translate-y-0'
            : 'opacity-0 scale-95 translate-y-3'
        }`}
      >
        <button
          ref={closeButtonRef}
          type="button"
          onClick={onClose}
          disabled={isSubmitting}
          aria-label={labels.closeAria}
          className="absolute top-4 right-4 z-10 w-10 h-10 rounded-full bg-white/95 hover:bg-harmony-sand text-harmony-heading border border-emerald-900/10 flex items-center justify-center transition-all duration-200 hover:scale-105 shadow-sm disabled:opacity-50"
        >
          <X className="w-5 h-5" aria-hidden="true" />
        </button>

        <div className="pr-10 mb-6">
          <p className="text-xs sm:text-sm font-medium text-[#22A06B] mb-1.5">
            {labels.eyebrow}
          </p>
          <h3
            id="join-modal-title"
            className="font-serif text-2xl sm:text-3xl font-bold text-harmony-heading leading-snug"
          >
            {labels.title}
          </h3>
          <p className="text-sm text-harmony-ink mt-2 leading-relaxed text-justify hyphens-auto">
            {labels.description}
          </p>
        </div>

        {submitted ? (
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
                  {labels.successTitle}
                </p>
                <p className="text-sm text-harmony-ink mt-1 leading-relaxed">
                  {labels.successDescription}
                </p>
              </div>
            </div>
            <div className="flex flex-wrap items-center gap-3 pt-1">
              <button
                type="button"
                onClick={onClose}
                className="inline-flex items-center justify-center bg-harmony-primary hover:bg-harmony-primary-hover text-white font-semibold text-sm px-5 py-2.5 rounded-full transition-colors"
              >
                {labels.returnButton}
              </button>
              <button
                type="button"
                onClick={() => setSubmitted(false)}
                className="inline-flex items-center text-sm font-semibold text-harmony-primary hover:text-harmony-primary-hover transition-colors"
              >
                {labels.sendAnother}
              </button>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} noValidate className="space-y-4">
            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <label
                  htmlFor="join-name"
                  className="block text-sm font-medium text-harmony-ink mb-1.5"
                >
                  {labels.nameLabel}
                </label>
                <input
                  type="text"
                  id="join-name"
                  required
                  disabled={isSubmitting}
                  value={form.name}
                  onChange={(e) => {
                    setForm((prev) => ({ ...prev, name: e.target.value }));
                    if (errorKey) setErrorKey(null);
                  }}
                  placeholder={labels.namePlaceholder}
                  className="w-full px-4 py-2.5 rounded-xl border border-emerald-900/15 bg-harmony-cream/60 focus:bg-white focus:border-harmony-primary focus:ring-2 focus:ring-harmony-emerald/20 outline-none transition-all text-sm text-harmony-heading placeholder:text-slate-400 disabled:opacity-60"
                />
              </div>

              <div>
                <label
                  htmlFor="join-email"
                  className="block text-sm font-medium text-harmony-ink mb-1.5"
                >
                  {labels.emailLabel}
                </label>
                <input
                  type="email"
                  id="join-email"
                  required
                  disabled={isSubmitting}
                  value={form.email}
                  onChange={(e) => {
                    setForm((prev) => ({ ...prev, email: e.target.value }));
                    if (errorKey) setErrorKey(null);
                  }}
                  placeholder={labels.emailPlaceholder}
                  className="w-full px-4 py-2.5 rounded-xl border border-emerald-900/15 bg-harmony-cream/60 focus:bg-white focus:border-harmony-primary focus:ring-2 focus:ring-harmony-emerald/20 outline-none transition-all text-sm text-harmony-heading placeholder:text-slate-400 disabled:opacity-60"
                />
              </div>
            </div>

            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <label
                  htmlFor="join-phone"
                  className="block text-sm font-medium text-harmony-ink mb-1.5"
                >
                  {labels.phoneLabel}
                </label>
                <input
                  type="tel"
                  id="join-phone"
                  disabled={isSubmitting}
                  value={form.phone}
                  onChange={(e) => setForm((prev) => ({ ...prev, phone: e.target.value }))}
                  placeholder={labels.phonePlaceholder}
                  className="w-full px-4 py-2.5 rounded-xl border border-emerald-900/15 bg-harmony-cream/60 focus:bg-white focus:border-harmony-primary focus:ring-2 focus:ring-harmony-emerald/20 outline-none transition-all text-sm text-harmony-heading placeholder:text-slate-400 disabled:opacity-60"
                />
              </div>

              <div>
                <label
                  htmlFor="join-organization"
                  className="block text-sm font-medium text-harmony-ink mb-1.5"
                >
                  {labels.orgLabel}
                </label>
                <input
                  type="text"
                  id="join-organization"
                  disabled={isSubmitting}
                  value={form.organization}
                  onChange={(e) =>
                    setForm((prev) => ({ ...prev, organization: e.target.value }))
                  }
                  placeholder={labels.orgPlaceholder}
                  className="w-full px-4 py-2.5 rounded-xl border border-emerald-900/15 bg-harmony-cream/60 focus:bg-white focus:border-harmony-primary focus:ring-2 focus:ring-harmony-emerald/20 outline-none transition-all text-sm text-harmony-heading placeholder:text-slate-400 disabled:opacity-60"
                />
              </div>
            </div>

            <div>
              <label
                htmlFor="join-message"
                className="block text-sm font-medium text-harmony-ink mb-1.5"
              >
                {labels.messageLabel}
              </label>
              <textarea
                id="join-message"
                rows={3}
                required
                disabled={isSubmitting}
                value={form.message}
                onChange={(e) => {
                  setForm((prev) => ({ ...prev, message: e.target.value }));
                  if (errorKey) setErrorKey(null);
                }}
                placeholder={labels.messagePlaceholder}
                className="w-full px-4 py-2.5 rounded-xl border border-emerald-900/15 bg-harmony-cream/60 focus:bg-white focus:border-harmony-primary focus:ring-2 focus:ring-harmony-emerald/20 outline-none transition-all text-sm text-harmony-heading placeholder:text-slate-400 resize-y disabled:opacity-60"
              />
            </div>

            {errorKey && (
              <div
                role="alert"
                className="flex items-center gap-2.5 p-3.5 rounded-xl bg-red-50 border border-red-200 text-red-800 text-sm"
              >
                <AlertCircle className="w-4 h-4 shrink-0 text-red-600" aria-hidden="true" />
                <span>{errors[errorKey]}</span>
              </div>
            )}

            <button
              type="submit"
              disabled={isSubmitting}
              className="group w-full inline-flex items-center justify-center gap-2 bg-harmony-primary hover:bg-harmony-primary-hover text-white font-semibold text-sm sm:text-base px-7 py-3.5 rounded-full shadow-xs transition-all duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] hover:-translate-y-0.5 hover:shadow-md active:scale-[0.98] disabled:opacity-70 disabled:pointer-events-none"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" aria-hidden="true" />
                  {labels.submitLoading}
                </>
              ) : (
                <>
                  {labels.submitIdle}
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
    </div>
  );
}
