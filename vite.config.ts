import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  server: {
    port: 8082, // Use a different port from the main application
    proxy: {
      '/api': {
        target: 'http://localhost:8081', // Main application
        changeOrigin: true,
      },
    },
  },
}); 