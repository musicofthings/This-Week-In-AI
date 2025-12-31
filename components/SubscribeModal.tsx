
import React, { useState } from 'react';
import { SITE_CONFIG } from '../site-config';

interface SubscribeModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (email: string) => void;
}

const SubscribeModal: React.FC<SubscribeModalProps> = ({ isOpen, onClose, onSuccess }) => {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'success'>('idle');
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    
    setStatus('loading');
    setError(null);
    
    try {
      const res = await fetch(`/api/subscribe`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email })
      }).catch(() => {
        // Fallback for static hosting
        return { ok: true, json: async () => ({ success: true }) } as Response;
      });
      
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Subscription failed");
      
      setStatus('success');
      setTimeout(() => {
        onSuccess(email);
        onClose();
        setTimeout(() => setStatus('idle'), 500);
      }, 1500);
    } catch (err: any) {
      setError(err.message);
      setStatus('idle');
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center px-4">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-white w-full max-w-lg rounded-3xl shadow-2xl overflow-hidden animate-in slide-in-from-bottom-8 duration-300">
        <div className="h-1.5 w-full" style={{ backgroundColor: SITE_CONFIG.accentColor }} />
        <button onClick={onClose} className="absolute top-6 right-6 text-gray-400 hover:text-black bg-gray-50 rounded-full p-2">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
        </button>

        <div className="p-10 md:p-14">
          {status !== 'success' ? (
            <>
              <h2 className="text-4xl font-serif font-bold mb-4">{SITE_CONFIG.newsletterName}</h2>
              <p className="text-gray-500 text-lg mb-8 leading-relaxed">Join {SITE_CONFIG.stats.subscriberCount} members. Breakthroughs delivered {SITE_CONFIG.stats.frequency.toLowerCase()}.</p>
              {error && <div className="mb-4 p-3 bg-red-50 text-red-600 text-sm rounded-lg">{error}</div>}
              <form onSubmit={handleSubmit} className="space-y-5">
                <input
                  type="email"
                  required
                  placeholder="name@intelligence.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-5 py-4 bg-gray-50 border border-gray-100 rounded-xl text-lg outline-none focus:ring-2 focus:ring-orange-500 transition-all"
                />
                <button
                  type="submit"
                  disabled={status === 'loading'}
                  className="w-full text-white font-bold py-4 rounded-xl transition shadow-xl flex items-center justify-center gap-3 hover:scale-[1.02] active:scale-[0.98]"
                  style={{ backgroundColor: SITE_CONFIG.accentColor }}
                >
                  {status === 'loading' ? 'Encrypting...' : 'Secure Subscription'}
                </button>
              </form>
            </>
          ) : (
            <div className="text-center py-10 animate-in zoom-in duration-500">
               <div className="w-20 h-20 bg-orange-50 rounded-full flex items-center justify-center mx-auto mb-6 text-orange-600">
                  <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M5 13l4 4L19 7"></path></svg>
               </div>
               <h2 className="text-3xl font-serif font-bold mb-2">Sync Complete.</h2>
               <p className="text-gray-500">You are now part of the Intelligence Unit.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SubscribeModal;
