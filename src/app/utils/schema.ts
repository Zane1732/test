/**
 * Schema.org JSON-LD structured data for SEO
 */
import { DetailedManga, SeriesManga } from "@/app/services/api";

export interface WebPageSchema {
  '@context': string;
  '@type': string;
  name: string;
  description: string;
  url: string;
  publisher?: {
    '@type': string;
    name: string;
    logo?: {
      '@type': string;
      url: string;
    };
  };
}

export interface BreadcrumbSchema {
  '@context': string;
  '@type': string;
  itemListElement: {
    '@type': string;
    position: number;
    name: string;
    item?: string;
  }[];
}

export interface ArticleSchema {
  '@context': string;
  '@type': string;
  headline: string;
  description: string;
  image: string[];
  datePublished?: string;
  dateModified?: string;
  author?: {
    '@type': string;
    name: string;
  };
  publisher?: {
    '@type': string;
    name: string;
    logo?: {
      '@type': string;
      url: string;
    };
  };
  mainEntityOfPage: {
    '@type': string;
    '@id': string;
  };
}

/**
 * Generate structured data for a manga detail page
 * @param manga The manga object
 * @param url The canonical URL of the page
 * @returns JSON-LD structured data as a string
 */
export function generateMangaSchema(manga: DetailedManga, url: string): string {
  // Article schema for the manga page
  const articleSchema: ArticleSchema = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: manga.title,
    description: manga.description || `Read ${manga.title} manga online at ManhwaNest.`,
    image: [manga.image],
    dateModified: manga.updatedOn || new Date().toISOString(),
    author: {
      '@type': 'Person',
      name: manga.authors?.join(', ') || 'Unknown Author'
    },
    publisher: {
      '@type': 'Organization',
      name: 'ManhwaNest',
      logo: {
        '@type': 'ImageObject',
        url: 'https://manhwanest.fun/logo.png'
      }
    },
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': url
    }
  };

  // Breadcrumb schema for navigation
  const breadcrumbSchema: BreadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      {
        '@type': 'ListItem',
        position: 1,
        name: 'Home',
        item: 'https://manhwanest.fun/'
      },
      {
        '@type': 'ListItem',
        position: 2,
        name: 'Manga',
        item: 'https://manhwanest.fun/latest'
      },
      {
        '@type': 'ListItem',
        position: 3,
        name: manga.title
      }
    ]
  };

  return JSON.stringify([articleSchema, breadcrumbSchema]);
}

/**
 * Generate structured data for a chapter page
 * @param manga The manga object
 * @param chapterId The chapter ID
 * @param url The canonical URL of the page
 * @returns JSON-LD structured data as a string
 */
export function generateChapterSchema(manga: DetailedManga, chapterId: string, chapterTitle: string, url: string): string {
  // Article schema for the chapter page
  const articleSchema: ArticleSchema = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: `${manga.title} - Chapter ${chapterId}${chapterTitle ? `: ${chapterTitle}` : ''}`,
    description: `Read ${manga.title} Chapter ${chapterId} online at ManhwaNest.`,
    image: [manga.image],
    dateModified: new Date().toISOString(),
    author: {
      '@type': 'Person',
      name: manga.authors?.join(', ') || 'Unknown Author'
    },
    publisher: {
      '@type': 'Organization',
      name: 'ManhwaNest',
      logo: {
        '@type': 'ImageObject',
        url: 'https://manhwanest.fun/logo.png'
      }
    },
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': url
    }
  };

  // Breadcrumb schema for navigation
  const breadcrumbSchema: BreadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      {
        '@type': 'ListItem',
        position: 1,
        name: 'Home',
        item: 'https://manhwanest.fun/'
      },
      {
        '@type': 'ListItem',
        position: 2,
        name: 'Manga',
        item: 'https://manhwanest.fun/latest'
      },
      {
        '@type': 'ListItem',
        position: 3,
        name: manga.title,
        item: `https://manhwanest.fun/manga/${manga.id}`
      },
      {
        '@type': 'ListItem',
        position: 4,
        name: `Chapter ${chapterId}`
      }
    ]
  };

  return JSON.stringify([articleSchema, breadcrumbSchema]);
}

/**
 * Generate structured data for the homepage
 * @param url The canonical URL of the page
 * @returns JSON-LD structured data as a string
 */
export function generateHomeSchema(url: string): string {
  const webPageSchema: WebPageSchema = {
    '@context': 'https://schema.org',
    '@type': 'WebPage',
    name: 'ManhwaNest - Read Latest Manga Online',
    description: 'ManhwaNest is your ultimate destination for reading the latest manga online. Discover a vast collection of popular manga series with high-quality scans and regular updates.',
    url: url,
    publisher: {
      '@type': 'Organization',
      name: 'ManhwaNest',
      logo: {
        '@type': 'ImageObject',
        url: 'https://manhwanest.fun/logo.png'
      }
    }
  };

  return JSON.stringify(webPageSchema);
} 