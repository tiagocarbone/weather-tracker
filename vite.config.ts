import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react-swc';
import { resolve } from 'path';

export default defineConfig({
  plugins: [react()],
  resolve: {
    // Frontend source lives under src/frontend; map @ to that folder so imports like
    // '@/components/...' resolve to src/frontend/components/...
    alias: [{ find: '@', replacement: resolve(__dirname, 'src/frontend') }],
  },
  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:5000',
        changeOrigin: true,
        secure: false,
      }
    }
  }
});
