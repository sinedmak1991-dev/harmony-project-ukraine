import type { NewsArticle } from '../data/harmonyContent';

export const GOOGLE_SCRIPT_URL =
  'https://script.google.com/macros/s/AKfycbxJIH75q8KtqZGqjR0FaXE4XfXGGnMBqOYsTiJBGBrGyCls78aUzGsF4EyD_TypcIwZ/exec';

interface RawSheetNewsItem {
  id?: string | number;
  date?: string;
  category?: string;
  title?: string;
  excerpt?: string;
  content?: string;
  image?: string;
  highlight?: string;
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

function formatNewsDate(rawDate: unknown): string {
  const value = typeof rawDate === 'string' ? rawDate.trim() : '';
  if (!value) return '';

  // Якщо Google Таблиця повернула ISO-дату (наприклад, 2026-11-25T22:00:00.000Z), форматуємо її українською
  if (/^\d{4}-\d{2}-\d{2}/.test(value)) {
    const parsed = new Date(value);
    if (!Number.isNaN(parsed.getTime())) {
      const day = String(parsed.getDate()).padStart(2, '0');
      const month = UKRAINIAN_MONTHS[parsed.getMonth()];
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

function estimateReadTime(paragraphs: string[]): string {
  const wordCount = paragraphs
    .join(' ')
    .trim()
    .split(/\s+/)
    .filter(Boolean).length;
  const minutes = Math.max(1, Math.ceil(wordCount / 180));
  return `${minutes} хв читання`;
}

function normalizeNewsItem(raw: RawSheetNewsItem, index: number): NewsArticle | null {
  if (typeof raw.status === 'string' && raw.status.trim()) {
    if (raw.status.trim().toLowerCase() !== 'опубліковано') {
      return null;
    }
  }

  const title = typeof raw.title === 'string' ? raw.title.trim() : '';
  if (!title) return null;

  const category =
    typeof raw.category === 'string' && raw.category.trim()
      ? raw.category.trim()
      : 'Новини';

  const excerpt = typeof raw.excerpt === 'string' ? raw.excerpt.trim() : '';
  const contentText = typeof raw.content === 'string' ? raw.content.trim() : '';

  const paragraphs = contentText
    ? contentText
        .split(/\r?\n+/)
        .map((line) => line.trim())
        .filter(Boolean)
    : excerpt
      ? [excerpt]
      : [];

  const finalExcerpt = excerpt || paragraphs[0] || '';
  const image = sanitizeImageUrl(raw.image);
  const readTime =
    typeof raw.readTime === 'string' && raw.readTime.trim()
      ? raw.readTime.trim()
      : estimateReadTime(paragraphs.length > 0 ? paragraphs : [finalExcerpt]);

  const highlight =
    typeof raw.highlight === 'string' && raw.highlight.trim()
      ? raw.highlight.trim()
      : undefined;

  return {
    id: raw.id !== undefined && raw.id !== '' ? raw.id : `sheet-${index}`,
    category,
    date: formatNewsDate(raw.date),
    readTime,
    title,
    excerpt: finalExcerpt,
    image,
    placeholderPath: '',
    imageAlt: title,
    paragraphs: paragraphs.length > 0 ? paragraphs : [finalExcerpt],
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
    throw new Error(`Помилка сервера (${response.status}). Спробуйте ще раз.`);
  }

  const text = await response.text();
  if (text.trim()) {
    try {
      const parsed = JSON.parse(text) as { status?: string; message?: string };
      if (parsed.status === 'error') {
        throw new Error(parsed.message || 'Не вдалося зберегти звернення.');
      }
    } catch (err) {
      if (err instanceof Error && err.message !== 'Unexpected token' && !err.message.includes('JSON')) {
        throw err;
      }
    }
  }
}
