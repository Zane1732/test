'use client';

import Script from 'next/script';
import { DetailedManga } from '../services/api';

type MangaSchemaProps = {
  manga: DetailedManga;
  url: string;
};

export default function MangaSchema({ manga, url }: MangaSchemaProps) {
  // Convert genres to schema-appropriate keywords
  const keywords = manga.genres ? manga.genres.join(',') : '';
  
  // Format author names
  const authors = manga.authors ? manga.authors.join(', ') : '';
  
  // Get the main manga image
  const image = manga.image || '';
  
  // Get current date
  const currentDate = new Date().toISOString();
  
  // Create a schema for this manga using Book type for better relevance
  const mangaSchema = {
    '@context': 'https://schema.org',
    '@type': 'Book',
    name: manga.title,
    headline: `Read ${manga.title} Online Free`,
    image: image,
    author: {
      '@type': 'Person',
      name: authors || 'Unknown',
    },
    publisher: {
      '@type': 'Organization',
      name: 'ManhwaNest',
      logo: {
        '@type': 'ImageObject',
        url: 'https://manhwanest.fun/logo.png',
      },
      url: 'https://manhwanest.fun',
    },
    description: manga.description || `Read ${manga.title} on ManhwaNest`,
    keywords: keywords,
    datePublished: manga.updatedOn || currentDate,
    dateModified: manga.updatedOn || currentDate,
    inLanguage: 'en-US',
    genre: manga.genres,
    bookFormat: 'GraphicNovel',
    potentialAction: {
      '@type': 'ReadAction',
      target: {
        '@type': 'EntryPoint',
        urlTemplate: url
      }
    },
    // Manga/Manhwa specific properties
    numberOfPages: manga.chapters?.length || 1,
    readBy: {
      '@type': 'Audience',
      audienceType: 'Manga and Manhwa Readers'
    },
    // Add additional properties to improve rich results
    aggregateRating: manga.rating ? {
      '@type': 'AggregateRating',
      ratingValue: manga.rating,
      bestRating: '5',
      ratingCount: '100',
    } : undefined,
    isPartOf: manga.status === 'Ongoing' ? {
      '@type': 'Series',
      name: `${manga.title} Series`,
      url: url
    } : undefined
  };

  // Create a breadcrumb schema for navigation
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
        name: manga.genres?.[0] || 'Manga',
        item: `https://manhwanest.fun/search?query=${manga.genres?.[0] || 'manga'}`,
      },
      {
        '@type': 'ListItem',
        position: 3,
        name: manga.title,
        item: url,
      },
    ],
  };

  // Create a WebPage schema for additional SEO benefits
  const webPageSchema = {
    '@context': 'https://schema.org',
    '@type': 'WebPage',
    '@id': url,
    url: url,
    name: `Read ${manga.title} Manga Online Free`,
    description: manga.description || `Read ${manga.title} manga online for free on ManhwaNest`,
    isPartOf: {
      '@type': 'WebSite',
      '@id': 'https://manhwanest.fun/#website',
      name: 'ManhwaNest',
      url: 'https://manhwanest.fun',
      description: 'Read manga and manhwa online free'
    },
    primaryImageOfPage: {
      '@type': 'ImageObject',
      url: manga.image
    },
    datePublished: manga.updatedOn || currentDate,
    dateModified: manga.updatedOn || currentDate,
    breadcrumb: {
      '@id': `${url}#breadcrumb`
    }
  };

  return (
    <>
      <Script
        id="manga-schema"
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(mangaSchema),
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