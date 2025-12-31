
import React, { useState, useEffect } from 'react';
import { NewsArticle } from '../types';

interface ArticleOverlayProps {
  article: NewsArticle | null;
  onClose: () => void;
}

const BLOCKS_EMBED = [
  'nytimes.com', 'wsj.com', 'bloomberg.com', 'theverge.com', 'wired.com', 
  'techcrunch.com', 'medium.com', 'twitter.com', 'x.com', 'linkedin.com', 
  'openai.com', 'reuters.com', 'apnews.com', 'nature.com', 'github.com',
  'google.com', 'microsoft.com', 'apple.com', 'theguardian.com'
];

const ArticleOverlay: React.FC<ArticleOverlayProps> = ({ article, onClose }) => {
  const [viewMode, setViewMode] = useState<'summary' | 'full'>('summary');
  const [iframeError, setIframeError] = useState(false);
  
  useEffect(() => {
    if (article) {
      setViewMode('summary');
      setIframeError(false);
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => { document.body.style.overflow = 'unset'; };
  }, [article]);

  if (!article) return null;

  const isFallbackLink = article.sourceUrl.includes('google.com/search');

  const getHostname = (url: string) => {
    try {
      const u = new URL(url);
      return u.hostname.replace('www.', '');
    } catch (e) {
      return 'original source';
    }
  };

  const safeUrl = article.sourceUrl;
  const hostname = getHostname(safeUrl);
  const likelyBlocksIframe = BLOCKS_EMBED.some(domain => hostname.includes(domain));

  const handleOpenOriginal = () => {
    window.open(safeUrl, '_blank', 'noopener,noreferrer');
  };

  const handleSearchFallback = () => {
    const searchUrl = `https://www.google.com/search?q=${encodeURIComponent(article.title)}`;
    window.open(searchUrl, '_blank', 'noopener,noreferrer');
  };

  return (
    <div className="fixed inset-0 z-[110] flex flex-col bg-white animate-in slide-in-from-bottom-full duration-500">
      {/* Header */}
      <div className="h-16 border-b border-gray-100 flex items-center justify-between px-4 md:px-6 bg-white shrink-0 shadow-sm">
        <div className="flex items-center gap-2 md:gap-4 flex-1 min-w-0">
          <button 
            onClick={onClose}
            className="p-2 -ml-2 hover:bg-gray-100 rounded-full transition text-gray-400 hover:text-black shrink-0"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7"></path></svg>
          </button>
          <div className="flex flex-col min-w-0">
            <h2 className="font-bold text-xs md:text-sm truncate pr-4">{article.title}</h2>
            <div className="flex items-center gap-2">
              <span className="text-[9px] md:text-[10px] text-gray-400 font-bold uppercase tracking-widest truncate">{hostname}</span>
              {isFallbackLink ? (
                <span className="flex items-center gap-1 text-[8px] bg-amber-50 text-amber-600 font-extrabold px-1.5 py-0.5 rounded-full uppercase border border-amber-100">
                  Search Required
                </span>
              ) : (
                <span className="flex items-center gap-1 text-[8px] bg-green-50 text-green-600 font-extrabold px-1.5 py-0.5 rounded-full uppercase border border-green-100">
                  Verified URL
                </span>
              )}
            </div>
          </div>
        </div>
        
        <div className="flex items-center gap-2 shrink-0">
          <div className="flex bg-gray-100 rounded-lg p-1">
            <button 
              onClick={() => setViewMode('summary')}
              className={`px-3 py-1 text-[10px] md:text-xs font-bold rounded-md transition-all ${viewMode === 'summary' ? 'bg-white shadow-sm text-black' : 'text-gray-500 hover:text-black'}`}
            >
              Summary
            </button>
            <button 
              onClick={() => {
                if (isFallbackLink) {
                  handleSearchFallback();
                } else if (likelyBlocksIframe) {
                  if (confirm("This publisher (" + hostname + ") typically blocks embedded views. Open original in a new tab?")) {
                    handleOpenOriginal();
                  } else {
                    setViewMode('full');
                  }
                } else {
                  setViewMode('full');
                }
              }}
              className={`px-3 py-1 text-[10px] md:text-xs font-bold rounded-md transition-all ${viewMode === 'full' ? 'bg-white shadow-sm text-black' : 'text-gray-500 hover:text-black'}`}
            >
              Embed
            </button>
          </div>
        </div>
      </div>
      
      {/* Content */}
      <div className="flex-1 overflow-auto bg-gray-50/20">
        {viewMode === 'summary' ? (
          <div className="max-w-3xl mx-auto px-6 py-12 md:py-20 animate-in fade-in duration-500">
            {isFallbackLink && (
              <div className="mb-10 bg-amber-50 border border-amber-100 p-4 rounded-xl flex items-start gap-4 text-amber-800">
                <svg className="w-6 h-6 shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"></path></svg>
                <div className="text-sm">
                  <p className="font-bold mb-1">Direct Link Syncing...</p>
                  <p>Our intelligence unit could not verify a 100% stable direct URL for this story. Use the <strong>Search for Coverage</strong> button below to find the original publication.</p>
                </div>
              </div>
            )}

            <div className="mb-12">
              <span className="inline-block px-2.5 py-1 bg-orange-50 text-orange-700 text-[10px] font-bold rounded-md mb-6 uppercase tracking-widest border border-orange-100">
                {article.category}
              </span>
              <h1 className="text-3xl md:text-5xl lg:text-6xl font-serif font-bold leading-tight mb-8">
                {article.title}
              </h1>
              <div className="flex items-center gap-4 text-sm text-gray-400 font-semibold border-b border-gray-100 pb-8">
                <time>{article.date}</time>
                <span className="w-1.5 h-1.5 bg-gray-200 rounded-full"></span>
                <span className="capitalize">{hostname.split('.')[0]}</span>
              </div>
            </div>
            
            <div className="prose prose-lg max-w-none">
              <p className="text-xl md:text-2xl text-gray-600 font-serif italic mb-12 leading-relaxed border-l-4 border-orange-300 pl-8 bg-orange-50/30 py-4 rounded-r-lg">
                {article.excerpt}
              </p>
              
              <div className="text-lg md:text-xl text-gray-800 leading-relaxed space-y-10 font-serif">
                {article.content.split('\n').filter(p => p.trim()).map((p, i) => (
                  <p key={i}>{p}</p>
                ))}
              </div>
            </div>
            
            <div className="mt-24 pt-12 border-t border-gray-100 text-center">
               <h3 className="text-sm font-bold text-gray-400 uppercase tracking-widest mb-8">Access Original Coverage</h3>
               <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                {isFallbackLink ? (
                  <button 
                    onClick={handleSearchFallback}
                    className="w-full sm:w-auto px-10 py-4 bg-orange-600 text-white font-bold rounded-2xl hover:bg-orange-700 transition text-center shadow-xl shadow-orange-600/20 flex items-center justify-center gap-3"
                  >
                    Search for Coverage
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>
                  </button>
                ) : (
                  <button 
                    onClick={handleOpenOriginal}
                    className="w-full sm:w-auto px-10 py-4 bg-black text-white font-bold rounded-2xl hover:bg-gray-800 transition text-center shadow-xl shadow-black/10 flex items-center justify-center gap-3"
                  >
                    Visit Publisher
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M14 5l7 7m0 0l-7 7m7-7H3"></path></svg>
                  </button>
                )}
                
                {!isFallbackLink && (
                  <button 
                    onClick={handleSearchFallback}
                    className="w-full sm:w-auto px-10 py-4 bg-white border border-gray-200 text-gray-600 font-bold rounded-2xl hover:bg-gray-50 transition text-center"
                  >
                    Alternate Sources
                  </button>
                )}
              </div>
            </div>
          </div>
        ) : (
          <div className="w-full h-full relative bg-gray-50 flex flex-col">
            <div className="flex-1 relative bg-white">
              <div className="absolute inset-0 flex flex-col items-center justify-center p-12 text-center bg-gray-50">
                <div className="w-16 h-16 bg-white rounded-2xl shadow-sm flex items-center justify-center mb-6">
                  <svg className="w-8 h-8 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1"></path></svg>
                </div>
                <h3 className="text-xl font-bold mb-3">Initializing Embedded Frame...</h3>
                <p className="text-gray-500 max-w-sm text-sm leading-relaxed mb-8">
                  Frame security may prevent some publishers from loading. If blank, visit the publisher directly.
                </p>
                <button onClick={handleOpenOriginal} className="px-8 py-3 bg-black text-white font-bold rounded-xl shadow-lg">Open Website</button>
              </div>
              <iframe 
                src={safeUrl} 
                className={`w-full h-full border-none bg-white relative z-10 ${iframeError ? 'hidden' : ''}`}
                title={article.title}
                sandbox="allow-scripts allow-same-origin allow-popups allow-forms"
                onError={() => setIframeError(true)}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ArticleOverlay;
