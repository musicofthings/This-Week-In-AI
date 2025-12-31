
import React from 'react';
import { SITE_CONFIG } from '../site-config';

interface NavbarProps {
  onSignInClick: () => void;
  onSubscribeClick: () => void;
  userEmail: string | null;
  onSignOut: () => void;
}

const Navbar: React.FC<NavbarProps> = ({ onSignInClick, onSubscribeClick, userEmail, onSignOut }) => {
  return (
    <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-100">
      <div className="max-w-screen-xl mx-auto px-6 h-16 flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <div className="w-8 h-8 bg-black rounded flex items-center justify-center">
            <span className="text-white font-bold text-xs">
              {SITE_CONFIG.name.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase()}
            </span>
          </div>
          <span className="font-bold text-xl tracking-tight hidden sm:block">{SITE_CONFIG.name}</span>
        </div>
        
        <nav className="flex items-center space-x-6">
          {userEmail ? (
            <div className="flex items-center space-x-4">
              <span className="text-sm font-medium text-gray-600 hidden md:block">
                {userEmail}
              </span>
              <button 
                onClick={onSignOut}
                className="text-sm font-medium text-gray-400 hover:text-black transition"
              >
                Sign out
              </button>
              <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center border border-gray-200 overflow-hidden">
                <img src={`https://api.dicebear.com/7.x/initials/svg?seed=${userEmail}`} alt="Avatar" />
              </div>
            </div>
          ) : (
            <>
              <button 
                onClick={onSignInClick}
                className="text-sm font-medium text-gray-500 hover:text-black"
              >
                Sign in
              </button>
              <button 
                onClick={onSubscribeClick}
                className="px-4 py-2 text-white rounded font-medium text-sm transition shadow-sm"
                style={{ backgroundColor: SITE_CONFIG.accentColor }}
              >
                Subscribe
              </button>
            </>
          )}
        </nav>
      </div>
    </header>
  );
};

export default Navbar;
