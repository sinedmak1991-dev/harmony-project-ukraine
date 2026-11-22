import { type FormEvent, useEffect, useState } from 'react';
import {
  AlertCircle,
  ArrowRight,
  BookOpen,
  CheckCircle2,
  ChevronRight,
  Compass,
  Facebook,
  Flower2,
  Focus,
  Globe,
  Heart,
  HeartHandshake,
  Instagram,
  Leaf,
  Mail,
  MapPin,
  Phone,
  School,
  Send,
  ShieldCheck,
  Sparkles,
  Sprout,
  Sun,
  Users,
  Wind,
  Youtube,
} from 'lucide-react';
import { Header, SeedOfLifeMark } from './components/Header';
import { ImpactCounter } from './components/ImpactCounter';
import { MediaFrame } from './components/MediaFrame';
import { NewsModal } from './components/NewsModal';
import { Reveal } from './components/Reveal';
import {
  CORE_VALUES,
  IMPACT_METRICS,
  MEDIA_ASSETS,
  NAV_ITEMS,
  NEWS_ARTICLES,
  type NewsArticle,
  type NewsCategory,
  PILLARS,
  SCHOOL_FEATURES,
  SCHOOL_STEPS,
  WELLBEING_BENEFITS,
} from './data/harmonyContent';

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const NEWS_CATEGORIES: NewsCategory[] = ['Усі', 'Події', 'Ресурси', 'Партнерство'];

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

function renderCoreValueIcon(name: 'heart' | 'circles' | 'users' | 'sun' | 'shield') {
  switch (name) {
    case 'heart':
      return <Heart className="w-5 h-5" strokeWidth={1.6} />;
    case 'circles':
      return <SeedOfLifeMark className="w-5 h-5" />;
    case 'users':
      return <Users className="w-5 h-5" strokeWidth={1.6} />;
    case 'sun':
      return <Sun className="w-5 h-5" strokeWidth={1.6} />;
    case 'shield':
      return <ShieldCheck className="w-5 h-5" strokeWidth={1.6} />;
  }
}

export default function App() {
  const [activeSection, setActiveSection] = useState<string>('');
  const [selectedNews, setSelectedNews] = useState<NewsArticle | null>(null);
  const [activeCategory, setActiveCategory] = useState<NewsCategory>('Усі');

  // Стан форми зворотного зв'язку
  const [contactForm, setContactForm] = useState({
    name: '',
    email: '',
    organization: '',
    topic: 'school',
    message: '',
  });
  const [contactError, setContactError] = useState<string | null>(null);
  const [contactSubmitted, setContactSubmitted] = useState(false);

  // Стан форми підписки на розсилку
  const [newsletterEmail, setNewsletterEmail] = useState('');
  const [newsletterError, setNewsletterError] = useState<string | null>(null);
  const [newsletterSubmitted, setNewsletterSubmitted] = useState(false);

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

  const filteredNews =
    activeCategory === 'Усі'
      ? NEWS_ARTICLES
      : NEWS_ARTICLES.filter((article) => article.category === activeCategory);

  const handleContactSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
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
    if (trimmedMessage.length < 8) {
      setContactError('Будь ласка, напишіть коротке повідомлення (щонайменше 8 символів).');
      return;
    }

    setContactError(null);
    setContactSubmitted(true);
    setContactForm({
      name: '',
      email: '',
      organization: '',
      topic: 'school',
      message: '',
    });
  };

  const handleNewsletterSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const trimmedEmail = newsletterEmail.trim();
    if (!EMAIL_PATTERN.test(trimmedEmail)) {
      setNewsletterError('Перевірте правильність електронної адреси.');
      return;
    }
    setNewsletterError(null);
    setNewsletterSubmitted(true);
    setNewsletterEmail('');
  };

  return (
    <div id="top" className="min-h-screen flex flex-col bg-harmony-cream text-harmony-ink">
      {/* НАВІГАЦІЯ */}
      <Header activeSection={activeSection} />

      <main className="flex-1">
        {/* 1. HERO СЕКЦІЯ (Освіта в гармонії з життям + макрофото пухнастої кульбаби праворуч) */}
        <section className="relative overflow-hidden bg-[#F4F8F7] border-b border-teal-900/10">
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
              className="w-full h-full bg-[#F4F8F7]"
              imgClassName="object-right dandelion-breeze"
            />
            {/* М'яка градієнтна маска для безшовного злиття кульбаби зі світлим фоном #F4F8F7 */}
            <div className="absolute inset-0 bg-gradient-to-r from-[#F4F8F7] via-[#F4F8F7]/80 to-transparent" />
            <div className="absolute inset-x-0 bottom-0 h-20 bg-gradient-to-t from-[#F4F8F7]/70 to-transparent" />
          </div>

          <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-12 pb-10 sm:pt-16 sm:pb-16 lg:py-24 xl:py-28">
            <div className="grid lg:grid-cols-12 gap-8 lg:gap-10 items-center">
              {/* Ліва текстова частина поверх світлої зони банера */}
              <div className="hero-enter lg:col-span-6 xl:col-span-6 space-y-6">
                <h1 className="font-serif text-4xl sm:text-5xl lg:text-[3.75rem] font-semibold text-harmony-dark leading-[1.1] tracking-tight">
                  Освіта <br />в{' '}
                  <span className="text-harmony-primary">гармонії</span> з життям.
                </h1>

                <div className="space-y-2.5 text-base sm:text-[17px] text-harmony-ink max-w-lg leading-relaxed">
                  <p>
                    Ми допомагаємо дітям і молоді розкривати потенціал, спираючись на принципи природи.
                  </p>
                  <p className="font-medium text-harmony-dark">
                    Для мирного, стійкого і кращого майбутнього України.
                  </p>
                </div>

                <div className="flex flex-wrap items-center gap-3.5 pt-2">
                  <a
                    href="#approach"
                    className="group inline-flex items-center justify-center gap-2 bg-harmony-primary hover:bg-harmony-dark text-white text-sm sm:text-base font-medium px-6 py-3.5 rounded-full transition-all duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] hover:-translate-y-0.5 hover:shadow-md active:scale-[0.98] whitespace-nowrap"
                  >
                    Відкрити наш підхід
                    <ChevronRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-0.5" />
                  </a>
                  <a
                    href="#schools"
                    className="inline-flex items-center justify-center bg-white/90 hover:bg-harmony-sand text-harmony-dark border border-teal-900/15 text-sm sm:text-base font-medium px-6 py-3.5 rounded-full transition-all duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] hover:-translate-y-0.5 whitespace-nowrap backdrop-blur-xs"
                  >
                    Для шкіл в Україні
                  </a>
                </div>

                {/* Слоган під кнопками (як на початковому макеті) */}
                <div className="pt-5 border-t border-teal-900/10 flex items-center gap-2.5 text-xs sm:text-sm text-harmony-ink max-w-md">
                  <Sprout className="w-4 h-4 text-harmony-primary shrink-0" strokeWidth={2} />
                  <span>
                    <strong className="font-semibold text-harmony-dark">Вкорінені в природі.</strong>{' '}
                    Створені для нашого майбутнього.
                  </span>
                </div>
              </div>

              {/* Мобільна та планшетна версія фото кульбаби з плавним переходом зверху */}
              <div className="hero-enter-delayed lg:hidden relative rounded-3xl overflow-hidden border border-teal-900/10 aspect-[16/10] bg-[#F4F8F7]">
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
                  className="pointer-events-none absolute inset-0 bg-gradient-to-r from-[#F4F8F7]/65 via-transparent to-transparent"
                />
              </div>
            </div>
          </div>
        </section>

        {/* 2. ЧОТИРИ ОПОРИ ПІДХОДУ ГАРМОНІЇ */}
        <section
          id="approach"
          className="py-14 sm:py-18 lg:py-22 bg-harmony-sand border-y border-teal-900/10"
        >
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <Reveal className="flex flex-col lg:flex-row lg:items-end justify-between gap-4 mb-10 lg:mb-12">
              <div className="max-w-2xl">
                <p className="text-xs sm:text-sm font-medium text-harmony-sky mb-2">
                  Наш підхід у чотирьох елементах
                </p>
                <h2 className="font-serif text-3xl sm:text-4xl font-bold text-harmony-dark leading-tight">
                  Чотири опори підходу Гармонії
                </h2>
              </div>
              <p className="text-sm sm:text-base text-harmony-ink max-w-md leading-relaxed">
                Чотири взаємопов’язані елементи, що формують як навчання, так і культуру школи.
              </p>
            </Reveal>

            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {PILLARS.map((pillar, index) => (
                <Reveal
                  key={pillar.number}
                  delayMs={getStaggerDelay(index)}
                  className="h-full"
                >
                  <article className="group h-full bg-white rounded-3xl overflow-hidden border border-teal-900/10 flex flex-col justify-between transition-all duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] hover:-translate-y-1.5 hover:shadow-[0_18px_38px_-18px_rgba(18,52,59,0.18)] hover:border-harmony-emerald/50">
                    <div className="p-6 pb-5">
                      <div
                        className={`w-12 h-12 rounded-full ${pillar.badgeTone} text-white flex items-center justify-center mb-5 transition-transform duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-110`}
                      >
                        {renderPillarIcon(pillar.iconName)}
                      </div>

                      <h3 className="font-serif text-xl font-bold text-harmony-dark mb-2">
                        {pillar.title}
                      </h3>

                      <p className="text-sm text-harmony-ink leading-relaxed">
                        {pillar.description}
                      </p>
                    </div>

                    <MediaFrame
                      src={pillar.image}
                      alt={pillar.imageAlt}
                      placeholderPath={pillar.placeholderPath}
                      className="aspect-[4/3] w-full mt-auto"
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
                <article className="group h-full bg-white rounded-3xl overflow-hidden border border-teal-900/10 flex flex-col justify-between transition-all duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] hover:-translate-y-1.5 hover:shadow-[0_18px_38px_-18px_rgba(18,52,59,0.18)] hover:border-harmony-emerald/45">
                  <div className="p-7 sm:p-8 pb-6">
                    <h2 className="font-serif text-2xl sm:text-[1.65rem] font-bold text-harmony-dark leading-snug mb-3.5">
                      Навчання, що зростає разом із дитиною
                    </h2>
                    <p className="text-harmony-ink text-sm sm:text-[15px] leading-relaxed mb-5">
                      Від раннього дитинства до юності ми підтримуємо цілісне навчання — розумом, серцем і руками, допомагаючи учням відчувати безпеку та рівновагу.
                    </p>
                    <a
                      href="#schools"
                      className="inline-flex items-center gap-1.5 text-sm font-semibold text-harmony-primary hover:text-harmony-dark transition-colors"
                    >
                      Дізнатися більше
                      <ArrowRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" />
                    </a>
                  </div>
                  <MediaFrame
                    src={MEDIA_ASSETS.natureDetail}
                    alt="Українські школярі малюють аквареллю листя та квіти на галявині"
                    placeholderPath="images/nature-detail.jpg"
                    className="aspect-[16/11] w-full mt-auto"
                    imgClassName="transition-transform duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-105"
                  />
                </article>
              </Reveal>

              {/* Картка 2 */}
              <Reveal delayMs={200} className="h-full">
                <article className="group h-full bg-white rounded-3xl overflow-hidden border border-teal-900/10 flex flex-col justify-between transition-all duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] hover:-translate-y-1.5 hover:shadow-[0_18px_38px_-18px_rgba(18,52,59,0.18)] hover:border-harmony-emerald/45">
                  <div className="p-7 sm:p-8 pb-6">
                    <h2 className="font-serif text-2xl sm:text-[1.65rem] font-bold text-harmony-dark leading-snug mb-3.5">
                      Підтримуємо дітей України сьогодні
                    </h2>
                    <p className="text-harmony-ink text-sm sm:text-[15px] leading-relaxed mb-5">
                      Ми допомагаємо школам і громадам долати стрес, будувати стійкість і відновлювати надію під час війни та після неї.
                    </p>
                    <a
                      href="#wellbeing"
                      className="inline-flex items-center gap-1.5 text-sm font-semibold text-harmony-sky hover:text-harmony-dark transition-colors"
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
                <div className="group relative overflow-hidden h-full bg-harmony-dark text-white rounded-3xl p-7 sm:p-8 flex flex-col justify-between transition-all duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] hover:-translate-y-1.5 hover:shadow-[0_22px_42px_-16px_rgba(18,52,59,0.32)]">
                  <div
                    aria-hidden="true"
                    className="pointer-events-none absolute -bottom-16 -right-16 w-56 h-56 text-harmony-emerald/[0.1] seed-spin-hover"
                  >
                    <SeedOfLifeMark className="w-full h-full" />
                  </div>

                  <div className="relative">
                    <p className="text-xs font-medium text-sky-300 tracking-wide mb-1.5">
                      Вимірювані результати
                    </p>
                    <h2 className="font-serif text-2xl sm:text-[1.75rem] font-bold tracking-wide mb-8">
                      Реальний вплив
                    </h2>

                    <div className="space-y-6">
                      {IMPACT_METRICS.map((metric, idx) => (
                        <div key={metric.label} className="flex items-center gap-4">
                          <div
                            className={`w-12 h-12 rounded-full bg-white/10 border border-white/15 flex items-center justify-center shrink-0 transition-transform duration-300 group-hover:scale-105 ${
                              idx === 1 ? 'text-sky-300' : 'text-harmony-sun'
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
                            <div className="text-sm text-teal-100/90 mt-0.5">
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
                      className="inline-flex items-center gap-2 text-sm font-medium text-sky-300 hover:text-white transition-colors"
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
          className="py-16 sm:py-20 lg:py-24 bg-harmony-sand border-y border-teal-900/10"
        >
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16 lg:space-y-20">
            {/* 4.1 Як ми працюємо зі школами */}
            <div>
              <Reveal className="max-w-2xl mb-10">
                <p className="text-xs sm:text-sm font-medium text-harmony-sky mb-2">
                  Для шкіл в Україні
                </p>
                <h2 className="font-serif text-3xl sm:text-4xl font-bold text-harmony-dark leading-tight">
                  Як ми працюємо зі школами
                </h2>
                <p className="text-harmony-ink mt-3 text-base leading-relaxed">
                  Ми співпрацюємо зі школами, щоб інтегрувати Гармонію в навчальну програму НУШ та культуру школи через перевірений і гнучкий підхід.
                </p>
              </Reveal>

              <div className="grid sm:grid-cols-2 lg:grid-cols-5 gap-4 lg:gap-5">
                {SCHOOL_FEATURES.map((feature, index) => (
                  <Reveal
                    key={feature.title}
                    delayMs={getStaggerDelay(index)}
                    className="h-full"
                  >
                    <div className="group h-full bg-white rounded-2xl p-5 sm:p-6 border border-teal-900/10 text-left lg:text-center flex flex-col lg:items-center transition-all duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] hover:-translate-y-1.5 hover:shadow-[0_16px_32px_-16px_rgba(18,52,59,0.16)] hover:border-harmony-emerald/45">
                      <div className="w-12 h-12 rounded-2xl bg-harmony-sage text-harmony-emerald flex items-center justify-center mb-4 transition-transform duration-300 group-hover:scale-110">
                        {renderSchoolFeatureIcon(feature.iconName)}
                      </div>
                      <h3 className="font-serif font-bold text-base sm:text-lg text-harmony-dark mb-2">
                        {feature.title}
                      </h3>
                      <p className="text-xs sm:text-[13px] text-harmony-ink leading-relaxed">
                        {feature.description}
                      </p>
                    </div>
                  </Reveal>
                ))}
              </div>
            </div>

            {/* 4.2 Навчання, що підтримує добробут і стійкість */}
            <div id="wellbeing" className="scroll-mt-24">
              <Reveal className="bg-white rounded-3xl p-7 sm:p-10 border border-teal-900/10">
                <div className="max-w-3xl mb-8">
                  <h3 className="font-serif text-2xl sm:text-3xl font-bold text-harmony-dark leading-tight">
                    Навчання, що підтримує добробут і стійкість
                  </h3>
                  <p className="text-harmony-ink text-sm sm:text-base mt-3 leading-relaxed">
                    Ми підтримуємо цілісне благополуччя дитини — розуму, серця і тіла. Наш підхід допомагає зменшити стрес, зміцнити емоційну рівновагу та створити безпечне, підтримувальне середовище для кожного учня.
                  </p>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4 sm:gap-5">
                  {WELLBEING_BENEFITS.map((benefit) => (
                    <div
                      key={benefit.title}
                      className="group flex flex-col items-center text-center p-4 rounded-2xl bg-harmony-cream border border-teal-900/10 transition-all duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] hover:-translate-y-1 hover:shadow-sm hover:border-harmony-emerald/40"
                    >
                      <div className="w-11 h-11 rounded-full bg-harmony-sage text-harmony-emerald flex items-center justify-center mb-3 transition-transform duration-300 group-hover:scale-110">
                        {renderWellbeingIcon(benefit.iconName)}
                      </div>
                      <p className="text-xs sm:text-sm font-medium text-harmony-dark leading-snug">
                        {benefit.title}
                      </p>
                    </div>
                  ))}
                </div>

                <div className="mt-6 p-4 sm:p-5 rounded-2xl bg-sky-50/80 border border-harmony-sky/20 flex items-center gap-3.5 text-xs sm:text-sm text-harmony-dark">
                  <Sprout className="w-5 h-5 text-harmony-sky shrink-0" strokeWidth={1.85} />
                  <p className="leading-relaxed">
                    <strong className="font-semibold">Підтримка психологічного добробуту</strong> — один із ключових пріоритетів Проєкту Гармонія, особливо для дітей і педагогів в Україні.
                  </p>
                </div>
              </Reveal>
            </div>

            {/* 4.3 Ваш шлях упровадження (каскадна поява 100..500ms) */}
            <div>
              <Reveal className="max-w-2xl mb-10">
                <h3 className="font-serif text-2xl sm:text-3xl font-bold text-harmony-dark">
                  Ваш шлях упровадження
                </h3>
                <p className="text-harmony-ink text-sm sm:text-base mt-2 leading-relaxed">
                  Чіткий, підтримуваний шлях від першої розмови до сталих результатів у школі.
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
                    <div className="group relative h-full bg-white p-6 rounded-2xl border border-teal-900/10 flex flex-col items-start lg:items-center lg:text-center transition-all duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] hover:-translate-y-1.5 hover:shadow-[0_18px_36px_-18px_rgba(18,52,59,0.18)] hover:border-harmony-emerald/50">
                      <span className="relative z-10 inline-flex items-center justify-center w-10 h-10 rounded-full bg-harmony-primary text-white font-serif font-bold text-base tabular-nums mb-4 ring-4 ring-white transition-transform duration-300 group-hover:scale-110">
                        {item.step}
                      </span>
                      <h4 className="font-serif font-bold text-lg text-harmony-dark mb-2">
                        {item.title}
                      </h4>
                      <p className="text-xs sm:text-[13px] text-harmony-ink leading-relaxed">
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
                  className="pointer-events-none absolute -right-10 -bottom-14 w-64 h-64 text-harmony-emerald/[0.11] seed-spin-hover"
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
                  <p className="text-sm sm:text-base text-slate-200 leading-relaxed">
                    Давайте будувати освіту, що підтримує дітей України — з силою природи та силою спільноти.
                  </p>
                </div>

                <a
                  href="#contacts"
                  className="relative shrink-0 inline-flex items-center gap-2 bg-harmony-primary hover:bg-white hover:text-harmony-dark text-white font-medium text-sm sm:text-base px-7 py-3.5 rounded-full transition-all duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] hover:-translate-y-0.5 active:scale-[0.98] whitespace-nowrap"
                >
                  Долучитися
                  <ArrowRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" />
                </a>
              </div>
            </Reveal>
          </div>
        </section>

        {/* 5. РОЗДІЛ «НОВИНИ» */}
        <section id="news" className="py-16 sm:py-20 lg:py-24 bg-harmony-cream">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <Reveal className="flex flex-col lg:flex-row lg:items-end justify-between mb-10 lg:mb-12 gap-6">
              <div className="max-w-xl">
                <p className="text-xs sm:text-sm font-medium text-harmony-sky mb-2">
                  Події та публікації
                </p>
                <h2 className="font-serif text-3xl sm:text-4xl font-bold text-harmony-dark leading-tight">
                  Новини проєкту
                </h2>
                <p className="text-sm sm:text-base text-harmony-ink mt-3 leading-relaxed">
                  Останні історії з українських шкіл, анонси вебінарів для вчителів та результати учнівських досліджень.
                </p>
              </div>

              {/* Інтерактивний фільтр категорій новин */}
              <div
                role="tablist"
                aria-label="Фільтр новин за категорією"
                className="inline-flex flex-wrap items-center gap-1 p-1 bg-harmony-sand rounded-xl border border-teal-900/10 self-start lg:self-end"
              >
                {NEWS_CATEGORIES.map((category) => {
                  const isSelected = activeCategory === category;
                  return (
                    <button
                      key={category}
                      type="button"
                      role="tab"
                      aria-selected={isSelected}
                      onClick={() => setActiveCategory(category)}
                      className={`px-3.5 py-2 text-xs sm:text-sm font-medium rounded-lg transition-all duration-200 whitespace-nowrap ${
                        isSelected
                          ? 'bg-white text-harmony-dark shadow-xs'
                          : 'text-harmony-ink hover:text-harmony-dark'
                      }`}
                    >
                      {category}
                    </button>
                  );
                })}
              </div>
            </Reveal>

            <div className="grid md:grid-cols-3 gap-7 lg:gap-8">
              {filteredNews.map((article, index) => (
                <Reveal
                  key={`${activeCategory}-${article.id}`}
                  delayMs={getStaggerDelay(index)}
                  className="h-full"
                >
                  <article className="group h-full bg-white rounded-3xl overflow-hidden border border-teal-900/10 flex flex-col transition-all duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] hover:-translate-y-1.5 hover:shadow-[0_18px_38px_-18px_rgba(18,52,59,0.18)] hover:border-harmony-emerald/45">
                    <button
                      type="button"
                      onClick={() => setSelectedNews(article)}
                      className="block w-full text-left focus-visible:outline-none"
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

                    <div className="p-6 flex-1 flex flex-col justify-between">
                      <div>
                        <div className="flex flex-wrap items-center gap-2 text-xs text-harmony-ink/70 mb-3">
                          <span className="font-semibold text-harmony-sky">
                            {article.category}
                          </span>
                          <span aria-hidden="true">·</span>
                          <time>{article.date}</time>
                          <span aria-hidden="true">·</span>
                          <span>{article.readTime}</span>
                        </div>

                        <h3 className="font-serif text-xl font-bold text-harmony-dark leading-snug mb-3 group-hover:text-harmony-primary transition-colors">
                          <button
                            type="button"
                            onClick={() => setSelectedNews(article)}
                            className="text-left focus-visible:underline"
                          >
                            {article.title}
                          </button>
                        </h3>

                        <p className="text-sm text-harmony-ink leading-relaxed line-clamp-3">
                          {article.excerpt}
                        </p>
                      </div>

                      <div className="pt-5 mt-5 border-t border-teal-900/10">
                        <button
                          type="button"
                          onClick={() => setSelectedNews(article)}
                          className="inline-flex items-center gap-1.5 text-sm font-semibold text-harmony-primary hover:text-harmony-dark transition-colors"
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
          </div>
        </section>

        {/* 6. КОНТАКТИ ТА ФОРМА ЗВОРОТНОГО ЗВ'ЯЗКУ */}
        <section
          id="contacts"
          className="py-16 sm:py-20 lg:py-24 bg-harmony-sand border-t border-teal-900/10"
        >
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid lg:grid-cols-12 gap-10 lg:gap-12 items-start">
              {/* Ліва частина: Контакти */}
              <Reveal delayMs={100} className="lg:col-span-5 space-y-6">
                <div>
                  <p className="text-xs sm:text-sm font-medium text-harmony-sky mb-2">
                    Зв’яжіться з нами
                  </p>
                  <h2 className="font-serif text-3xl sm:text-4xl font-bold text-harmony-dark leading-tight">
                    Приєднайтеся до нашого руху
                  </h2>
                </div>

                <p className="text-harmony-ink leading-relaxed text-base">
                  Освіта може бути силою добра у світі. Разом ми робимо це можливим. Напишіть нам, якщо ви представляєте школу, громаду або бажаєте підтримати проєкт.
                </p>

                <div className="space-y-4 pt-2">
                  <div className="flex items-start gap-4">
                    <div className="w-11 h-11 rounded-full bg-white text-harmony-emerald border border-teal-900/10 flex items-center justify-center shrink-0">
                      <Mail className="w-5 h-5" strokeWidth={1.8} />
                    </div>
                    <div>
                      <p className="text-xs text-harmony-ink/70">Електронна пошта</p>
                      <a
                        href="mailto:info@harmonyproject.org.ua"
                        className="font-medium text-harmony-dark hover:text-harmony-primary transition-colors"
                      >
                        info@harmonyproject.org.ua
                      </a>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <div className="w-11 h-11 rounded-full bg-white text-harmony-sky border border-teal-900/10 flex items-center justify-center shrink-0">
                      <Phone className="w-5 h-5" strokeWidth={1.8} />
                    </div>
                    <div>
                      <p className="text-xs text-harmony-ink/70">Телефон координатора</p>
                      <a
                        href="tel:+380000000000"
                        className="font-medium text-harmony-dark hover:text-harmony-primary transition-colors tabular-nums"
                      >
                        +38 (0XX) XXX-XX-XX
                      </a>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <div className="w-11 h-11 rounded-full bg-white text-harmony-emerald border border-teal-900/10 flex items-center justify-center shrink-0">
                      <MapPin className="w-5 h-5" strokeWidth={1.8} />
                    </div>
                    <div>
                      <p className="text-xs text-harmony-ink/70">Локація</p>
                      <p className="font-medium text-harmony-dark">
                        Україна / Велика Британія (міжнародна освітня ініціатива)
                      </p>
                    </div>
                  </div>
                </div>

                {/* Соціальні мережі */}
                <div className="pt-3 flex items-center gap-3">
                  <a
                    href="#contacts"
                    aria-label="Facebook сторінка The Harmony Project for Ukraine"
                    className="w-11 h-11 rounded-full bg-harmony-dark text-white hover:bg-harmony-primary flex items-center justify-center transition-all duration-300 hover:-translate-y-0.5"
                  >
                    <Facebook className="w-5 h-5" strokeWidth={1.75} />
                  </a>
                  <a
                    href="#contacts"
                    aria-label="Instagram сторінка The Harmony Project for Ukraine"
                    className="w-11 h-11 rounded-full bg-harmony-dark text-white hover:bg-harmony-primary flex items-center justify-center transition-all duration-300 hover:-translate-y-0.5"
                  >
                    <Instagram className="w-5 h-5" strokeWidth={1.75} />
                  </a>
                  <a
                    href="#contacts"
                    aria-label="YouTube канал The Harmony Project for Ukraine"
                    className="w-11 h-11 rounded-full bg-harmony-dark text-white hover:bg-harmony-primary flex items-center justify-center transition-all duration-300 hover:-translate-y-0.5"
                  >
                    <Youtube className="w-5 h-5" strokeWidth={1.75} />
                  </a>
                </div>
              </Reveal>

              {/* Права частина: Форма зворотного зв'язку */}
              <Reveal delayMs={200} className="lg:col-span-7">
                <div className="bg-white rounded-3xl p-7 sm:p-10 border border-teal-900/10 shadow-[0_12px_34px_-24px_rgba(18,52,59,0.16)]">
                  <h3 className="font-serif text-2xl font-bold text-harmony-dark mb-2">
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
                      <div className="flex items-start gap-3 text-harmony-dark">
                        <CheckCircle2 className="w-6 h-6 text-harmony-emerald shrink-0 mt-0.5" />
                        <div>
                          <p className="font-serif font-bold text-lg text-harmony-dark">
                            Дякуємо! Ваше повідомлення надіслано.
                          </p>
                          <p className="text-sm text-harmony-ink mt-1 leading-relaxed">
                            Координатор The Harmony Project for Ukraine опрацює ваш запит і зв’яжеться з вами найближчим часом.
                          </p>
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={() => setContactSubmitted(false)}
                        className="inline-flex items-center gap-2 text-sm font-medium text-harmony-primary hover:text-harmony-dark transition-colors"
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
                            value={contactForm.name}
                            onChange={(e) => {
                              setContactForm((prev) => ({ ...prev, name: e.target.value }));
                              if (contactError) setContactError(null);
                            }}
                            placeholder="Олена Коваленко"
                            className="w-full px-4 py-3 rounded-xl border border-teal-900/15 bg-harmony-cream/60 focus:bg-white focus:border-harmony-primary focus:ring-2 focus:ring-harmony-emerald/20 outline-none transition-all text-sm text-harmony-dark placeholder:text-slate-400"
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
                            value={contactForm.email}
                            onChange={(e) => {
                              setContactForm((prev) => ({ ...prev, email: e.target.value }));
                              if (contactError) setContactError(null);
                            }}
                            placeholder="olena@school.ua"
                            className="w-full px-4 py-3 rounded-xl border border-teal-900/15 bg-harmony-cream/60 focus:bg-white focus:border-harmony-primary focus:ring-2 focus:ring-harmony-emerald/20 outline-none transition-all text-sm text-harmony-dark placeholder:text-slate-400"
                          />
                        </div>
                      </div>

                      <div className="grid sm:grid-cols-2 gap-5">
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
                            value={contactForm.organization}
                            onChange={(e) =>
                              setContactForm((prev) => ({
                                ...prev,
                                organization: e.target.value,
                              }))
                            }
                            placeholder="Назва школи або громади"
                            className="w-full px-4 py-3 rounded-xl border border-teal-900/15 bg-harmony-cream/60 focus:bg-white focus:border-harmony-primary focus:ring-2 focus:ring-harmony-emerald/20 outline-none transition-all text-sm text-harmony-dark placeholder:text-slate-400"
                          />
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
                            value={contactForm.topic}
                            onChange={(e) =>
                              setContactForm((prev) => ({ ...prev, topic: e.target.value }))
                            }
                            className="w-full px-4 py-3 rounded-xl border border-teal-900/15 bg-harmony-cream/60 focus:bg-white focus:border-harmony-primary focus:ring-2 focus:ring-harmony-emerald/20 outline-none transition-all text-sm text-harmony-dark"
                          >
                            <option value="school">Долучити школу до проєкту</option>
                            <option value="training">Навчання для вчителів</option>
                            <option value="partnership">Партнерство / Підтримка</option>
                            <option value="other">Інше питання</option>
                          </select>
                        </div>
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
                          value={contactForm.message}
                          onChange={(e) => {
                            setContactForm((prev) => ({ ...prev, message: e.target.value }));
                            if (contactError) setContactError(null);
                          }}
                          placeholder="Розкажіть коротко про вашу школу або запит..."
                          className="w-full px-4 py-3 rounded-xl border border-teal-900/15 bg-harmony-cream/60 focus:bg-white focus:border-harmony-primary focus:ring-2 focus:ring-harmony-emerald/20 outline-none transition-all text-sm text-harmony-dark placeholder:text-slate-400 resize-y"
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
                        className="group w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-harmony-primary hover:bg-harmony-dark text-white font-medium text-sm sm:text-base px-8 py-3.5 rounded-full transition-all duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] hover:-translate-y-0.5 hover:shadow-md active:scale-[0.98] whitespace-nowrap"
                      >
                        Надіслати повідомлення
                        <Send className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-0.5" />
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
        {/* Верхня смуга: цитата + 5 іконок цінностей */}
        <div className="border-b border-white/12">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-11 lg:py-12">
            <Reveal className="grid lg:grid-cols-12 gap-8 lg:gap-10 items-center">
              <div className="lg:col-span-5 lg:pr-8 lg:border-r lg:border-white/15">
                <blockquote className="font-serif italic text-lg sm:text-xl leading-relaxed text-slate-100">
                  «Ми не відокремлені від природи. Ми є її частиною. Насправді, ми — це природа.»
                </blockquote>
                <p className="text-xs font-medium tracking-wider text-harmony-sun mt-3">
                  — Проєкт Гармонія
                </p>
              </div>

              <div className="lg:col-span-7 grid grid-cols-2 sm:grid-cols-5 gap-4">
                {CORE_VALUES.map((value, idx) => (
                  <div
                    key={value.label}
                    className="group flex flex-col items-center text-center gap-2.5"
                  >
                    <div
                      className={`w-11 h-11 rounded-full bg-white/10 border border-white/15 flex items-center justify-center transition-transform duration-300 group-hover:scale-110 ${
                        idx === 3 || idx === 4
                          ? 'text-harmony-sun'
                          : idx === 1 || idx === 2
                            ? 'text-sky-300'
                            : 'text-teal-200'
                      }`}
                    >
                      {renderCoreValueIcon(value.iconName)}
                    </div>
                    <span className="text-xs font-medium text-teal-100/90 tracking-wide">
                      {value.label}
                    </span>
                  </div>
                ))}
              </div>
            </Reveal>
          </div>
        </div>

        {/* Нижня частина: логотип + підписка на розсилку + навігація */}
        <div className="relative overflow-hidden">
          <div
            aria-hidden="true"
            className="pointer-events-none absolute -left-20 -bottom-24 w-72 h-72 text-harmony-emerald/[0.06]"
          >
            <SeedOfLifeMark className="w-full h-full" />
          </div>

          <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-12 pb-8">
            <div className="grid md:grid-cols-12 gap-10 pb-10 border-b border-white/12 items-center">
              <div className="md:col-span-6 space-y-4">
                <a
                  href="#top"
                  className="inline-flex items-center py-1 bg-transparent group focus-visible:rounded-xl"
                  aria-label="The Harmony Project for Ukraine — на початок сторінки"
                >
                  <img
                    src={MEDIA_ASSETS.logo}
                    alt="The Harmony Project for Ukraine"
                    className="h-12 sm:h-14 w-auto object-contain bg-transparent logo-hover-organic"
                  />
                </a>
                <p className="text-sm text-slate-300 max-w-md leading-relaxed">
                  Освіта, заснована на принципах природи, що зміцнює добробут, стійкість і віру в майбутнє покоління України.
                </p>
              </div>

              <div className="md:col-span-6">
                <h4 className="font-serif text-xl font-bold tracking-wide mb-1.5">
                  Будьте на зв’язку
                </h4>
                <p className="text-sm text-slate-300 mb-4">
                  Підпишіться на нашу розсилку, щоб отримувати методичні матеріали та анонси подій.
                </p>

                <form
                  onSubmit={handleNewsletterSubmit}
                  noValidate
                  className="flex flex-col sm:flex-row gap-2.5 sm:gap-0 bg-transparent sm:bg-white rounded-2xl sm:rounded-full sm:p-1.5 max-w-lg"
                >
                  <label htmlFor="newsletter-email" className="sr-only">
                    Ваша електронна адреса
                  </label>
                  <input
                    id="newsletter-email"
                    type="email"
                    required
                    value={newsletterEmail}
                    onChange={(e) => {
                      setNewsletterEmail(e.target.value);
                      if (newsletterError) setNewsletterError(null);
                      if (newsletterSubmitted) setNewsletterSubmitted(false);
                    }}
                    placeholder="Ваша електронна адреса"
                    className="flex-1 px-5 py-3 rounded-full bg-white text-harmony-dark placeholder:text-slate-400 text-sm focus:outline-none"
                  />
                  <button
                    type="submit"
                    className="bg-harmony-primary hover:bg-harmony-dark text-white font-medium px-6 py-3 rounded-full text-sm transition-colors duration-200 whitespace-nowrap shrink-0"
                  >
                    Підписатися
                  </button>
                </form>

                {newsletterError && (
                  <p
                    role="alert"
                    className="mt-2.5 inline-flex items-center gap-1.5 text-xs text-amber-300"
                  >
                    <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                    <span>{newsletterError}</span>
                  </p>
                )}

                {newsletterSubmitted && (
                  <p
                    role="status"
                    className="mt-2.5 inline-flex items-center gap-1.5 text-xs text-harmony-sun"
                  >
                    <CheckCircle2 className="w-3.5 h-3.5 shrink-0" />
                    <span>Ви успішно підписалися на новини проєкту!</span>
                  </p>
                )}
              </div>
            </div>

            <div className="pt-7 flex flex-col sm:flex-row justify-between items-center gap-4 text-xs text-slate-400">
              <p>© 2026 The Harmony Project for Ukraine. Усі права захищено.</p>
              <div className="flex flex-wrap items-center gap-6">
                {NAV_ITEMS.map((item) => (
                  <a
                    key={item.id}
                    href={item.href}
                    className="hover:text-white transition-colors whitespace-nowrap"
                  >
                    {item.label}
                  </a>
                ))}
              </div>
            </div>
          </div>
        </div>
      </footer>

      {/* МОДАЛЬНЕ ВІКНО ДЛЯ ЧИТАННЯ ПОВНОГО ТЕКСТУ НОВИНИ */}
      <NewsModal
        article={selectedNews}
        onClose={() => setSelectedNews(null)}
        onSelectArticle={(article) => setSelectedNews(article)}
      />
    </div>
  );
}
