'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { formatRelativeTime } from '@/app/utils/formatters';

// Define a proper interface for chapter
interface Chapter {
  id: string | number;
  title: string | null;
  releaseDate: string;
  number?: string | number; // Make number optional
}

export default function ChapterSearch({ chapters, mangaId }: { chapters: Chapter[]; mangaId: string }) {
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredChapters, setFilteredChapters] = useState(chapters);
  
  useEffect(() => {
    if (!searchQuery.trim()) {
      setFilteredChapters(chapters);
      return;
    }
    
    const filtered = chapters.filter(chapter => {
      // Safe access to ensure we don't crash if title or number is undefined
      const title = String(chapter.title || '').toLowerCase();
      const numberStr = String(chapter.number || chapter.id || '').toLowerCase();
      const query = searchQuery.toLowerCase();

      return title.includes(query) || numberStr.includes(query);
    });
    
    setFilteredChapters(filtered);
  }, [chapters, searchQuery]);
  
  return (
    <div className="bg-gray-900 rounded-lg shadow-lg overflow-hidden border border-gray-800">
      {/* Search input */}
      <div className="p-4 bg-gradient-to-r from-gray-900 to-gray-800 border-b border-gray-700">
        <div className="relative">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search chapters..."
            className="w-full bg-gray-800 border border-gray-700 rounded-lg py-2 pl-10 pr-4 
                      text-sm text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-red-500/50"
          />
          <div className="absolute left-3 top-2.5 text-gray-400">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
        </div>
      </div>
      
      {/* Chapters list */}
      <div className="max-h-[600px] overflow-y-auto">
        {filteredChapters.length === 0 ? (
          <div className="p-8 text-center text-gray-400">
            No chapters found matching &quot;{searchQuery}&quot;
          </div>
        ) : (
          <div className="divide-y divide-gray-800">
            {filteredChapters.map((chapter) => (
              <Link 
                key={chapter.id} 
                href={`/manga/${mangaId}/chapter/${chapter.id}`}
              >
                <div className="p-4 hover:bg-gray-800 transition-colors flex justify-between items-center">
                  <div className="flex flex-col">
                    <span className="text-red-400 font-medium">
                      Chapter {chapter.id}
                    </span>
                    {chapter.title && (
                      <span className="text-sm text-gray-400">
                        {chapter.title}
                      </span>
                    )}
                  </div>
                  <div className="text-xs text-gray-500">
                    {formatRelativeTime(chapter.releaseDate)}
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
} 