import { Metadata } from 'next';
import { DetailedManga } from '@/app/services/api';

/**
 * Generate Open Graph metadata for a manga detail page
 */
export function generateMangaMetadata(manga: DetailedManga): Metadata {
  // Optimize title with keywords and proper format
  const title = `Read ${manga.title} Manga Online Free | ManhwaNest`;
  
  // Create an SEO-optimized description with a call to action
  const description = 
    manga.description && manga.description.length > 140
      ? `${manga.description.substring(0, 137)}... Read ${manga.title} manga online free on ManhwaNest. High-quality scans updated regularly!`
      : `Read ${manga.title} manga online free on ManhwaNest. ${manga.description || 'Enjoy high-quality scans and the latest chapters updated regularly. No ads, no registration required.'}`;

  // Primary and secondary keywords
  const primaryKeywords = [
    `read ${manga.title} online`,
    `${manga.title} manga free`,
    `${manga.title} latest chapters`,
    manga.status?.toLowerCase() === 'completed' ? `${manga.title} complete manga` : `${manga.title} ongoing manga`,
  ];
  
  const secondaryKeywords = [
    'read manga online free',
    'best manhwa website',
    'high quality manga scans',
    'no ads manga site',
    ...manga.genres.map(genre => `${genre.toLowerCase()} manga`),
  ];

  return {
    title: title,
    description: description,
    keywords: [
      manga.title,
      ...primaryKeywords,
      ...manga.genres,
      ...secondaryKeywords,
    ],
    authors: [{ name: manga.authors?.join(', ') || 'Unknown' }],
    openGraph: {
      title: title,
      description: description,
      type: 'article',
      url: `https://manhwanest.fun/manga/${manga.id}`,
      images: [
        {
          url: manga.image,
          width: 800,
          height: 1200,
          alt: `${manga.title} manga cover art - Read online on ManhwaNest`,
        },
      ],
      siteName: 'ManhwaNest',
      publishedTime: manga.updatedOn,
      modifiedTime: manga.updatedOn,
      section: manga.genres[0] || 'Manga',
      tags: manga.genres,
    },
    twitter: {
      card: 'summary_large_image',
      title: title,
      description: description,
      images: [manga.image],
      creator: '@ManhwaNest',
    },
    alternates: {
      canonical: `https://manhwanest.fun/manga/${manga.id}`,
    },
  };
}

/**
 * Generate Open Graph metadata for a chapter page
 */
export function generateChapterMetadata(manga: DetailedManga, chapterId: string, chapterTitle?: string): Metadata {
  // Optimize title with keywords and proper format
  const title = chapterTitle 
    ? `${manga.title} Chapter ${chapterId}: ${chapterTitle} - Read Online Free | ManhwaNest` 
    : `${manga.title} Chapter ${chapterId} - Read Online Free | ManhwaNest`;
  
  // Create an SEO-optimized description with a call to action
  const description = `Read ${manga.title} Chapter ${chapterId}${chapterTitle ? `: ${chapterTitle}` : ''} online for free on ManhwaNest. High-quality manga scans, no ads, fast loading. Continue the story now!`;

  // Chapter-specific keywords
  const chapterKeywords = [
    `${manga.title} chapter ${chapterId}`,
    `read ${manga.title} chapter ${chapterId} online`,
    `${manga.title} chapter ${chapterId} free`,
    `${manga.title} manga chapter ${chapterId}`,
    chapterTitle ? `${manga.title} ${chapterTitle}` : '',
    `latest ${manga.title} chapters`,
  ].filter(Boolean);

  return {
    title: title,
    description: description,
    keywords: [
      manga.title,
      `chapter ${chapterId}`,
      chapterTitle || '',
      ...chapterKeywords,
      'read manga chapter online free',
      'high quality manga scans',
      'latest manga updates'
    ].filter(Boolean),
    openGraph: {
      title: title,
      description: description,
      type: 'article',
      url: `https://manhwanest.fun/manga/${manga.id}/chapter/${chapterId}`,
      images: [
        {
          url: manga.image,
          width: 800,
          height: 1200,
          alt: `${manga.title} Chapter ${chapterId} - Read on ManhwaNest`,
        },
      ],
      siteName: 'ManhwaNest',
      publishedTime: manga.updatedOn,
      modifiedTime: manga.updatedOn,
      section: 'Manga Chapter',
      tags: [...manga.genres, 'manga chapter', 'manhwa chapter'],
    },
    twitter: {
      card: 'summary_large_image',
      title: title,
      description: description,
      images: [manga.image],
      creator: '@ManhwaNest',
    },
    alternates: {
      canonical: `https://manhwanest.fun/manga/${manga.id}/chapter/${chapterId}`,
    },
  };
} 