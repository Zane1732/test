import { NextResponse } from 'next/server';
import { getLatestManga, getSeriesManga, getPopularManga } from '@/app/services/api';

/**
 * Dynamic sitemap generator
 * This API route generates a sitemap.xml file based on the current manga in the database
 */
// This API route serves a secondary sitemap at /api/sitemap-api.xml
// The main sitemap is served through Next.js's built-in sitemap.ts mechanism
export async function GET() {
  try {
    // Fetch manga from different sources to include in sitemap
    const [latestManga, seriesManga, popularManga] = await Promise.all([
      getLatestManga(1),
      getSeriesManga(1),
      getPopularManga(1)
    ]);
    
    // Combine all manga results and remove duplicates based on ID
    const allMangaIds = new Set<string>();
    const combinedManga = [];
    
    // Add manga from latest
    for (const manga of latestManga.results) {
      if (!allMangaIds.has(manga.id)) {
        allMangaIds.add(manga.id);
        combinedManga.push(manga);
      }
    }
    
    // Add manga from series
    for (const manga of seriesManga.results) {
      if (!allMangaIds.has(manga.id)) {
        allMangaIds.add(manga.id);
        combinedManga.push(manga);
      }
    }
    
    // Add manga from popular
    for (const manga of popularManga.results) {
      if (!allMangaIds.has(manga.id)) {
        allMangaIds.add(manga.id);
        combinedManga.push(manga);
      }
    }
    
    // Base URL for the site
    const baseUrl = "https://manhwanest.fun";
    
    // Get current date for lastmod
    const date = new Date().toISOString();
    
    // Start building the XML sitemap
    let xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>${baseUrl}</loc>
    <lastmod>${date}</lastmod>
    <changefreq>daily</changefreq>
    <priority>1.0</priority>
  </url>
  <url>
    <loc>${baseUrl}/browse</loc>
    <lastmod>${date}</lastmod>
    <changefreq>daily</changefreq>
    <priority>0.9</priority>
  </url>
  <url>
    <loc>${baseUrl}/bookmarks</loc>
    <lastmod>${date}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
  </url>`;
    
    // Add manga detail pages
    for (const manga of combinedManga) {
      // Make sure the ID doesn't have the "series/" prefix
      const mangaId = manga.id.startsWith('series/') ? manga.id.replace('series/', '') : manga.id;
      
      xml += `
  <url>
    <loc>${baseUrl}/manga/${mangaId}</loc>
    <lastmod>${date}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
  </url>`;
    }
    
    // Close the XML
    xml += `
</urlset>`;
    
    // Set content type and return XML
    return new Response(xml, {
      headers: {
        'Content-Type': 'application/xml',
        // Add cache control headers to control caching
        'Cache-Control': 'public, max-age=3600, s-maxage=3600',
      },
    });
  } catch (error) {
    console.error('Error generating sitemap:', error);
    return new NextResponse('Error generating sitemap', { status: 500 });
  }
} 