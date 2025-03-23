'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';
import { DetailedManga } from '@/app/services/api';
import { formatRelativeTime } from '@/app/utils/formatters';
import { isBookmarked, addBookmark, removeBookmark, BookmarkItem } from '@/app/utils/indexedDB';

// Client-side Chapter Search Component
function ChapterSearch({ chapters, mangaId }: { chapters: any[], mangaId: string }) {
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredChapters, setFilteredChapters] = useState(chapters);

  useEffect(() => {
    if (!searchQuery.trim()) {
      setFilteredChapters(chapters);
      return;
    }
    
    const query = searchQuery.toLowerCase();
    const filtered = chapters.filter(chapter => {
      const chapterId = String(chapter.id).toLowerCase();
      const chapterTitle = (chapter.title || '').toLowerCase();
      
      return chapterId.includes(query) || chapterTitle.includes(query);
    });
    
    setFilteredChapters(filtered);
  }, [searchQuery, chapters]);

  return (
    <div className="bg-gradient-to-br from-gray-900 to-gray-950 rounded-lg shadow-lg border border-gray-800 overflow-hidden">
      {/* Header with search input */}
      <div className="p-3 sm:p-4 border-b border-gray-800 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
        <h2 className="text-lg sm:text-xl font-bold text-white">Chapters <span className="text-sm font-normal text-gray-400">({chapters.length})</span></h2>
        
        <div className="w-full sm:w-auto">
          <div className="relative">
            <input
              type="text"
              placeholder="Search chapters..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full sm:w-64 bg-gray-800 text-white text-sm rounded-md pl-8 pr-4 py-2 focus:ring-1 focus:ring-red-500 focus:outline-none"
            />
            <svg 
              xmlns="http://www.w3.org/2000/svg" 
              className="h-4 w-4 absolute left-2.5 top-1/2 transform -translate-y-1/2 text-gray-400" 
              fill="none" 
              viewBox="0 0 24 24" 
              stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            {searchQuery && (
              <button 
                onClick={() => setSearchQuery('')}
                className="absolute right-2.5 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white"
                aria-label="Clear search"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            )}
          </div>
        </div>
      </div>
      
      {/* Chapters list */}
      <div className="max-h-[600px] overflow-y-auto">
        {filteredChapters.length === 0 ? (
          <div className="p-8 text-center text-gray-400">
            No chapters found matching "{searchQuery}"
          </div>
        ) : (
          <div className="divide-y divide-gray-800">
            {filteredChapters.map((chapter) => (
              <Link 
                key={chapter.id} 
                href={`/manga/${mangaId}/chapter/${chapter.id}`}
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between p-3 sm:p-4 hover:bg-gray-800/50 transition-colors group">
                  <div className="flex items-center">
                    <div className="w-8 h-8 sm:w-10 sm:h-10 flex-shrink-0 rounded-full bg-gray-800 flex items-center justify-center mr-3 group-hover:bg-red-600/20 transition-colors">
                      <span className="text-sm sm:text-base font-bold text-gray-300 group-hover:text-red-400 transition-colors">
                        {chapter.number}
                      </span>
                    </div>
                    <div>
                      <h3 className="text-sm sm:text-base font-medium text-white group-hover:text-red-400 transition-colors">
                        {chapter.title}
                      </h3>
                      <p className="text-sm text-gray-400">
                        {chapter.releaseDate ? `Release date: ${formatRelativeTime(chapter.releaseDate)}` : 'No release date available'}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center mt-2 sm:mt-0 space-x-3 ml-11 sm:ml-0">
                    <span className="text-xs text-gray-400 flex items-center">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5 mr-1" viewBox="0 0 20 20" fill="currentColor">
                        <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
                        <path fillRule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clipRule="evenodd" />
                      </svg>
                      3200
                    </span>
                    <button 
                      className="text-xs bg-gray-800 hover:bg-gray-700 text-white px-2 py-1 rounded transition-colors"
                      aria-label={`Read chapter ${chapter.title || chapter.id}`}
                    >
                      Read
                    </button>
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

// BookmarkButton component with functionality
function BookmarkButton({ mangaId, manga }: { mangaId: string, manga: DetailedManga }) {
  const [isBookmarkedState, setIsBookmarkedState] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  
  useEffect(() => {
    // Check if manga is bookmarked in IndexedDB
    const checkBookmarkStatus = async () => {
      try {
        setIsLoading(true);
        const bookmarked = await isBookmarked(mangaId);
        setIsBookmarkedState(bookmarked);
      } catch (error) {
        console.error('Error checking bookmark status:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    checkBookmarkStatus();
  }, [mangaId]);
  
  const toggleBookmark = async () => {
    try {
      setIsLoading(true);
      
      if (isBookmarkedState) {
        // Remove from bookmarks
        await removeBookmark(mangaId);
        setIsBookmarkedState(false);
      } else {
        // Add to bookmarks
        const bookmarkData: BookmarkItem = {
          mangaId,
          title: manga.title,
          image: manga.image,
          addedAt: Date.now()
        };
        await addBookmark(bookmarkData);
        setIsBookmarkedState(true);
      }
    } catch (error) {
      console.error('Error toggling bookmark:', error);
    } finally {
      setIsLoading(false);
    }
  };
  
  return (
    <div className="w-full">
    <button 
      onClick={toggleBookmark}
      disabled={isLoading}
      className={`flex items-center justify-center px-5 sm:px-6 py-2.5 rounded-md text-sm font-medium w-full sm:w-auto transition-all duration-300 ${
        isLoading ? 'opacity-70 cursor-not-allowed' :
        isBookmarkedState 
          ? 'bg-yellow-600 hover:bg-yellow-700 text-white' 
          : 'bg-gray-800 hover:bg-gray-700 text-white'
      }`}
    >
      <svg 
        xmlns="http://www.w3.org/2000/svg" 
        className={`h-4 w-4 mr-2 ${isBookmarkedState ? 'text-yellow-300' : 'text-gray-400'} ${isLoading ? 'animate-pulse' : ''}`} 
        fill={isBookmarkedState ? 'currentColor' : 'none'} 
        viewBox="0 0 24 24" 
        stroke="currentColor"
      >
        <path 
          strokeLinecap="round" 
          strokeLinejoin="round" 
          strokeWidth={2} 
          d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" 
        />
      </svg>
      {isLoading ? 'Loading...' : isBookmarkedState ? 'Bookmarked' : 'Bookmark'}
    </button>
    </div>
  );
}

// Expandable Description Component
function ExpandableDescription({ description }: { description: string }) {
  const [isExpanded, setIsExpanded] = useState(false);
  const shortDescription = description.length > 200 ? `${description.substring(0, 200)}...` : description;

  return (
    <div className="bg-gray-900/50 rounded-lg p-3 sm:p-4 border border-gray-800">
      <h3 className="text-sm font-bold mb-2 text-white">Synopsis</h3>
      <div className="text-xs sm:text-sm text-gray-300">
        {isExpanded ? description : shortDescription}
        {description.length > 200 && (
          <button 
            onClick={() => setIsExpanded(!isExpanded)} 
            className="ml-1 text-red-400 hover:text-red-300 transition-colors font-medium"
          >
            {isExpanded ? 'Read Less' : 'Read More'}
          </button>
        )}
      </div>
    </div>
  );
}

// Social Media Share Section
function SocialShareSection({ manga }: { manga: any }) {
  const shareUrl = typeof window !== 'undefined' ? window.location.href : '';
  
  const shareOptions = [
    { 
      name: 'Twitter', 
      icon: (
        <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
          <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84"></path>
        </svg>
      ),
      action: () => window.open(`https://twitter.com/intent/tweet?text=Check out ${manga.title}&url=${encodeURIComponent(shareUrl)}`, '_blank'),
      color: 'bg-blue-400 hover:bg-blue-500'
    },
    { 
      name: 'Facebook', 
      icon: (
        <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
          <path fillRule="evenodd" d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" clipRule="evenodd"></path>
        </svg>
      ),
      action: () => window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`, '_blank'),
      color: 'bg-blue-600 hover:bg-blue-700'
    },
    { 
      name: 'WhatsApp', 
      icon: (
        <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
        </svg>
      ),
      action: () => window.open(`https://wa.me/?text=${encodeURIComponent(`Check out ${manga.title}: ${shareUrl}`)}`, '_blank'),
      color: 'bg-green-600 hover:bg-green-700'
    },
    { 
      name: 'Reddit', 
      icon: (
        <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
          <path d="M12 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0zm5.01 4.744c.688 0 1.25.561 1.25 1.249a1.25 1.25 0 0 1-2.498.056l-2.597-.547-.8 3.747c1.824.07 3.48.632 4.674 1.488.308-.309.73-.491 1.207-.491.968 0 1.754.786 1.754 1.754 0 .716-.435 1.333-1.01 1.614a3.111 3.111 0 0 1 .042.52c0 2.694-3.13 4.87-7.004 4.87-3.874 0-7.004-2.176-7.004-4.87 0-.183.015-.366.043-.534A1.748 1.748 0 0 1 4.028 12c0-.968.786-1.754 1.754-1.754.463 0 .898.196 1.207.49 1.207-.883 2.878-1.43 4.744-1.487l.885-4.182a.342.342 0 0 1 .14-.197.35.35 0 0 1 .238-.042l2.906.617a1.214 1.214 0 0 1 1.108-.701zM9.25 12C8.561 12 8 12.562 8 13.25c0 .687.561 1.248 1.25 1.248.687 0 1.248-.561 1.248-1.249 0-.688-.561-1.249-1.249-1.249zm5.5 0c-.687 0-1.248.561-1.248 1.25 0 .687.561 1.248 1.249 1.248.688 0 1.249-.561 1.249-1.249 0-.687-.562-1.249-1.25-1.249zm-5.466 3.99a.327.327 0 0 0-.231.094.33.33 0 0 0 0 .463c.842.842 2.484.913 2.961.913.477 0 2.105-.056 2.961-.913a.361.361 0 0 0 .029-.463.33.33 0 0 0-.464 0c-.547.533-1.684.73-2.512.73-.828 0-1.979-.196-2.512-.73a.326.326 0 0 0-.232-.095z"/>
        </svg>
      ),
      action: () => window.open(`https://www.reddit.com/submit?url=${encodeURIComponent(shareUrl)}&title=${encodeURIComponent(`Check out ${manga.title}`)}`, '_blank'),
      color: 'bg-orange-600 hover:bg-orange-700'
    },
    { 
      name: 'Pinterest', 
      icon: (
        <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
          <path d="M12.017 0C5.396 0 .029 5.367.029 11.987c0 5.079 3.158 9.417 7.618 11.162-.105-.949-.199-2.403.041-3.439.219-.937 1.406-5.957 1.406-5.957s-.359-.72-.359-1.781c0-1.663.967-2.911 2.168-2.911 1.024 0 1.518.769 1.518 1.688 0 1.029-.653 2.567-.992 3.992-.285 1.193.6 2.165 1.775 2.165 2.128 0 3.768-2.245 3.768-5.487 0-2.861-2.063-4.869-5.008-4.869-3.41 0-5.409 2.562-5.409 5.199 0 1.033.394 2.143.889 2.741.099.12.112.225.085.345-.09.375-.293 1.199-.334 1.363-.053.225-.172.271-.401.165-1.495-.69-2.433-2.878-2.433-4.646 0-3.776 2.748-7.252 7.92-7.252 4.158 0 7.392 2.967 7.392 6.923 0 4.135-2.607 7.462-6.233 7.462-1.214 0-2.354-.629-2.758-1.379l-.749 2.848c-.269 1.045-1.004 2.352-1.498 3.146 1.123.345 2.306.535 3.55.535 6.607 0 11.985-5.365 11.985-11.987C23.97 5.39 18.592.026 11.985.026L12.017 0z"/>
        </svg>
      ),
      action: () => window.open(`https://pinterest.com/pin/create/button/?url=${encodeURIComponent(shareUrl)}&media=${encodeURIComponent(manga.image)}&description=${encodeURIComponent(`Check out ${manga.title}`)}`, '_blank'),
      color: 'bg-red-600 hover:bg-red-700'
    },
    { 
      name: 'Copy Link', 
      icon: (
        <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"></path>
        </svg>
      ),
      action: () => {
        navigator.clipboard.writeText(shareUrl);
        alert('Link copied to clipboard!');
      },
      color: 'bg-gray-700 hover:bg-gray-600'
    }
  ];
  
  return (
    <>
      {shareOptions.map((option, index) => (
        <button
          key={index}
          onClick={option.action}
          className={`${option.color} text-white rounded-md px-3 sm:px-4 py-2 text-xs sm:text-sm flex items-center transition-colors`}
        >
          <span className="mr-1.5">{option.icon}</span>
          <span className="hidden xs:inline">{option.name}</span>
        </button>
      ))}
    </>
  );
}

// Main client-side components wrapper
export default function MangaClientComponents({ 
  manga, 
  mangaId,
  sortedChapters,
  popularityScore
}: { 
  manga: DetailedManga, 
  mangaId: string,
  sortedChapters: any[],
  popularityScore: number
}) {
  return (
    <div className="space-y-3 sm:space-y-4">
      <BookmarkButton mangaId={mangaId} manga={manga} />
      
      <div className="flex flex-wrap gap-3">
        <SocialShareSection manga={manga} />
      </div>
      
      <ExpandableDescription description={manga.description} />
    </div>
  );
} 