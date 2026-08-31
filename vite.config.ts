import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { sqliteApiPlugin } from './server/vitePluginApi.ts'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
    sqliteApiPlugin(),
  ],
  build: {
    // Target modern browsers on VPS — better tree-shaking + smaller output
    target: 'es2020',
    // Enable CSS code-splitting per chunk
    cssCodeSplit: true,
    // Raise chunk warn limit to silence false positives (framer-motion is large)
    chunkSizeWarningLimit: 800,
    rollupOptions: {
      output: {
        // Manual chunk splitting: isolate large libs so they cache independently
        manualChunks(id) {
          if (id.includes('node_modules/react/') || id.includes('node_modules/react-dom/') || id.includes('node_modules/scheduler/')) {
            return 'vendor-react';
          }
          if (id.includes('node_modules/framer-motion/')) {
            return 'vendor-motion';
          }
          if (id.includes('node_modules/lucide-react/')) {
            return 'vendor-lucide';
          }
        },
      },
    },
  },
  // Ensure framer-motion is pre-bundled in dev for faster HMR
  optimizeDeps: {
    include: ['framer-motion', 'lucide-react'],
  },
})
