
import React from 'react';
import { SITE_CONFIG } from '../site-config';

const Footer: React.FC = () => {
  return (
    <footer className="border-t border-gray-100 py-12 px-6 bg-white">
      <div className="max-w-screen-xl mx-auto flex flex-col md:flex-row justify-between items-center space-y-6 md:space-y-0">
        <div className="flex items-center space-x-2">
          <div className="w-6 h-6 bg-black rounded flex items-center justify-center">
            <span className="text-white font-bold text-[10px]">
              {SITE_CONFIG.shortName.slice(0, 2).toUpperCase()}
            </span>
          </div>
          <span className="font-bold text-sm">{SITE_CONFIG.name}</span>
        </div>
        
        <div className="flex space-x-8 text-sm text-gray-500">
          <a href="#" className="hover:text-black transition">Archive</a>
          <a href="#" className="hover:text-black transition">About</a>
          <a href={SITE_CONFIG.social.twitter} target="_blank" className="hover:text-black transition">Twitter</a>
          <a href={SITE_CONFIG.social.github} target="_blank" className="hover:text-black transition">GitHub</a>
        </div>
        
        <div className="text-xs text-gray-400">
          © {new Date().getFullYear()} {SITE_CONFIG.newsletterName}. Powered by Gemini.
        </div>
      </div>
    </footer>
  );
};

export default Footer;
