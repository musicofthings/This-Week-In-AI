
import React from 'react';
import { NewsContent, NewsArticle } from '../types';
import { SITE_CONFIG } from '../site-config';

interface Props {
  content: NewsContent | null;
  onSubscribeClick: () => void;
  onArticleClick: (article: NewsArticle) => void;
  filter: string;
  isSubscribed?: boolean;
}

const NewsCard: React.FC<{ article: NewsArticle; index: number; onClick: () => void }> = ({ article, index, onClick }) => {
  let hostname = 'news-source';
  try {
    const urlString = article.sourceUrl.startsWith('http') ? article.sourceUrl : `https://${article.sourceUrl}`;
    const url = new URL(urlString);
    hostname = url.hostname.replace('www.', '');
  } catch (e) {
    console.warn('Invalid URL for article:', article.title);
  }

  const isFallbackLink = article.sourceUrl.includes('google.com/search');

  return (
    <div className="group flex flex-col bg-white border border-gray-100 rounded-xl overflow-hidden hover:shadow-xl hover:border-orange-200 transition-all duration-300">
      <button 
        onClick={onClick}
        className="block relative aspect-video overflow-hidden w-full text-left"
        aria-label={`Read more about ${article.title}`}
      >
        <img 
          src={`https://picsum.photos/seed/ai-portal-${index}-${article.category.toLowerCase()}/800/450`} 
          alt=""
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
        <div className="absolute top-3 left-3 flex flex-col gap-2">
          <span className="px-2 py-1 bg-white/95 backdrop-blur text-[10px] font-bold tracking-wider text-gray-900 rounded shadow-sm uppercase border border-gray-100">
            {article.category}
          </span>
          {isFallbackLink ? (
             <span className="px-2 py-1 bg-amber-500/90 backdrop-blur text-[8px] font-bold tracking-widest text-white rounded shadow-sm uppercase flex items-center gap-1">
                <svg className="w-2 h-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>
                Sync Req.
             </span>
          ) : (
            <span className="px-2 py-1 bg-green-500/90 backdrop-blur text-[8px] font-bold tracking-widest text-white rounded shadow-sm uppercase flex items-center gap-1">
                <svg className="w-2 h-2" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"></path></svg>
                Verified
            </span>
          )}
        </div>
      </button>
      
      <div className="p-5 flex-1 flex flex-col">
        <div className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mb-2 flex items-center gap-2">
          <span>{article.date}</span>
          <span className="w-1 h-1 bg-gray-300 rounded-full"></span>
          <span className="truncate max-w-[150px]">{hostname}</span>
        </div>
        
        <button 
          onClick={onClick}
          className="block text-left group-hover:text-orange-600 transition-colors"
        >
          <h3 className="text-xl font-serif font-bold leading-snug mb-3 line-clamp-2">
            {article.title}
          </h3>
        </button>

        <p className="text-sm text-gray-600 line-clamp-3 mb-4 flex-1 leading-relaxed">
          {article.excerpt}
        </p>

        <div className="flex flex-wrap gap-2 mb-6">
          {article.tags.slice(0, 3).map((tag, i) => (
            <span key={i} className="text-[10px] font-medium text-orange-600 bg-orange-50 px-2 py-0.5 rounded">
              {tag.startsWith('#') ? tag : `#${tag}`}
            </span>
          ))}
        </div>
        
        <div className="mt-auto pt-4 border-t border-gray-50 flex items-center justify-between">
          <button 
            onClick={onClick}
            className="text-sm font-bold text-black hover:text-orange-600 inline-flex items-center gap-1 group/link"
          >
            Intelligence Briefing
            <svg className="w-4 h-4 transition-transform group-hover/link:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path>
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"></path>
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
};

const NewsSection: React.FC<Props> = ({ content, onSubscribeClick, onArticleClick, filter, isSubscribed }) => {
  if (!content) return null;

  const filteredArticles = filter === 'ALL' 
    ? content.articles 
    : content.articles.filter(a => a.category.toUpperCase() === filter.toUpperCase());

  return (
    <div className="space-y-16">
      {filteredArticles.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredArticles.map((article, idx) => (
            <NewsCard key={idx} article={article} index={idx} onClick={() => onArticleClick(article)} />
          ))}
        </div>
      ) : (
        <div className="text-center py-20 bg-gray-50 rounded-3xl border-2 border-dashed border-gray-100">
          <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-sm">
            <svg className="w-8 h-8 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"></path></svg>
          </div>
          <h3 className="text-xl font-serif font-bold mb-2">No reports in {filter}</h3>
          <p className="text-gray-500 max-w-xs mx-auto text-sm">Our intelligence unit hasn't processed breakthroughs in this category for the current period.</p>
        </div>
      )}

      <div className="bg-black text-white rounded-3xl p-10 md:p-16 relative overflow-hidden group/cta">
        <div className="relative z-10 max-w-lg">
          {isSubscribed ? (
            <>
              <div className="inline-flex items-center gap-2 px-3 py-1 bg-orange-500/20 text-orange-400 text-[10px] font-bold rounded-full uppercase tracking-widest mb-6 border border-orange-500/30">
                <span className="w-1.5 h-1.5 bg-orange-500 rounded-full animate-pulse"></span>
                Insider Access Active
              </div>
              <h3 className="text-3xl md:text-4xl font-serif font-bold mb-4">The intelligence unit is synced.</h3>
              <p className="text-gray-400 text-lg mb-0 leading-relaxed">
                Thank you for being part of our {SITE_CONFIG.stats.subscriberCount} readers. You will receive the next briefing {SITE_CONFIG.stats.frequency.toLowerCase()}.
              </p>
            </>
          ) : (
            <>
              <h3 className="text-3xl md:text-4xl font-serif font-bold mb-4">Stay ahead of the curve.</h3>
              <p className="text-gray-400 text-lg mb-8">
                {SITE_CONFIG.newsletterName} is your weekly filter for the noise of the industry. Delivered {SITE_CONFIG.stats.frequency.toLowerCase()}.
              </p>
              <div className="flex flex-col sm:flex-row gap-3">
                <div className="flex-1 relative">
                  <input 
                    type="email" 
                    placeholder="Your email" 
                    onClick={(e) => { e.preventDefault(); onSubscribeClick(); }}
                    className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-3 text-white placeholder:text-white/40 focus:outline-none focus:ring-2 focus:ring-orange-500 cursor-pointer"
                    readOnly
                  />
                </div>
                <button 
                  onClick={onSubscribeClick}
                  className="hover:opacity-90 text-white font-bold py-3 px-8 rounded-lg transition shadow-lg group-hover/cta:scale-105"
                  style={{ backgroundColor: SITE_CONFIG.accentColor }}
                >
                  Subscribe
                </button>
              </div>
            </>
          )}
        </div>
        <div className="absolute right-0 bottom-0 top-0 w-1/3 bg-gradient-to-l from-orange-600/10 to-transparent hidden md:block"></div>
      </div>

      {content.sources.length > 0 && (
        <div className="pt-10 border-t border-gray-100">
          <h3 className="text-sm font-bold text-gray-400 uppercase tracking-widest mb-6 text-center">Verified Information Sources</h3>
          <div className="flex flex-wrap justify-center gap-3">
            {content.sources.slice(0, 10).map((source, idx) => (
              <a 
                key={idx}
                href={source.uri} 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-[11px] font-semibold text-gray-500 hover:text-black border border-gray-100 rounded-md px-3 py-1.5 bg-gray-50/50 hover:bg-gray-100 transition-all"
              >
                {source.title}
              </a>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default NewsSection;
