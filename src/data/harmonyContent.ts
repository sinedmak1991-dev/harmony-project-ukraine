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

  // НОВИНИ: замініть на 'images/news-1.jpg', 'images/news-2.jpg', 'images/news-3.jpg'
  news1: withBase('src/assets/images/hero_outdoor_circle_1795338778632.jpg'),
  news2: withBase('src/assets/images/pillar_great_works_1795338782561.jpg'),
  news3: withBase('src/assets/images/pillar_enquiry_binoculars_1795338778299.jpg'),
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
    shortDescription: 'Формуємо культуру поваги, довіри та відповідальності.',
    description:
      'Цінності формують культуру поваги, довіри та відповідальності в шкільній спільноті.',
    image: MEDIA_ASSETS.pillar1,
    placeholderPath: 'images/pillar-1.jpg',
    imageAlt: 'Дитина розглядає польові квіти на сонячному лузі',
    iconName: 'heart',
    badgeTone: 'bg-[#2A7B6F]',
  },
  {
    number: '2',
    title: '2. Запити',
    shortDescription: 'Навчаємо через питання, цікавість та дослідження.',
    description:
      'Навчаємо через глибокі питання, природну цікавість і спонукаємо до досліджень.',
    image: MEDIA_ASSETS.pillar2,
    placeholderPath: 'images/pillar-2.jpg',
    imageAlt: 'Учні досліджують ліс із біноклями та польовим щоденником',
    iconName: 'compass',
    badgeTone: 'bg-[#21635B]',
  },
  {
    number: '3',
    title: '3. Принципи природи',
    shortDescription: 'Розуміємо універсальні принципи, що поєднують усе в житті.',
    description:
      'Сім природних принципів допомагають зрозуміти взаємозв’язки в усьому живому.',
    image: MEDIA_ASSETS.pillar3,
    placeholderPath: 'images/pillar-3.jpg',
    imageAlt: 'Учні викладають природні візерунки з шишок, папороті та соняшника',
    iconName: 'flower',
    badgeTone: 'bg-[#3898EC]',
  },
  {
    number: '4',
    title: '4. Великі роботи',
    shortDescription: 'Створюємо проєкти, що мають справжній вплив.',
    description:
      'Навчання завершується значущими проєктами, що створюють реальний вплив у громаді.',
    image: MEDIA_ASSETS.pillar4,
    placeholderPath: 'images/pillar-4.jpg',
    imageAlt: 'Вчителька та учні працюють над екологічною картою свого краю на природі',
    iconName: 'sparkles',
    badgeTone: 'bg-[#12343B]',
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
    label: 'дітей охоплено',
    iconName: 'users',
  },
  {
    value: 150,
    suffix: '+',
    label: 'шкіл і партнерів',
    iconName: 'school',
  },
  {
    value: 100,
    suffix: '+',
    label: 'реалізованих проєктів',
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
    description: 'Працюємо разом із керівництвом, вчителями та громадами.',
    iconName: 'users',
  },
  {
    title: 'Адаптовано для України',
    description: 'Програма відповідає стандартам НУШ та місцевим потребам.',
    iconName: 'leaf',
  },
  {
    title: 'Підтримка вчителів',
    description: 'Навчання, наставництво та ресурси на кожному етапі впровадження.',
    iconName: 'book',
  },
  {
    title: 'Добробут учнів',
    description: 'Інструменти й практики для зменшення стресу та внутрішнього балансу.',
    iconName: 'heart',
  },
  {
    title: 'Навчання для життя',
    description: 'Учні досліджують реальні запитання та створюють змістовні проєкти.',
    iconName: 'sprout',
  },
];

export interface WellbeingBenefit {
  title: string;
  iconName: 'wind' | 'handshake' | 'focus' | 'shield' | 'sun';
}

export const WELLBEING_BENEFITS: WellbeingBenefit[] = [
  { title: 'Зменшує стрес і тривожність', iconName: 'wind' },
  { title: 'Розвиває емпатію та зв’язки', iconName: 'handshake' },
  { title: 'Підтримує концентрацію та спокій', iconName: 'focus' },
  { title: 'Зміцнює внутрішню стійкість', iconName: 'shield' },
  { title: 'Надихає надією та сенсом', iconName: 'sun' },
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
    description: 'Обговорюємо потреби вашої школи й те, як Гармонія може допомогти.',
  },
  {
    step: '2',
    title: 'Планувати',
    description: 'Створюємо індивідуальний план упровадження для вашого контексту.',
  },
  {
    step: '3',
    title: 'Підготувати',
    description: 'Ваша команда отримує навчання, ресурси та постійну підтримку.',
  },
  {
    step: '4',
    title: 'Упроваджувати',
    description: 'Впроваджуємо Гармонію в щоденне навчання та життя школи.',
  },
  {
    step: '5',
    title: 'Розвиватися',
    description: 'Відзначаємо прогрес, вимірюємо вплив і рухаємося далі разом.',
  },
];

export type NewsCategory = 'Усі' | 'Події' | 'Ресурси' | 'Партнерство';

export interface NewsArticle {
  id: number;
  category: Exclude<NewsCategory, 'Усі'>;
  date: string;
  readTime: string;
  title: string;
  excerpt: string;
  image: string;
  placeholderPath: string;
  imageAlt: string;
  paragraphs: string[];
  highlight: string;
}

export const NEWS_ARTICLES: NewsArticle[] = [
  {
    id: 0,
    category: 'Події',
    date: '15 листопада 2026',
    readTime: '3 хв читання',
    title: 'Практикум на природі: як учні досліджують біорізноманіття рідного краю',
    excerpt:
      'Учні та педагоги провели польові дослідження місцевої флори й фауни, поєднуючи біологію, мистецтво та практики емоційного відновлення.',
    image: MEDIA_ASSETS.news1,
    placeholderPath: 'images/news-1.jpg',
    imageAlt: 'Учні та вчителька проводять заняття просто неба на зеленому лузі',
    paragraphs: [
      'Учні та педагоги шкіл-партнерів провели серію осінніх польових досліджень місцевої флори й фауни, поєднуючи природничі науки, спостереження за екосистемами та м’які практики емоційного відновлення.',
      'Під час занять діти працювали з визначниками рослин, спостерігали за міграцією птахів, замальовували природні симетрії та вели власні польові щоденники. Такий інтегрований підхід допомагає не лише глибше засвоїти шкільну програму, а й помітно знизити рівень тривожності через живий контакт із природою.',
      'За підсумками практикуму класи створили інтерактивні екологічні карти шкільних подвір’їв і парків, які вже стали частиною відкритих виставок для батьків та місцевих громад.',
    ],
    highlight:
      'Понад 450 учнів із 12 шкіл долучилися до осінньої серії занять просто неба, поєднавши природничі дослідження з арт-практиками.',
  },
  {
    id: 1,
    category: 'Ресурси',
    date: '02 листопада 2026',
    readTime: '4 хв читання',
    title: 'Новий посібник для вчителів НУШ: інтеграція принципів природи в уроки',
    excerpt:
      'Відкрито вільний доступ до адаптованих методичних матеріалів, які допомагають планувати інтегровані тижні на основі циклів природи.',
    image: MEDIA_ASSETS.news2,
    placeholderPath: 'images/news-2.jpg',
    imageAlt: 'Методична робота вчителя з учнями над навчальною картою на свіжому повітрі',
    paragraphs: [
      'Команда The Harmony Project for Ukraine підготувала оновлений комплект методичних матеріалів для початкової та базової школи, повністю узгоджений із Державним стандартом та модельною програмою НУШ.',
      'У посібнику зібрано приклади інтегрованих навчальних тижнів, де математика, українська мова, образотворче мистецтво та «Я досліджую світ» природно об’єднуються навколо семи ключових принципів природи: взаємозалежності, циклічності, різноманіття, адаптації, здоров’я, геометрії та єдності.',
      'Кожен розділ містить готові запитання для дослідницького пошуку, ідеї для занять у шкільному дворі та шаблони для планування підсумкової «Великої роботи» класу.',
    ],
    highlight:
      'Щоб отримати безкоштовний доступ до електронної версії посібника для вашої школи, заповніть форму зворотного зв’язку в розділі «Контакти».',
  },
  {
    id: 2,
    category: 'Партнерство',
    date: '20 жовтня 2026',
    readTime: '3 хв читання',
    title: 'Співпраця українських та британських освітян: підсумки осінньої зустрічі',
    excerpt:
      'Педагоги з різних областей України поділилися досвідом впровадження «Великих робіт» у своїх громадах попри виклики сьогодення.',
    image: MEDIA_ASSETS.news3,
    placeholderPath: 'images/news-3.jpg',
    imageAlt: 'Учні з біноклями досліджують природу в межах міжнародної освітньої програми',
    paragraphs: [
      'Понад 150 шкіл-партнерів та освітян з України й Великої Британії долучилися до осінньої онлайн-зустрічі спільноти The Harmony Project для обміну практичним досвідом.',
      'Українські вчителі презентували власні учнівські «Великі роботи» — від створення медоносних клумб і шкільних аптекарських грядок до проєктів збереження малих річок і підтримки психологічної стійкості родин у громадах.',
      'Британські колеги відзначили надзвичайну стійкість та творчість українських педагогів, а також узгодили програму спільних менторських сесій і вебінарів на весняний семестр 2027 року.',
    ],
    highlight:
      'Реєстрація українських шкіл на весняну хвилю менторської підтримки та обміну досвідом вже відкрита.',
  },
];

export interface CoreValueItem {
  label: string;
  iconName: 'heart' | 'circles' | 'users' | 'sun' | 'shield';
}

export const CORE_VALUES: CoreValueItem[] = [
  { label: 'Цілісність', iconName: 'heart' },
  { label: 'Єдність', iconName: 'circles' },
  { label: 'Інклюзивність', iconName: 'users' },
  { label: 'Надія', iconName: 'sun' },
  { label: 'Стійкість', iconName: 'shield' },
];
