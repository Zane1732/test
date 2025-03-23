'use client';

import { useState, useEffect, useCallback, useMemo } from 'react';
import Link from 'next/link';
import { AnimatePresence, motion } from 'framer-motion';
import { formatRelativeTime } from '@/app/utils/formatters';

interface PageImage {
  page: number;
  img: string;
}

interface Chapter {
  id: number | string;
  title: string | null;
  releaseDate: string;
}

interface ChapterReaderProps {
  chapterImages: PageImage[];
  mangaId: string;
  chapterId: string;
  previousChapter: Chapter | null;
  nextChapter: Chapter | null;
  mangaTitle?: string;
  allChapters?: Chapter[];
}

export default function ChapterReader({ 
  chapterImages, 
  mangaId, 
  chapterId,
  previousChapter,
  nextChapter,
  mangaTitle = "Manga",
  allChapters = []
}: ChapterReaderProps) {
  const [currentPage, setCurrentPage] = useState(0);
  const [readingMode, setReadingMode] = useState<'vertical' | 'paged'>('vertical');
  const [isChaptersOpen, setIsChaptersOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [showScrollToTop, setShowScrollToTop] = useState(false);
  
  // Sort all chapters by id in descending order (newest first)
  const sortedAllChapters = useMemo(() => {
    if (!allChapters.length) return [];
    return [...allChapters].sort((a, b) => Number(b.id) - Number(a.id));
  }, [allChapters]);
  
  // Filter chapters based on search
  const filteredChapters = useMemo(() => {
    if (!searchTerm.trim()) return sortedAllChapters;
    
    const query = searchTerm.toLowerCase();
    return sortedAllChapters.filter(chapter => {
      // Search by chapter id
      if (String(chapter.id).toLowerCase().includes(query)) return true;
      
      // Search by chapter title if present
      if (chapter.title && chapter.title.toLowerCase().includes(query)) return true;
      
      return false;
    });
  }, [searchTerm, sortedAllChapters]);

  // Handle keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (readingMode === 'paged') {
        if (e.key === 'ArrowRight' || e.key === 'd') {
          e.preventDefault();
          setCurrentPage(prev => Math.min(prev + 1, chapterImages.length - 1));
        } else if (e.key === 'ArrowLeft' || e.key === 'a') {
          e.preventDefault();
          setCurrentPage(prev => Math.max(prev - 1, 0));
        }
      }
    };
    
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [readingMode, chapterImages]);
  
  // Handle scroll for vertical reading mode
  useEffect(() => {
    const handleScroll = () => {
      setShowScrollToTop(window.scrollY > 500);
      
      // Auto-close sidebars on scroll
      if (isChaptersOpen || isSettingsOpen) {
        setIsChaptersOpen(false);
        setIsSettingsOpen(false);
      }
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [isChaptersOpen, isSettingsOpen]);
  
  // Format the chapter title display
  const formatChapterTitle = (chapter: Chapter) => {
    if (chapter.title) {
      return `${chapter.title}`;
    }
    return `Chapter ${chapter.id}`;
  };
  
  // Format date to relative time (e.g., "2 days ago")
  const formatChapterDate = (dateString: string) => {
    try {
      return formatRelativeTime(dateString);
    } catch (error) {
      return 'Recently';
    }
  };

  const toggleChapters = () => {
    setIsChaptersOpen(!isChaptersOpen);
    // Close settings dropdown if open
    if (isSettingsOpen) setIsSettingsOpen(false);
  };
  
  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };
  
  const hasImages = chapterImages && chapterImages.length > 0;

  return (
    <div className="relative pt-0 bg-black">
      {/* Fixed Header/Navigation */}
      <div className="fixed top-0 left-0 right-0 bg-gray-900/95 backdrop-blur-sm border-b border-gray-800/50 z-50">
        <div className="h-14 px-4 flex items-center justify-between max-w-7xl mx-auto">
          <div className="flex items-center gap-4">
            <Link 
              href={`/manga/${mangaId}`}
              className="text-white/90 hover:text-white flex items-center gap-2 transition-colors"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              <span className="text-sm font-medium">Back</span>
            </Link>

            <button
              onClick={toggleChapters}
              className={`text-white hover:text-red-400 flex items-center gap-2 transition-colors ${
                isChaptersOpen ? 'text-red-400' : ''
              }`}
              title="Toggle chapter list"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
              <span className="text-sm font-medium">Chapters ({sortedAllChapters.length})</span>
            </button>
          </div>

          <div className="hidden md:block text-center text-xs text-white/90 font-medium truncate max-w-md">
            {mangaTitle} - Ch.{chapterId}
          </div>

          <div className="flex items-center gap-4">
            {previousChapter && (
              <Link
                href={`/manga/${mangaId}/chapter/${previousChapter.id}`}
                className="text-white/90 hover:text-white transition-colors flex items-center gap-1"
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
                <span className="text-sm hidden sm:inline">Previous</span>
              </Link>
            )}
            
            <span className="text-white/90 text-sm font-medium md:hidden">
              Ch.{chapterId}
            </span>
            
            {nextChapter && (
              <Link
                href={`/manga/${mangaId}/chapter/${nextChapter.id}`}
                className="text-white/90 hover:text-white transition-colors flex items-center gap-1"
              >
                <span className="text-sm hidden sm:inline">Next</span>
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </Link>
            )}
          </div>
        </div>
      </div>

      {/* Animated Chapter List Sidebar */}
      <AnimatePresence>
        {isChaptersOpen && (
          <>
            <motion.div
              initial={{ x: -320 }}
              animate={{ x: 0 }}
              exit={{ x: -320 }}
              transition={{ type: "spring", bounce: 0, duration: 0.3 }}
              className="fixed top-14 left-0 w-80 h-[calc(100vh-56px)] bg-gray-900/95 backdrop-blur-sm z-40 overflow-hidden border-r border-gray-800"
            >
              <motion.div 
                className="h-full flex flex-col"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.1 }}
              >
                <div className="flex justify-between items-center p-4 border-b border-gray-700 bg-gradient-to-r from-gray-900 to-gray-800">
                  <h3 className="text-white font-medium flex items-center">
                    <svg className="w-5 h-5 mr-2 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                    </svg>
                    Chapter List 
                    <span className="text-sm text-gray-400 ml-2 bg-gray-800/80 px-2 py-0.5 rounded-full">
                      {sortedAllChapters.length}
                    </span>
                  </h3>
                  <button 
                    onClick={toggleChapters}
                    className="text-gray-400 hover:text-red-400 transition-colors p-1 rounded-full hover:bg-gray-800"
                    title="Close chapter list"
                  >
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
                
                {/* Search input */}
                {sortedAllChapters.length > 0 && (
                <div className="p-4 border-b border-gray-700 bg-gray-900/30">
                  <div className="relative">
                    <input
                      type="text"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      placeholder="Search chapters..."
                      className="w-full bg-gray-800/80 border border-gray-700 rounded-lg py-2 pl-10 pr-4 
                                text-sm text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-red-500/50 focus:border-red-500/50 transition-all"
                    />
                    <div className="absolute left-3 top-2.5 text-gray-400">
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                      </svg>
                    </div>
                    {searchTerm && (
                      <button
                        onClick={() => setSearchTerm('')}
                        className="absolute right-3 top-2.5 text-gray-400 hover:text-red-400 transition-colors"
                        title="Clear search"
                      >
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      </button>
                    )}
                  </div>
                  {searchTerm && (
                    <div className="mt-2 text-xs text-gray-300 bg-gray-800/50 px-3 py-1 rounded-md flex items-center">
                      <svg className="w-3 h-3 mr-1 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      Found {filteredChapters.length} of {sortedAllChapters.length} chapters
                    </div>
                  )}
                </div>
                )}
                
                <div className="overflow-y-auto flex-1 bg-gradient-to-b from-gray-900/30 to-gray-950/80">
                  <div className="p-3 space-y-2">
                    {filteredChapters.length > 0 ? (
                      filteredChapters.map((chapter) => {
                        const isCurrentChapter = String(chapter.id) === String(chapterId);
                        return (
                          <Link
                            key={chapter.id}
                            href={`/manga/${mangaId}/chapter/${chapter.id}`}
                            onClick={toggleChapters}
                            className={`block rounded-lg transition-all hover:scale-[1.02] ${
                              isCurrentChapter
                                ? 'bg-gradient-to-r from-red-600 to-red-700 text-white shadow-md border-l-4 border-white/50'
                                : 'text-gray-300 hover:bg-gray-800 hover:text-white border-l-4 border-transparent hover:border-red-500/50'
                            }`}
                          >
                            <div className="p-3">
                              <div className="font-medium flex justify-between items-center">
                                <div className="flex items-center gap-2">
                                  <span className={`inline-flex justify-center items-center rounded-full ${
                                    isCurrentChapter
                                      ? 'bg-white/20 text-white w-7 h-7 font-bold'
                                      : 'bg-gray-800 text-gray-300 w-6 h-6'
                                  }`}>
                                    {chapter.id}
                                  </span>
                                  <div className="flex flex-col">
                                    <span className="font-semibold">{chapter.title ? chapter.title : `Chapter ${chapter.id}`}</span>
                                    <span className="text-xs mt-0.5 text-gray-400">
                                      {formatChapterDate(chapter.releaseDate)}
                                    </span>
                                  </div>
                                </div>
                                {isCurrentChapter && (
                                  <span className="text-xs bg-white/20 px-2 py-0.5 rounded-full font-medium animate-pulse">
                                    READING
                                  </span>
                                )}
                              </div>
                            </div>
                          </Link>
                        );
                      })
                    ) : (
                      <div className="flex flex-col items-center justify-center p-6 text-center bg-gray-900/50 rounded-lg my-4 mx-2">
                        <svg className="w-10 h-10 text-gray-500 mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <div className="text-gray-400 text-sm">No chapters found</div>
                        <div className="text-xs text-gray-500 mt-1">Try a different search term</div>
                      </div>
                    )}
                  </div>
                </div>
              </motion.div>
            </motion.div>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="fixed inset-0 bg-black/50 z-30"
              onClick={toggleChapters}
            />
          </>
        )}
      </AnimatePresence>

      {/* Main Content */}
      <div className="w-full mx-auto relative">
        {hasImages ? (
          readingMode === 'vertical' ? (
            // Vertical reading mode
            <div className="flex flex-col -mt-1 pt-12">
              {chapterImages.map((image, index) => (
                <div key={index} className="w-full flex justify-center bg-black">
                  <img
                    src={image.img}
                    alt={`Page ${image.page}`}
                    className="w-full h-auto object-contain"
                    loading="lazy"
                  />
                </div>
              ))}
            </div>
          ) : (
            // Paged reading mode (optional, you can keep or remove as needed)
            <div className="h-[calc(100vh-120px)] flex flex-col items-center justify-center">
              <div className="w-full h-full flex justify-center items-center">
                <img
                  src={chapterImages[currentPage]?.img}
                  alt={`Page ${currentPage + 1}`}
                  className="max-w-full max-h-full object-contain"
                />
              </div>
            </div>
          )
        ) : (
          // No images state
          <div className="min-h-[60vh] flex flex-col items-center justify-center">
            <div className="bg-gray-900/80 p-8 rounded-xl max-w-md text-center">
              <svg className="w-16 h-16 text-gray-500 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m2.25 0H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
              </svg>
              <h3 className="text-xl font-bold text-white mb-2">No Images Found</h3>
              <p className="text-gray-400 mb-6">
                We couldn't load the chapter images. Please try again later or check if this chapter is available.
              </p>
              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <Link
                  href={`/manga/${mangaId}`}
                  className="px-4 py-2 bg-gray-800 text-white rounded-lg hover:bg-gray-700 transition-colors"
                >
                  Back to Manga
                </Link>
                {previousChapter && (
                  <Link
                    href={`/manga/${mangaId}/chapter/${previousChapter.id}`}
                    className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                  >
                    Previous Chapter
                  </Link>
                )}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Floating back to top button */}
      {showScrollToTop && (
        <button
          onClick={scrollToTop}
          className="fixed bottom-16 right-6 bg-red-600 text-white p-3 rounded-full shadow-lg z-40 hover:bg-red-700 transition-colors"
          title="Back to top"
        >
          <svg 
            xmlns="http://www.w3.org/2000/svg" 
            className="h-5 w-5" 
            fill="none" 
            viewBox="0 0 24 24" 
            stroke="currentColor"
          >
            <path 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              strokeWidth={2} 
              d="M5 10l7-7m0 0l7 7m-7-7v18"
            />
          </svg>
        </button>
      )}
      
      {/* Page Progress Indicator (for vertical mode) */}
      {hasImages && readingMode === 'vertical' && (
        <div className="fixed bottom-4 left-1/2 -translate-x-1/2 bg-black/70 text-white text-xs py-1 px-3 rounded-full z-40">
          {chapterImages.length} Pages
        </div>
      )}
    </div>
  );
} 