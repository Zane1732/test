import Image from 'next/image';
import Link from 'next/link';
import { RecommendedManga } from '../services/api';

interface RecommendationCardProps {
  manga: RecommendedManga;
}

export default function RecommendationCard({ manga }: RecommendationCardProps) {
  // Fix the manga ID by removing the "series/" prefix if it exists
  const mangaId = manga.id.startsWith('series/') ? manga.id.replace('series/', '') : manga.id;
  
  return (
    <Link href={`/manga/${mangaId}`} className="block group">
      <div className="relative h-52 w-full overflow-hidden rounded-lg shadow-lg transition-all duration-300 group-hover:shadow-xl group-hover:translate-y-[-2px] group-hover:scale-[1.02]">
        {/* Cover Image */}
        <div className="absolute inset-0 bg-gray-800">
          <Image
            src={manga.image}
            alt={manga.title}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-110"
            sizes="(max-width: 768px) 50vw, 33vw"
          />
        </div>
        
        {/* Glowing overlay on hover */}
        <div className="absolute inset-0 bg-gradient-to-t from-red-500/50 via-transparent to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-60"></div>
        
        {/* Status badge */}
        {manga.status && (
          <div className="absolute top-2 left-2 z-10">
            <span className="inline-block bg-gradient-to-r from-red-700 to-red-600 text-white text-xs px-2 py-1 rounded-md shadow-md">
              {manga.status}
            </span>
          </div>
        )}
        
        {/* Rating badge */}
        {manga.rating && (
          <div className="absolute top-2 right-2 z-10">
            <span className="inline-flex items-center bg-gray-900/80 text-white text-xs px-2 py-1 rounded-md shadow-md">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 mr-1 text-yellow-400" viewBox="0 0 20 20" fill="currentColor">
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118l-2.8-2.034c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
              </svg>
              {parseFloat(manga.rating).toFixed(1)}
            </span>
          </div>
        )}
        
        {/* Title overlay */}
        <div className="absolute bottom-0 left-0 right-0 p-2 bg-gradient-to-t from-gray-900 to-transparent">
          <h3 className="text-sm font-medium text-white line-clamp-2 group-hover:text-red-200 transition-colors duration-300">
            {manga.title}
          </h3>
        </div>
        
        {/* Latest chapter badge */}
        {manga.latestChapter && (
          <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-red-900/90 to-transparent pt-4 pb-2 px-2 -mb-14 group-hover:mb-0 transition-all duration-300 ease-in-out">
            <span className="text-xs text-white flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 mr-1" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
              </svg>
              {manga.latestChapter}
            </span>
          </div>
        )}
      </div>
    </Link>
  );
} 