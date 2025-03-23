'use client';

import { usePathname } from "next/navigation";
import Footer from "./Footer";

export default function FooterWrapper({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isChapterPage = pathname?.includes('/manga/') && pathname?.includes('/chapter/');
  
  return (
    <>
      {children}
      {!isChapterPage && <Footer />}
    </>
  );
} 