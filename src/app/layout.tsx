import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import FooterWrapper from "./components/FooterWrapper";
import Script from "next/script";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

// Website URL
const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://manhwanest.fun";

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  themeColor: "#0f0f0f",
};

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "ManhwaNest - Read Manga & Manhwa Online Free | Latest Updates",
    template: "%s | ManhwaNest",
  },
  description: "ManhwaNest is your premium destination for reading high-quality manga and manhwa online free. Enjoy the latest updates, HD scans, and a seamless reading experience with no ads.",
  keywords: [
    "read manga online free", "best manhwa websites", "read manhwa online", 
    "manga scans free", "latest manga chapters", "korean comics online", 
    "free manhwa reading sites", "manga updates daily", "popular manga series", 
    "top manhwa 2025", "webtoon", "comics", "manga chapters"
  ],
  authors: [{ name: "ManhwaNest Team" }],
  creator: "ManhwaNest",
  publisher: "ManhwaNest",
  category: "Entertainment",
  applicationName: "ManhwaNest",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: siteUrl,
    siteName: "ManhwaNest",
    title: "ManhwaNest - Read Manga & Manhwa Online Free | Latest Updates",
    description: "Your premium destination for reading high-quality manga and manhwa online free with regular updates, HD scans, and zero ads. Find the best manga and manhwa titles all in one place.",
    images: [
      {
        url: `${siteUrl}/og-image.jpg`,
        width: 1200,
        height: 630,
        alt: "ManhwaNest - Premium Manga and Manhwa Reading Experience",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "ManhwaNest - Read Manga & Manhwa Online Free | Latest Updates",
    description: "Your premium destination for reading high-quality manga and manhwa online free with regular updates, HD scans, and zero ads. Find the best manga and manhwa titles all in one place.",
    images: [`${siteUrl}/twitter-image.jpg`],
    creator: "@ManhwaNest",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  manifest: `${siteUrl}/manifest.json`,
  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "32x32" },
      { url: "/favicon.svg", type: "image/svg+xml" }
    ],
    shortcut: "/favicon.ico",
    apple: "/favicon.svg",
  },
  verification: {
    google: "verification_token",
  },
  alternates: {
    canonical: siteUrl,
    languages: {
      "en-US": siteUrl,
    },
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <head>
        {/* Structured data for organization */}
        <Script
          id="organization-schema"
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Organization",
              name: "ManhwaNest",
              url: siteUrl,
              logo: `${siteUrl}/logo.png`,
              sameAs: [
                "https://discord.gg/7JKJSbnHqf",
                "https://www.instagram.com/shafat_420/"
              ],
              description: "A premium online platform for reading high-quality manga and manhwa for free, with regular updates and HD scans.",
            }),
          }}
        />

        {/* Structured data for WebSite */}
        <Script
          id="website-schema"
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "WebSite",
              name: "ManhwaNest",
              url: siteUrl,
              potentialAction: {
                "@type": "SearchAction",
                target: `${siteUrl}/search?query={search_term_string}`,
                "query-input": "required name=search_term_string",
              },
              description: "Read the latest manga and manhwa online for free. High-quality scans, fast updates, and a seamless reading experience.",
              keywords: "manga online, manhwa free, read comics online, korean webtoons",
              inLanguage: "en-US",
              copyrightYear: new Date().getFullYear(),
              genre: "Comics and Graphic Novels",
              audience: {
                "@type": "Audience",
                audienceType: "Manga and Manhwa Readers"
              }
            }),
          }}
        />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-gray-950 text-white`}
      >
        <FooterWrapper>
          {children}
        </FooterWrapper>
      </body>
    </html>
  );
}
