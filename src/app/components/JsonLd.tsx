'use client';

import Script from 'next/script';

interface JsonLdProps {
  data: string;
}

export default function JsonLd({ data }: JsonLdProps) {
  return (
    <Script
      id="json-ld"
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: data }}
      strategy="afterInteractive"
    />
  );
} 