import mockNews from "../data/mockNews.json";
import type { NewsArticle, NewsArticleInput, NewsStatus } from "../types/news";

const STORAGE_KEY = "talk-tantra-admin-news-v1";

function isNewsArticle(value: unknown): value is NewsArticle {
  if (!value || typeof value !== "object") return false;

  const article = value as Partial<NewsArticle>;

  return (
    typeof article.id === "string" &&
    typeof article.slug === "string" &&
    typeof article.category === "string" &&
    typeof article.title?.en === "string" &&
    typeof article.title?.hi === "string" &&
    typeof article.description?.en === "string" &&
    typeof article.description?.hi === "string" &&
    Array.isArray(article.content?.en) &&
    Array.isArray(article.content?.hi) &&
    ["DRAFT", "PUBLISHED", "SCHEDULED"].includes(article.status as string)
  );
}

function readStoredArticles(): NewsArticle[] | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;

    const parsed: unknown = JSON.parse(raw);

    if (Array.isArray(parsed) && parsed.every(isNewsArticle)) {
      return parsed;
    }
  } catch (error) {
    console.error("Unable to read saved news:", error);
  }

  return null;
}

function saveArticles(articles: NewsArticle[]): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(articles));
}

function createSlug(title: string): string {
  return (
    title
      .normalize("NFKD")
      .toLowerCase()
      .trim()
      .replace(/[^\p{L}\p{N}]+/gu, "-")
      .replace(/^-+|-+$/g, "") || "untitled-news"
  );
}

function uniqueSlug(
  title: string,
  articles: NewsArticle[],
  excludeId?: string,
) {
  const base = createSlug(title);
  let slug = base;
  let suffix = 2;

  while (
    articles.some(
      (article) => article.id !== excludeId && article.slug === slug,
    )
  ) {
    slug = `${base}-${suffix++}`;
  }

  return slug;
}

function makeId(): string {
  return (
    globalThis.crypto?.randomUUID?.() ??
    `news-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`
  );
}

export function getNewsArticles(): NewsArticle[] {
  const stored = readStoredArticles();

  if (stored) return stored;

  const seed = mockNews as NewsArticle[];

  try {
    saveArticles(seed);
  } catch (error) {
    console.error("Unable to initialize news storage:", error);
  }

  return seed;
}

export function saveNewsArticle(
  input: NewsArticleInput,
  id?: string,
): NewsArticle[] {
  const articles = getNewsArticles();
  const now = new Date().toISOString();

  const existing = id
    ? articles.find((article) => article.id === id)
    : undefined;

  if (id && !existing) {
    throw new Error("The news article could not be found.");
  }

  const article: NewsArticle = {
    ...input,
    id: existing?.id ?? makeId(),
    slug: uniqueSlug(input.title.en, articles, existing?.id),
    createdAt: existing?.createdAt ?? now,
    updatedAt: now,
  };

  const updated = existing
    ? articles.map((item) => (item.id === id ? article : item))
    : [article, ...articles];

  saveArticles(updated);
  return updated;
}

export function deleteNewsArticle(id: string): NewsArticle[] {
  const articles = getNewsArticles();
  const updated = articles.filter((article) => article.id !== id);

  if (updated.length === articles.length) {
    throw new Error("The news article could not be found.");
  }

  saveArticles(updated);
  return updated;
}

export function updateNewsStatus(
  id: string,
  status: NewsStatus,
): NewsArticle[] {
  const articles = getNewsArticles();
  const exists = articles.some((article) => article.id === id);

  if (!exists) {
    throw new Error("The news article could not be found.");
  }

  const now = new Date().toISOString();

  const updated = articles.map((article) => {
    if (article.id !== id) return article;

    return {
      ...article,
      status,
      publishedAt:
        status === "PUBLISHED"
          ? (article.publishedAt ?? now)
          : status === "DRAFT"
            ? null
            : article.publishedAt,
      updatedAt: now,
    };
  });

  saveArticles(updated);
  return updated;
}
