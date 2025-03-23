'use client';

import Script from 'next/script';
import { DetailedManga } from '../services/api';

type ChapterSchemaProps = {
  manga: DetailedManga;
  chapterId: string;
  chapterTitle?: string;
  url: string;
  images: { page: number; img: string }[];
};

export default function ChapterSchema({ manga, chapterId, chapterTitle, url, images }: ChapterSchemaProps) {
  // Get current date
  const currentDate = new Date().toISOString();
  
  // Create breadcrumb schema for navigation
  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      {
        '@type': 'ListItem',
        position: 1,
        name: 'Home',
        item: 'https://manhwanest.fun',
      },
      {
        '@type': 'ListItem',
        position: 2,
        name: 'Manga',
        item: 'https://manhwanest.fun/latest',
      },
      {
        '@type': 'ListItem',
        position: 3,
        name: manga.title,
        item: `https://manhwanest.fun/manga/${manga.id}`,
      },
      {
        '@type': 'ListItem',
        position: 4,
        name: `Chapter ${chapterId}${chapterTitle ? `: ${chapterTitle}` : ''}`,
        item: url,
      },
    ],
  };

  // Create schema for this chapter
  const chapterSchema = {
    '@context': 'https://schema.org',
    '@type': 'Chapter',
    name: `${manga.title} - Chapter ${chapterId}${chapterTitle ? `: ${chapterTitle}` : ''}`,
    position: parseInt(chapterId, 10),
    url: url,
    image: images.length > 0 ? images[0].img : manga.image,
    isPartOf: {
      '@type': 'Book',
      name: manga.title,
      author: {
        '@type': 'Person',
        name: manga.authors ? manga.authors.join(', ') : 'Unknown',
      },
      url: `https://manhwanest.fun/manga/${manga.id}`,
      genre: manga.genres,
      publisher: {
        '@type': 'Organization',
        name: 'ManhwaNest',
        url: 'https://manhwanest.fun',
      },
    },
    datePublished: manga.updatedOn || currentDate,
    dateModified: currentDate,
    pageStart: 1,
    pageEnd: images.length,
    inLanguage: 'en-US',
    accessMode: 'visual',
    accessibilityFeature: ['highContrastDisplay', 'readingOrder'],
    readBy: {
      '@type': 'Audience',
      audienceType: 'Manga and Manhwa Readers'
    }
  };

  // Create webpage schema for this chapter
  const webPageSchema = {
    '@context': 'https://schema.org',
    '@type': 'WebPage',
    '@id': url,
    url: url,
    name: `${manga.title} Chapter ${chapterId} - Read Online Free`,
    description: `Read ${manga.title} Chapter ${chapterId}${chapterTitle ? `: ${chapterTitle}` : ''} online for free on ManhwaNest. High-quality manga scans, no ads, and fast loading.`,
    isPartOf: {
      '@type': 'WebSite',
      '@id': 'https://manhwanest.fun/#website',
      name: 'ManhwaNest',
      url: 'https://manhwanest.fun',
      description: 'Read manga and manhwa online free'
    },
    primaryImageOfPage: {
      '@type': 'ImageObject',
      url: images.length > 0 ? images[0].img : manga.image
    },
    datePublished: manga.updatedOn || currentDate,
    dateModified: currentDate,
    breadcrumb: {
      '@id': `${url}#breadcrumb`
    }
  };

  return (
    <>
      <Script
        id="chapter-schema"
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(chapterSchema),
        }}
      />
      <Script
        id="breadcrumb-schema"
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(breadcrumbSchema),
        }}
      />
      <Script
        id="webpage-schema"
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(webPageSchema),
        }}
      />
    </>
  );
} 