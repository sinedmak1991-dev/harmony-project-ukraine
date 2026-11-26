/**
 * ============================================================================
 * ЦЕНТРАЛІЗОВАНІ МЕДІА-ПЛЕЙСХОЛДЕРИ ТА КОНТЕНТ — THE HARMONY PROJECT FOR UKRAINE
 * ============================================================================
 *
 * Як замінити зображення на власні фото:
 * 1. Покладіть ваші файли у папку `public/images/` (тоді шлях буде `/images/...`).
 * 2. Замініть відповідний рядок `src` у об'єкті MEDIA_ASSETS нижче на шлях із коментаря.
 *    Наприклад: heroCircle: '/images/hero-circle.jpg'
 * 3. Якщо фото тимчасово відсутнє, компонент <MediaFrame /> автоматично покаже
 *    акуратну ботанічну заглушку без зламаної іконки.
 */

const withBase = (assetPath: string) =>
  `${import.meta.env.BASE_URL}${assetPath.replace(/^\/+/, '')}`;

export const MEDIA_ASSETS = {
  // ОФІЦІЙНИЙ ПРОЗОРИЙ ЛОГОТИП (PNG із прозорим фоном: public/images/logo.png)
  logo: withBase('images/logo.png'),

  // HERO IMAGE: Кульбаба (можна замінити на власне фото images/dandelion-hero.jpg)
  heroDandelion: withBase('src/assets/images/hero_dandelion_macro_1795340951974.jpg'),

  // ДОДАТКОВЕ ФОТО ДІТЕЙ У КОЛІ (для новин / галереї — можна замінити на 'images/hero-circle.jpg')
  heroCircle: withBase('src/assets/images/hero_outdoor_circle_1795338778632.jpg'),

  // ОПОРА 1 (Цінності): замініть на 'images/pillar-1.jpg'
  pillar1: withBase('src/assets/images/pillar_values_flowers_1795338778491.jpg'),

  // ОПОРА 2 (Запити): замініть на 'images/pillar-2.jpg'
  pillar2: withBase('src/assets/images/pillar_enquiry_binoculars_1795338778299.jpg'),

  // ОПОРА 3 (Принципи природи): замініть на 'images/pillar-3.jpg'
  pillar3: withBase('src/assets/images/pillar_nature_principles_1795338777410.jpg'),

  // ОПОРА 4 (Великі роботи): замініть на 'images/pillar-4.jpg'
  pillar4: withBase('src/assets/images/pillar_great_works_1795338782561.jpg'),

  // ВПЛИВ — КАРТКА 1 («Навчання, що зростає разом із дитиною»): замініть на 'images/nature-detail.jpg'
  natureDetail: withBase('src/assets/images/impact_wellbeing_kids_1795338777905.jpg'),

  // ВПЛИВ — КАРТКА 2 («Підтримуємо дітей України сьогодні»): замініть на 'images/wellbeing.jpg'
  wellbeing: withBase('src/assets/images/impact_ukraine_nature_1795338778783.jpg'),
} as const;

export interface NavItem {
  id: string;
  label: string;
  href: string;
}

export const NAV_ITEMS: NavItem[] = [
  { id: 'approach', label: 'Наш підхід', href: '#approach' },
  { id: 'schools', label: 'Для шкіл в Україні', href: '#schools' },
  { id: 'impact', label: 'Вплив', href: '#impact' },
  { id: 'news', label: 'Новини', href: '#news' },
  { id: 'contacts', label: 'Контакти', href: '#contacts' },
];

export interface PillarItem {
  number: string;
  title: string;
  shortDescription: string;
  description: string;
  image: string;
  placeholderPath: string;
  imageAlt: string;
  iconName: 'heart' | 'compass' | 'flower' | 'sparkles';
  badgeTone: string;
}

export const PILLARS: PillarItem[] = [
  {
    number: '1',
    title: '1. Цінності',
    shortDescription: 'Створюємо культуру поваги, довіри та відповідальності.',
    description:
      'Створюємо культуру поваги, довіри та відповідальності, що стає моральним орієнтиром для всієї шкільної родини.',
    image: MEDIA_ASSETS.pillar1,
    placeholderPath: 'images/pillar-1.jpg',
    imageAlt: 'Дитина розглядає польові квіти на сонячному лузі',
    iconName: 'heart',
    badgeTone: 'bg-[#22A06B]',
  },
  {
    number: '2',
    title: '2. Запити на навчання',
    shortDescription: 'Замінюємо сухе заучування живим дослідженням.',
    description:
      'Замінюємо сухе заучування живим дослідженням: вчимося ставити сміливі запитання та шукати відповіді у реальному житті.',
    image: MEDIA_ASSETS.pillar2,
    placeholderPath: 'images/pillar-2.jpg',
    imageAlt: 'Учні досліджують ліс із біноклями та польовим щоденником',
    iconName: 'compass',
    badgeTone: 'bg-[#1A7F56]',
  },
  {
    number: '3',
    title: '3. Природні принципи',
    shortDescription: 'Вивчаємо сім законів гармонії в природі.',
    description:
      'Вивчаємо сім законів гармонії в природі, щоб розуміти взаємозв’язок усього живого та своє місце у світі.',
    image: MEDIA_ASSETS.pillar3,
    placeholderPath: 'images/pillar-3.jpg',
    imageAlt: 'Учні викладають природні візерунки з шишок, папороті та соняшника',
    iconName: 'flower',
    badgeTone: 'bg-[#2E9E6B]',
  },
  {
    number: '4',
    title: '4. Великі роботи',
    shortDescription: 'Перетворюємо знання на дію через практичні проєкти.',
    description:
      'Перетворюємо знання на дію: учні створюють якісні практичні проєкти, якими пишаються і діляться зі спільнотою.',
    image: MEDIA_ASSETS.pillar4,
    placeholderPath: 'images/pillar-4.jpg',
    imageAlt: 'Вчителька та учні працюють над екологічною картою свого краю на природі',
    iconName: 'sparkles',
    badgeTone: 'bg-[#1D5B57]',
  },
];

export interface ImpactMetric {
  value: number;
  suffix: string;
  label: string;
  iconName: 'users' | 'school' | 'globe';
}

export const IMPACT_METRICS: ImpactMetric[] = [
  {
    value: 20000,
    suffix: '+',
    label: 'дітей відчули навчання в гармонії',
    iconName: 'users',
  },
  {
    value: 150,
    suffix: '+',
    label: 'закладів освіти впроваджують підхід',
    iconName: 'school',
  },
  {
    value: 100,
    suffix: '+',
    label: 'шкільних ініціатив сталого розвитку',
    iconName: 'globe',
  },
];

export interface SchoolFeature {
  title: string;
  description: string;
  iconName: 'users' | 'leaf' | 'book' | 'heart' | 'sprout';
}

export const SCHOOL_FEATURES: SchoolFeature[] = [
  {
    title: 'Партнерство',
    description:
      'Будуємо співпрацю між педагогами, батьками та експертами громади, залучаючи місцевий досвід у навчання.',
    iconName: 'users',
  },
  {
    title: 'Адаптовано для України',
    description:
      'Повністю відповідає концепції НУШ і враховує особливості та потреби кожного регіону України.',
    iconName: 'leaf',
  },
  {
    title: 'Підтримка вчителів',
    description:
      'Навчаємо команди вчителів, ділимося готовими сценаріями запитів та супроводжуємо на кожному етапі.',
    iconName: 'book',
  },
  {
    title: 'Добробут учнів',
    description:
      'Практики усвідомленості та зв’язок із природою допомагають дітям відновлювати емоційну рівновагу.',
    iconName: 'heart',
  },
  {
    title: 'Навчання для життя',
    description:
      'Учні досліджують реальні питання, розвивають лідерство та втілюють корисні для громади проєкти.',
    iconName: 'sprout',
  },
];

export interface WellbeingBenefit {
  title: string;
  iconName: 'wind' | 'handshake' | 'focus' | 'shield' | 'sun';
}

export const WELLBEING_BENEFITS: WellbeingBenefit[] = [
  { title: 'Знижує стрес і емоційну напругу', iconName: 'wind' },
  { title: 'Поглиблює емпатію та довіру', iconName: 'handshake' },
  { title: 'Розвиває уважність і внутрішній спокій', iconName: 'focus' },
  { title: 'Формує психологічну стійкість', iconName: 'shield' },
  { title: 'Надихає сенсом і вірою в майбутнє', iconName: 'sun' },
];

export interface SchoolStep {
  step: string;
  title: string;
  description: string;
}

export const SCHOOL_STEPS: SchoolStep[] = [
  {
    step: '1',
    title: 'Дослідити',
    description: 'Обговорюємо запит вашої школи та знаходимо найкращу точку старту.',
  },
  {
    step: '2',
    title: 'Планувати',
    description: 'Адаптуємо навчальні запити й принципи «Гармонії» під ваш контекст.',
  },
  {
    step: '3',
    title: 'Підготувати',
    description: 'Навчаємо команду педагогів, ділимося посібником і методичними ресурсами.',
  },
  {
    step: '4',
    title: 'Упроваджувати',
    description: 'Запускаємо навчання через дослідження, природу та «Великі роботи».',
  },
  {
    step: '5',
    title: 'Розвиватися',
    description: 'Підбиваємо підсумки, ділимося успіхами й масштабуємо практику далі.',
  },
];

export type NewsCategory = string;

export interface NewsArticle {
  id: string | number;
  category: string;
  date: string;
  readTime: string;
  title: string;
  excerpt: string;
  image: string;
  placeholderPath?: string;
  imageAlt: string;
  paragraphs: string[];
  highlight?: string;
}

export interface HarmonyPrincipleItem {
  label: string;
  iconName: 'link' | 'cycle' | 'flower' | 'leaf' | 'heart' | 'geometry' | 'unity';
}

export const HARMONY_PRINCIPLES: HarmonyPrincipleItem[] = [
  { label: 'Взаємозалежність', iconName: 'link' },
  { label: 'Цикл', iconName: 'cycle' },
  { label: 'Різноманітність', iconName: 'flower' },
  { label: 'Адаптація', iconName: 'leaf' },
  { label: 'Здоров’я', iconName: 'heart' },
  { label: 'Геометрія', iconName: 'geometry' },
  { label: 'Єдність', iconName: 'unity' },
];
