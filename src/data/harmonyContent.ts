/**
 * ============================================================================
 * ЦЕНТРАЛІЗОВАНІ МЕДІА-АКТИВИ ТА ДВОМОВНИЙ СЛОВНИК (UA / EN)
 * THE HARMONY PROJECT
 * ============================================================================
 */

export type Language = 'uk' | 'en';

const withBase = (assetPath: string) =>
  `${import.meta.env.BASE_URL}${assetPath.replace(/^\/+/, '')}`;

export const MEDIA_ASSETS = {
  // HERO IMAGE: Кульбаба
  heroDandelion: withBase('src/assets/images/hero_dandelion_macro_1795340951974.jpg'),

  // ДОДАТКОВЕ ФОТО ДІТЕЙ У КОЛІ
  heroCircle: withBase('src/assets/images/hero_outdoor_circle_1795338778632.jpg'),

  // ОПОРА 1 (Цінності)
  pillar1: withBase('src/assets/images/pillar_values_flowers_1795338778491.jpg'),

  // ОПОРА 2 (Запити)
  pillar2: withBase('src/assets/images/pillar_enquiry_binoculars_1795338778299.jpg'),

  // ОПОРА 3 (Принципи природи)
  pillar3: withBase('src/assets/images/pillar_nature_principles_1795338777410.jpg'),

  // ОПОРА 4 (Великі роботи)
  pillar4: withBase('src/assets/images/pillar_great_works_1795338782561.jpg'),

  // ВПЛИВ — КАРТКА 1 («Навчання, що зростає разом із дитиною»)
  natureDetail: withBase('src/assets/images/impact_wellbeing_kids_1795338777905.jpg'),

  // ВПЛИВ — КАРТКА 2 («Підтримуємо дітей України сьогодні»)
  wellbeing: withBase('src/assets/images/impact_ukraine_nature_1795338778783.jpg'),
} as const;

export interface NavItem {
  id: string;
  label: string;
  href: string;
}

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

export interface ImpactMetric {
  value: number;
  suffix: string;
  label: string;
  iconName: 'users' | 'school' | 'globe';
}

export interface SchoolFeature {
  title: string;
  description: string;
  iconName: 'users' | 'leaf' | 'book' | 'heart' | 'sprout';
}

export interface WellbeingBenefit {
  title: string;
  iconName: 'wind' | 'handshake' | 'focus' | 'shield' | 'sun';
}

export interface SchoolStep {
  step: string;
  title: string;
  description: string;
}

export interface HarmonyPrincipleItem {
  label: string;
  iconName: 'link' | 'cycle' | 'flower' | 'leaf' | 'heart' | 'geometry' | 'unity';
}

export type NewsCategory = string;

/** Нормалізована новина з Google Таблиці з необов'язковими полями англійського перекладу */
export interface NewsArticle {
  id: string | number;
  category: string;
  categoryEn?: string;
  dateUk: string;
  dateEn: string;
  readTimeUk: string;
  readTimeEn: string;
  title: string;
  titleEn?: string;
  excerpt: string;
  excerptEn?: string;
  image: string;
  placeholderPath?: string;
  paragraphs: string[];
  paragraphsEn?: string[];
  highlight?: string;
  highlightEn?: string;
}

/** Локалізоване представлення новини для відображення в поточній мові */
export interface LocalizedNewsArticle {
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

export interface SiteContent {
  pageTitle: string;
  skipToContent: string;
  navItems: NavItem[];
  header: {
    logoAriaLabel: string;
    navAriaLabel: string;
    mobileNavAriaLabel: string;
    joinButton: string;
    openMenuAria: string;
    closeMenuAria: string;
    langSwitchAria: string;
    langLabel: string;
  };
  hero: {
    titleStart: string;
    titleHighlight: string;
    description: string;
    primaryCta: string;
    secondaryCta: string;
    sloganBold: string;
    sloganRest: string;
    imageAlt: string;
  };
  pillarsSection: {
    eyebrow: string;
    titleStart: string;
    titleHighlight: string;
    description: string;
    items: PillarItem[];
  };
  impactSection: {
    card1: {
      title: string;
      description: string;
      cta: string;
      imageAlt: string;
    };
    card2: {
      title: string;
      description: string;
      cta: string;
      imageAlt: string;
    };
    statsCard: {
      eyebrow: string;
      title: string;
      cta: string;
      metrics: ImpactMetric[];
    };
  };
  schoolsSection: {
    eyebrow: string;
    titleStart: string;
    titleHighlight: string;
    description: string;
    features: SchoolFeature[];
  };
  wellbeingSection: {
    title: string;
    description: string;
    benefits: WellbeingBenefit[];
    highlightBold: string;
    highlightRest: string;
  };
  stepsSection: {
    title: string;
    description: string;
    steps: SchoolStep[];
  };
  ctaBanner: {
    eyebrow: string;
    title: string;
    description: string;
    button: string;
  };
  newsSection: {
    eyebrow: string;
    title: string;
    description: string;
    allCategory: string;
    filterAriaLabel: string;
    loadingText: string;
    emptyTitle: string;
    emptyDescription: string;
    readMore: string;
    openArticleAriaPrefix: string;
    modal: {
      closeAria: string;
      prev: string;
      next: string;
      contactCta: string;
    };
  };
  contactsSection: {
    eyebrow: string;
    titleStart: string;
    titleHighlight: string;
    description: string;
    emailLabel: string;
    phoneLabel: string;
    locationLabel: string;
    locationValue: string;
    formTitle: string;
    formRequiredNote: string;
    successTitle: string;
    successDescription: string;
    sendAnother: string;
    fields: {
      nameLabel: string;
      namePlaceholder: string;
      emailLabel: string;
      emailPlaceholder: string;
      phoneLabel: string;
      phonePlaceholder: string;
      orgLabel: string;
      orgPlaceholder: string;
      topicLabel: string;
      topics: {
        school: string;
        training: string;
        partnership: string;
        other: string;
      };
      messageLabel: string;
      messagePlaceholder: string;
    };
    submitIdle: string;
    submitLoading: string;
    errors: {
      name: string;
      email: string;
      message: string;
      network: string;
    };
  };
  joinModal: {
    closeAria: string;
    eyebrow: string;
    title: string;
    description: string;
    successTitle: string;
    successDescription: string;
    returnButton: string;
    sendAnother: string;
    nameLabel: string;
    namePlaceholder: string;
    emailLabel: string;
    emailPlaceholder: string;
    phoneLabel: string;
    phonePlaceholder: string;
    orgLabel: string;
    orgPlaceholder: string;
    messageLabel: string;
    messagePlaceholder: string;
    submitIdle: string;
    submitLoading: string;
    topicForSheet: string;
  };
  footer: {
    quote: string;
    quoteAuthor: string;
    principles: HarmonyPrincipleItem[];
    description: string;
    communityTitle: string;
    communityDescription: string;
    contactButton: string;
    copyright: string;
    navAriaLabel: string;
  };
  accessibility: {
    buttonLabel: string;
    panelTitle: string;
    panelSubtitle: string;
    closeAria: string;
    fontScaleLabel: string;
    fontScales: {
      normal: { shortTitle: string; ariaLabel: string; percent: string };
      large: { shortTitle: string; ariaLabel: string; percent: string };
      xlarge: { shortTitle: string; ariaLabel: string; percent: string };
    };
    toggles: {
      highContrast: { label: string; description: string };
      readableFont: { label: string; description: string };
      highlightLinks: { label: string; description: string };
      reduceMotion: { label: string; description: string };
    };
    resetButton: string;
    announcements: {
      reset: string;
      enabled: string;
      disabled: string;
      fontScalePrefix: string;
    };
  };
}

export const SITE_CONTENT: Record<Language, SiteContent> = {
  uk: {
    pageTitle: 'The Harmony Project — Освіта в гармонії з життям',
    skipToContent: 'Перейти до основного вмісту',
    navItems: [
      { id: 'approach', label: 'Наш підхід', href: '#approach' },
      { id: 'schools', label: 'Для шкіл в Україні', href: '#schools' },
      { id: 'impact', label: 'Вплив', href: '#impact' },
      { id: 'news', label: 'Новини', href: '#news' },
      { id: 'contacts', label: 'Контакти', href: '#contacts' },
    ],
    header: {
      logoAriaLabel: 'The Harmony Project — на початок сторінки',
      navAriaLabel: 'Головна навігація',
      mobileNavAriaLabel: 'Мобільна навігація',
      joinButton: 'Долучитися',
      openMenuAria: 'Відкрити меню',
      closeMenuAria: 'Закрити меню',
      langSwitchAria: 'Перемикач мови сайту',
      langLabel: 'Мова',
    },
    hero: {
      titleStart: 'Освіта, що оживає',
      titleHighlight: 'в гармонії з життям.',
      description:
        'Навчання, засноване на принципах природи: від запитів і досліджень до значущих «Великих робіт». Підтримуємо добробут українських учнів і педагогів, формуючи покоління відповідальних лідерів сталого майбутнього.',
      primaryCta: 'Відкрити підхід',
      secondaryCta: 'Впровадити у школі',
      sloganBold: 'Природа — наш учитель.',
      sloganRest: 'Вкорінені у цінностях, відкриті до світу.',
      imageAlt:
        'Стигла пухнаста кульбаба у ранковому світлі з насінинами, що розлітаються у повітрі',
    },
    pillarsSection: {
      eyebrow: 'Наш підхід у чотирьох елементах',
      titleStart: 'Чотири опори підходу',
      titleHighlight: 'Гармонії',
      description:
        'Цілісна система, де шкільні предмети поєднуються з життєвим досвідом, творчістю та турботою про світ.',
      items: [
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
      ],
    },
    impactSection: {
      card1: {
        title: 'Навчання, що зростає разом із дитиною',
        description:
          'Коли природа стає нашим учителем, навчання оживає. Від раннього дитинства до юності ми розвиваємо допитливість, творчість і вміння бачити цілісність світу розумом, серцем і руками.',
        cta: 'Дізнатися більше',
        imageAlt: 'Українські школярі малюють аквареллю листя та квіти на галявині',
      },
      card2: {
        title: 'Підтримуємо дітей України сьогодні',
        description:
          'Допомагаємо школам і громадам зміцнювати психологічний добробут учнів та педагогів. Через турботу про довкілля, спільні проєкти й тихі хвилини споглядання діти відновлюють внутрішню рівновагу та надію.',
        cta: 'Читати більше',
        imageAlt: 'Ранковий український луг із дикими квітами та лелекою у гнізді',
      },
      statsCard: {
        eyebrow: 'Вимірювані результати',
        title: 'Реальний вплив',
        cta: 'Історії впливу',
        metrics: [
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
        ],
      },
    },
    schoolsSection: {
      eyebrow: 'Для шкіл в Україні',
      titleStart: 'Як ми працюємо зі',
      titleHighlight: 'школами',
      description:
        'Пропонуємо перевірений і гнучкий шлях інтеграції підходу «Гармонії» в навчальний процес та повсякденну культуру сучасної української школи.',
      features: [
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
      ],
    },
    wellbeingSection: {
      title: 'Навчання, що підтримує добробут і стійкість',
      description:
        'Коли діти навчаються у зв’язку з природою, вони почуваються добре і впевнено. Ми створюємо в школі простір довіри, спокою та взаємної підтримки для кожного учня й педагога.',
      benefits: [
        { title: 'Знижує стрес і емоційну напругу', iconName: 'wind' },
        { title: 'Поглиблює емпатію та довіру', iconName: 'handshake' },
        { title: 'Розвиває уважність і внутрішній спокій', iconName: 'focus' },
        { title: 'Формує психологічну стійкість', iconName: 'shield' },
        { title: 'Надихає сенсом і вірою в майбутнє', iconName: 'sun' },
      ],
      highlightBold: 'Психологічний добробут і стійкість',
      highlightRest:
        '— ключовий пріоритет Проєкту «Гармонія», особливо важливий для українських дітей і педагогів сьогодні.',
    },
    stepsSection: {
      title: 'Ваш шлях упровадження',
      description:
        'Простий і підтримуваний маршрут від першого знайомства до живих змін у шкільній спільноті.',
      steps: [
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
      ],
    },
    ctaBanner: {
      eyebrow: 'Відкриті до партнерства',
      title: 'Готові розпочати?',
      description:
        'Будуймо разом освіту 21 століття, яка підтримує дітей України — силою природи, цінностей та живої спільноти.',
      button: 'Долучитися',
    },
    newsSection: {
      eyebrow: 'Події та публікації',
      title: 'Новини проєкту',
      description:
        'Актуальні події, анонси семінарів для педагогів та новини розвитку Проєкту «Гармонія» в Україні.',
      allCategory: 'Усі',
      filterAriaLabel: 'Фільтр новин за категорією',
      loadingText: 'Завантаження новин...',
      emptyTitle: "Актуальні новини скоро з'являться",
      emptyDescription:
        'Ми готуємо свіжі матеріали, анонси подій та історії українських шкіл-партнерів.',
      readMore: 'Читати далі',
      openArticleAriaPrefix: 'Відкрити новину:',
      modal: {
        closeAria: 'Закрити новину',
        prev: 'Попередня',
        next: 'Наступна',
        contactCta: 'Зв’язатися з командою',
      },
    },
    contactsSection: {
      eyebrow: 'Зв’яжіться з нами',
      titleStart: 'Приєднайтеся до',
      titleHighlight: 'нашого руху',
      description:
        'Освіта може бути силою добра у світі. Разом ми робимо це можливим. Напишіть нам, якщо ви представляєте школу, громаду або бажаєте підтримати проєкт.',
      emailLabel: 'Електронна пошта',
      phoneLabel: 'Телефон координатора',
      locationLabel: 'Локація',
      locationValue: 'Україна / Велика Британія (міжнародна освітня ініціатива)',
      formTitle: 'Форма зворотного зв’язку',
      formRequiredNote: 'Поля, позначені зірочкою (*), обов’язкові для заповнення.',
      successTitle: 'Дякуємо! Ваше звернення успішно надіслано.',
      successDescription: 'Ми зв’яжемося з вами найближчим часом.',
      sendAnother: 'Надіслати ще одне повідомлення',
      fields: {
        nameLabel: 'Ваше ім’я та прізвище *',
        namePlaceholder: 'Олена Коваленко',
        emailLabel: 'Електронна пошта *',
        emailPlaceholder: 'olena@school.ua',
        phoneLabel: 'Телефон',
        phonePlaceholder: '+38 (0XX) XXX-XX-XX',
        orgLabel: 'Заклад освіти / Організація',
        orgPlaceholder: 'Назва школи або громади',
        topicLabel: 'Тема звернення',
        topics: {
          school: 'Долучити школу до проєкту',
          training: 'Навчання для вчителів',
          partnership: 'Партнерство / Підтримка',
          other: 'Інше питання',
        },
        messageLabel: 'Повідомлення *',
        messagePlaceholder: 'Розкажіть коротко про вашу школу або запит...',
      },
      submitIdle: 'Надіслати повідомлення',
      submitLoading: 'Надсилання...',
      errors: {
        name: 'Будь ласка, вкажіть ваше ім’я та прізвище.',
        email: 'Будь ласка, введіть коректну електронну адресу.',
        message: 'Будь ласка, напишіть коротке повідомлення (щонайменше 6 символів).',
        network:
          'Не вдалося надіслати звернення. Перевірте з’єднання з інтернетом і спробуйте ще раз.',
      },
    },
    joinModal: {
      closeAria: 'Закрити форму',
      eyebrow: 'Проєкт «Гармонія»',
      title: 'Долучитися до проєкту',
      description:
        'Залиште контакти, щоб впровадити підхід «Гармонії» у вашій школі або долучитися як партнер.',
      successTitle: 'Дякуємо! Ваше звернення успішно надіслано.',
      successDescription: 'Ми зв’яжемося з вами найближчим часом.',
      returnButton: 'Повернутися на сайт',
      sendAnother: 'Надіслати ще одне звернення',
      nameLabel: 'Ваше ім’я *',
      namePlaceholder: 'Олена Коваленко',
      emailLabel: 'Електронна пошта *',
      emailPlaceholder: 'olena@school.ua',
      phoneLabel: 'Телефон',
      phonePlaceholder: '+38 (0XX) XXX-XX-XX',
      orgLabel: 'Школа / Організація',
      orgPlaceholder: 'Назва школи або громади',
      messageLabel: 'Повідомлення *',
      messagePlaceholder:
        'Розкажіть коротко про вашу школу або як ви бажаєте долучитися...',
      submitIdle: 'Надіслати заявку',
      submitLoading: 'Надсилання...',
      topicForSheet: 'Заявка «Долучитися»',
    },
    footer: {
      quote:
        '«Ми не стоїмо осторонь від природи. Як і все інше, ми є частиною Природи. Насправді — ми є Природою.»',
      quoteAuthor: '— Передмова до посібника Проєкту «Гармонія»',
      principles: [
        { label: 'Взаємозалежність', iconName: 'link' },
        { label: 'Цикл', iconName: 'cycle' },
        { label: 'Різноманітність', iconName: 'flower' },
        { label: 'Адаптація', iconName: 'leaf' },
        { label: 'Здоров’я', iconName: 'heart' },
        { label: 'Геометрія', iconName: 'geometry' },
        { label: 'Єдність', iconName: 'unity' },
      ],
      description:
        'Новий спосіб пізнавати світ і навчатися у природи — поєднуючи цінності, дослідницькі запити та практичну турботу про довкілля й спільноту.',
      communityTitle: 'Спільнота для практики',
      communityDescription:
        'Відкриті до співпраці зі школами, педагогами та освітніми ініціативами України. Разом формуємо освіту 21 століття, вкорінену в принципах природи.',
      contactButton: 'Зв’язатися з нами',
      copyright: '© 2026 Проєкт «Гармонія» (The Harmony Project). Усі права захищено.',
      navAriaLabel: 'Навігація у футері',
    },
    accessibility: {
      buttonLabel: 'Налаштування доступності',
      panelTitle: 'Налаштування доступності',
      panelSubtitle: 'Безбар’єрний режим сайту',
      closeAria: 'Закрити панель налаштувань доступності',
      fontScaleLabel: 'Розмір шрифту',
      fontScales: {
        normal: { shortTitle: 'Звичайний', ariaLabel: 'Звичайний (100%)', percent: '100%' },
        large: { shortTitle: 'Збільшений', ariaLabel: 'Збільшений (115%)', percent: '115%' },
        xlarge: { shortTitle: 'Великий', ariaLabel: 'Великий (130%)', percent: '130%' },
      },
      toggles: {
        highContrast: {
          label: 'Високий контраст',
          description: 'Чіткіший текст, насичені межі та контрастний фон',
        },
        readableFont: {
          label: 'Зручне читання',
          description: 'Більші інтервали тексту та вирівнювання по лівому краю',
        },
        highlightLinks: {
          label: 'Підсвітити посилання й кнопки',
          description: 'Додає помітний контур усім інтерактивним елементам',
        },
        reduceMotion: {
          label: 'Зупинити анімації',
          description: 'Вимикає рух елементів і плавні переходи',
        },
      },
      resetButton: 'Скинути налаштування',
      announcements: {
        reset: 'Налаштування доступності скинуто до стандартних.',
        enabled: 'увімкнено',
        disabled: 'вимкнено',
        fontScalePrefix: 'Розмір шрифту',
      },
    },
  },

  en: {
    pageTitle: 'The Harmony Project — Education in Harmony with Life',
    skipToContent: 'Skip to main content',
    navItems: [
      { id: 'approach', label: 'Our Approach', href: '#approach' },
      { id: 'schools', label: 'For Schools in Ukraine', href: '#schools' },
      { id: 'impact', label: 'Impact', href: '#impact' },
      { id: 'news', label: 'News', href: '#news' },
      { id: 'contacts', label: 'Contacts', href: '#contacts' },
    ],
    header: {
      logoAriaLabel: 'The Harmony Project — back to top',
      navAriaLabel: 'Main navigation',
      mobileNavAriaLabel: 'Mobile navigation',
      joinButton: 'Join Us',
      openMenuAria: 'Open menu',
      closeMenuAria: 'Close menu',
      langSwitchAria: 'Language switcher',
      langLabel: 'Language',
    },
    hero: {
      titleStart: 'Education that comes alive',
      titleHighlight: 'in harmony with life.',
      description:
        'Learning rooted in the principles of Nature: from meaningful enquiries and discovery to purposeful Great Works. We support the wellbeing of Ukrainian students and educators, nurturing a generation of responsible leaders for a sustainable future.',
      primaryCta: 'Explore the Approach',
      secondaryCta: 'Bring to Your School',
      sloganBold: 'Nature is our teacher.',
      sloganRest: 'Rooted in values, open to the world.',
      imageAlt:
        'A sunlit dandelion seed head releasing delicate seeds into the morning air',
    },
    pillarsSection: {
      eyebrow: 'Our approach in four elements',
      titleStart: 'Four Pillars of',
      titleHighlight: 'Harmony',
      description:
        'A cohesive system where school subjects connect with real-life experience, creativity, and care for the living world.',
      items: [
        {
          number: '1',
          title: '1. Values',
          shortDescription: 'Building a culture of respect, trust, and responsibility.',
          description:
            'We cultivate a shared culture of respect, trust, and responsibility that serves as a moral compass for the entire school community.',
          image: MEDIA_ASSETS.pillar1,
          placeholderPath: 'images/pillar-1.jpg',
          imageAlt: 'A child closely observing wildflowers in a sunlit meadow',
          iconName: 'heart',
          badgeTone: 'bg-[#22A06B]',
        },
        {
          number: '2',
          title: '2. Enquiries of Learning',
          shortDescription: 'Replacing rote memorisation with living enquiry.',
          description:
            'We replace passive memorisation with living enquiry, empowering students to ask bold questions and discover real-world answers.',
          image: MEDIA_ASSETS.pillar2,
          placeholderPath: 'images/pillar-2.jpg',
          imageAlt: 'Students exploring a woodland with binoculars and a field journal',
          iconName: 'compass',
          badgeTone: 'bg-[#1A7F56]',
        },
        {
          number: '3',
          title: '3. Principles of Nature',
          shortDescription: 'Exploring the seven principles of harmony in Nature.',
          description:
            'We explore the seven principles of harmony in Nature so learners understand the interdependence of all life and their place within it.',
          image: MEDIA_ASSETS.pillar3,
          placeholderPath: 'images/pillar-3.jpg',
          imageAlt: 'Students arranging natural geometry patterns with pine cones, ferns, and a sunflower',
          iconName: 'flower',
          badgeTone: 'bg-[#2E9E6B]',
        },
        {
          number: '4',
          title: '4. Great Works',
          shortDescription: 'Turning knowledge into meaningful real-world action.',
          description:
            'We turn knowledge into action: students create high-quality, purposeful projects they take pride in and share with their community.',
          image: MEDIA_ASSETS.pillar4,
          placeholderPath: 'images/pillar-4.jpg',
          imageAlt: 'A teacher and students collaborating outdoors on a local ecological map',
          iconName: 'sparkles',
          badgeTone: 'bg-[#1D5B57]',
        },
      ],
    },
    impactSection: {
      card1: {
        title: 'Learning that grows with every child',
        description:
          'When Nature becomes our teacher, learning comes alive. From early years through adolescence, we nurture curiosity, creativity, and the ability to see the wholeness of the world with head, heart, and hands.',
        cta: 'Learn more',
        imageAlt: 'Ukrainian students painting leaves and wildflowers outdoors with watercolours',
      },
      card2: {
        title: "Supporting Ukraine's children today",
        description:
          'We help schools and communities strengthen the psychological wellbeing of students and educators. Through caring for the environment, shared projects, and quiet moments of reflection, children restore inner balance and hope.',
        cta: 'Read more',
        imageAlt: 'A morning Ukrainian meadow with wildflowers and a white stork in its nest',
      },
      statsCard: {
        eyebrow: 'Measurable outcomes',
        title: 'Real Impact',
        cta: 'Impact stories',
        metrics: [
          {
            value: 20000,
            suffix: '+',
            label: 'children experiencing learning in harmony',
            iconName: 'users',
          },
          {
            value: 150,
            suffix: '+',
            label: 'schools embedding the Harmony approach',
            iconName: 'school',
          },
          {
            value: 100,
            suffix: '+',
            label: 'school-led sustainability initiatives',
            iconName: 'globe',
          },
        ],
      },
    },
    schoolsSection: {
      eyebrow: 'For Schools in Ukraine',
      titleStart: 'How we work with',
      titleHighlight: 'schools',
      description:
        'We offer a proven, flexible pathway for integrating the Harmony approach into everyday teaching and the living culture of modern Ukrainian schools.',
      features: [
        {
          title: 'Partnership',
          description:
            'We foster collaboration among teachers, parents, and local experts, bringing community wisdom directly into learning.',
          iconName: 'users',
        },
        {
          title: 'Adapted for Ukraine',
          description:
            'Fully aligned with the New Ukrainian School (NUS) framework and tailored to the unique needs of every region.',
          iconName: 'leaf',
        },
        {
          title: 'Teacher Support',
          description:
            'We train teaching teams, share ready-to-use enquiry plans, and provide ongoing mentoring at every step.',
          iconName: 'book',
        },
        {
          title: 'Student Wellbeing',
          description:
            'Mindful practices and meaningful connection with Nature help children restore calm and emotional balance.',
          iconName: 'heart',
        },
        {
          title: 'Learning for Life',
          description:
            'Students investigate real-world questions, build leadership, and deliver projects that serve their communities.',
          iconName: 'sprout',
        },
      ],
    },
    wellbeingSection: {
      title: 'Learning that nurtures wellbeing and resilience',
      description:
        'When children learn in connection with Nature, they feel grounded and confident. We help schools create spaces of trust, calm, and mutual support for every student and educator.',
      benefits: [
        { title: 'Reduces stress and emotional tension', iconName: 'wind' },
        { title: 'Deepens empathy and trust', iconName: 'handshake' },
        { title: 'Cultivates mindfulness and inner calm', iconName: 'focus' },
        { title: 'Builds psychological resilience', iconName: 'shield' },
        { title: 'Inspires purpose and hope for the future', iconName: 'sun' },
      ],
      highlightBold: 'Psychological wellbeing and resilience',
      highlightRest:
        'are at the heart of The Harmony Project — especially vital for Ukrainian children and educators today.',
    },
    stepsSection: {
      title: 'Your Implementation Pathway',
      description:
        'A clear, supported journey from first conversation to lasting, living change across your school community.',
      steps: [
        {
          step: '1',
          title: 'Explore',
          description:
            'We discuss your school’s goals and identify the most natural starting point.',
        },
        {
          step: '2',
          title: 'Plan',
          description:
            'We tailor learning enquiries and Harmony principles to fit your curriculum and context.',
        },
        {
          step: '3',
          title: 'Prepare',
          description:
            'We train your teaching team and equip them with guides and practical resources.',
        },
        {
          step: '4',
          title: 'Implement',
          description:
            'We launch enquiry-led learning rooted in Nature and culminating in Great Works.',
        },
        {
          step: '5',
          title: 'Grow',
          description:
            'We reflect on outcomes, celebrate achievements, and scale the practice further.',
        },
      ],
    },
    ctaBanner: {
      eyebrow: 'Open to partnership',
      title: 'Ready to get started?',
      description:
        "Let's build 21st-century education together — supporting Ukraine's children through the power of Nature, shared values, and a vibrant community.",
      button: 'Join Us',
    },
    newsSection: {
      eyebrow: 'Events & updates',
      title: 'Project News',
      description:
        'Latest events, teacher seminar announcements, and updates on the growth of The Harmony Project in Ukraine.',
      allCategory: 'All',
      filterAriaLabel: 'Filter news by category',
      loadingText: 'Loading news...',
      emptyTitle: 'Latest news coming soon',
      emptyDescription:
        'We are preparing fresh stories, upcoming event announcements, and highlights from our partner schools in Ukraine.',
      readMore: 'Read more',
      openArticleAriaPrefix: 'Open article:',
      modal: {
        closeAria: 'Close article',
        prev: 'Previous',
        next: 'Next',
        contactCta: 'Contact our team',
      },
    },
    contactsSection: {
      eyebrow: 'Get in touch',
      titleStart: 'Join',
      titleHighlight: 'our movement',
      description:
        'Education can be a force for good in the world. Together we make it possible. Reach out if you represent a school, a community, or wish to support the initiative.',
      emailLabel: 'Email',
      phoneLabel: 'Coordinator phone',
      locationLabel: 'Location',
      locationValue: 'Ukraine / United Kingdom (international educational initiative)',
      formTitle: 'Contact Form',
      formRequiredNote: 'Fields marked with an asterisk (*) are required.',
      successTitle: 'Thank you! Your message has been sent.',
      successDescription: 'We will get back to you shortly.',
      sendAnother: 'Send another message',
      fields: {
        nameLabel: 'Your full name *',
        namePlaceholder: 'Olena Kovalenko',
        emailLabel: 'Email address *',
        emailPlaceholder: 'olena@school.ua',
        phoneLabel: 'Phone number',
        phonePlaceholder: '+38 (0XX) XXX-XX-XX',
        orgLabel: 'School / Organisation',
        orgPlaceholder: 'Name of your school or community',
        topicLabel: 'Topic',
        topics: {
          school: 'Bring a school into the project',
          training: 'Teacher training & workshops',
          partnership: 'Partnership / Support',
          other: 'Other enquiry',
        },
        messageLabel: 'Message *',
        messagePlaceholder: 'Tell us briefly about your school or enquiry...',
      },
      submitIdle: 'Send message',
      submitLoading: 'Sending...',
      errors: {
        name: 'Please enter your full name.',
        email: 'Please enter a valid email address.',
        message: 'Please write a short message (at least 6 characters).',
        network: 'Could not send your message. Please check your connection and try again.',
      },
    },
    joinModal: {
      closeAria: 'Close form',
      eyebrow: 'The Harmony Project',
      title: 'Join the Project',
      description:
        'Leave your details to introduce the Harmony approach in your school or collaborate with us as a partner.',
      successTitle: 'Thank you! Your request has been sent.',
      successDescription: 'We will be in touch with you shortly.',
      returnButton: 'Return to website',
      sendAnother: 'Send another request',
      nameLabel: 'Your name *',
      namePlaceholder: 'Olena Kovalenko',
      emailLabel: 'Email address *',
      emailPlaceholder: 'olena@school.ua',
      phoneLabel: 'Phone',
      phonePlaceholder: '+38 (0XX) XXX-XX-XX',
      orgLabel: 'School / Organisation',
      orgPlaceholder: 'Name of your school or community',
      messageLabel: 'Message *',
      messagePlaceholder: 'Tell us briefly about your school or how you would like to join...',
      submitIdle: 'Submit request',
      submitLoading: 'Sending...',
      topicForSheet: 'Join Us Application (EN)',
    },
    footer: {
      quote:
        '“We do not stand apart from Nature. Like everything else, we are part of Nature. In fact, we are Nature.”',
      quoteAuthor: '— Foreword to The Harmony Project Guide',
      principles: [
        { label: 'Interdependence', iconName: 'link' },
        { label: 'Cycle', iconName: 'cycle' },
        { label: 'Diversity', iconName: 'flower' },
        { label: 'Adaptation', iconName: 'leaf' },
        { label: 'Health', iconName: 'heart' },
        { label: 'Geometry', iconName: 'geometry' },
        { label: 'Oneness', iconName: 'unity' },
      ],
      description:
        'A new way of learning from Nature — uniting values, enquiries of learning, and practical care for our environment and community.',
      communityTitle: 'A Community of Practice',
      communityDescription:
        'Open to collaborating with schools, educators, and educational initiatives across Ukraine. Together we shape 21st-century education rooted in the principles of Nature.',
      contactButton: 'Contact Us',
      copyright: '© 2026 The Harmony Project. All rights reserved.',
      navAriaLabel: 'Footer navigation',
    },
    accessibility: {
      buttonLabel: 'Accessibility settings',
      panelTitle: 'Accessibility Settings',
      panelSubtitle: 'Inclusive browsing options',
      closeAria: 'Close accessibility settings panel',
      fontScaleLabel: 'Font size',
      fontScales: {
        normal: { shortTitle: 'Default', ariaLabel: 'Default (100%)', percent: '100%' },
        large: { shortTitle: 'Large', ariaLabel: 'Large (115%)', percent: '115%' },
        xlarge: { shortTitle: 'Larger', ariaLabel: 'Larger (130%)', percent: '130%' },
      },
      toggles: {
        highContrast: {
          label: 'High contrast',
          description: 'Sharper text, stronger borders, and high-contrast surfaces',
        },
        readableFont: {
          label: 'Dyslexia-friendly reading',
          description: 'Wider text spacing and left-aligned paragraphs',
        },
        highlightLinks: {
          label: 'Highlight links & buttons',
          description: 'Adds a clear outline around all interactive controls',
        },
        reduceMotion: {
          label: 'Pause animations',
          description: 'Disables motion effects and smooth transitions',
        },
      },
      resetButton: 'Reset settings',
      announcements: {
        reset: 'Accessibility settings reset to default.',
        enabled: 'enabled',
        disabled: 'disabled',
        fontScalePrefix: 'Font size',
      },
    },
  },
};
