export type BlogPost = {
  id: string;
  title: string;
  slug: string;
  description: string;
  /** Isi artikel dalam HTML (dari editor admin). */
  value: string;
  thumbnail: string | null;
  views: number;
  tags: string[];
  isEditorPick?: boolean;
  createdAt: string;
  updatedAt: string;
  publishedAt?: string | null;
};

export type BlogSummary = Omit<BlogPost, 'value'> & { readingMinutes: number };
