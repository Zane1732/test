'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import NextTopLoader from 'nextjs-toploader';
import { motion, AnimatePresence } from 'framer-motion';

export default function Header() {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [showMobileSearch, setShowMobileSearch] = useState(false);
  const pathname = usePathname();

  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      const offset = window.scrollY;
      if (offset > 50) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  // Check if a link is active
  const isLinkActive = (path: string) => {
    if (path === '/' && pathname === '/') return true;
    if (path !== '/' && pathname?.startsWith(path)) return true;
    return false;
  };

  // Toggle mobile search
  const toggleMobileSearch = () => {
    setShowMobileSearch(!showMobileSearch);
    if (isOpen) setIsOpen(false);
  };

  // Animation variants
  const mobileMenuVariants = {
    closed: { 
      height: 0,
      opacity: 0,
      transition: { 
        duration: 0.3,
        ease: "easeInOut",
        when: "afterChildren" 
      }
    },
    open: { 
      height: "auto",
      opacity: 1,
      transition: { 
        duration: 0.3,
        ease: "easeInOut",
        when: "beforeChildren",
        staggerChildren: 0.05
      }
    }
  };

  const menuItemVariants = {
    closed: { 
      opacity: 0,
      y: -10,
      transition: { duration: 0.2 }
    },
    open: { 
      opacity: 1,
      y: 0,
      transition: { duration: 0.2 }
    }
  };

  const searchBarVariants = {
    closed: { 
      height: 0,
      opacity: 0,
      transition: { 
        duration: 0.3,
        ease: "easeInOut"
      }
    },
    open: { 
      height: "auto",
      opacity: 1,
      transition: { 
        duration: 0.3,
        ease: "easeInOut"
      }
    }
  };

  return (
    <>
      {/* TopLoader component for page transitions - Increased size and brightness */}
      <NextTopLoader 
        color="#ef4444"
        showSpinner={false} 
        height={4}
        shadow="0 0 20px #ef4444"
        speed={200}
        zIndex={9999}
      />
      
      <header className={`sticky w-full top-0 left-0 right-0 z-50 transition-all duration-300 ${scrolled ? 'bg-[#0A1525]/95 backdrop-blur-md shadow-lg' : 'bg-[#0A1525]'}`}>
        <nav className="border-b border-gray-800/40 transition-all duration-300">
          <div className="container mx-auto px-4">
            <div className="flex justify-between items-center h-16">
              {/* Logo */}
              <div className="flex-shrink-0 flex items-center">
                <Link href="/" className="flex items-center group">
                  <div className="relative">
                    <div className="absolute -inset-1 bg-gradient-to-r from-red-600 to-purple-600 rounded-full blur opacity-40 group-hover:opacity-80 transition duration-500"></div>
                    <div className="relative bg-gradient-to-r from-red-500 to-purple-600 text-white p-1.5 rounded-full">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                      </svg>
                    </div>
                  </div>
                  <span className="text-lg font-bold ml-2 bg-clip-text text-transparent bg-gradient-to-r from-red-400 to-purple-400 group-hover:from-red-300 group-hover:to-purple-300 transition duration-300">ManhwaNest</span>
                </Link>
              </div>

              {/* Desktop menu - Enhanced Button Style */}
              <div className="hidden md:block">
                <div className="ml-10 flex items-center space-x-4">
                  <Link 
                    href="/" 
                    className={`px-6 py-1.5 rounded-full transition-all duration-300 font-medium ${
                      isLinkActive('/') 
                        ? 'bg-gradient-to-r from-red-600 to-red-700 text-white shadow-[0_0_15px_rgba(239,68,68,0.5)] border border-red-500/50' 
                        : 'text-gray-300 hover:text-white hover:bg-gray-800 border border-transparent hover:border-gray-700'
                    }`}
                  >
                    Home
                  </Link>
                  <Link 
                    href="/latest" 
                    className={`px-6 py-1.5 rounded-full transition-all duration-300 font-medium ${
                      isLinkActive('/latest') 
                        ? 'bg-gradient-to-r from-red-600 to-red-700 text-white shadow-[0_0_15px_rgba(239,68,68,0.5)] border border-red-500/50' 
                        : 'text-gray-300 hover:text-white hover:bg-gray-800 border border-transparent hover:border-gray-700'
                    }`}
                  >
                    Latest
                  </Link>
                  <Link 
                    href="/popular" 
                    className={`px-6 py-1.5 rounded-full transition-all duration-300 font-medium ${
                      isLinkActive('/popular') 
                        ? 'bg-gradient-to-r from-red-600 to-red-700 text-white shadow-[0_0_15px_rgba(239,68,68,0.5)] border border-red-500/50' 
                        : 'text-gray-300 hover:text-white hover:bg-gray-800 border border-transparent hover:border-gray-700'
                    }`}
                  >
                    Popular
                  </Link>
                  <Link 
                    href="/bookmarks" 
                    className={`px-6 py-1.5 rounded-full transition-all duration-300 font-medium ${
                      isLinkActive('/bookmarks') 
                        ? 'bg-gradient-to-r from-red-600 to-red-700 text-white shadow-[0_0_15px_rgba(239,68,68,0.5)] border border-red-500/50' 
                        : 'text-gray-300 hover:text-white hover:bg-gray-800 border border-transparent hover:border-gray-700'
                    }`}
                  >
                    <span className="flex items-center">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
                      </svg>
                      Bookmarks
                    </span>
                  </Link>
                </div>
              </div>

              {/* Search input - desktop - Improved visuals */}
              <div className="hidden md:flex items-center">
                <form action="/search" method="get" className="relative flex items-center group">
                  <input
                    type="text"
                    name="query"
                    placeholder="Search manga..."
                    className="bg-[#111A2E] text-white placeholder-gray-400 border border-gray-800/40 rounded-l-full pl-10 pr-4 py-2 focus:outline-none focus:border-red-500 focus:ring-1 focus:ring-red-500/30 transition-all duration-300 w-64 group-hover:border-gray-700"
                  />
                  <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 group-hover:text-gray-300 transition-colors">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                  </div>
                  <button 
                    type="submit" 
                    className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-r-full transition-colors duration-300"
                    aria-label="Search"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </button>
                </form>
              </div>

              {/* Mobile buttons */}
              <div className="flex items-center space-x-3 md:hidden">
                {/* Mobile search toggle button */}
                <motion.button
                  onClick={toggleMobileSearch}
                  className="text-gray-300 hover:text-white transition-colors duration-300 transform hover:scale-110"
                  aria-label="Toggle search"
                  whileTap={{ scale: 0.9 }}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </motion.button>

                {/* Mobile menu button - With animation */}
                <motion.button
                  onClick={() => {
                    setIsOpen(!isOpen);
                    if (showMobileSearch) setShowMobileSearch(false);
                  }}
                  className="text-gray-300 hover:text-white transition-all duration-300 transform hover:scale-110"
                  aria-label="Main menu"
                  whileTap={{ scale: 0.9 }}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 transition-transform duration-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path 
                      strokeLinecap="round" 
                      strokeLinejoin="round" 
                      strokeWidth={2} 
                      d={isOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"} 
                    />
                  </svg>
                </motion.button>
              </div>
            </div>
          </div>

          {/* Mobile search bar - Separate from menu */}
          <AnimatePresence>
            {showMobileSearch && (
              <motion.div 
                className="md:hidden bg-[#0A1525] overflow-hidden"
                initial="closed"
                animate="open"
                exit="closed"
                variants={searchBarVariants}
              >
                <div className="container mx-auto px-4 py-2">
                  <form action="/search" method="get" className="relative flex items-center">
                    <input
                      type="text"
                      name="query"
                      placeholder="Search manga..."
                      className="w-full bg-[#111A2E] text-white placeholder-gray-400 border border-gray-800/40 rounded-l-full pl-10 pr-4 py-2 focus:outline-none focus:ring-1 focus:ring-red-500/30"
                      autoFocus={showMobileSearch}
                    />
                    <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                      </svg>
                    </div>
                    <motion.button 
                      type="submit" 
                      className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-r-full transition-colors duration-300"
                      aria-label="Search"
                      whileTap={{ scale: 0.95 }}
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </motion.button>
                  </form>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Mobile menu with Framer Motion */}
          <AnimatePresence>
            {isOpen && (
              <motion.div 
                id="mobile-menu"
                className="md:hidden overflow-hidden bg-[#0A1525]/90 backdrop-blur-sm"
                initial="closed"
                animate="open"
                exit="closed"
                variants={mobileMenuVariants}
              >
                <div className="px-4 pt-2 pb-3 space-y-2">
                  <motion.div variants={menuItemVariants}>
                    <Link 
                      href="/" 
                      className={`flex justify-center items-center py-2 rounded-full text-base font-medium transition-all duration-300 ${
                        isLinkActive('/') 
                          ? 'bg-gradient-to-r from-red-600 to-red-700 text-white shadow-[0_0_15px_rgba(239,68,68,0.4)] border border-red-500/50' 
                          : 'text-gray-300 hover:text-white hover:bg-gray-800 border border-gray-800'
                      }`}
                      onClick={() => setIsOpen(false)}
                    >
                      Home
                    </Link>
                  </motion.div>
                  
                  <motion.div variants={menuItemVariants}>
                    <Link 
                      href="/latest" 
                      className={`flex justify-center items-center py-2 rounded-full text-base font-medium transition-all duration-300 ${
                        isLinkActive('/latest') 
                          ? 'bg-gradient-to-r from-red-600 to-red-700 text-white shadow-[0_0_15px_rgba(239,68,68,0.4)] border border-red-500/50' 
                          : 'text-gray-300 hover:text-white hover:bg-gray-800 border border-gray-800'
                      }`}
                      onClick={() => setIsOpen(false)}
                    >
                      Latest
                    </Link>
                  </motion.div>
                  
                  <motion.div variants={menuItemVariants}>
                    <Link 
                      href="/popular" 
                      className={`flex justify-center items-center py-2 rounded-full text-base font-medium transition-all duration-300 ${
                        isLinkActive('/popular') 
                          ? 'bg-gradient-to-r from-red-600 to-red-700 text-white shadow-[0_0_15px_rgba(239,68,68,0.4)] border border-red-500/50' 
                          : 'text-gray-300 hover:text-white hover:bg-gray-800 border border-gray-800'
                      }`}
                      onClick={() => setIsOpen(false)}
                    >
                      Popular
                    </Link>
                  </motion.div>
                  
                  <motion.div variants={menuItemVariants}>
                    <Link 
                      href="/bookmarks" 
                      className={`flex justify-center items-center py-2 rounded-full text-base font-medium transition-all duration-300 ${
                        isLinkActive('/bookmarks') 
                          ? 'bg-gradient-to-r from-red-600 to-red-700 text-white shadow-[0_0_15px_rgba(239,68,68,0.4)] border border-red-500/50' 
                          : 'text-gray-300 hover:text-white hover:bg-gray-800 border border-gray-800'
                      }`}
                      onClick={() => setIsOpen(false)}
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
                      </svg>
                      Bookmarks
                    </Link>
                  </motion.div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </nav>
      </header>
    </>
  );
} 
