export type NewsStatus = "DRAFT" | "PUBLISHED" | "SCHEDULED";

export type NewsCategory =
  | "India"
  | "Uttar Pradesh"
  | "Politics"
  | "Business"
  | "World"
  | "Sports"
  | "Entertainment"
  | "Technology";

export interface LocalizedText {
  en: string;
  hi: string;
}

export interface LocalizedContent {
  en: string[];
  hi: string[];
}

export interface NewsArticle {
  id: string;
  slug: string;
  category: NewsCategory;
  title: LocalizedText;
  description: LocalizedText;
  content: LocalizedContent;
  imageUrl: string;
  author: string;
  status: NewsStatus;
  publishedAt: string | null;
  createdAt: string;
  updatedAt: string;
}

export type NewsArticleInput = Omit<
  NewsArticle,
  "id" | "slug" | "createdAt" | "updatedAt"
>;
