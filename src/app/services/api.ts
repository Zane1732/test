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

// Base API URL
const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'https://asura-ten.vercel.app/api';

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

export async function getLatestManga(page: number = 1): Promise<MangaResponse> {
  try {
    const response = await fetchWithTimeout(`${API_BASE_URL}/latest?page=${page}`, { cache: 'no-store' });
    
    if (!response.ok) {
      throw new Error('Failed to fetch manga data');
    }
    
    return await response.json();
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
    const response = await fetchWithTimeout(`${API_BASE_URL}/series?page=${page}`, { cache: 'no-store' });
    
    if (!response.ok) {
      throw new Error('Failed to fetch series data');
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error fetching series:', error);
    return {
      currentPage: page,
      hasNextPage: false,
      results: []
    };
  }
}

export async function getMangaDetailById(id: string): Promise<DetailedManga | null> {
  try {
    const response = await fetchWithTimeout(`${API_BASE_URL}/manga/${id}`, { cache: 'no-store' });
    
    if (!response.ok) {
      throw new Error('Failed to fetch manga details');
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error fetching manga details:', error);
    return null;
  }
}

export async function getMangaById(id: string): Promise<Manga | null> {
  try {
    const response = await fetchWithTimeout(`${API_BASE_URL}/manga/${id}`, { cache: 'no-store' });
    
    if (!response.ok) {
      throw new Error('Failed to fetch manga data');
    }
    
    return await response.json();
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

// Fetch chapter images directly from the correct endpoint
export async function getChapterImages(mangaId: string, chapterId: string): Promise<PageImage[]> {
  try {
    const response = await fetchWithTimeout(
      `${API_BASE_URL}/chapter/${mangaId}/chapter/${chapterId}`,
      { cache: 'no-store' },
      30000 // Increase timeout for image loading
    );
    
    if (!response.ok) {
      throw new Error('Failed to fetch chapter images');
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error fetching chapter images:', error);
    return [];
  }
}

export async function getPopularManga(page: number = 1): Promise<SeriesResponse> {
  try {
    const response = await fetchWithTimeout(`${API_BASE_URL}/popular?page=${page}`, { cache: 'no-store' });
    
    if (!response.ok) {
      throw new Error('Failed to fetch popular manga data');
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error fetching popular manga:', error);
    return {
      currentPage: page,
      hasNextPage: false,
      results: []
    };
  }
} 