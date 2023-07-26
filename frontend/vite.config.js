import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    apiFallback: true
  },
  build: {
    assetsDir: 'static' // Set the static folder to "static"
  }
});