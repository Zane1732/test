'use client';

import Image from 'next/image';
import Link from 'next/link';
import { Manga } from '../services/api';

interface MangaCardProps {
  manga: Manga;
}

export default function MangaCard({ manga }: MangaCardProps) {
  // Take only the first 3 chapters to display
  const displayedChapters = manga.chapters.slice(0, 3);
  
  // Fix the manga ID by removing the "series/" prefix if it exists
  const mangaId = manga.id.startsWith('series/') ? manga.id.replace('series/', '') : manga.id;
  
  return (
    <div className="group flex flex-col bg-gradient-to-br from-gray-900 to-gray-950 rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 border border-gray-800 hover:border-red-500/30 hover:shadow-red-500/10 relative">
      {/* Glowing overlay on hover */}
      <div className="absolute inset-0 bg-gradient-to-r from-red-500/0 to-purple-600/0 opacity-0 group-hover:opacity-10 transition-opacity duration-300 rounded-lg"></div>
      
      {/* Manga Cover with hover effect - Portrait aspect ratio */}
      <Link href={`/manga/${mangaId}`} className="block">
        <div className="relative w-full flex-shrink-0 transition-transform duration-300 group-hover:scale-[1.02] overflow-hidden" style={{ paddingTop: '140%' }}>
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent opacity-60 group-hover:opacity-40 transition-opacity duration-300 z-10"></div>
          
          <Image
            src={manga.image}
            alt={manga.title}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            className="object-cover transition-transform duration-500 group-hover:scale-110"
            priority
            unoptimized={true}
          />
          
          {/* Status badge - Hide if Unknown */}
          {manga.status && manga.status !== 'Unknown' && (
            <div className="absolute top-2 left-2 z-20">
              <span className="text-xs font-medium bg-red-600/90 text-white px-2 py-0.5 rounded-sm shadow-md shadow-red-900/50">
                {manga.status}
              </span>
            </div>
          )}
          
          {/* Manga title overlay on the image */}
          <div className="absolute bottom-0 left-0 right-0 p-3 bg-gradient-to-t from-black/90 via-black/70 to-transparent z-20">
            <h2 className="font-bold text-base text-white line-clamp-2 group-hover:text-red-400 transition-colors duration-300">
              {manga.title}
            </h2>
          </div>
        </div>
      </Link>
      
      {/* Chapters List - Made smaller */}
      <div className="p-2 space-y-1">
        {displayedChapters.map((chapter, index) => (
          <Link 
            key={chapter.id}
            href={`/manga/${mangaId}/chapter/${chapter.id}`} 
            className="flex items-center bg-gray-800/60 hover:bg-gray-800 p-1 px-2 rounded text-xs transition-all duration-300 border-l-2 border-red-500/80 group-hover:translate-x-1 block"
            style={{ transitionDelay: `${index * 50}ms` }}
          >
            <div className="w-1.5 h-1.5 bg-red-500 rounded-full mr-1.5 group-hover:animate-pulse"></div>
            <div className="flex flex-col xs:flex-row xs:items-center flex-1">
              <span className="font-medium text-red-400 whitespace-nowrap">Chapter {chapter.id}</span>
              <span className="text-gray-400 text-xs xs:ml-1">{chapter.releaseDate}</span>
            </div>
          </Link>
        ))}
        
        {/* Latest chapter badge at the bottom */}
        <div className="pt-1.5 flex justify-center">
          <Link 
            href={`/manga/${mangaId}/chapter/${displayedChapters[0]?.id || '1'}`}
            className="text-xs font-medium bg-gradient-to-r from-red-700 to-red-600 text-white px-2.5 py-0.5 rounded-full shadow-sm group-hover:shadow-red-700/50 transition-all duration-300 group-hover:from-red-600 group-hover:to-red-500"
          >
            {manga.latestChapter}
          </Link>
        </div>
      </div>
    </div>
  );
} 