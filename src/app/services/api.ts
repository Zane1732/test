export interface Chapter {
  id: string;
  title: string;
  releaseDate: string;
}

export interface Manga {
  id: string;
  title: string;
  image: string;
  status: string;
  latestChapter: string;
  chapters: Chapter[];
  rating: string;
}

export interface MangaResponse {
  currentPage: number;
  hasNextPage: boolean;
  results: Manga[];
}

export interface SeriesManga {
  id: string;
  title: string;
  image: string;
  status: string;
  latestChapter: string;
  rating: string;
}

export interface SeriesResponse {
  currentPage: number;
  hasNextPage: boolean;
  results: SeriesManga[];
}

export interface RecommendedManga {
  id: string;
  title: string;
  image: string;
  latestChapter: string;
  status: string;
  rating: string;
}

export interface DetailedManga {
  id: string;
  title: string;
  image: string;
  rating: string;
  status: string;
  description: string;
  authors: string[];
  artist: string;
  updatedOn: string;
  genres: string[];
  recommendations: RecommendedManga[];
  chapters: {
    id: number;
    title: string | null;
    releaseDate: string;
  }[];
}

// MangaFire API Response Types
export interface MangaFireManga {
  id: string;
  status: string;
  name: string;
  description: string;
  currentChapter: string;
  genres: string[];
  poster: string;
}

export interface MangaFireRankedManga {
  id: string;
  name: string;
  rank: string;
  poster: string;
}

export interface MangaFireRecentManga {
  id: string;
  name: string | null;
  poster: string;
  type: string;
  latestChapters: {
    chapterName: string;
    releaseTime: string;
  }[];
}

export interface MangaFireNewRelease {
  id: string;
  name: string;
  poster: string;
}

export interface MangaFireHomeResponse {
  releasingManga: MangaFireManga[];
  mostViewedManga: {
    day: MangaFireRankedManga[];
    week: MangaFireRankedManga[];
    month: MangaFireRankedManga[];
  };
  recentlyUpdatedManga: MangaFireRecentManga[];
  newReleaseManga: MangaFireNewRelease[];
}

// Base API URL
const API_BASE_URL = 'https://mangafire-api-pi.vercel.app/api';

// Custom fetch with timeout to prevent hanging requests
async function fetchWithTimeout(url: string, options: RequestInit = {}, timeout = 15000) {
  const controller = new AbortController();
  const id = setTimeout(() => controller.abort(), timeout);
  
  try {
    const response = await fetch(url, {
      ...options,
      signal: controller.signal
    });
    clearTimeout(id);
    return response;
  } catch (error) {
    clearTimeout(id);
    throw error;
  }
}

// Helper function to extract manga ID from MangaFire URL format
function extractMangaId(mangaFireId: string): string {
  // Remove "/manga/" prefix and extract clean ID
  return mangaFireId.replace('/manga/', '').split('.')[0];
}

// Helper function to convert MangaFire manga to our format
function convertMangaFireToManga(mangaFireManga: MangaFireManga): Manga {
  return {
    id: extractMangaId(mangaFireManga.id),
    title: mangaFireManga.name,
    image: mangaFireManga.poster,
    status: mangaFireManga.status,
    latestChapter: mangaFireManga.currentChapter,
    rating: '4.5', // Default rating since MangaFire doesn't provide this
    chapters: [] // Will be populated when needed
  };
}

// Helper function to convert MangaFire ranked manga to our series format
function convertRankedToSeries(rankedManga: MangaFireRankedManga): SeriesManga {
  return {
    id: extractMangaId(rankedManga.id),
    title: rankedManga.name,
    image: rankedManga.poster,
    status: 'Releasing', // Default status
    latestChapter: 'Latest Chapter',
    rating: (5 - (parseInt(rankedManga.rank) - 1) * 0.1).toFixed(1) // Generate rating based on rank
  };
}

// Helper function to convert recent manga to our format
function convertRecentToManga(recentManga: MangaFireRecentManga): Manga {
  const latestChapter = recentManga.latestChapters[0];
  return {
    id: extractMangaId(recentManga.id),
    title: recentManga.name || 'Unknown Title',
    image: recentManga.poster,
    status: 'Releasing',
    latestChapter: latestChapter?.chapterName || 'Latest Chapter',
    rating: '4.0',
    chapters: recentManga.latestChapters.map((chapter, index) => ({
      id: `${index + 1}`,
      title: chapter.chapterName,
      releaseDate: chapter.releaseTime
    }))
  };
}

export async function getLatestManga(page: number = 1): Promise<MangaResponse> {
  try {
    const response = await fetchWithTimeout(`${API_BASE_URL}/home`, { cache: 'no-store' });
    
    if (!response.ok) {
      throw new Error('Failed to fetch manga data');
    }
    
    const data: MangaFireHomeResponse = await response.json();
    
    // Convert recently updated manga to our format
    const results = data.recentlyUpdatedManga.map(convertRecentToManga);
    
    return {
      currentPage: page,
      hasNextPage: page < 5, // Assume 5 pages for pagination
      results: results
    };
  } catch (error) {
    console.error('Error fetching manga:', error);
    return {
      currentPage: page,
      hasNextPage: false,
      results: []
    };
  }
}

export async function getSeriesManga(page: number = 1): Promise<SeriesResponse> {
  try {
    const response = await fetchWithTimeout(`${API_BASE_URL}/home`, { cache: 'no-store' });
    
    if (!response.ok) {
      throw new Error('Failed to fetch series data');
    }
    
    const data: MangaFireHomeResponse = await response.json();
    
    // Convert releasing manga to our series format
    const results = data.releasingManga.map(manga => ({
      id: extractMangaId(manga.id),
      title: manga.name,
      image: manga.poster,
      status: manga.status,
      latestChapter: manga.currentChapter,
      rating: '4.5' // Default rating
    }));
    
    return {
      currentPage: page,
      hasNextPage: page < 5,
      results: results
    };
  } catch (error) {
    console.error('Error fetching series:', error);
    return {
      currentPage: page,
      hasNextPage: false,
      results: []
    };
  }
}

export async function getPopularManga(page: number = 1): Promise<SeriesResponse> {
  try {
    const response = await fetchWithTimeout(`${API_BASE_URL}/home`, { cache: 'no-store' });
    
    if (!response.ok) {
      throw new Error('Failed to fetch popular manga data');
    }
    
    const data: MangaFireHomeResponse = await response.json();
    
    // Use most viewed manga from the week
    const results = data.mostViewedManga.week.map(convertRankedToSeries);
    
    return {
      currentPage: page,
      hasNextPage: page < 5,
      results: results
    };
  } catch (error) {
    console.error('Error fetching popular manga:', error);
    return {
      currentPage: page,
      hasNextPage: false,
      results: []
    };
  }
}

export async function getMangaDetailById(id: string): Promise<DetailedManga | null> {
  try {
    // For now, we'll use the home API and find the manga by ID
    // In a real implementation, you'd have a dedicated manga detail endpoint
    const response = await fetchWithTimeout(`${API_BASE_URL}/home`, { cache: 'no-store' });
    
    if (!response.ok) {
      throw new Error('Failed to fetch manga details');
    }
    
    const data: MangaFireHomeResponse = await response.json();
    
    // Search for the manga in all available data
    let foundManga: MangaFireManga | null = null;
    
    // Check releasing manga
    foundManga = data.releasingManga.find(manga => extractMangaId(manga.id) === id) || null;
    
    if (!foundManga) {
      // If not found in releasing, create a mock detailed manga
      // In a real implementation, you'd call a specific manga detail endpoint
      return null;
    }
    
    // Convert to detailed manga format
    const detailedManga: DetailedManga = {
      id: extractMangaId(foundManga.id),
      title: foundManga.name,
      image: foundManga.poster,
      rating: '4.5',
      status: foundManga.status,
      description: foundManga.description,
      authors: ['Unknown Author'], // MangaFire doesn't provide author info in home endpoint
      artist: 'Unknown Artist',
      updatedOn: new Date().toISOString(),
      genres: foundManga.genres,
      recommendations: data.releasingManga.slice(0, 6).map(manga => ({
        id: extractMangaId(manga.id),
        title: manga.name,
        image: manga.poster,
        latestChapter: manga.currentChapter,
        status: manga.status,
        rating: '4.5'
      })),
      chapters: Array.from({ length: 50 }, (_, i) => ({
        id: i + 1,
        title: `Chapter ${i + 1}`,
        releaseDate: new Date(Date.now() - i * 24 * 60 * 60 * 1000).toISOString()
      })).reverse()
    };
    
    return detailedManga;
  } catch (error) {
    console.error('Error fetching manga details:', error);
    return null;
  }
}

export async function getMangaById(id: string): Promise<Manga | null> {
  try {
    const detailedManga = await getMangaDetailById(id);
    if (!detailedManga) return null;
    
    return {
      id: detailedManga.id,
      title: detailedManga.title,
      image: detailedManga.image,
      status: detailedManga.status,
      latestChapter: detailedManga.chapters[0]?.title || 'Latest Chapter',
      rating: detailedManga.rating,
      chapters: detailedManga.chapters.map(ch => ({
        id: ch.id.toString(),
        title: ch.title || '',
        releaseDate: ch.releaseDate
      }))
    };
  } catch (error) {
    console.error('Error fetching manga details:', error);
    return null;
  }
}

// Define the interface for the page images from the API
export interface PageImage {
  page: number;
  img: string;
}

// Fetch chapter images - Mock implementation since MangaFire API structure isn't clear for chapters
export async function getChapterImages(mangaId: string, chapterId: string): Promise<PageImage[]> {
  try {
    // This is a mock implementation
    // In a real scenario, you'd call the MangaFire chapter endpoint
    // For now, return mock images
    const mockImages: PageImage[] = Array.from({ length: 20 }, (_, i) => ({
      page: i + 1,
      img: `https://via.placeholder.com/800x1200/333/fff?text=Page+${i + 1}`
    }));
    
    return mockImages;
  } catch (error) {
    console.error('Error fetching chapter images:', error);
    return [];
  }
}