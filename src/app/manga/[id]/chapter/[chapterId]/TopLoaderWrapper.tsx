'use client';

import NextTopLoader from 'nextjs-toploader';

export default function TopLoaderWrapper() {
  return (
    <NextTopLoader 
      color="#ef4444" 
      showSpinner={false} 
      height={3}
      shadow="0 0 10px #ef4444,0 0 5px #ef4444"
    />
  );
} 