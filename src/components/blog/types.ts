export type BlogPostStatus = 'DRAFT' | 'PUBLISHED' | 'ARCHIVED';

// Minimal author shape (matches your User model)
export interface BlogAuthor {
  id: string;
  name: string | null;
  username?: string | null;
  avatarUrl?: string | null;
}

export interface BlogCategory {
  id: string;
  name: string;
  slug: string;
}

// What the card actually needs — keeps it lean
export interface BlogCardData {
  id: string;
  title: string;
  slug: string;
  excerpt?: string | null;
  coverImage?: string | null;
  status: BlogPostStatus;
  publishedAt?: string | null;
  readingTime?: number | null;
  createdAt: string;

  author: BlogAuthor;
  categories: BlogCategory[];

  // Counts (computed on backend or via _count)
  likeCount?: number;
  commentCount?: number;

  // Optional: has the current user liked it?
  isLiked?: boolean;
}