'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { SeriesManga } from '../services/api';

interface HeroSectionProps {
  popularManga: SeriesManga[];
}

export default function HeroSection({ popularManga }: HeroSectionProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [direction, setDirection] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const genres = ['Action', 'Adventure', 'Fantasy', 'Magic', 'Martial Arts', 'Shounen'];

  // Filter out manga without valid data
  const validManga = popularManga.filter(manga => 
    manga && manga.id && manga.title && manga.image
  );

  const slideVariants = {
    enter: (direction: number) => ({
      x: direction > 0 ? 1000 : -1000,
      opacity: 0
    }),
    center: {
      zIndex: 1,
      x: 0,
      opacity: 1
    },
    exit: (direction: number) => ({
      zIndex: 0,
      x: direction < 0 ? 1000 : -1000,
      opacity: 0
    })
  };

  const handleNext = useCallback(() => {
    if (validManga.length === 0) return;
    setDirection(1);
    setCurrentIndex((prev) => (prev + 1) % validManga.length);
  }, [validManga.length]);

  const handlePrevious = useCallback(() => {
    if (validManga.length === 0) return;
    setDirection(-1);
    setCurrentIndex((prev) => (prev - 1 + validManga.length) % validManga.length);
  }, [validManga.length]);

  useEffect(() => {
    if (!isPaused && validManga.length > 0) {
      const timer = setInterval(() => {
        handleNext();
      }, 5000);

      return () => clearInterval(timer);
    }
  }, [handleNext, isPaused, validManga.length]);

  // If no valid manga, don't render the hero section
  if (validManga.length === 0) return null;

  const currentManga = validManga[currentIndex];
  // Fix the manga ID by removing the "series/" prefix if it exists
  const mangaId = currentManga.id.startsWith('series/') ? currentManga.id.replace('series/', '') : currentManga.id;
  
  return (
    <section 
      className="relative h-[500px] xs:h-[550px] sm:h-[600px] md:h-[650px] lg:h-[500px] w-full overflow-hidden"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      <AnimatePresence initial={false} custom={direction}>
        <motion.div
          key={currentIndex}
          custom={direction}
          variants={slideVariants}
          initial="enter"
          animate="center"
          exit="exit"
          transition={{
            x: { type: "spring", stiffness: 300, damping: 30 },
            opacity: { duration: 0.2 }
          }}
          className="absolute inset-0"
        >
          {/* Background Image with Gradient */}
          <div className="absolute inset-0">
            <div className="absolute inset-0 bg-gradient-to-r from-black/95 via-black/80 to-transparent z-10" />
            <Image
              src={currentManga.image}
              alt={currentManga.title}
              fill
              className="w-full h-full object-cover object-center opacity-80"
              unoptimized={true}
              priority
            />
          </div>

          {/* Content */}
          <div className="relative h-full z-20">
            <div className="container mx-auto px-4 h-full">
              {/* Mobile Layout (centered) for small screens, Side-by-side for lg+ */}
              <div className="flex h-full">
                {/* Left Content - Full width on mobile, half on lg+ */}
                <div className="w-full lg:w-1/2 h-full flex flex-col items-center lg:items-start justify-center">
                  {/* Card visible only on mobile/tablet */}
                  <div className="lg:hidden w-[180px] xs:w-[200px] sm:w-[240px] md:w-[280px]
                    h-[260px] xs:h-[280px] sm:h-[340px] md:h-[400px]
                    relative mb-4 sm:mb-6 transition-transform hover:scale-105">
                    <Image
                      src={currentManga.image}
                      alt={currentManga.title}
                      fill
                      className="w-full h-full object-cover rounded-lg shadow-xl"
                      unoptimized={true}
                    />
                  </div>

                  {/* Info Section - Centered on mobile, left-aligned on lg+ */}
                  <div className="flex flex-col items-center lg:items-start text-center lg:text-left 
                    max-w-[280px] xs:max-w-[320px] sm:max-w-[400px] md:max-w-xl px-2">
                    <div className="text-white/90 text-xs xs:text-sm sm:text-base md:text-lg mb-1.5 sm:mb-2">
                      <span className="font-semibold line-clamp-1">
                        {currentManga.latestChapter}
                      </span>
                    </div>

                    <h1 className="text-lg xs:text-xl sm:text-2xl md:text-3xl lg:text-4xl 
                      font-bold text-white mb-2 sm:mb-3 line-clamp-2">
                      {currentManga.title}
                    </h1>

                    <div className="flex flex-wrap justify-center lg:justify-start gap-1 sm:gap-2 mb-3 sm:mb-4">
                      {genres.map((genre) => (
                        <span
                          key={genre}
                          className="px-2 sm:px-4 py-0.5 sm:py-1 rounded-md text-xs sm:text-sm
                            bg-white/10 text-white/90 backdrop-blur-sm"
                        >
                          {genre}
                        </span>
                      ))}
                    </div>

                    <div className="flex space-x-3">
                      <div className="px-2 py-1 bg-red-600/80 rounded text-sm text-white">
                        <span className="font-bold">{currentManga.rating}</span> ★
                      </div>
                      {currentManga.status && currentManga.status !== 'Unknown' && (
                        <div className="px-2 py-1 bg-gray-800/80 rounded text-sm text-white">
                          {currentManga.status}
                        </div>
                      )}
                    </div>

                    <div className="flex gap-2 sm:gap-3 mt-4">
                      <Link
                        href={`/manga/${mangaId}`}
                        className="px-3 sm:px-4 md:px-6 py-1.5 sm:py-2 md:py-2.5 
                          bg-red-600 hover:bg-red-700 text-white rounded-md 
                          text-xs sm:text-sm md:text-base font-medium transition-all 
                          hover:scale-105 active:scale-95"
                      >
                        Read Now
                      </Link>
                      <Link
                        href={`/manga/${mangaId}`}
                        className="px-3 sm:px-4 md:px-6 py-1.5 sm:py-2 md:py-2.5 
                          bg-white/10 hover:bg-white/20 text-white rounded-md 
                          text-xs sm:text-sm md:text-base font-medium transition-all
                          hover:scale-105 active:scale-95"
                      >
                        View Info
                      </Link>
                    </div>
                  </div>
                </div>

                {/* Right Side Card - Only visible on lg+ screens */}
                <div className="hidden lg:flex lg:w-1/2 h-full items-center justify-end">
                  <div className="w-[300px] h-[420px] relative transform -translate-y-6">
                    <Image
                      src={currentManga.image}
                      alt={currentManga.title}
                      fill
                      className="w-full h-full object-cover rounded-lg shadow-xl"
                      unoptimized={true}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="absolute bottom-0 left-0 w-full h-1 bg-gray-800/50">
            <motion.div
              className="h-full bg-red-600"
              initial={{ width: "0%" }}
              animate={{ width: "100%" }}
              transition={{ duration: 5, repeat: isPaused ? 0 : Infinity }}
            />
          </div>
        </motion.div>
      </AnimatePresence>

      {/* Navigation Arrows */}
      <div className="absolute bottom-4 right-4 flex gap-1.5 sm:gap-2 z-30">
        <button 
          onClick={() => {
            setIsPaused(true);
            handlePrevious();
          }}
          className="p-1.5 sm:p-2 rounded-lg bg-black/50 backdrop-blur-sm text-white/90 
            hover:bg-black/70 hover:text-white transition-all"
          aria-label="Previous slide"
        >
          <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        <button 
          onClick={() => {
            setIsPaused(true);
            handleNext();
          }}
          className="p-1.5 sm:p-2 rounded-lg bg-black/50 backdrop-blur-sm text-white/90 
            hover:bg-black/70 hover:text-white transition-all"
          aria-label="Next slide"
        >
          <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </button>
      </div>
    </section>
  );
} 