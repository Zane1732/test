import Image from 'next/image';
import Link from 'next/link';
import { SeriesManga } from '../services/api';

interface SeriesCardProps {
  series: SeriesManga;
}

export default function SeriesCard({ series }: SeriesCardProps) {
  // Fix the manga ID by removing the "series/" prefix if it exists
  const mangaId = series.id.startsWith('series/') ? series.id.replace('series/', '') : series.id;
  
  return (
    <Link 
      href={`/manga/${mangaId}`}
      className="group flex flex-col bg-gradient-to-br from-gray-900 to-gray-950 rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 border border-gray-800 hover:border-red-500/30 hover:shadow-red-500/10 relative"
    >
      {/* Glowing overlay on hover */}
      <div className="absolute inset-0 bg-gradient-to-r from-red-500/0 to-purple-600/0 opacity-0 group-hover:opacity-10 transition-opacity duration-300 rounded-lg"></div>
      
      {/* Manga Cover with hover effect - Portrait aspect ratio */}
      <div className="relative w-full flex-shrink-0 transition-transform duration-300 group-hover:scale-[1.02] overflow-hidden" style={{ paddingTop: '140%' }}>
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent opacity-60 group-hover:opacity-40 transition-opacity duration-300 z-10"></div>
        
        <Image
          src={series.image}
          alt={series.title}
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          className="object-cover transition-transform duration-500 group-hover:scale-110"
          priority
          unoptimized={true}
        />
        
        {/* Status badge - Hide if Unknown */}
        {series.status && series.status !== 'Unknown' && (
          <div className="absolute top-2 left-2 z-20">
            <span className="text-xs font-medium bg-red-600/90 text-white px-2 py-0.5 rounded-sm shadow-md shadow-red-900/50">
              {series.status}
            </span>
          </div>
        )}
        
        {/* Rating badge */}
        <div className="absolute top-2 right-2 z-20">
          <div className="flex items-center bg-gray-900/80 px-2 py-0.5 rounded-sm shadow-md">
            <svg className="w-3 h-3 text-yellow-400 mr-1" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path>
            </svg>
            <span className="text-xs font-medium text-white">{series.rating}</span>
          </div>
        </div>
        
        {/* Manga title overlay on the image */}
        <div className="absolute bottom-0 left-0 right-0 p-3 bg-gradient-to-t from-black/90 via-black/70 to-transparent z-20">
          <h2 className="font-bold text-base text-white line-clamp-2 group-hover:text-red-400 transition-colors duration-300">
            {series.title}
          </h2>
        </div>
      </div>
      
      {/* Latest chapter badge at the bottom */}
      <div className="p-3 flex justify-center">
        <span className="text-xs font-medium bg-gradient-to-r from-red-700 to-red-600 text-white px-2.5 py-1 rounded-full shadow-sm group-hover:shadow-red-700/50 transition-all duration-300 group-hover:from-red-600 group-hover:to-red-500">
          {series.latestChapter}
        </span>
      </div>
    </Link>
  );
} 