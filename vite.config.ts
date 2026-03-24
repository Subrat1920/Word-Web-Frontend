import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/api/v1': {
        target: 'https://word-app-backend-xjdl.onrender.com',
        changeOrigin: true,
        secure: false, // In case backend HTTPS has issues locally
      }
    }
  }
});
