/**
 * Formats a Date object into a readable string format
 * @param date The date to format
 * @returns Formatted date string (e.g., "Jan 15, 2023")
 */
export function formatDate(date: Date): string {
  // Check if the date is valid
  if (isNaN(date.getTime())) {
    return 'Invalid date';
  }
  
  // Options for date formatting
  const options: Intl.DateTimeFormatOptions = {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  };
  
  return date.toLocaleDateString('en-US', options);
}

/**
 * Formats a date string representing how long ago it was (relative time)
 * @param dateString The date string to format
 * @returns A string representing how long ago (e.g., "2 days ago")
 */
export function formatRelativeTime(dateString: string): string {
  try {
    const date = new Date(dateString);
    
    // Check if the date is valid
    if (isNaN(date.getTime())) {
      return 'Coming soon';
    }
    
    const now = new Date();
    
    // Check if the date is in the future
    if (date > now) {
      // For future dates, check if it's within a reasonable timeframe
      const yearDiff = date.getFullYear() - now.getFullYear();
      
      if (yearDiff > 1) {
        // If more than a year in the future, it's likely test data
        return 'Coming soon';
      } else {
        // For legitimate future dates within a year, format appropriately
        const diffInDays = Math.floor((date.getTime() - now.getTime()) / (1000 * 3600 * 24));
        
        if (diffInDays < 1) {
          return 'Coming today';
        } else if (diffInDays === 1) {
          return 'Coming tomorrow';
        } else if (diffInDays < 7) {
          return `Coming in ${diffInDays} days`;
        } else if (diffInDays < 30) {
          const weeks = Math.floor(diffInDays / 7);
          return `Coming in ${weeks} week${weeks > 1 ? 's' : ''}`;
        } else {
          const months = Math.floor(diffInDays / 30);
          return `Coming in ${months} month${months > 1 ? 's' : ''}`;
        }
      }
    }
    
    const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);
    
    // Less than a minute
    if (diffInSeconds < 60) {
      return 'Just now';
    }
    
    // Less than an hour
    if (diffInSeconds < 3600) {
      const minutes = Math.floor(diffInSeconds / 60);
      return `${minutes} minute${minutes > 1 ? 's' : ''} ago`;
    }
    
    // Less than a day
    if (diffInSeconds < 86400) {
      const hours = Math.floor(diffInSeconds / 3600);
      return `${hours} hour${hours > 1 ? 's' : ''} ago`;
    }
    
    // Less than a week
    if (diffInSeconds < 604800) {
      const days = Math.floor(diffInSeconds / 86400);
      return `${days} day${days > 1 ? 's' : ''} ago`;
    }
    
    // Less than a month
    if (diffInSeconds < 2592000) {
      const weeks = Math.floor(diffInSeconds / 604800);
      return `${weeks} week${weeks > 1 ? 's' : ''} ago`;
    }
    
    // Less than a year
    if (diffInSeconds < 31536000) {
      const months = Math.floor(diffInSeconds / 2592000);
      return `${months} month${months > 1 ? 's' : ''} ago`;
    }
    
    // More than a year
    const years = Math.floor(diffInSeconds / 31536000);
    return `${years} year${years > 1 ? 's' : ''} ago`;
  } catch (error) {
    console.error('Error formatting date:', error);
    return 'Coming soon';
  }
} 