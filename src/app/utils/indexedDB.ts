/**
 * IndexedDB utility for bookmark management
 */

const DB_NAME = 'asuraMangaDB';
const DB_VERSION = 1;
const BOOKMARK_STORE = 'bookmarks';

interface BookmarkItem {
  mangaId: string;
  title: string;
  image: string;
  addedAt: number;
}

/**
 * Initialize the IndexedDB database
 */
export function initDB(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION);

    request.onerror = () => {
      console.error('Error opening IndexedDB');
      reject(new Error('Could not open IndexedDB'));
    };

    request.onsuccess = (event) => {
      const db = (event.target as IDBOpenDBRequest).result;
      resolve(db);
    };

    request.onupgradeneeded = (event) => {
      const db = (event.target as IDBOpenDBRequest).result;
      
      // Create the bookmarks object store with mangaId as key path
      if (!db.objectStoreNames.contains(BOOKMARK_STORE)) {
        const bookmarkStore = db.createObjectStore(BOOKMARK_STORE, { keyPath: 'mangaId' });
        
        // Create indexes for faster queries
        bookmarkStore.createIndex('addedAt', 'addedAt', { unique: false });
        bookmarkStore.createIndex('title', 'title', { unique: false });
      }
    };
  });
}

/**
 * Add a manga to bookmarks
 */
export async function addBookmark(manga: BookmarkItem): Promise<void> {
  try {
    const db = await initDB();
    const tx = db.transaction(BOOKMARK_STORE, 'readwrite');
    const store = tx.objectStore(BOOKMARK_STORE);
    
    // Add timestamp if not provided
    if (!manga.addedAt) {
      manga.addedAt = Date.now();
    }
    
    const request = store.put(manga);
    
    return new Promise((resolve, reject) => {
      request.onsuccess = () => resolve();
      request.onerror = () => reject(new Error('Failed to add bookmark'));
      tx.oncomplete = () => db.close();
    });
  } catch (error) {
    console.error('Error adding bookmark:', error);
    throw error;
  }
}

/**
 * Remove a manga from bookmarks
 */
export async function removeBookmark(mangaId: string): Promise<void> {
  try {
    const db = await initDB();
    const tx = db.transaction(BOOKMARK_STORE, 'readwrite');
    const store = tx.objectStore(BOOKMARK_STORE);
    
    const request = store.delete(mangaId);
    
    return new Promise((resolve, reject) => {
      request.onsuccess = () => resolve();
      request.onerror = () => reject(new Error('Failed to remove bookmark'));
      tx.oncomplete = () => db.close();
    });
  } catch (error) {
    console.error('Error removing bookmark:', error);
    throw error;
  }
}

/**
 * Check if a manga is bookmarked
 */
export async function isBookmarked(mangaId: string): Promise<boolean> {
  try {
    const db = await initDB();
    const tx = db.transaction(BOOKMARK_STORE, 'readonly');
    const store = tx.objectStore(BOOKMARK_STORE);
    
    const request = store.get(mangaId);
    
    return new Promise((resolve) => {
      request.onsuccess = () => resolve(!!request.result);
      request.onerror = () => resolve(false);
      tx.oncomplete = () => db.close();
    });
  } catch (error) {
    console.error('Error checking bookmark:', error);
    return false;
  }
}

/**
 * Get all bookmarked manga
 */
export async function getAllBookmarks(): Promise<BookmarkItem[]> {
  try {
    const db = await initDB();
    const tx = db.transaction(BOOKMARK_STORE, 'readonly');
    const store = tx.objectStore(BOOKMARK_STORE);
    
    // Get all records sorted by addedAt (newest first)
    const index = store.index('addedAt');
    const request = index.openCursor(null, 'prev');
    
    const bookmarks: BookmarkItem[] = [];
    
    return new Promise((resolve) => {
      request.onsuccess = (event) => {
        const cursor = (event.target as IDBRequest<IDBCursorWithValue>).result;
        
        if (cursor) {
          bookmarks.push(cursor.value);
          cursor.continue();
        } else {
          resolve(bookmarks);
        }
      };
      
      request.onerror = () => resolve([]);
      tx.oncomplete = () => db.close();
    });
  } catch (error) {
    console.error('Error getting bookmarks:', error);
    return [];
  }
}

export type { BookmarkItem }; 