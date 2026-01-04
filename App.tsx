
import React, { useState, useEffect, useCallback, useRef } from 'react';
import { fetchLatestAINews, HISTORICAL_REPORTS } from './services/gemini';
import { NewsContent, NewsArticle, GroundingSource } from './types';
import Navbar from './components/Navbar';
import ArticleHeader from './components/ArticleHeader';
import NewsSection from './components/NewsSection';
import Skeleton from './components/Skeleton';
import Footer from './components/Footer';
import AuthModal from './components/AuthModal';
import SubscribeModal from './components/SubscribeModal';
import CategoryMenu from './components/CategoryMenu';
import ArticleOverlay from './components/ArticleOverlay';

const STORAGE_KEY = 'ai_news_archive_v18'; 
const SYNC_KEY = 'ai_news_last_sync_timestamp';
const RETRY_KEY = 'ai_news_retry_until'; // New cool-down key
const USER_KEY = 'ai_user_email';
const SUB_KEY = 'ai_user_subscribed';

const App: React.FC = () => {
  const [news, setNews] = useState<NewsContent | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [isRefreshing, setIsRefreshing] = useState(false);
  
  const [selectedCategory, setSelectedCategory] = useState('ALL');
  const [selectedArticle, setSelectedArticle] = useState<NewsArticle | null>(null);
  const [isAuthModalOpen, setAuthModalOpen] = useState(false);
  const [isSubscribeModalOpen, setSubscribeModalOpen] = useState(false);
  
  const [userEmail, setUserEmail] = useState<string | null>(localStorage.getItem(USER_KEY));
  const [isSubscribed, setIsSubscribed] = useState<boolean>(localStorage.getItem(SUB_KEY) === 'true');

  const initialized = useRef(false);

  const saveToCache = useCallback((newContent: NewsContent | null) => {
    const cachedRaw = localStorage.getItem(STORAGE_KEY);
    const articleMap = new Map<string, NewsArticle>();
    const sourceMap = new Map<string, GroundingSource>();

    // Step 1: Initialize with expanded Historical Reports
    HISTORICAL_REPORTS.forEach(a => {
      const key = a.title.trim().toLowerCase();
      articleMap.set(key, { ...a, category: a.category.toUpperCase() });
    });

    // Step 2: Merge existing Archive
    if (cachedRaw) {
      try {
        const cached: NewsContent = JSON.parse(cachedRaw);
        cached.articles.forEach(a => {
          const key = a.title.trim().toLowerCase();
          const existing = articleMap.get(key);
          if (!existing || a.content.length > existing.content.length) {
            articleMap.set(key, { ...a, category: a.category.toUpperCase() });
          }
        });
        cached.sources.forEach(s => sourceMap.set(s.uri, s));
      } catch (e) {
        console.warn("Recalibrating archive...");
      }
    }

    // Step 3: Merge Fresh Intelligence
    if (newContent) {
      newContent.articles.forEach(a => {
        const key = a.title.trim().toLowerCase();
        const existing = articleMap.get(key);
        if (!existing || a.content.length > existing.content.length) {
          articleMap.set(key, { ...a, category: a.category.toUpperCase() });
        }
      });
      newContent.sources.forEach(s => sourceMap.set(s.uri, s));
    }

    let allArticles = Array.from(articleMap.values());
    allArticles.sort((a, b) => {
      const d1 = new Date(a.date).getTime() || 0;
      const d2 = new Date(b.date).getTime() || 0;
      return d2 - d1;
    });

    if (allArticles.length > 500) {
      allArticles = allArticles.slice(0, 500);
    }

    const finalContent: NewsContent = {
      articles: allArticles,
      sources: Array.from(sourceMap.values()).slice(0, 100),
      lastUpdated: newContent?.lastUpdated || news?.lastUpdated || new Date().toLocaleDateString()
    };

    localStorage.setItem(STORAGE_KEY, JSON.stringify(finalContent));
    localStorage.setItem(SYNC_KEY, Date.now().toString());
    setNews(finalContent);
  }, [news]);

  const loadNews = useCallback(async (isBackground = false) => {
    // FIX 1: Check Cool-down Timer
    const retryUntil = localStorage.getItem(RETRY_KEY);
    if (retryUntil && Date.now() < parseInt(retryUntil)) {
      console.log("Cool-down active. Skipping API sync.");
      setLoading(false);
      // Ensure we have data loaded
      const cachedRaw = localStorage.getItem(STORAGE_KEY);
      if (cachedRaw && !news) {
        try { setNews(JSON.parse(cachedRaw)); } catch(e) {}
      }
      return; 
    }

    try {
      if (!isBackground) setLoading(true);
      setIsRefreshing(true);
      setError(null);
      
      const data = await fetchLatestAINews();
      
      // Success! Clear retry timer
      localStorage.removeItem(RETRY_KEY);

      if (data && data.articles && data.articles.length > 0) {
        saveToCache(data);
      } else {
        saveToCache(null);
      }
    } catch (err: any) {
      console.error("Sync error:", err.message);

      // FIX 2: Set Cool-down on 429/Quota errors (1 hour)
      const isQuota = err.message.includes("Capacity") || err.message.includes("429") || err.message.includes("quota");
      if (isQuota) {
         const cooldown = Date.now() + (60 * 60 * 1000); 
         localStorage.setItem(RETRY_KEY, cooldown.toString());
      }

      // FIX 3: Suppress error if we have ANY content (Historical or Cached)
      const cachedRaw = localStorage.getItem(STORAGE_KEY);
      
      if (cachedRaw) {
        try {
          const cached = JSON.parse(cachedRaw);
          setNews(cached);
          
          // If we have content, DO NOT show the red error box.
          // Users prefer stale content over a broken site.
          if (cached.articles.length > 0) {
            console.warn("Suppressing UI error due to available archive content.");
          } else {
            // Only show error if we have literally nothing
            setError("Unable to retrieve briefings. Please check back later.");
          }
        } catch (e) {
          setError("Briefing unavailable. Please refresh.");
          saveToCache(null);
        }
      } else {
         // Fallback to historical reports (which saveToCache(null) generates)
         saveToCache(null);
         // Even here, we suppress error because saveToCache(null) populates HISTORICAL_REPORTS
      }
    } finally {
      setLoading(false);
      setIsRefreshing(false);
    }
  }, [news, saveToCache]);

  useEffect(() => {
    if (initialized.current) return;
    initialized.current = true;

    const cachedRaw = localStorage.getItem(STORAGE_KEY);
    const lastSync = localStorage.getItem(SYNC_KEY);
    
    if (cachedRaw) {
      try {
        const parsed = JSON.parse(cachedRaw);
        setNews(parsed);
        setLoading(false);
        // Refresh every 24 hours
        if (!lastSync || Date.now() - parseInt(lastSync) > 86400000) {
          loadNews(true);
        } else {
          // If no sync needed, still check if we missed a background update
          // or if user manually requests one later.
        }
      } catch (e) {
        loadNews();
      }
    } else {
      saveToCache(null);
      loadNews();
    }
  }, []);

  const handleSignInSuccess = (email: string) => {
    setUserEmail(email);
    localStorage.setItem(USER_KEY, email);
  };

  const handleSubscribeSuccess = (email: string) => {
    setUserEmail(email);
    setIsSubscribed(true);
    localStorage.setItem(USER_KEY, email);
    localStorage.setItem(SUB_KEY, 'true');
  };

  const handleSignOut = () => {
    setUserEmail(null);
    setIsSubscribed(false);
    localStorage.removeItem(USER_KEY);
    localStorage.removeItem(SUB_KEY);
  };

  return (
    <div className="min-h-screen bg-white text-black font-sans selection:bg-orange-100">
      <Navbar 
        onSignInClick={() => setAuthModalOpen(true)}
        onSubscribeClick={() => setSubscribeModalOpen(true)}
        userEmail={userEmail}
        onSignOut={handleSignOut}
      />
      
      <main className="max-w-screen-xl mx-auto px-6 py-12">
        {loading && (!news || news.articles.length === 0) ? (
          <Skeleton />
        ) : (
          <>
            <ArticleHeader 
              date={news?.lastUpdated || new Date().toLocaleDateString()} 
              isRefreshing={isRefreshing}
              onRefresh={() => {
                // Allow manual override of cooldown
                localStorage.removeItem(RETRY_KEY);
                loadNews();
              }}
            />
            
            <CategoryMenu 
              selectedCategory={selectedCategory} 
              onSelect={setSelectedCategory}
              className="mb-12"
            />

            {error && (
               <div className="mb-8 p-4 bg-orange-50 border border-orange-100 rounded-xl text-orange-700 text-center text-xs font-bold uppercase tracking-widest animate-in fade-in slide-in-from-top-4 duration-500">
                 {error}
               </div>
            )}
            
            <NewsSection 
              content={news} 
              onSubscribeClick={() => setSubscribeModalOpen(true)}
              onArticleClick={setSelectedArticle}
              filter={selectedCategory}
              isSubscribed={isSubscribed}
            />
          </>
        )}
      </main>

      <Footer />

      <AuthModal 
        isOpen={isAuthModalOpen} 
        onClose={() => setAuthModalOpen(false)} 
        onSuccess={handleSignInSuccess}
      />

      <SubscribeModal 
        isOpen={isSubscribeModalOpen} 
        onClose={() => setSubscribeModalOpen(false)} 
        onSuccess={handleSubscribeSuccess}
      />

      <ArticleOverlay 
        article={selectedArticle} 
        onClose={() => setSelectedArticle(null)}
      />
    </div>
  );
};

export default App;
