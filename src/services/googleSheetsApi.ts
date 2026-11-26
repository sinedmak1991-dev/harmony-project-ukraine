import type {
  Language,
  LocalizedNewsArticle,
  NewsArticle,
} from '../data/harmonyContent';

export const GOOGLE_SCRIPT_URL =
  'https://script.google.com/macros/s/AKfycbxJIH75q8KtqZGqjR0FaXE4XfXGGnMBqOYsTiJBGBrGyCls78aUzGsF4EyD_TypcIwZ/exec';

interface RawSheetNewsItem {
  id?: string | number;
  date?: string;
  category?: string;
  category_en?: string;
  title?: string;
  title_en?: string;
  excerpt?: string;
  excerpt_en?: string;
  content?: string;
  content_en?: string;
  image?: string;
  highlight?: string;
  highlight_en?: string;
  readTime?: string;
  status?: string;
}

interface SheetNewsResponse {
  status?: string;
  data?: RawSheetNewsItem[];
  message?: string;
}

export interface ContactSubmissionPayload {
  name: string;
  email: string;
  phone: string;
  organization?: string;
  topic?: string;
  message: string;
}

const UKRAINIAN_MONTHS = [
  'січня',
  'лютого',
  'березня',
  'квітня',
  'травня',
  'червня',
  'липня',
  'серпня',
  'вересня',
  'жовтня',
  'листопада',
  'грудня',
];

const ENGLISH_MONTHS = [
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December',
];

function formatNewsDate(rawDate: unknown, lang: Language): string {
  const value = typeof rawDate === 'string' ? rawDate.trim() : '';
  if (!value) return '';

  // Якщо Google Таблиця повернула ISO-дату (наприклад, 2026-11-25T22:00:00.000Z), форматуємо її обраною мовою
  if (/^\d{4}-\d{2}-\d{2}/.test(value)) {
    const parsed = new Date(value);
    if (!Number.isNaN(parsed.getTime())) {
      const day = String(parsed.getDate()).padStart(2, '0');
      const months = lang === 'en' ? ENGLISH_MONTHS : UKRAINIAN_MONTHS;
      const month = months[parsed.getMonth()];
      const year = parsed.getFullYear();
      return `${day} ${month} ${year}`;
    }
  }

  return value;
}

function sanitizeImageUrl(rawUrl: unknown): string {
  if (typeof rawUrl !== 'string') return '';
  const trimmed = rawUrl.trim();
  if (!trimmed) return '';

  // Підтримка посилань на файли Google Drive (перетворюємо у пряме зображення)
  const driveMatch = trimmed.match(/drive\.google\.com\/file\/d\/([a-zA-Z0-9_-]+)/);
  if (driveMatch?.[1]) {
    return `https://drive.google.com/thumbnail?id=${driveMatch[1]}&sz=w1200`;
  }

  // Дозволяємо лише безпечні http(s) або відносні шляхи
  if (/^(https?:\/\/|\.\/|\/)/i.test(trimmed)) {
    return trimmed;
  }

  return '';
}

function estimateReadTime(paragraphs: string[], lang: Language): string {
  const wordCount = paragraphs
    .join(' ')
    .trim()
    .split(/\s+/)
    .filter(Boolean).length;
  const minutes = Math.max(1, Math.ceil(wordCount / 180));
  return lang === 'en' ? `${minutes} min read` : `${minutes} хв читання`;
}

function splitParagraphs(text: string): string[] {
  return text
    .split(/\r?\n+/)
    .map((line) => line.trim())
    .filter(Boolean);
}

function normalizeNewsItem(raw: RawSheetNewsItem, index: number): NewsArticle | null {
  if (typeof raw.status === 'string' && raw.status.trim()) {
    if (raw.status.trim().toLowerCase() !== 'опубліковано') {
      return null;
    }
  }

  const title = typeof raw.title === 'string' ? raw.title.trim() : '';
  const titleEn = typeof raw.title_en === 'string' ? raw.title_en.trim() : '';
  if (!title && !titleEn) return null;

  const category =
    typeof raw.category === 'string' && raw.category.trim()
      ? raw.category.trim()
      : 'Новини';
  const categoryEn =
    typeof raw.category_en === 'string' && raw.category_en.trim()
      ? raw.category_en.trim()
      : undefined;

  const excerpt = typeof raw.excerpt === 'string' ? raw.excerpt.trim() : '';
  const excerptEn = typeof raw.excerpt_en === 'string' ? raw.excerpt_en.trim() : '';

  const contentText = typeof raw.content === 'string' ? raw.content.trim() : '';
  const contentTextEn = typeof raw.content_en === 'string' ? raw.content_en.trim() : '';

  const paragraphs = contentText
    ? splitParagraphs(contentText)
    : excerpt
      ? [excerpt]
      : [];

  const paragraphsEn = contentTextEn
    ? splitParagraphs(contentTextEn)
    : excerptEn
      ? [excerptEn]
      : undefined;

  const finalExcerpt = excerpt || paragraphs[0] || '';
  const finalExcerptEn = excerptEn || paragraphsEn?.[0] || undefined;

  const image = sanitizeImageUrl(raw.image);
  const explicitReadTime =
    typeof raw.readTime === 'string' && raw.readTime.trim()
      ? raw.readTime.trim()
      : '';

  const readTimeUk =
    explicitReadTime ||
    estimateReadTime(paragraphs.length > 0 ? paragraphs : [finalExcerpt], 'uk');
  const readTimeEn =
    explicitReadTime ||
    estimateReadTime(
      paragraphsEn && paragraphsEn.length > 0
        ? paragraphsEn
        : paragraphs.length > 0
          ? paragraphs
          : [finalExcerptEn || finalExcerpt],
      'en'
    );

  const highlight =
    typeof raw.highlight === 'string' && raw.highlight.trim()
      ? raw.highlight.trim()
      : undefined;
  const highlightEn =
    typeof raw.highlight_en === 'string' && raw.highlight_en.trim()
      ? raw.highlight_en.trim()
      : undefined;

  return {
    id: raw.id !== undefined && raw.id !== '' ? raw.id : `sheet-${index}`,
    category,
    categoryEn,
    dateUk: formatNewsDate(raw.date, 'uk'),
    dateEn: formatNewsDate(raw.date, 'en'),
    readTimeUk,
    readTimeEn,
    title: title || titleEn,
    titleEn: titleEn || undefined,
    excerpt: finalExcerpt,
    excerptEn: finalExcerptEn,
    image,
    placeholderPath: '',
    paragraphs: paragraphs.length > 0 ? paragraphs : [finalExcerpt],
    paragraphsEn,
    highlight,
    highlightEn,
  };
}

/**
 * Повертає локалізовану версію новини для обраної мови.
 * Якщо для англійської мови поля перекладу порожні — плавно повертає український оригінал.
 */
export function localizeNewsArticle(
  article: NewsArticle,
  lang: Language
): LocalizedNewsArticle {
  const isEn = lang === 'en';
  const title = isEn && article.titleEn ? article.titleEn : article.title;
  const category = isEn && article.categoryEn ? article.categoryEn : article.category;
  const excerpt = isEn && article.excerptEn ? article.excerptEn : article.excerpt;
  const paragraphs =
    isEn && article.paragraphsEn && article.paragraphsEn.length > 0
      ? article.paragraphsEn
      : article.paragraphs;
  const highlight = isEn && article.highlightEn ? article.highlightEn : article.highlight;

  return {
    id: article.id,
    category,
    date: isEn ? article.dateEn : article.dateUk,
    readTime: isEn ? article.readTimeEn : article.readTimeUk,
    title,
    excerpt,
    image: article.image,
    placeholderPath: article.placeholderPath,
    imageAlt: title,
    paragraphs,
    highlight,
  };
}

/**
 * Завантажує список опублікованих новин із Google Таблиці через Google Apps Script Web App.
 * Повертає нормалізований масив NewsArticle (може бути порожнім, якщо опублікованих новин немає).
 */
export async function fetchNewsFromSheet(signal?: AbortSignal): Promise<NewsArticle[]> {
  const response = await fetch(GOOGLE_SCRIPT_URL, {
    method: 'GET',
    redirect: 'follow',
    signal,
  });

  if (!response.ok) {
    throw new Error(`HTTP ${response.status}`);
  }

  const json = (await response.json()) as SheetNewsResponse;
  if (json.status !== 'success' || !Array.isArray(json.data)) {
    return [];
  }

  return json.data
    .map((item, idx) => normalizeNewsItem(item, idx))
    .filter((item): item is NewsArticle => item !== null);
}

/**
 * Надсилає звернення з форми у Google Таблицю через Google Apps Script Web App.
 * Використовує text/plain;charset=utf-8 для коректного проходження CORS без preflight.
 */
export async function submitContactToSheet(payload: ContactSubmissionPayload): Promise<void> {
  const trimmedName = payload.name.trim();
  const trimmedEmail = payload.email.trim();
  const trimmedPhone = payload.phone.trim();
  const trimmedOrg = payload.organization?.trim() ?? '';
  const trimmedMessage = payload.message.trim();

  // Об'єднуємо телефон і заклад/організацію в phone (щоб дані гарантовано потрапили у таблицю),
  // а також передаємо organization окремим полем.
  const combinedPhone = trimmedOrg
    ? trimmedPhone
      ? `${trimmedPhone} (${trimmedOrg})`
      : trimmedOrg
    : trimmedPhone;

  const bodyPayload: Record<string, string> = {
    name: trimmedName,
    email: trimmedEmail,
    phone: combinedPhone,
    organization: trimmedOrg,
    message: trimmedMessage,
  };

  if (payload.topic) {
    bodyPayload.topic = payload.topic;
  }

  const response = await fetch(GOOGLE_SCRIPT_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'text/plain;charset=utf-8',
    },
    body: JSON.stringify(bodyPayload),
    redirect: 'follow',
  });

  if (!response.ok) {
    throw new Error(`HTTP ${response.status}`);
  }

  const text = await response.text();
  if (text.trim()) {
    try {
      const parsed = JSON.parse(text) as { status?: string; message?: string };
      if (parsed.status === 'error') {
        throw new Error(parsed.message || 'Submission failed');
      }
    } catch (err) {
      if (
        err instanceof Error &&
        err.message !== 'Unexpected token' &&
        !err.message.includes('JSON')
      ) {
        throw err;
      }
    }
  }
}
