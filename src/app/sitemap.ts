import { MetadataRoute } from 'next';
import { getLatestManga, getPopularManga, getSeriesManga } from './services/api';

// Sitemap generation for better SEO
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = 'https://manhwanest.fun';
  const currentDate = new Date().toISOString();
  
  // Define static pages
  const staticPages = [
    {
      url: baseUrl,
      lastModified: currentDate,
      changeFrequency: 'daily' as const,
      priority: 1.0,
    },
    {
      url: `${baseUrl}/search`,
      lastModified: currentDate,
      changeFrequency: 'weekly' as const,
      priority: 0.8,
    },
    {
      url: `${baseUrl}/latest`,
      lastModified: currentDate,
      changeFrequency: 'daily' as const,
      priority: 0.9,
    },
    {
      url: `${baseUrl}/popular`,
      lastModified: currentDate,
      changeFrequency: 'daily' as const,
      priority: 0.9,
    },
    {
      url: `${baseUrl}/bookmarks`,
      lastModified: currentDate,
      changeFrequency: 'weekly' as const,
      priority: 0.7,
    },
  ];

  // Add genre pages
  const genres = [
    'action', 'adventure', 'comedy', 'drama', 'fantasy', 'horror', 
    'romance', 'sci-fi', 'slice-of-life', 'sports', 'mystery', 'supernatural'
  ];
  
  const genrePages = genres.map(genre => ({
    url: `${baseUrl}/search?query=${genre}`,
    lastModified: currentDate,
    changeFrequency: 'weekly' as const,
    priority: 0.7,
  }));

  // Fetch manga data
  try {
    // Fetch popular and latest manga
    const popularMangaResponse = await getPopularManga();
    const latestMangaResponse = await getLatestManga();
    const seriesMangaResponse = await getSeriesManga();
    
    // Extract results arrays
    const popularManga = popularMangaResponse.results || [];
    const latestManga = latestMangaResponse.results || [];
    const seriesManga = seriesMangaResponse.results || [];
    
    // Combine all manga and remove duplicates
    const allManga = [...popularManga, ...latestManga, ...seriesManga];
    const uniqueMangaMap = new Map();
    
    allManga.forEach(manga => {
      if (!uniqueMangaMap.has(manga.id)) {
        uniqueMangaMap.set(manga.id, manga);
      }
    });
    
    const uniqueManga = Array.from(uniqueMangaMap.values());
    
    // Map manga to sitemap entries
    const mangaPages = uniqueManga.map(manga => ({
      url: `${baseUrl}/manga/${manga.id}`,
      lastModified: manga.updatedAt || currentDate,
      changeFrequency: 'weekly' as const,
      priority: 0.8,
      // Optional: Add image data for Google Image sitemap
      images: manga.coverImage ? [
        manga.coverImage
      ] : undefined,
    }));
    
    // Combine all pages for the sitemap
    return [...staticPages, ...genrePages, ...mangaPages];
    
  } catch (error) {
    console.error('Error generating sitemap:', error);
    // Return just static pages if there's an error fetching manga
    return [...staticPages, ...genrePages];
  }
} 
