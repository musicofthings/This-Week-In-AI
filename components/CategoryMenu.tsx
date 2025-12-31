
import React from 'react';
import { SITE_CONFIG } from '../site-config';

interface Props {
  selectedCategory: string;
  onSelect: (category: string) => void;
  className?: string;
}

const CategoryMenu: React.FC<Props> = ({ selectedCategory, onSelect, className = "" }) => {
  return (
    <div className={`flex items-center justify-center gap-1 md:gap-4 overflow-x-auto no-scrollbar py-2 border-y border-gray-100 ${className}`}>
      {SITE_CONFIG.categories.map((cat) => (
        <button
          key={cat}
          onClick={() => onSelect(cat)}
          className={`px-3 py-1.5 text-[11px] md:text-xs font-bold tracking-widest rounded-full transition-all whitespace-nowrap ${
            selectedCategory === cat 
              ? 'bg-black text-white' 
              : 'text-gray-500 hover:text-black hover:bg-gray-50'
          }`}
        >
          {cat}
        </button>
      ))}
    </div>
  );
};

export default CategoryMenu;
