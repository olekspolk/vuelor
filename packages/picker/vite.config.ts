import { resolve } from 'path'
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    vue()
  ],
  resolve: {
    alias: {
      '@': resolve(__dirname, 'src')
    },
  },
  build: {
    lib: {
      name: 'vuelor-picker',
      entry: resolve(__dirname, 'src/index.ts'),
      fileName: 'index',
      formats: ['es'],
    },
    rollupOptions: {
      external: ['vue', 'reka-ui', 'tailwind-merge'],
      output: {
        globals: {
          vue: 'Vue',
        },
        assetFileNames: (chunkInfo) => {
          if (chunkInfo.name === 'index.css')
            return 'style.css'
          return chunkInfo.name as string
        },
      },
    },
    cssCodeSplit: true,
  }
})
