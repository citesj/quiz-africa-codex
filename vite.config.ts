import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { ViteImageOptimizer } from 'vite-plugin-image-optimizer';

export default defineConfig({
  plugins: [
    react(),
    ViteImageOptimizer({
      svg: {
        multipass: false,
        plugins: [
          {
            name: 'preset-default',
            params: {
              overrides: {
                removeViewBox: false,
              },
            },
          },
        ],
      },
      webp: {
        quality: 80,
      },
      png: {
        quality: 100,
      },
      jpeg: {
        quality: 100,
      },
      jpg: {
        quality: 100,
      },
      gif: {
        optimizationLevel: 1,
      },
      cache: true,
      cacheLocation: '.cache/vite-image-optimizer',
      test: /\.(svg|webp)$/i,
      includePublic: true,
      logStats: false,
      ansiColors: false,
    }),
  ],
  build: {
    chunkSizeWarningLimit: 1400,
  },
});
