import { Metadata } from 'next';

// Metadata for Bookmarks page
const metadata: Metadata = {
  title: 'My Bookmarked Manga & Manhwa | Saved Series - ManhwaNest',
  description: 'View your bookmarked manga and manhwa on ManhwaNest. Access your saved series, track your reading progress, and pick up where you left off.',
  keywords: [
    'bookmarked manga', 
    'saved manhwa', 
    'reading list', 
    'manga collection', 
    'favorite comics',
    'reading progress',
    'manga tracker'
  ],
  robots: {
    index: false,  // Don't index user-specific bookmarks page
    follow: true,
  },
  alternates: {
    canonical: 'https://manhwanest.fun/bookmarks',
  },
  openGraph: {
    title: 'My Bookmarks | ManhwaNest',
    description: 'Manage your bookmarked manga and manhwa collection on ManhwaNest. Continue reading your saved series.',
    url: 'https://manhwanest.fun/bookmarks',
    siteName: 'ManhwaNest',
    type: 'website',
  },
};

export default metadata; 