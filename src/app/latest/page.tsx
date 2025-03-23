import Header from '../components/Header';
import SeriesCard from '../components/SeriesCard';
import Pagination from '../components/Pagination';
import { getSeriesManga } from '../services/api';
import { Metadata } from 'next';

// Generate metadata for Latest Updates page
export const metadata: Metadata = {
  title: 'Latest Manga & Manhwa Updates | Read New Releases - ManhwaNest',
  description: 'Discover the latest manga and manhwa updates on ManhwaNest. Read new releases and chapters of your favorite series with high-quality scans, zero ads, and free access.',
  keywords: [
    'latest manga updates', 
    'new manhwa releases', 
    'recent manga chapters', 
    'updated manhwa series', 
    'newest manga online',
    'free manga updates',
    'read latest chapters'
  ],
  alternates: {
    canonical: 'https://manhwanest.fun/latest',
  },
  openGraph: {
    title: 'Latest Manga & Manhwa Updates | ManhwaNest',
    description: 'Discover and read the latest manga and manhwa updates on ManhwaNest. New releases added daily with high-quality scans.',
    url: 'https://manhwanest.fun/latest',
    siteName: 'ManhwaNest',
    type: 'website',
    images: [
      {
        url: 'https://manhwanest.fun/images/latest-updates-og.jpg',
        width: 1200,
        height: 630,
        alt: 'Latest manga and manhwa updates on ManhwaNest',
      },
    ],
  },
};

interface LatestPageProps {
  searchParams: Promise<{
    page?: string;
  }>;
}

export default async function LatestPage(props: LatestPageProps) {
  // Await searchParams before accessing properties
  const searchParams = await props.searchParams;
  const currentPage = parseInt(searchParams.page || '1', 10);
  
  // Get series data
  const seriesData = await getSeriesManga(currentPage);
  
  // For demo purposes, we're using totalPages as 10
  const totalPages = 10;
  
  return (
    <div className="min-h-screen bg-gray-950 text-white">
      <Header />
      
      <main className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8 text-center bg-clip-text text-transparent bg-gradient-to-r from-red-400 to-purple-400">Latest Series Updates</h1>
        
        {/* Series grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-5">
          {seriesData.results.map((series) => (
            <SeriesCard 
              key={series.id}
              series={series}
            />
          ))}
        </div>
        
        <Pagination currentPage={currentPage} totalPages={totalPages} basePath="/latest" />
      </main>
    </div>
  );
} 