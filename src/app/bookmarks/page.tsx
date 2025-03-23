'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import Header from '@/app/components/Header';
import { getAllBookmarks, removeBookmark, BookmarkItem } from '@/app/utils/indexedDB';

export default function BookmarksPage() {
  const [bookmarks, setBookmarks] = useState<BookmarkItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isRemoving, setIsRemoving] = useState<string | null>(null);

  useEffect(() => {
    // Fetch all bookmarks when component mounts
    const fetchBookmarks = async () => {
      try {
        setIsLoading(true);
        const bookmarkData = await getAllBookmarks();
        setBookmarks(bookmarkData);
      } catch (error) {
        console.error('Error fetching bookmarks:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchBookmarks();
  }, []);

  const handleRemoveBookmark = async (mangaId: string) => {
    try {
      setIsRemoving(mangaId);
      await removeBookmark(mangaId);
      // Update local state
      setBookmarks(prev => prev.filter(bookmark => bookmark.mangaId !== mangaId));
    } catch (error) {
      console.error('Error removing bookmark:', error);
    } finally {
      setIsRemoving(null);
    }
  };

  const formatDate = (timestamp: number) => {
    return new Date(timestamp).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="min-h-screen bg-gray-950 text-white">
      <Header />
      
      <main className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-2xl sm:text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-red-400 to-purple-400">
            My Bookmarks
          </h1>
        </div>
        
        {isLoading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-pulse flex flex-col items-center">
              <svg className="w-12 h-12 text-red-500 mb-3" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
              </svg>
              <p className="text-gray-400">Loading your bookmarks...</p>
            </div>
          </div>
        ) : bookmarks.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-5">
            {bookmarks.map((bookmark) => (
              <div key={bookmark.mangaId} className="group flex flex-col bg-gradient-to-br from-gray-900 to-gray-950 rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 border border-gray-800 hover:border-red-500/30 hover:shadow-red-500/10 relative">
                {/* Manga Cover */}
                <Link href={`/manga/${bookmark.mangaId}`} className="block">
                  <div className="relative w-full flex-shrink-0 transition-transform duration-300 group-hover:scale-[1.02] overflow-hidden" style={{ paddingTop: '140%' }}>
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent opacity-60 group-hover:opacity-40 transition-opacity duration-300 z-10"></div>
                    
                    <Image
                      src={bookmark.image}
                      alt={bookmark.title}
                      fill
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                      className="object-cover transition-transform duration-500 group-hover:scale-110"
                      priority
                    />
                    
                    {/* Added date badge */}
                    <div className="absolute top-2 left-2 z-20">
                      <span className="text-xs font-medium bg-gray-800/90 text-white px-2 py-0.5 rounded-sm shadow-md">
                        Added: {formatDate(bookmark.addedAt)}
                      </span>
                    </div>
                    
                    {/* Manga title overlay on the image */}
                    <div className="absolute bottom-0 left-0 right-0 p-3 bg-gradient-to-t from-black/90 via-black/70 to-transparent z-20">
                      <h2 className="font-bold text-base text-white line-clamp-2 group-hover:text-red-400 transition-colors duration-300">
                        {bookmark.title}
                      </h2>
                    </div>
                  </div>
                </Link>
                
                {/* Action buttons */}
                <div className="p-2 flex justify-between">
                  <Link 
                    href={`/manga/${bookmark.mangaId}`}
                    className="flex-1 mr-1 text-center text-xs font-medium bg-red-600 hover:bg-red-700 text-white px-2 py-1.5 rounded transition-colors"
                  >
                    Read
                  </Link>
                  <button 
                    onClick={() => handleRemoveBookmark(bookmark.mangaId)}
                    disabled={isRemoving === bookmark.mangaId}
                    className={`flex-1 ml-1 text-xs font-medium ${
                      isRemoving === bookmark.mangaId 
                        ? 'bg-gray-700 cursor-not-allowed' 
                        : 'bg-gray-800 hover:bg-gray-700'
                    } text-white px-2 py-1.5 rounded transition-colors`}
                  >
                    {isRemoving === bookmark.mangaId ? 'Removing...' : 'Remove'}
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-gradient-to-br from-gray-900 to-gray-950 p-8 rounded-xl shadow-lg border border-gray-800 text-center">
            <svg className="w-16 h-16 text-gray-600 mx-auto mb-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
            </svg>
            <h2 className="text-xl font-bold text-white mb-2">No Bookmarks Found</h2>
            <p className="text-gray-400 mb-6">
              You haven't bookmarked any manga yet. Browse and find manga you like to bookmark them!
            </p>
            <Link 
              href="/"
              className="inline-block bg-red-600 hover:bg-red-700 text-white font-medium px-4 py-2 rounded-md transition-colors"
            >
              Browse Manga
            </Link>
          </div>
        )}
      </main>
    </div>
  );
} 