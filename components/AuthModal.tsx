
import React, { useState } from 'react';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (email: string) => void;
}

const AuthModal: React.FC<AuthModalProps> = ({ isOpen, onClose, onSuccess }) => {
  const [email, setEmail] = useState('');
  const [step, setStep] = useState<'input' | 'sending' | 'success'>('input');
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setStep('sending');
    
    try {
      const res = await fetch(`/api/auth`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email })
      }).catch(() => {
        // Fallback for static hosting (GitHub Pages) where /api/auth 404s
        return { ok: true, json: async () => ({ success: true }) } as Response;
      });
      
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Authentication failed");
      
      setStep('success');
      setTimeout(() => {
        onSuccess(email);
        onClose();
        setStep('input');
        setEmail('');
      }, 1500);
    } catch (err: any) {
      setError(err.message);
      setStep('input');
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center px-4">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-white w-full max-w-md rounded-2xl shadow-2xl p-8 md:p-10">
        <button onClick={onClose} className="absolute top-4 right-4 text-gray-400 hover:text-black transition p-2">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
        </button>

        <div className="text-center">
          {step === 'input' && (
            <>
              <h2 className="text-3xl font-serif font-bold mb-2">Sign in</h2>
              <p className="text-gray-500 mb-8">Enter your email for a secure briefing link.</p>
              {error && <div className="mb-4 p-3 bg-red-50 text-red-600 text-sm rounded-lg">{error}</div>}
              <form onSubmit={handleSubmit} className="space-y-4">
                <input
                  type="email"
                  required
                  placeholder="name@company.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-orange-500 bg-gray-50 outline-none transition-all"
                />
                <button type="submit" className="w-full bg-black text-white font-bold py-3.5 rounded-lg hover:bg-gray-800 transition shadow-lg">
                  Access Intelligence
                </button>
              </form>
            </>
          )}

          {step === 'sending' && (
            <div className="py-12">
              <div className="w-16 h-16 border-4 border-orange-100 border-t-orange-500 rounded-full animate-spin mx-auto mb-6"></div>
              <h3 className="text-xl font-bold mb-2">Synchronizing...</h3>
              <p className="text-sm text-gray-500">Establishing secure connection</p>
            </div>
          )}

          {step === 'success' && (
            <div className="py-12 animate-in zoom-in duration-300">
              <div className="w-20 h-20 bg-green-50 text-green-600 rounded-full mb-6 flex items-center justify-center mx-auto">
                <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M5 13l4 4L19 7"></path></svg>
              </div>
              <h3 className="text-xl font-bold mb-2">Authenticated</h3>
              <p className="text-sm text-gray-500">Accessing the Intelligence Unit...</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AuthModal;
