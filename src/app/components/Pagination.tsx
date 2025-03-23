'use client';

import Link from 'next/link';

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  basePath?: string;
}

export default function Pagination({ currentPage, totalPages, basePath = "/" }: PaginationProps) {
  const pagesToShow = 5;
  let startPage = Math.max(1, currentPage - Math.floor(pagesToShow / 2));
  const endPage = Math.min(totalPages, startPage + pagesToShow - 1);
  
  // Adjust start page if end page is at max
  if (endPage === totalPages) {
    startPage = Math.max(1, endPage - pagesToShow + 1);
  }
  
  const pages = Array.from({ length: endPage - startPage + 1 }, (_, i) => startPage + i);
  
  return (
    <div className="flex justify-center my-8">
      <div className="flex items-center justify-center bg-gradient-to-r from-gray-900/60 to-gray-900/80 rounded-lg p-2 shadow-lg relative overflow-hidden border border-gray-800">
        {/* Subtle glow effect */}
        <div className="absolute inset-0 bg-gradient-to-r from-red-600/5 to-purple-600/5 rounded-lg"></div>
        
        <div className="relative z-10 flex items-center space-x-1">
          {/* Previous page button */}
          {currentPage > 1 && (
            <Link 
              href={`${basePath}?page=${currentPage - 1}`}
              className="flex items-center justify-center h-9 w-9 rounded-md text-gray-400 hover:text-white bg-gray-800/70 hover:bg-gray-700 transition-all duration-300 hover:shadow-md hover:shadow-red-600/10"
              aria-label="Previous page"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </Link>
          )}
          
          {/* Show ellipsis if not starting from page 1 */}
          {startPage > 1 && (
            <Link 
              href={`${basePath}?page=1`}
              className="flex items-center justify-center h-9 min-w-9 px-3 rounded-md text-gray-400 hover:text-white bg-gray-800/70 hover:bg-gray-700 transition-all duration-300"
            >
              1
            </Link>
          )}
          
          {startPage > 2 && (
            <span className="flex items-center justify-center h-9 w-9 text-gray-400">
              ...
            </span>
          )}
          
          {/* Page numbers */}
          {pages.map(page => (
            <Link 
              key={page}
              href={`${basePath}?page=${page}`}
              className={`flex items-center justify-center h-9 min-w-9 px-3 rounded-md transition-all duration-300 ${
                page === currentPage 
                  ? 'bg-gradient-to-r from-red-700 to-red-600 text-white shadow-md shadow-red-800/30' 
                  : 'text-gray-400 hover:text-white bg-gray-800/70 hover:bg-gray-700'
              }`}
            >
              {page}
            </Link>
          ))}
          
          {/* Show ellipsis if not ending at last page */}
          {endPage < totalPages - 1 && (
            <span className="flex items-center justify-center h-9 w-9 text-gray-400">
              ...
            </span>
          )}
          
          {endPage < totalPages && (
            <Link 
              href={`${basePath}?page=${totalPages}`}
              className="flex items-center justify-center h-9 min-w-9 px-3 rounded-md text-gray-400 hover:text-white bg-gray-800/70 hover:bg-gray-700 transition-all duration-300"
            >
              {totalPages}
            </Link>
          )}
          
          {/* Next page button */}
          {currentPage < totalPages && (
            <Link 
              href={`${basePath}?page=${currentPage + 1}`}
              className="flex items-center justify-center h-9 w-9 rounded-md text-gray-400 hover:text-white bg-gray-800/70 hover:bg-gray-700 transition-all duration-300 hover:shadow-md hover:shadow-red-600/10"
              aria-label="Next page"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </Link>
          )}
        </div>
      </div>
    </div>
  );
} 