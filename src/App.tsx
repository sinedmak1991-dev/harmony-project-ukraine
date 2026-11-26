import { type FormEvent, useEffect, useState } from 'react';
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
import { Header, SeedOfLifeMark } from './components/Header';
import { ImpactCounter } from './components/ImpactCounter';
import { JoinModal } from './components/JoinModal';
import { Logo } from './components/Logo';
import { MediaFrame } from './components/MediaFrame';
import { NewsModal } from './components/NewsModal';
import { Reveal } from './components/Reveal';
import {
  HARMONY_PRINCIPLES,
  type HarmonyPrincipleItem,
  IMPACT_METRICS,
  MEDIA_ASSETS,
  NAV_ITEMS,
  type NewsArticle,
  type NewsCategory,
  PILLARS,
  SCHOOL_FEATURES,
  SCHOOL_STEPS,
  WELLBEING_BENEFITS,
} from './data/harmonyContent';
import { fetchNewsFromSheet, submitContactToSheet } from './services/googleSheetsApi';

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const TOPIC_LABELS: Record<string, string> = {
  school: 'Долучити школу до проєкту',
  training: 'Навчання для вчителів',
  partnership: 'Партнерство / Підтримка',
  other: 'Інше питання',
};

const STAGGER_DELAYS = [100, 200, 300, 400, 500] as const;

function getStaggerDelay(index: number): 0 | 100 | 200 | 300 | 400 | 500 {
  return STAGGER_DELAYS[Math.min(index, STAGGER_DELAYS.length - 1)];
}

function renderPillarIcon(name: 'heart' | 'compass' | 'flower' | 'sparkles') {
  switch (name) {
    case 'heart':
      return <Heart className="w-5 h-5" strokeWidth={1.75} />;
    case 'compass':
      return <Compass className="w-5 h-5" strokeWidth={1.75} />;
    case 'flower':
      return <Flower2 className="w-5 h-5" strokeWidth={1.75} />;
    case 'sparkles':
      return <Sparkles className="w-5 h-5" strokeWidth={1.75} />;
  }
}

function renderImpactIcon(name: 'users' | 'school' | 'globe') {
  switch (name) {
    case 'users':
      return <Users className="w-5 h-5" strokeWidth={1.75} />;
    case 'school':
      return <School className="w-5 h-5" strokeWidth={1.75} />;
    case 'globe':
      return <Globe className="w-5 h-5" strokeWidth={1.75} />;
  }
}

function renderSchoolFeatureIcon(name: 'users' | 'leaf' | 'book' | 'heart' | 'sprout') {
  switch (name) {
    case 'users':
      return <Users className="w-6 h-6" strokeWidth={1.6} />;
    case 'leaf':
      return <Leaf className="w-6 h-6" strokeWidth={1.6} />;
    case 'book':
      return <BookOpen className="w-6 h-6" strokeWidth={1.6} />;
    case 'heart':
      return <HeartHandshake className="w-6 h-6" strokeWidth={1.6} />;
    case 'sprout':
      return <Sprout className="w-6 h-6" strokeWidth={1.6} />;
  }
}

function renderWellbeingIcon(name: 'wind' | 'handshake' | 'focus' | 'shield' | 'sun') {
  switch (name) {
    case 'wind':
      return <Wind className="w-5 h-5" strokeWidth={1.7} />;
    case 'handshake':
      return <HeartHandshake className="w-5 h-5" strokeWidth={1.7} />;
    case 'focus':
      return <Focus className="w-5 h-5" strokeWidth={1.7} />;
    case 'shield':
      return <ShieldCheck className="w-5 h-5" strokeWidth={1.7} />;
    case 'sun':
      return <Sun className="w-5 h-5" strokeWidth={1.7} />;
  }
}

function renderHarmonyPrincipleIcon(name: HarmonyPrincipleItem['iconName']) {
  switch (name) {
    case 'link':
      return <Link2 className="w-5 h-5" strokeWidth={1.6} />;
    case 'cycle':
      return <RefreshCw className="w-5 h-5" strokeWidth={1.6} />;
    case 'flower':
      return <Flower2 className="w-5 h-5" strokeWidth={1.6} />;
    case 'leaf':
      return <Leaf className="w-5 h-5" strokeWidth={1.6} />;
    case 'heart':
      return <Heart className="w-5 h-5" strokeWidth={1.6} />;
    case 'geometry':
      return <Hexagon className="w-5 h-5" strokeWidth={1.6} />;
    case 'unity':
      return <Sun className="w-5 h-5" strokeWidth={1.6} />;
  }
}

export default function App() {
  const [activeSection, setActiveSection] = useState<string>('');
  const [newsArticles, setNewsArticles] = useState<NewsArticle[]>([]);
  const [isLoadingNews, setIsLoadingNews] = useState<boolean>(true);
  const [selectedNews, setSelectedNews] = useState<NewsArticle | null>(null);
  const [activeCategory, setActiveCategory] = useState<NewsCategory>('Усі');
  const [isJoinModalOpen, setIsJoinModalOpen] = useState<boolean>(false);

  // Стан форми зворотного зв'язку
  const [contactForm, setContactForm] = useState({
    name: '',
    email: '',
    phone: '',
    organization: '',
    topic: 'school',
    message: '',
  });
  const [isContactSubmitting, setIsContactSubmitting] = useState(false);
  const [contactError, setContactError] = useState<string | null>(null);
  const [contactSubmitted, setContactSubmitted] = useState(false);

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
    const sectionIds = NAV_ITEMS.map((item) => item.id);
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

  const newsCategories: NewsCategory[] = [
    'Усі',
    ...Array.from(
      new Set(newsArticles.map((article) => article.category).filter(Boolean))
    ),
  ];

  const effectiveCategory = newsCategories.includes(activeCategory)
    ? activeCategory
    : 'Усі';

  const filteredNews =
    effectiveCategory === 'Усі'
      ? newsArticles
      : newsArticles.filter((article) => article.category === effectiveCategory);

  const handleContactSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (isContactSubmitting) return;

    const trimmedName = contactForm.name.trim();
    const trimmedEmail = contactForm.email.trim();
    const trimmedMessage = contactForm.message.trim();

    if (trimmedName.length < 2) {
      setContactError('Будь ласка, вкажіть ваше ім’я та прізвище.');
      return;
    }
    if (!EMAIL_PATTERN.test(trimmedEmail)) {
      setContactError('Будь ласка, введіть коректну електронну адресу.');
      return;
    }
    if (trimmedMessage.length < 6) {
      setContactError('Будь ласка, напишіть коротке повідомлення (щонайменше 6 символів).');
      return;
    }

    setContactError(null);
    setIsContactSubmitting(true);

    try {
      await submitContactToSheet({
        name: trimmedName,
        email: trimmedEmail,
        phone: contactForm.phone,
        organization: contactForm.organization,
        topic: TOPIC_LABELS[contactForm.topic] || contactForm.topic,
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
      setContactError(
        'Не вдалося надіслати звернення. Перевірте з’єднання з інтернетом і спробуйте ще раз.'
      );
    } finally {
      setIsContactSubmitting(false);
    }
  };

  return (
    <div id="top" className="min-h-screen flex flex-col bg-harmony-cream text-harmony-ink">
      {/* НАВІГАЦІЯ */}
      <Header
        activeSection={activeSection}
        onOpenJoinModal={() => setIsJoinModalOpen(true)}
      />

      <main className="flex-1">
        {/* 1. HERO СЕКЦІЯ (Освіта в гармонії з життям + макрофото пухнастої кульбаби праворуч) */}
        <section className="relative overflow-hidden bg-[#F7FBF9] border-b border-emerald-900/10">
          {/* HERO IMAGE: Кульбаба (можна замінити на власне фото images/dandelion-hero.jpg) */}
          <div
            aria-hidden="true"
            className="hidden lg:block absolute inset-y-0 right-0 w-[64%] xl:w-[62%] overflow-hidden pointer-events-none select-none"
          >
            <MediaFrame
              src={MEDIA_ASSETS.heroDandelion}
              alt="Стигла пухнаста кульбаба у ранковому світлі з насінинами, що розлітаються у повітрі"
              placeholderPath="images/dandelion-hero.jpg"
              priority
              className="w-full h-full bg-[#F7FBF9]"
              imgClassName="object-right dandelion-breeze"
            />
            {/* М'яка градієнтна маска для безшовного злиття кульбаби зі світлим фоном #F7FBF9 */}
            <div className="absolute inset-0 bg-gradient-to-r from-[#F7FBF9] via-[#F7FBF9]/80 to-transparent" />
            <div className="absolute inset-x-0 bottom-0 h-20 bg-gradient-to-t from-[#F7FBF9]/70 to-transparent" />
          </div>

          <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-12 pb-10 sm:pt-16 sm:pb-16 lg:py-24 xl:py-28">
            <div className="grid lg:grid-cols-12 gap-8 lg:gap-10 items-center">
              {/* Ліва текстова частина поверх світлої зони банера */}
              <div className="hero-enter lg:col-span-6 xl:col-span-6 space-y-6">
                <h1 className="font-serif text-4xl sm:text-5xl lg:text-[3.5rem] font-semibold text-harmony-heading leading-[1.12] tracking-tight">
                  Освіта, що оживає{' '}
                  <span className="text-harmony-primary">в гармонії з життям.</span>
                </h1>

                <p className="text-base sm:text-[17px] text-harmony-ink max-w-xl leading-relaxed text-justify hyphens-auto">
                  Навчання, засноване на принципах природи: від запитів і досліджень до значущих «Великих робіт». Підтримуємо добробут українських учнів і педагогів, формуючи покоління відповідальних лідерів сталого майбутнього.
                </p>

                <div className="flex flex-wrap items-center gap-3.5 pt-2">
                  <a
                    href="#approach"
                    className="group font-ui inline-flex items-center justify-center gap-2 bg-harmony-primary hover:bg-harmony-primary-hover text-white text-sm sm:text-base font-semibold tracking-tight px-6 py-3.5 rounded-full shadow-xs transition-all duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] hover:-translate-y-0.5 hover:shadow-md active:scale-[0.98] whitespace-nowrap"
                  >
                    Відкрити підхід
                    <ChevronRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-0.5" />
                  </a>
                  <a
                    href="#schools"
                    className="font-ui inline-flex items-center justify-center bg-white/95 hover:bg-harmony-sand text-harmony-heading border border-emerald-900/15 text-sm sm:text-base font-semibold tracking-tight px-6 py-3.5 rounded-full transition-all duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] hover:-translate-y-0.5 whitespace-nowrap backdrop-blur-xs"
                  >
                    Впровадити у школі
                  </a>
                </div>

                {/* Слоган під кнопками (як на початковому макеті) */}
                <div className="pt-5 border-t border-emerald-900/10 flex items-center gap-2.5 text-xs sm:text-sm text-harmony-ink max-w-lg">
                  <Sprout className="w-4 h-4 text-harmony-primary shrink-0" strokeWidth={2} />
                  <span>
                    <strong className="font-semibold text-harmony-heading">Природа — наш учитель.</strong>{' '}
                    Вкорінені у цінностях, відкриті до світу.
                  </span>
                </div>
              </div>

              {/* Мобільна та планшетна версія фото кульбаби з плавним переходом зверху */}
              <div className="hero-enter-delayed lg:hidden relative rounded-3xl overflow-hidden border border-emerald-900/10 aspect-[16/10] bg-[#F7FBF9]">
                {/* HERO IMAGE: Кульбаба (можна замінити на власне фото images/dandelion-hero.jpg) */}
                <MediaFrame
                  src={MEDIA_ASSETS.heroDandelion}
                  alt="Стигла пухнаста кульбаба у ранковому світлі з насінинами, що розлітаються у повітрі"
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
                  Наш підхід у чотирьох елементах
                </p>
                <h2 className="font-serif text-3xl sm:text-4xl font-bold text-harmony-heading leading-tight">
                  Чотири опори підходу <span className="text-harmony-primary">Гармонії</span>
                </h2>
              </div>
              <p className="text-sm sm:text-base text-harmony-ink max-w-md leading-relaxed text-justify hyphens-auto">
                Цілісна система, де шкільні предмети поєднуються з життєвим досвідом, творчістю та турботою про світ.
              </p>
            </Reveal>

            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 items-stretch">
              {PILLARS.map((pillar, index) => (
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
                      Навчання, що зростає разом із дитиною
                    </h2>
                    <p className="text-harmony-ink text-sm sm:text-[15px] leading-relaxed mb-5 text-justify hyphens-auto">
                      Коли природа стає нашим учителем, навчання оживає. Від раннього дитинства до юності ми розвиваємо допитливість, творчість і вміння бачити цілісність світу розумом, серцем і руками.
                    </p>
                    <a
                      href="#schools"
                      className="mt-auto inline-flex items-center gap-1.5 text-sm font-semibold text-[#22A06B] hover:text-[#1A7F56] transition-colors"
                    >
                      Дізнатися більше
                      <ArrowRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" />
                    </a>
                  </div>
                  <MediaFrame
                    src={MEDIA_ASSETS.natureDetail}
                    alt="Українські школярі малюють аквареллю листя та квіти на галявині"
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
                      Підтримуємо дітей України сьогодні
                    </h2>
                    <p className="text-harmony-ink text-sm sm:text-[15px] leading-relaxed mb-5 text-justify hyphens-auto">
                      Допомагаємо школам і громадам зміцнювати психологічний добробут учнів та педагогів. Через турботу про довкілля, спільні проєкти й тихі хвилини споглядання діти відновлюють внутрішню рівновагу та надію.
                    </p>
                    <a
                      href="#wellbeing"
                      className="mt-auto inline-flex items-center gap-1.5 text-sm font-semibold text-[#22A06B] hover:text-[#1A7F56] transition-colors"
                    >
                      Читати більше
                      <ArrowRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" />
                    </a>
                  </div>
                  <MediaFrame
                    src={MEDIA_ASSETS.wellbeing}
                    alt="Ранковий український луг із дикими квітами та лелекою у гнізді"
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
                      Вимірювані результати
                    </p>
                    <h2 className="font-serif text-2xl sm:text-[1.75rem] font-bold tracking-wide mb-8">
                      Реальний вплив
                    </h2>

                    <div className="space-y-6">
                      {IMPACT_METRICS.map((metric, idx) => (
                        <div key={metric.label} className="flex items-center gap-4">
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
                      Історії впливу
                      <ArrowRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" />
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
                  Для шкіл в Україні
                </p>
                <h2 className="font-serif text-3xl sm:text-4xl font-bold text-harmony-heading leading-tight">
                  Як ми працюємо зі <span className="text-harmony-primary">школами</span>
                </h2>
                <p className="text-harmony-ink mt-3 text-base leading-relaxed text-justify hyphens-auto">
                  Пропонуємо перевірений і гнучкий шлях інтеграції підходу «Гармонії» в навчальний процес та повсякденну культуру сучасної української школи.
                </p>
              </Reveal>

              <div className="grid sm:grid-cols-2 lg:grid-cols-5 gap-4 lg:gap-5 items-stretch">
                {SCHOOL_FEATURES.map((feature, index) => (
                  <Reveal
                    key={feature.title}
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
                    Навчання, що підтримує добробут і стійкість
                  </h3>
                  <p className="text-harmony-ink text-sm sm:text-base mt-3 leading-relaxed text-justify hyphens-auto">
                    Коли діти навчаються у зв’язку з природою, вони почуваються добре і впевнено. Ми створюємо в школі простір довіри, спокою та взаємної підтримки для кожного учня й педагога.
                  </p>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4 sm:gap-5">
                  {WELLBEING_BENEFITS.map((benefit) => (
                    <div
                      key={benefit.title}
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
                  <Sprout className="w-5 h-5 text-harmony-primary shrink-0" strokeWidth={1.85} />
                  <p className="leading-relaxed text-justify hyphens-auto">
                    <strong className="font-semibold">Психологічний добробут і стійкість</strong> — ключовий пріоритет Проєкту «Гармонія», особливо важливий для українських дітей і педагогів сьогодні.
                  </p>
                </div>
              </Reveal>
            </div>

            {/* 4.3 Ваш шлях упровадження (каскадна поява 100..500ms) */}
            <div>
              <Reveal className="max-w-2xl mb-10">
                <h3 className="font-serif text-2xl sm:text-3xl font-bold text-harmony-heading">
                  Ваш шлях упровадження
                </h3>
                <p className="text-harmony-ink text-sm sm:text-base mt-2 leading-relaxed text-justify hyphens-auto">
                  Простий і підтримуваний маршрут від першого знайомства до живих змін у шкільній спільноті.
                </p>
              </Reveal>

              <div className="grid sm:grid-cols-2 lg:grid-cols-5 gap-5 relative">
                <div
                  aria-hidden="true"
                  className="hidden lg:block absolute top-5 left-[10%] right-[10%] border-t border-dashed border-harmony-emerald/55"
                />

                {SCHOOL_STEPS.map((item, index) => (
                  <Reveal
                    key={item.step}
                    delayMs={getStaggerDelay(index)}
                    className={
                      index === SCHOOL_STEPS.length - 1
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
                    Відкриті до партнерства
                  </p>
                  <h3 className="font-serif text-2xl sm:text-3xl font-bold tracking-wide text-white">
                    Готові розпочати?
                  </h3>
                  <p className="text-sm sm:text-base text-emerald-50/90 leading-relaxed text-justify hyphens-auto">
                    Будуймо разом освіту 21 століття, яка підтримує дітей України — силою природи, цінностей та живої спільноти.
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() => setIsJoinModalOpen(true)}
                  className="relative shrink-0 inline-flex items-center gap-2 bg-harmony-primary hover:bg-harmony-primary-hover text-white font-semibold text-sm sm:text-base px-7 py-3.5 rounded-full shadow-xs transition-all duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] hover:-translate-y-0.5 hover:shadow-md active:scale-[0.98] whitespace-nowrap"
                >
                  Долучитися
                  <ArrowRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" />
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
                  Події та публікації
                </p>
                <h2 className="font-serif text-3xl sm:text-4xl font-bold text-harmony-heading leading-tight">
                  Новини проєкту
                </h2>
                <p className="text-sm sm:text-base text-harmony-ink mt-3 leading-relaxed text-justify hyphens-auto">
                  Актуальні події, анонси семінарів для педагогів та новини розвитку Проєкту «Гармонія» в Україні.
                </p>
              </div>

              {/* Інтерактивний фільтр категорій новин (показується лише за наявності новин) */}
              {!isLoadingNews && newsArticles.length > 0 && (
                <div
                  role="tablist"
                  aria-label="Фільтр новин за категорією"
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
                  <Loader2 className="w-4 h-4 text-harmony-primary animate-spin" />
                  <span>Завантаження новин...</span>
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
            ) : newsArticles.length === 0 ? (
              <Reveal>
                <div className="max-w-2xl mx-auto rounded-3xl bg-harmony-sand border border-emerald-900/10 px-7 sm:px-10 py-10 sm:py-12 text-center shadow-[0_10px_30px_-24px_rgba(24,78,72,0.14)]">
                  <div className="w-12 h-12 rounded-2xl bg-white border border-emerald-900/10 text-harmony-primary flex items-center justify-center mx-auto mb-5">
                    <Sparkles className="w-5 h-5" strokeWidth={1.75} />
                  </div>
                  <h3 className="font-serif text-2xl font-bold text-harmony-heading mb-2.5">
                    Актуальні новини скоро з'являться
                  </h3>
                  <p className="text-sm sm:text-base text-harmony-ink leading-relaxed max-w-lg mx-auto">
                    Ми готуємо свіжі матеріали, анонси подій та історії українських шкіл-партнерів.
                  </p>
                </div>
              </Reveal>
            ) : (
              <div className="grid md:grid-cols-3 gap-7 lg:gap-8 items-stretch">
                {filteredNews.map((article, index) => (
                  <Reveal
                    key={`${effectiveCategory}-${article.id}`}
                    delayMs={getStaggerDelay(index)}
                    className="h-full"
                  >
                    <article className="group h-full bg-white rounded-3xl overflow-hidden border border-emerald-900/10 flex flex-col transition-all duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] hover:-translate-y-1.5 hover:shadow-[0_18px_38px_-18px_rgba(24,78,72,0.16)] hover:border-harmony-emerald/45">
                      {article.image && (
                        <button
                          type="button"
                          onClick={() => setSelectedNews(article)}
                          className="block w-full text-left focus-visible:outline-none shrink-0"
                          aria-label={`Відкрити новину: ${article.title}`}
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
                              onClick={() => setSelectedNews(article)}
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
                            onClick={() => setSelectedNews(article)}
                            className="inline-flex items-center gap-1.5 text-sm font-semibold text-harmony-primary hover:text-harmony-primary-hover transition-colors"
                          >
                            Читати далі
                            <ArrowRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" />
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
                    Зв’яжіться з нами
                  </p>
                  <h2 className="font-serif text-3xl sm:text-4xl font-bold text-harmony-heading leading-tight">
                    Приєднайтеся до <span className="text-harmony-primary">нашого руху</span>
                  </h2>
                </div>

                <p className="text-harmony-ink leading-relaxed text-base text-justify hyphens-auto">
                  Освіта може бути силою добра у світі. Разом ми робимо це можливим. Напишіть нам, якщо ви представляєте школу, громаду або бажаєте підтримати проєкт.
                </p>

                <div className="space-y-4 pt-2">
                  <div className="flex items-start gap-4">
                    <div className="w-11 h-11 rounded-full bg-white text-[#22A06B] border border-emerald-900/10 flex items-center justify-center shrink-0">
                      <Mail className="w-5 h-5" strokeWidth={1.8} />
                    </div>
                    <div>
                      <p className="text-xs text-harmony-ink/70">Електронна пошта</p>
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
                      <Phone className="w-5 h-5" strokeWidth={1.8} />
                    </div>
                    <div>
                      <p className="text-xs text-harmony-ink/70">Телефон координатора</p>
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
                      <MapPin className="w-5 h-5" strokeWidth={1.8} />
                    </div>
                    <div>
                      <p className="text-xs text-harmony-ink/70">Локація</p>
                      <p className="font-medium text-harmony-heading">
                        Україна / Велика Британія (міжнародна освітня ініціатива)
                      </p>
                    </div>
                  </div>
                </div>
              </Reveal>

              {/* Права частина: Форма зворотного зв'язку */}
              <Reveal delayMs={200} className="lg:col-span-7">
                <div className="bg-white rounded-3xl p-7 sm:p-10 border border-emerald-900/10 shadow-[0_12px_34px_-24px_rgba(24,78,72,0.16)]">
                  <h3 className="font-serif text-2xl font-bold text-harmony-heading mb-2">
                    Форма зворотного зв’язку
                  </h3>
                  <p className="text-sm text-harmony-ink/70 mb-6">
                    Поля, позначені зірочкою (*), обов’язкові для заповнення.
                  </p>

                  {contactSubmitted ? (
                    <div
                      role="status"
                      className="p-6 rounded-2xl bg-harmony-sand border border-harmony-emerald/30 space-y-4"
                    >
                      <div className="flex items-start gap-3 text-harmony-heading">
                        <CheckCircle2 className="w-6 h-6 text-harmony-emerald shrink-0 mt-0.5" />
                        <div>
                          <p className="font-serif font-bold text-lg text-harmony-heading">
                            Дякуємо! Ваше звернення успішно надіслано.
                          </p>
                          <p className="text-sm text-harmony-ink mt-1 leading-relaxed">
                            Ми зв’яжемося з вами найближчим часом.
                          </p>
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={() => setContactSubmitted(false)}
                        className="inline-flex items-center gap-2 text-sm font-semibold text-harmony-primary hover:text-harmony-primary-hover transition-colors"
                      >
                        Надіслати ще одне повідомлення
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
                            Ваше ім’я та прізвище *
                          </label>
                          <input
                            type="text"
                            id="contact-name"
                            required
                            disabled={isContactSubmitting}
                            value={contactForm.name}
                            onChange={(e) => {
                              setContactForm((prev) => ({ ...prev, name: e.target.value }));
                              if (contactError) setContactError(null);
                            }}
                            placeholder="Олена Коваленко"
                            className="w-full px-4 py-3 rounded-xl border border-emerald-900/15 bg-harmony-cream/60 focus:bg-white focus:border-harmony-primary focus:ring-2 focus:ring-harmony-emerald/20 outline-none transition-all text-sm text-harmony-heading placeholder:text-slate-400 disabled:opacity-60"
                          />
                        </div>

                        <div>
                          <label
                            htmlFor="contact-email"
                            className="block text-sm font-medium text-harmony-ink mb-1.5"
                          >
                            Електронна пошта *
                          </label>
                          <input
                            type="email"
                            id="contact-email"
                            required
                            disabled={isContactSubmitting}
                            value={contactForm.email}
                            onChange={(e) => {
                              setContactForm((prev) => ({ ...prev, email: e.target.value }));
                              if (contactError) setContactError(null);
                            }}
                            placeholder="olena@school.ua"
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
                            Телефон
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
                            placeholder="+38 (0XX) XXX-XX-XX"
                            className="w-full px-4 py-3 rounded-xl border border-emerald-900/15 bg-harmony-cream/60 focus:bg-white focus:border-harmony-primary focus:ring-2 focus:ring-harmony-emerald/20 outline-none transition-all text-sm text-harmony-heading placeholder:text-slate-400 disabled:opacity-60"
                          />
                        </div>

                        <div>
                          <label
                            htmlFor="contact-organization"
                            className="block text-sm font-medium text-harmony-ink mb-1.5"
                          >
                            Заклад освіти / Організація
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
                            placeholder="Назва школи або громади"
                            className="w-full px-4 py-3 rounded-xl border border-emerald-900/15 bg-harmony-cream/60 focus:bg-white focus:border-harmony-primary focus:ring-2 focus:ring-harmony-emerald/20 outline-none transition-all text-sm text-harmony-heading placeholder:text-slate-400 disabled:opacity-60"
                          />
                        </div>
                      </div>

                      <div>
                        <label
                          htmlFor="contact-topic"
                          className="block text-sm font-medium text-harmony-ink mb-1.5"
                        >
                          Тема звернення
                        </label>
                        <select
                          id="contact-topic"
                          disabled={isContactSubmitting}
                          value={contactForm.topic}
                          onChange={(e) =>
                            setContactForm((prev) => ({ ...prev, topic: e.target.value }))
                          }
                          className="w-full px-4 py-3 rounded-xl border border-emerald-900/15 bg-harmony-cream/60 focus:bg-white focus:border-harmony-primary focus:ring-2 focus:ring-harmony-emerald/20 outline-none transition-all text-sm text-harmony-heading disabled:opacity-60"
                        >
                          <option value="school">Долучити школу до проєкту</option>
                          <option value="training">Навчання для вчителів</option>
                          <option value="partnership">Партнерство / Підтримка</option>
                          <option value="other">Інше питання</option>
                        </select>
                      </div>

                      <div>
                        <label
                          htmlFor="contact-message"
                          className="block text-sm font-medium text-harmony-ink mb-1.5"
                        >
                          Повідомлення *
                        </label>
                        <textarea
                          id="contact-message"
                          rows={4}
                          required
                          disabled={isContactSubmitting}
                          value={contactForm.message}
                          onChange={(e) => {
                            setContactForm((prev) => ({ ...prev, message: e.target.value }));
                            if (contactError) setContactError(null);
                          }}
                          placeholder="Розкажіть коротко про вашу школу або запит..."
                          className="w-full px-4 py-3 rounded-xl border border-emerald-900/15 bg-harmony-cream/60 focus:bg-white focus:border-harmony-primary focus:ring-2 focus:ring-harmony-emerald/20 outline-none transition-all text-sm text-harmony-heading placeholder:text-slate-400 resize-y disabled:opacity-60"
                        />
                      </div>

                      {contactError && (
                        <div
                          role="alert"
                          className="flex items-center gap-2.5 p-3.5 rounded-xl bg-red-50 border border-red-200 text-red-800 text-sm"
                        >
                          <AlertCircle className="w-4 h-4 shrink-0 text-red-600" />
                          <span>{contactError}</span>
                        </div>
                      )}

                      <button
                        type="submit"
                        disabled={isContactSubmitting}
                        className="group w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-harmony-primary hover:bg-harmony-primary-hover text-white font-semibold text-sm sm:text-base px-8 py-3.5 rounded-full shadow-xs transition-all duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] hover:-translate-y-0.5 hover:shadow-md active:scale-[0.98] whitespace-nowrap disabled:opacity-70 disabled:pointer-events-none"
                      >
                        {isContactSubmitting ? (
                          <>
                            <Loader2 className="w-4 h-4 animate-spin" />
                            Надсилання...
                          </>
                        ) : (
                          <>
                            Надіслати повідомлення
                            <Send className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-0.5" />
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
                  «Ми не стоїмо осторонь від природи. Як і все інше, ми є частиною Природи. Насправді — ми є Природою.»
                </blockquote>
                <p className="text-xs font-medium tracking-wider text-harmony-sun mt-3">
                  — Передмова до посібника Проєкту «Гармонія»
                </p>
              </div>

              <div className="lg:col-span-8 grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-x-2.5 gap-y-5">
                {HARMONY_PRINCIPLES.map((principle, idx) => (
                  <div
                    key={principle.label}
                    className="group flex flex-col items-center text-center gap-2.5"
                  >
                    <div
                      className={`w-11 h-11 rounded-full bg-white/12 border border-white/18 flex items-center justify-center transition-transform duration-300 group-hover:scale-110 ${
                        idx === 4 || idx === 6
                          ? 'text-harmony-sun'
                          : 'text-emerald-200'
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
                  aria-label="The Harmony Project — на початок сторінки"
                >
                  <Logo variant="dark" />
                </a>
                <p className="text-sm text-emerald-50/85 max-w-md leading-relaxed text-justify hyphens-auto">
                  Новий спосіб пізнавати світ і навчатися у природи — поєднуючи цінності, дослідницькі запити та практичну турботу про довкілля й спільноту.
                </p>
              </div>

              <div className="md:col-span-6">
                <h4 className="font-serif text-xl font-bold tracking-wide mb-2">
                  Спільнота для практики
                </h4>
                <p className="text-sm text-emerald-50/85 leading-relaxed max-w-lg mb-5 text-justify hyphens-auto">
                  Відкриті до співпраці зі школами, педагогами та освітніми ініціативами України. Разом формуємо освіту 21 століття, вкорінену в принципах природи.
                </p>
                <a
                  href="#contacts"
                  className="font-ui inline-flex items-center gap-2 bg-harmony-primary hover:bg-harmony-primary-hover text-white text-[15px] font-semibold tracking-tight px-6 py-3 rounded-full shadow-xs transition-all duration-200 hover:-translate-y-0.5"
                >
                  <span>Зв’язатися з нами</span>
                  <ArrowRight className="w-4 h-4" />
                </a>
              </div>
            </div>

            <div className="pt-7 flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-emerald-100/75">
              <p>
                © 2026 Проєкт «Гармонія» (The Harmony Project). Усі права захищено.
              </p>
              <nav aria-label="Навігація у футері" className="font-ui flex flex-wrap items-center justify-center gap-2">
                {NAV_ITEMS.map((item) => {
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
        articles={newsArticles}
        onClose={() => setSelectedNews(null)}
        onSelectArticle={(article) => setSelectedNews(article)}
      />

      {/* МОДАЛЬНА ФОРМА «ДОЛУЧИТИСЯ» */}
      <JoinModal
        isOpen={isJoinModalOpen}
        onClose={() => setIsJoinModalOpen(false)}
      />
    </div>
  );
}
