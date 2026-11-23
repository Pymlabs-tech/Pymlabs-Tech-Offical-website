import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig(({ isSsrBuild }) => ({
  plugins: [react()],
  base: '/',
  build: {
    sourcemap: false,
    assetsInlineLimit: 2048,
    cssCodeSplit: false,
    target: 'es2020',
    rollupOptions: isSsrBuild
      ? {}
      : {
          output: {
            // Libraries change rarely: separate files stay cached across site updates.
            manualChunks(id) {
              if (!id.includes('node_modules')) return undefined;
              if (id.includes('framer-motion') || id.includes('motion-dom') || id.includes('motion-utils')) return 'motion';
              if (/node_modules[\/](react|react-dom|scheduler|react-router|react-router-dom|cookie|set-cookie-parser)[\/]/.test(id)) return 'react';
              return 'vendor';
            },
          },
        },
  },
  ssr: {
    noExternal: ['framer-motion'],
  },
}));
