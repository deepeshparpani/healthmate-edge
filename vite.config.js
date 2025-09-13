import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  plugins: [react()],
  root: '.',                  // current folder
  base: './',                 // so it works with Electron file://
  build: {
    outDir: 'dist',           // production build
    rollupOptions: {
      input: path.resolve(__dirname, 'index.html')
    }
  },
  server: {
    port: 5173                // Vite dev server
  }
});
