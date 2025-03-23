import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { getChapterImages, PageImage, getMangaDetailById, DetailedManga } from '@/app/services/api';
import ChapterReader from './ChapterReader';
import { Metadata } from 'next';
import { formatRelativeTime } from '@/app/utils/formatters';
import TopLoaderWrapper from './TopLoaderWrapper';
import ChapterSchema from '@/app/components/ChapterSchema';
import { generateChapterMetadata } from '@/app/components/SchemaProvider';

export async function generateMetadata({ 
  params 
}: { 
  params: Promise<{ id: string, chapterId: string }> 
}): Promise<Metadata> {
  try {
    // Get manga details for better metadata
    const { id: mangaId, chapterId } = await params;
    const manga = await getMangaDetailById(mangaId);
    
    if (!manga) {
      return {
        title: `Chapter ${chapterId} - ManhwaNest`,
        description: `Read Chapter ${chapterId} online for free on ManhwaNest.`,
      };
    }
    
    // Find the chapter to get the title if available
    const chapter = manga.chapters.find(ch => String(ch.id) === String(chapterId));
    const chapterTitle = chapter?.title || '';
    
    // Generate optimized metadata for this chapter page
    return generateChapterMetadata(manga, chapterId, chapterTitle);
  } catch (error) {
    console.error('Error generating chapter metadata:', error);
    const { chapterId } = await params;
    return {
      title: `Chapter ${chapterId} - ManhwaNest`,
      description: `Read Chapter ${chapterId} online for free on ManhwaNest.`,
    };
  }
}

interface ChapterPageProps {
  params: Promise<{
    id: string;
    chapterId: string;
  }>;
}

export default async function ChapterPage({ params }: ChapterPageProps) {
  try {
    // Await params before accessing its properties
    const { id, chapterId } = await params;
    
    // Use the API service function instead of direct fetch
    const chapterImages = await getChapterImages(id, chapterId);
    
    // Fetch manga details to get chapter list and titles
    const mangaDetails = await getMangaDetailById(id);
    
    if (!mangaDetails) {
      throw new Error('Failed to fetch manga details');
    }
    
    // Sort chapters in descending order (newest first)
    const sortedChapters = [...mangaDetails.chapters].sort((a, b) => 
      Number(b.id) - Number(a.id)
    );
    
    // Find current chapter index
    const currentChapterIdNum = Number(chapterId);
    
    // Find previous and next chapters with actual data from API
    const currentChapterIndex = sortedChapters.findIndex(ch => Number(ch.id) === currentChapterIdNum);
    const previousChapter = currentChapterIndex < sortedChapters.length - 1 
      ? sortedChapters[currentChapterIndex + 1] 
      : null;
    
    const nextChapter = currentChapterIndex > 0 
      ? sortedChapters[currentChapterIndex - 1] 
      : null;
    
    // Get current chapter details for title
    const currentChapter = sortedChapters.find(ch => Number(ch.id) === currentChapterIdNum);
    const chapterTitle = currentChapter?.title || null;
    
    // Generate page URL for schema markup
    const pageUrl = `https://manhwanest.fun/manga/${id}/chapter/${chapterId}`;
    
    return (
      <div className="min-h-screen bg-gray-950 text-white flex flex-col">
        <TopLoaderWrapper />
        
        {/* Add Schema Markup for SEO */}
        <ChapterSchema 
          manga={mangaDetails} 
          chapterId={chapterId}
          chapterTitle={chapterTitle || undefined}
          url={pageUrl}
          images={chapterImages} 
        />
        
        <main className="w-full bg-gray-950 flex-1" itemScope itemType="https://schema.org/Chapter">
          {/* Hidden structured data for SEO */}
          <meta itemProp="name" content={`${mangaDetails.title} - Chapter ${chapterId}${chapterTitle ? `: ${chapterTitle}` : ''}`} />
          <meta itemProp="position" content={chapterId} />
          <link itemProp="url" href={pageUrl} />
          
          <div className="relative">
            <ChapterReader 
              chapterImages={chapterImages} 
              mangaId={id} 
              chapterId={chapterId}
              previousChapter={previousChapter}
              nextChapter={nextChapter}
              mangaTitle={mangaDetails.title}
              allChapters={sortedChapters}
            />
          </div>
        </main>
      </div>
    );
  } catch (error) {
    // Need to await params for the error state too
    const { id } = await params;
    console.error('Error in chapter page:', error);
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-950">
        <TopLoaderWrapper />
        <div className="text-center p-6 max-w-md">
          <h1 className="text-2xl font-bold text-red-500 mb-4">Error Loading Chapter</h1>
          <p className="text-gray-400 mb-6">
            We couldn't load this chapter. The chapter might not be available or there could be a temporary issue.
          </p>
          <Link 
            href={`/manga/${id}`} 
            className="inline-block px-6 py-3 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors"
            aria-label="Return to manga page"
          >
            Back to Manga Page
          </Link>
        </div>
      </div>
    );
  }
} 