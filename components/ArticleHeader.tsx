
import React from 'react';
import { SITE_CONFIG } from '../site-config';

interface Props {
  date: string;
  isRefreshing?: boolean;
  onRefresh?: () => void;
}

const ArticleHeader: React.FC<Props> = ({ date, isRefreshing, onRefresh }) => {
  return (
    <div className="mb-12 text-center relative">
      <div className="flex flex-col items-center gap-4 mb-4">
        <div className="flex items-center gap-3">
          <div className="inline-block px-3 py-1 bg-orange-50 text-orange-700 text-[10px] font-bold rounded-full uppercase tracking-[0.2em]">
            {SITE_CONFIG.tagline}
          </div>
          <div className="flex items-center gap-1.5 text-[10px] font-bold text-gray-400 uppercase tracking-widest">
            <span className={`w-1.5 h-1.5 rounded-full ${isRefreshing ? 'bg-orange-500 animate-pulse' : 'bg-green-500'}`}></span>
            {isRefreshing ? 'Updating...' : 'Live Sync'}
          </div>
        </div>
      </div>
      
      <h1 className="text-4xl md:text-5xl lg:text-7xl font-serif font-bold leading-tight mb-4 tracking-tight">
        {SITE_CONFIG.name}
      </h1>
      
      <p className="text-xl text-gray-500 font-serif max-w-2xl mx-auto italic mb-8">
        {SITE_CONFIG.description} Curated for the week of {date}.
      </p>

      <div className="flex items-center justify-center gap-4">
        <button 
          onClick={onRefresh}
          className="text-[10px] font-bold text-gray-400 hover:text-black uppercase tracking-widest flex items-center gap-2 transition-colors group"
        >
          <svg className={`w-3 h-3 ${isRefreshing ? 'animate-spin' : 'group-hover:rotate-180 transition-transform duration-500'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"></path>
          </svg>
          Refresh Feed
        </button>
      </div>

      <div className="mt-8 border-b border-gray-100 max-w-4xl mx-auto"></div>
    </div>
  );
};

export default ArticleHeader;
