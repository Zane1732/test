import React from 'react';
import Header from '../components/Header';
import SeriesCard from '../components/SeriesCard';
import Pagination from '../components/Pagination';
import { SeriesManga } from '../services/api';
import { Metadata } from 'next';

// Define proper type for searchParams as a Promise
type MetadataProps = {
  searchParams: Promise<{ query?: string; }>;
};

// Generate metadata for search page - handles both with and without query
export async function generateMetadata({ searchParams }: MetadataProps): Promise<Metadata> {
  // Await the searchParams Promise before accessing its properties
  const resolvedSearchParams = await searchParams;
  
  // If no query is provided, return static metadata for search page
  if (!resolvedSearchParams.query) {
    return {
      title: 'Search Manga & Manhwa | Find Comics to Read - ManhwaNest',
      description: 'Search for manga and manhwa on ManhwaNest. Find your favorite series, authors, and genres with our advanced search. Read high-quality scans for free.',
      keywords: [
        'search manga', 
        'find manhwa', 
        'manga search engine', 
        'manhwa database', 
        'find comics to read',
        'manga by genre',
        'search by author'
      ],
      alternates: {
        canonical: 'https://manhwanest.fun/search',
      },
      openGraph: {
        title: 'Search Manga & Manhwa | ManhwaNest',
        description: 'Find your favorite manga and manhwa on ManhwaNest. Search by title, author, or genre and read online for free.',
        url: 'https://manhwanest.fun/search',
        siteName: 'ManhwaNest',
        type: 'website',
      },
    };
  }
  
  // With query - return dynamic metadata for search results
  const query = resolvedSearchParams.query;
  return {
    title: `${query} - Manga Search Results | ManhwaNest`,
    description: `Search results for "${query}" manga and manhwa on ManhwaNest. Find and read free chapters of series matching "${query}".`,
    robots: {
      index: false,  // Don't index search result pages
      follow: true,
    },
    alternates: {
      canonical: `https://manhwanest.fun/search?query=${encodeURIComponent(query)}`,
    },
  };
}

interface SearchPageProps {
  searchParams: Promise<{
    query?: string;
    page?: string;
  }>;
}

interface SearchResponse {
  currentPage: number;
  hasNextPage: boolean;
  results: SeriesManga[];
}

export default async function SearchPage(props: SearchPageProps) {
  // Await searchParams before accessing properties
  const searchParams = await props.searchParams;
  const query = searchParams.query || '';
  const currentPage = parseInt(searchParams.page || '1', 10);
  
  // Empty state for no query
  if (!query) {
    return (
      <div className="min-h-screen bg-gray-950 text-white">
        <Header />
        
        <main className="container mx-auto px-4 py-8">
          <div className="max-w-2xl mx-auto text-center">
            <h1 className="text-3xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-red-400 to-purple-400">Search Manga</h1>
            
            <div className="bg-gradient-to-br from-gray-900 to-gray-950 p-8 rounded-xl shadow-lg border border-gray-800">
              <p className="text-gray-400 mb-6">
                Enter a search term in the header to find your favorite manga.
              </p>
              
              <form action="/search" method="get" className="relative max-w-md mx-auto">
                <input
                  type="text"
                  name="query"
                  placeholder="Search manga..."
                  className="w-full bg-gray-800/70 text-white placeholder-gray-400 border-0 rounded-full pl-10 pr-4 py-3 focus:outline-none focus:ring-2 focus:ring-red-500/50 focus:bg-gray-800 transition-all duration-300"
                  autoFocus
                />
                <div className="absolute left-3 top-3 text-gray-400">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </div>
                <button type="submit" className="absolute right-3 top-3 text-red-400 hover:text-red-500 transition-colors" title="Search">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 9l3 3m0 0l-3 3m3-3H8m13 0a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span className="sr-only">Search</span>
                </button>
              </form>
            </div>
          </div>
        </main>
      </div>
    );
  }
  
  // Fetch search results
  let searchResults: SearchResponse = {
    currentPage: 1,
    hasNextPage: false,
    results: []
  };
  
  try {
    const response = await fetch(`https://asura-ten.vercel.app/api/search?query=${encodeURIComponent(query)}&page=${currentPage}`, { cache: 'no-store' });
    
    if (!response.ok) {
      throw new Error('Failed to fetch search results');
    }
    
    searchResults = await response.json();
  } catch (error) {
    console.error('Error fetching search results:', error);
  }
  
  return (
    <div className="min-h-screen bg-gray-950 text-white">
      <Header />
      
      <main className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-2xl sm:text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-red-400 to-purple-400">
            Search Results: "{query}"
          </h1>
          <div className="text-sm text-gray-400">
            {searchResults.results.length} manga found
          </div>
        </div>
        
        {searchResults.results.length > 0 ? (
          <>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-5">
              {searchResults.results.map((manga) => (
                <SeriesCard 
                  key={manga.id}
                  series={manga}
                />
              ))}
            </div>
            
            {searchResults.hasNextPage && (
              <Pagination 
                currentPage={currentPage} 
                totalPages={Math.ceil(searchResults.results.length / 10) + currentPage} 
                basePath={`/search?query=${encodeURIComponent(query)}`} 
              />
            )}
          </>
        ) : (
          <div className="bg-gradient-to-br from-gray-900 to-gray-950 p-8 rounded-xl shadow-lg border border-gray-800 text-center">
            <svg className="w-16 h-16 text-gray-600 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <h2 className="text-xl font-bold text-white mb-2">No Results Found</h2>
            <p className="text-gray-400 mb-6">
              We couldn't find any manga matching "{query}". Try a different search term.
            </p>
          </div>
        )}
      </main>
    </div>
  );
} 