import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { Metadata } from 'next';
import Header from '@/app/components/Header';
import { getMangaDetailById, DetailedManga } from '@/app/services/api';
import { formatRelativeTime } from '@/app/utils/formatters';
import MangaClientComponents from './MangaClientComponents';
import ChapterSearch from '@/app/components/ChapterSearch';
import MangaSchema from '@/app/components/MangaSchema';
import { generateMangaMetadata } from '@/app/components/SchemaProvider';

interface MangaDetailProps {
  params: Promise<{ id: string }>;
}

// Generate metadata for this page
export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  try {
    const { id } = await params;
    const manga = await getMangaDetailById(id);
    if (!manga) {
      return {
        title: 'Manga Not Found',
        description: 'The manga you are looking for could not be found on ManhwaNest.'
      };
    }
    
    // Use our SEO-optimized metadata generator
    return generateMangaMetadata(manga);
  } catch (error) {
    console.error('Error generating manga metadata:', error);
    return {
      title: 'Manga Details | ManhwaNest',
      description: 'Explore manga details and chapters on ManhwaNest.'
    };
  }
}

export default async function MangaDetail({ params }: MangaDetailProps) {
  // Fix for Next.js 15: await params before accessing its properties
  const { id: mangaId } = await params;
  
  try {
    const manga = await getMangaDetailById(mangaId);
    
    if (!manga) {
      return notFound();
    }
    
    // Sort chapters by newest first
    const sortedChapters = [...manga.chapters].sort((a, b) => {
      return new Date(b.releaseDate).getTime() - new Date(a.releaseDate).getTime();
    });
    
    // Calculate the manga's popularity score for the progress bar (mock data)
    const popularityScore = Math.floor(Math.random() * 41) + 60; // Random number between 60-100
    
    // Generate the current page URL for schema markup
    const pageUrl = `https://manhwanest.fun/manga/${mangaId}`;
    
    return (
      <div className="min-h-screen bg-gray-950 text-white">
        <Header />
        
        {/* Add Schema Markup for SEO */}
        <MangaSchema manga={manga} url={pageUrl} />
        
        <main className="container mx-auto px-4 py-8">
          {/* Status Banner */}
          <div className="mb-4" itemScope itemProp="additionalProperty" itemType="https://schema.org/PropertyValue">
            <meta itemProp="name" content="Status" />
            <meta itemProp="value" content={manga.status} />
            <span className={`text-sm font-medium tracking-wider uppercase ${
              manga.status === 'COMPLETED' ? 'text-green-400' : 
              manga.status === 'ONGOING' ? 'text-blue-400' : 'text-yellow-400'
            }`}>
              {manga.status}
            </span>
          </div>
          
          {/* Manga Header Section - Enhanced Design */}
          <article className="relative overflow-hidden bg-gradient-to-br from-gray-900 to-gray-950 rounded-lg shadow-2xl mb-8 border border-gray-800" itemScope itemType="https://schema.org/Book">
            {/* Structured data hidden elements */}
            <meta itemProp="name" content={manga.title} />
            <meta itemProp="author" content={manga.authors.join(', ')} />
            <meta itemProp="datePublished" content={manga.updatedOn} />
            {manga.genres.map((genre, index) => (
              <meta key={`genre-${index}`} itemProp="genre" content={genre} />
            ))}
            
            {/* Subtle background glow */}
            <div className="absolute inset-0 bg-gradient-to-r from-red-500/5 to-purple-600/5 rounded-lg"></div>
            
            <div className="relative z-10 flex flex-col lg:flex-row">
              {/* Left Column - Cover and Buttons */}
              <div className="p-3 sm:p-4 md:p-6 w-full lg:w-1/4">
                {/* Manga Cover with enhanced shadow and border */}
                <figure className="relative mx-auto lg:mx-0 aspect-[3/4] max-w-[220px] w-full overflow-hidden rounded-lg mb-4 group">
                  <div className="absolute inset-0 bg-gradient-to-r from-red-500/20 to-purple-600/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500 z-10"></div>
                  <div className="absolute inset-0 border-2 border-gray-700 group-hover:border-red-500/30 rounded-lg transition-colors duration-300 z-20"></div>
                  <Image
                    src={manga.image}
                    alt={`${manga.title} manga cover art`}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-110"
                    sizes="(max-width: 640px) 180px, (max-width: 768px) 220px, (max-width: 1024px) 220px, 240px"
                    priority
                    itemProp="image"
                  />
                </figure>
                
                {/* Action Buttons */}
                <div className="flex flex-col sm:flex-row lg:flex-col gap-2 mb-6 lg:mb-0">
                  <Link 
                    href={`/manga/${mangaId}/chapter/${sortedChapters.length > 0 ? sortedChapters[0].id : '1'}`} 
                    className="flex-1 bg-gradient-to-r from-red-600 to-red-700 hover:from-red-500 hover:to-red-600 text-white text-center px-3 py-2.5 sm:py-3 rounded-md font-medium shadow-md shadow-red-700/20 transition-all duration-300 transform hover:-translate-y-0.5"
                    aria-label={`Read first chapter of ${manga.title}`}
                  >
                    READ FIRST CHAPTER
                  </Link>
                  <Link 
                    href={`/manga/${mangaId}/chapter/${sortedChapters.length > 0 ? sortedChapters[sortedChapters.length - 1].id : '1'}`} 
                    className="flex-1 bg-gray-800 hover:bg-gray-700 text-white text-center px-3 py-2.5 sm:py-3 rounded-md font-medium transition-all duration-300 transform hover:-translate-y-0.5"
                    aria-label={`Read latest chapter of ${manga.title}`}
                  >
                    READ LATEST CHAPTER
                  </Link>
                </div>
              </div>
              
              {/* Right Column - Content */}
              <div className="flex-1 p-3 sm:p-4 md:p-6 lg:border-l border-gray-800">
                <div className="flex flex-col">
                  {/* Main Content */}
                  <div>
                    {/* Title with animated gradient hover effect */}
                    <h1 className="text-xl sm:text-2xl md:text-3xl font-bold mb-2 text-white relative group inline-block" itemProp="headline">
                      {manga.title}
                      <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-red-500 to-purple-500 group-hover:w-full transition-all duration-500"></span>
                    </h1>
                    
                    {/* Stats Row */}
                    <div className="flex flex-wrap items-center gap-2 mb-4 text-xs">
                      <div className="flex items-center text-gray-300 bg-gray-800/50 px-2 py-0.5 rounded-full">
                        <span>Manga</span>
                      </div>
                      <div className="flex items-center text-gray-300 bg-gray-800/50 px-2 py-0.5 rounded-full">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 mr-1" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                          <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
                          <path fillRule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clipRule="evenodd" />
                        </svg>
                        <span>{Math.floor(Math.random() * 30) + 10}K views</span>
                      </div>
                      <div className="flex items-center text-gray-300 bg-gray-800/50 px-2 py-0.5 rounded-full" itemProp="aggregateRating" itemScope itemType="https://schema.org/AggregateRating">
                        <meta itemProp="ratingValue" content={manga.rating} />
                        <meta itemProp="bestRating" content="5" />
                        <meta itemProp="ratingCount" content="100" />
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 mr-1 text-yellow-400" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118l-2.8-2.034c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                        </svg>
                        <span>{parseFloat(manga.rating).toFixed(1)}</span>
                      </div>
                      <div className="flex items-center text-gray-300 bg-gray-800/50 px-2 py-0.5 rounded-full">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 mr-1" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
                        </svg>
                        <span>Updated {formatRelativeTime(manga.updatedOn)}</span>
                      </div>
                    </div>

                    {/* New Responsive Layout */}
                    <div className="flex flex-col lg:flex-row gap-4">
                      {/* Left column - Main content */}
                      <div className="w-full lg:w-2/3">
                        {/* Synopsis Section */}
                        <section className="mb-3 bg-gray-900/50 p-3 rounded-lg border border-gray-800">
                          <h2 className="text-sm font-bold mb-1 text-red-400">Synopsis</h2>
                          <p className="text-gray-300 text-xs sm:text-sm" itemProp="description">{manga.description}</p>
                        </section>
                        
                        {/* Genres */}
                        <section className="mb-3">
                          <h2 className="text-sm font-bold mb-1 text-white">Genres</h2>
                          <div className="flex flex-wrap gap-1">
                            {manga.genres.map((genre, index) => (
                              <Link 
                                key={index} 
                                href={`/genre/${genre.toLowerCase()}`}
                                className="bg-gray-800 hover:bg-gray-700 px-2 py-0.5 rounded-full text-xs text-white cursor-pointer transition-colors duration-200 hover:text-red-300 border border-gray-700 hover:border-red-500/30"
                              >
                                {genre}
                              </Link>
                            ))}
                          </div>
                        </section>

                        {/* Client-side components */}
                        <div className="hidden lg:block">
                          <MangaClientComponents 
                            manga={manga} 
                            mangaId={mangaId} 
                            sortedChapters={sortedChapters} 
                            popularityScore={popularityScore} 
                          />
                        </div>
                      </div>
                      
                      {/* Right Sidebar - Information */}
                      <div className="w-full lg:w-1/3">
                        <aside className="rounded-lg bg-gray-900/50 p-3 border border-gray-800">
                          <h2 className="text-sm font-medium mb-2 text-white">Information</h2>
                          
                          <div className="space-y-2 text-sm">
                            <div>
                              <p className="text-gray-400 text-xs mb-0.5">Author:</p>
                              <div className="flex flex-wrap gap-1">
                                {manga.authors.map((author, index) => (
                                  <Link 
                                    key={index} 
                                    href={`/search?query=${encodeURIComponent(author)}`}
                                    className="bg-gray-800 px-2 py-0.5 rounded text-xs text-white hover:bg-gray-700 transition-colors cursor-pointer"
                                  >
                                    {author}
                                  </Link>
                                ))}
                              </div>
                            </div>
                            
                            <div>
                              <p className="text-gray-400 text-xs mb-0.5">Artist:</p>
                              <Link 
                                href={`/search?query=${encodeURIComponent(manga.artist || 'Unknown')}`}
                                className="bg-gray-800 px-2 py-0.5 rounded text-xs text-white inline-block hover:bg-gray-700 transition-colors cursor-pointer"
                              >
                                {manga.artist || 'Unknown'}
                              </Link>
                            </div>
                            
                            <div>
                              <p className="text-gray-400 text-xs mb-0.5">Published:</p>
                              <p className="text-white text-xs">
                                {formatRelativeTime(manga.updatedOn)}
                              </p>
                            </div>

                            {/* Mobile-only actions section */}
                            <div className="lg:hidden mt-4 pt-2 border-t border-gray-800">
                              <MangaClientComponents 
                                manga={manga} 
                                mangaId={mangaId} 
                                sortedChapters={sortedChapters} 
                                popularityScore={popularityScore} 
                              />
                            </div>
                          </div>
                        </aside>
                        
                        {/* Recommended Manga Section */}
                        <section className="mt-4 bg-gray-900/50 rounded-lg border border-gray-800 overflow-hidden">
                          <div className="p-3 border-b border-gray-800">
                            <h2 className="text-sm font-bold text-white">Similar Titles</h2>
                          </div>
                          
                          <div className="p-1.5 space-y-1.5 max-h-[300px] overflow-y-auto">
                            {manga.recommendations && manga.recommendations.map((recommendedManga) => {
                              // Fix the manga ID by removing the "series/" prefix if it exists
                              const mangaId = recommendedManga.id.startsWith('series/') 
                                ? recommendedManga.id.replace('series/', '') 
                                : recommendedManga.id;
                              
                              return (
                                <Link href={`/manga/${mangaId}`} key={recommendedManga.id} className="block">
                                  <div className="flex items-center p-1.5 rounded-md hover:bg-gray-800/70 transition-colors group">
                                    {/* Manga thumbnail */}
                                    <div className="relative h-14 w-10 flex-shrink-0 overflow-hidden rounded">
                                      <Image
                                        src={recommendedManga.image}
                                        alt={`${recommendedManga.title} cover`}
                                        fill
                                        className="object-cover transition-transform duration-500 group-hover:scale-110"
                                        sizes="40px"
                                      />
                                    </div>
                                    
                                    {/* Manga details */}
                                    <div className="ml-2 flex-1">
                                      <h3 className="text-xs font-medium text-white line-clamp-2 group-hover:text-red-400 transition-colors">
                                        {recommendedManga.title}
                                      </h3>
                                      <p className="text-gray-400 text-xs mt-0.5">{recommendedManga.latestChapter}</p>
                                    </div>
                                  </div>
                                </Link>
                              );
                            })}
                          </div>
                        </section>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </article>
          
          {/* Chapter List Section */}
          <section className="mb-8" id="chapter-search-container" data-chapters={JSON.stringify(sortedChapters)} data-manga-id={mangaId}>
            <h2 className="sr-only">Chapters</h2>
            <ChapterSearch chapters={sortedChapters} mangaId={mangaId} />
          </section>
        </main>
      </div>
    );
  } catch (error) {
    console.error("Error fetching manga details:", error);
    return notFound();
  }
} 