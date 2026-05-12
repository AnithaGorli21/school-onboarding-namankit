import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
const TARGET =  'https://mahadbt2-uat-dashboard.quantela.com' // ← change once here

export default defineConfig({
  base: '/o/namankit-scheme',
  build: {
    outDir: './vite-build',
    rollupOptions: {
      external: [
        /^(?!@clayui\/css)@clayui.*$/,
      ],
    },
  },
  plugins: [
    react(), // ← automatic JSX runtime, no need for React imports
  ],
  server: {
    port: 5002,
    historyApiFallback: true,
   proxy: {
  '/o/c/pomasters':             { target: TARGET, changeOrigin: true, secure: false },
  '/o/c/atcmasters':            { target: TARGET, changeOrigin: true, secure: false },
  '/o/c':                       { target: TARGET, changeOrigin: true, secure: false },
  '/o/headless-delivery':       { target: TARGET, changeOrigin: true, secure: false },
  '/o/headless-admin-user':     { target: TARGET, changeOrigin: true, secure: false },
  '/o/headless-admin-list-type':{ target: TARGET, changeOrigin: true, secure: false },
  '/o/notification':            { target: TARGET, changeOrigin: true, secure: false },
  '/o/oauth2':                  { target: TARGET, changeOrigin: true, secure: false }, // ← add this too for Bearer token
},
  },
});