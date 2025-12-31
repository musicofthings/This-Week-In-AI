
export interface GroundingSource {
  title: string;
  uri: string;
}

export interface NewsArticle {
  title: string;
  excerpt: string;
  content: string;
  category: string;
  sourceUrl: string;
  date: string;
  tags: string[];
}

export interface NewsContent {
  articles: NewsArticle[];
  sources: GroundingSource[];
  lastUpdated: string;
}
