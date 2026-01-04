import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig(({ mode }) => {
  // Load env file based on `mode` in the current working directory.
  // Fix: Cast process to any to avoid "Property 'cwd' does not exist on type 'Process'" error.
  const env = loadEnv(mode, (process as any).cwd(), '');
  
  // Cloudflare Pages / Vite Best Practice:
  // Prefer VITE_API_KEY for client-side variables.
  // Fallback to API_KEY if set in system environment (e.g. Cloudflare Dashboard).
  const apiKey = env.VITE_API_KEY || env.API_KEY || process.env.API_KEY || "";

  return {
    plugins: [react()],
    define: {
      // Inject the API key into the client bundle securely
      // This allows 'process.env.API_KEY' to work in client code even if using VITE_ prefix
      'process.env.API_KEY': JSON.stringify(apiKey)
    },
    build: {
      outDir: 'dist',
      emptyOutDir: true,
      sourcemap: false
    },
    server: {
      port: 3000,
      proxy: {
        '/api': {
          target: 'http://127.0.0.1:8788',
          changeOrigin: true,
          secure: false,
          ws: true
        }
      }
    }
  };
});