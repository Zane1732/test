'use client';

import Link from 'next/link';
import { useState } from 'react';
import { ChevronDownIcon } from '@heroicons/react/24/outline';

export default function MobileFooter() {
  // State for mobile accordions
  const [openSection, setOpenSection] = useState<string | null>(null);

  // Toggle accordion sections on mobile
  const toggleSection = (section: string) => {
    if (openSection === section) {
      setOpenSection(null);
    } else {
      setOpenSection(section);
    }
  };

  return (
    <div className="md:hidden">
      {/* Site Info - Always visible on mobile */}
      <div className="mb-3">
        <h3 className="text-lg font-bold text-white mb-2">ManhwaNest</h3>
        <p className="text-gray-400 text-xs mb-2">
          Your premium destination for high-quality manhwa and manga.
        </p>
        <div className="flex items-center space-x-4 mb-2">
          <Link 
            href="https://discord.gg/7JKJSbnHqf" 
            target="_blank" 
            rel="noopener noreferrer"
            className="text-gray-400 hover:text-white transition-colors"
            aria-label="Join our Discord community"
          >
            <svg 
              xmlns="http://www.w3.org/2000/svg" 
              viewBox="0 0 640 512" 
              className="w-5 h-5 fill-current hover:text-indigo-400 transition-colors"
            >
              <path d="M524.531,69.836a1.5,1.5,0,0,0-.764-.7A485.065,485.065,0,0,0,404.081,32.03a1.816,1.816,0,0,0-1.923.91,337.461,337.461,0,0,0-14.9,30.6,447.848,447.848,0,0,0-134.426,0,309.541,309.541,0,0,0-15.135-30.6,1.89,1.89,0,0,0-1.924-.91A483.689,483.689,0,0,0,116.085,69.137a1.712,1.712,0,0,0-.788.676C39.068,183.651,18.186,294.69,28.43,404.354a2.016,2.016,0,0,0,.765,1.375A487.666,487.666,0,0,0,176.02,479.918a1.9,1.9,0,0,0,2.063-.676A348.2,348.2,0,0,0,208.12,430.4a1.86,1.86,0,0,0-1.019-2.588,321.173,321.173,0,0,1-45.868-21.853,1.885,1.885,0,0,1-.185-3.126c3.082-2.309,6.166-4.711,9.109-7.137a1.819,1.819,0,0,1,1.9-.256c96.229,43.917,200.41,43.917,295.5,0a1.812,1.812,0,0,1,1.924.233c2.944,2.426,6.027,4.851,9.132,7.16a1.884,1.884,0,0,1-.162,3.126,301.407,301.407,0,0,1-45.89,21.83,1.875,1.875,0,0,0-1,2.611,391.055,391.055,0,0,0,30.014,48.815,1.864,1.864,0,0,0,2.063.7A486.048,486.048,0,0,0,610.7,405.729a1.882,1.882,0,0,0,.765-1.352C623.729,277.594,590.933,167.465,524.531,69.836ZM222.491,337.58c-28.972,0-52.844-26.587-52.844-59.239S193.056,219.1,222.491,219.1c29.665,0,53.306,26.82,52.843,59.239C275.334,310.993,251.924,337.58,222.491,337.58Zm195.38,0c-28.971,0-52.843-26.587-52.843-59.239S388.437,219.1,417.871,219.1c29.667,0,53.307,26.82,52.844,59.239C470.715,310.993,447.538,337.58,417.871,337.58Z"/>
            </svg>
          </Link>
          <Link 
            href="https://www.instagram.com/shafat_420/" 
            target="_blank" 
            rel="noopener noreferrer"
            className="text-gray-400 hover:text-white transition-colors"
            aria-label="Follow us on Instagram"
          >
            <svg 
              xmlns="http://www.w3.org/2000/svg" 
              viewBox="0 0 448 512" 
              className="w-5 h-5 fill-current hover:text-pink-500 transition-colors"
            >
              <path d="M224.1 141c-63.6 0-114.9 51.3-114.9 114.9s51.3 114.9 114.9 114.9S339 319.5 339 255.9 287.7 141 224.1 141zm0 189.6c-41.1 0-74.7-33.5-74.7-74.7s33.5-74.7 74.7-74.7 74.7 33.5 74.7 74.7-33.6 74.7-74.7 74.7zm146.4-194.3c0 14.9-12 26.8-26.8 26.8-14.9 0-26.8-12-26.8-26.8s12-26.8 26.8-26.8 26.8 12 26.8 26.8zm76.1 27.2c-1.7-35.9-9.9-67.7-36.2-93.9-26.2-26.2-58-34.4-93.9-36.2-37-2.1-147.9-2.1-184.9 0-35.8 1.7-67.6 9.9-93.9 36.1s-34.4 58-36.2 93.9c-2.1 37-2.1 147.9 0 184.9 1.7 35.9 9.9 67.7 36.2 93.9s58 34.4 93.9 36.2c37 2.1 147.9 2.1 184.9 0 35.9-1.7 67.7-9.9 93.9-36.2 26.2-26.2 34.4-58 36.2-93.9 2.1-37 2.1-147.8 0-184.8zM398.8 388c-7.8 19.6-22.9 34.7-42.6 42.6-29.5 11.7-99.5 9-132.1 9s-102.7 2.6-132.1-9c-19.6-7.8-34.7-22.9-42.6-42.6-11.7-29.5-9-99.5-9-132.1s-2.6-102.7 9-132.1c7.8-19.6 22.9-34.7 42.6-42.6 29.5-11.7 99.5-9 132.1-9s102.7-2.6 132.1 9c19.6 7.8 34.7 22.9 42.6 42.6 11.7 29.5 9 99.5 9 132.1s2.7 102.7-9 132.1z"/>
            </svg>
          </Link>
        </div>
      </div>

      {/* Quick Links - Collapsible */}
      <div className="border-t border-gray-800 py-2">
        <button 
          onClick={() => toggleSection('links')} 
          className="flex items-center justify-between w-full py-2 text-left"
        >
          <h3 className="text-sm font-semibold text-white">Quick Links</h3>
          <ChevronDownIcon 
            className={`h-4 w-4 text-gray-400 transition-transform ${openSection === 'links' ? 'rotate-180' : ''}`}
          />
        </button>
        {openSection === 'links' && (
          <ul className="pl-2 space-y-2 py-2">
            <li>
              <Link href="/" className="text-gray-400 hover:text-white transition-colors text-xs">
                Home
              </Link>
            </li>
            <li>
              <Link href="/popular" className="text-gray-400 hover:text-white transition-colors text-xs">
                Popular Manhwa
              </Link>
            </li>
            <li>
              <Link href="/latest" className="text-gray-400 hover:text-white transition-colors text-xs">
                Latest Updates
              </Link>
            </li>
            <li>
              <Link href="/bookmarks" className="text-gray-400 hover:text-white transition-colors text-xs">
                My Bookmarks
              </Link>
            </li>
            <li>
              <Link href="/search" className="text-gray-400 hover:text-white transition-colors text-xs">
                Search Manhwa
              </Link>
            </li>
          </ul>
        )}
      </div>

      {/* Genres - Collapsible */}
      <div className="border-t border-gray-800 py-2">
        <button 
          onClick={() => toggleSection('genres')} 
          className="flex items-center justify-between w-full py-2 text-left"
        >
          <h3 className="text-sm font-semibold text-white">Popular Genres</h3>
          <ChevronDownIcon 
            className={`h-4 w-4 text-gray-400 transition-transform ${openSection === 'genres' ? 'rotate-180' : ''}`}
          />
        </button>
        {openSection === 'genres' && (
          <div className="grid grid-cols-2 gap-2 pl-2 py-2">
            <Link href="/search?query=action" className="text-gray-400 hover:text-white transition-colors text-xs">
              Action
            </Link>
            <Link href="/search?query=adventure" className="text-gray-400 hover:text-white transition-colors text-xs">
              Adventure
            </Link>
            <Link href="/search?query=comedy" className="text-gray-400 hover:text-white transition-colors text-xs">
              Comedy
            </Link>
            <Link href="/search?query=drama" className="text-gray-400 hover:text-white transition-colors text-xs">
              Drama
            </Link>
            <Link href="/search?query=fantasy" className="text-gray-400 hover:text-white transition-colors text-xs">
              Fantasy
            </Link>
            <Link href="/search?query=romance" className="text-gray-400 hover:text-white transition-colors text-xs">
              Romance
            </Link>
            <Link href="/search?query=martial+arts" className="text-gray-400 hover:text-white transition-colors text-xs">
              Martial Arts
            </Link>
            <Link href="/search?query=isekai" className="text-gray-400 hover:text-white transition-colors text-xs">
              Isekai
            </Link>
          </div>
        )}
      </div>

      {/* Legal - Collapsible */}
      <div className="border-t border-gray-800 py-2">
        <button 
          onClick={() => toggleSection('legal')} 
          className="flex items-center justify-between w-full py-2 text-left"
        >
          <h3 className="text-sm font-semibold text-white">Legal & Info</h3>
          <ChevronDownIcon 
            className={`h-4 w-4 text-gray-400 transition-transform ${openSection === 'legal' ? 'rotate-180' : ''}`}
          />
        </button>
        {openSection === 'legal' && (
          <ul className="pl-2 space-y-2 py-2">
            <li>
              <Link href="/privacy-policy" className="text-gray-400 hover:text-white transition-colors text-xs">
                Privacy Policy
              </Link>
            </li>
            <li>
              <Link href="/terms-of-service" className="text-gray-400 hover:text-white transition-colors text-xs">
                Terms of Service
              </Link>
            </li>
            <li>
              <Link href="/dmca" className="text-gray-400 hover:text-white transition-colors text-xs">
                DMCA Notice
              </Link>
            </li>
            <li>
              <Link href="/contact" className="text-gray-400 hover:text-white transition-colors text-xs">
                Contact Us
              </Link>
            </li>
            <li>
              <Link href="/about" className="text-gray-400 hover:text-white transition-colors text-xs">
                About ManhwaNest
              </Link>
            </li>
          </ul>
        )}
      </div>
    </div>
  );
} 