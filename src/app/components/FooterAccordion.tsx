'use client';

import { useState } from 'react';
import CustomChevronIcon from './CustomChevronIcon';

type FooterAccordionProps = {
  title: string;
  children: React.ReactNode;
  className?: string;
}

export default function FooterAccordion({ title, children, className = '' }: FooterAccordionProps) {
  const [isOpen, setIsOpen] = useState(false);
  
  return (
    <div className={`border-t border-gray-800 py-2 ${className}`}>
      <button 
        onClick={() => setIsOpen(!isOpen)} 
        className="flex items-center justify-between w-full py-2 text-left"
      >
        <h3 className="text-sm font-semibold text-white">{title}</h3>
        <CustomChevronIcon isOpen={isOpen} />
      </button>
      
      {isOpen && (
        <div className="pt-2 pb-1 pl-2">
          {children}
        </div>
      )}
    </div>
  );
} 