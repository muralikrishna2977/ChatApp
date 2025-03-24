import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  base: '/ChatApp/', // Ensure this matches your repository name
  build: {
    outDir: 'dist', // Default output directory
  }
});

