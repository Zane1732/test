import Header from '../components/Header';
import SeriesCard from '../components/SeriesCard';
import Pagination from '../components/Pagination';
import { getSeriesManga } from '../services/api';
import { Metadata } from 'next';

// Generate metadata for Popular page
export const metadata: Metadata = {
  title: 'Popular Manga & Manhwa Series | Top-Rated Comics - ManhwaNest',
  description: 'Discover the most popular manga and manhwa series on ManhwaNest. Browse top-rated comics and fan favorites with high-quality scans and free access to all chapters.',
  keywords: [
    'popular manga', 
    'top manhwa series', 
    'best rated manga', 
    'fan favorite comics', 
    'trending manga 2025',
    'popular manhwa titles',
    'most read manga online'
  ],
  alternates: {
    canonical: 'https://manhwanest.fun/popular',
  },
  openGraph: {
    title: 'Popular Manga & Manhwa Series | ManhwaNest',
    description: 'Browse the most popular manga and manhwa series on ManhwaNest. Discover top-rated comics and fan favorites with high-quality scans.',
    url: 'https://manhwanest.fun/popular',
    siteName: 'ManhwaNest',
    type: 'website',
    images: [
      {
        url: 'https://manhwanest.fun/images/popular-manga-og.jpg',
        width: 1200,
        height: 630,
        alt: 'Popular manga and manhwa series on ManhwaNest',
      },
    ],
  },
};

interface PopularPageProps {
  searchParams: Promise<{
    page?: string;
  }>;
}

export default async function PopularPage(props: PopularPageProps) {
  // Await searchParams before accessing properties
  const searchParams = await props.searchParams;
  const currentPage = parseInt(searchParams.page || '1', 10);
  
  // Get series data
  const seriesData = await getSeriesManga(currentPage);
  
  // For demo purposes, sort the results by rating
  const sortedSeries = [...seriesData.results].sort((a, b) => 
    parseFloat(b.rating) - parseFloat(a.rating)
  );
  
  // For demo purposes, we're using totalPages as 10
  const totalPages = 10;
  
  return (
    <div className="min-h-screen bg-gray-950 text-white">
      <Header />
      
      <main className="container mx-auto px-4 py-8">
        <h2 className="text-2xl font-bold mb-6 text-purple-400">All Popular Series</h2>
        
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-5">
          {sortedSeries.map((series) => (
            <SeriesCard 
              key={series.id}
              series={series}
            />
          ))}
        </div>
        
        <Pagination currentPage={currentPage} totalPages={totalPages} basePath="/popular" />
      </main>
    </div>
  );
} 