import Header from './components/Header';
import MangaCard from './components/MangaCard';
import Pagination from './components/Pagination';
import HeroSection from './components/HeroSection';
import { getLatestManga, getPopularManga } from './services/api';

interface HomeProps {
  searchParams: Promise<{
    page?: string;
  }>;
}

export default async function Home(props: HomeProps) {
  // Await searchParams before accessing properties
  const searchParams = await props.searchParams;
  const currentPage = parseInt(searchParams.page || '1', 10);
  
  // Get manga data
  const mangaData = await getLatestManga(currentPage);
  
  // Get popular manga for hero section
  const popularMangaData = await getPopularManga(1);
  
  // For demo purposes, we're using totalPages as 10
  const totalPages = 10;
  
  return (
    <div className="min-h-screen bg-gray-950 text-white">
      <Header />
      
      {/* Hero Section */}
      <HeroSection popularManga={popularMangaData.results} />
      
      <main className="container mx-auto px-4 py-8">
        <h2 className="text-2xl font-bold mb-6 text-red-400">All Manga</h2>
        
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-5">
          {mangaData.results.map((manga) => (
            <MangaCard 
              key={manga.id}
              manga={manga}
            />
          ))}
        </div>
        
        <Pagination currentPage={currentPage} totalPages={totalPages} basePath="/" />
      </main>
    </div>
  );
}
