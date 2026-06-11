import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      // Все запросы, начинающиеся с /api, будут перенаправляться на ваш бэкенд
      '/api': {
        target: 'http://localhost:5000', // Адрес вашего бэкенд-сервера
        changeOrigin: true,
        secure: false,
      },
    },
  },
});