import { resolve } from 'path'
import { defineConfig } from 'vitest/config'
import type { Plugin } from 'vite'
import vue from '@vitejs/plugin-vue'

// Mirrors @vuelor/picker: ship the Tailwind source registration inside dist so the
// `@source` path is anchored to this package instead of the consumer's stylesheet.
const tailwindSourceEntry: Plugin = {
  name: 'vuelor:tailwind-source-entry',
  generateBundle() {
    this.emitFile({
      type: 'asset',
      fileName: 'tailwind.css',
      source:
        '/* Registers this package as a Tailwind v4 source. `@source` resolves relative\n' +
        '   to this file, so "." is the package\'s own dist no matter where the importing\n' +
        '   stylesheet lives. Import it once from your CSS entry point:\n' +
        '   @import "@vuelor/gradient/tailwind.css"; */\n' +
        '@source ".";\n',
    })
  },
}

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    tailwindSourceEntry
  ],
  test: {
    coverage: {
      provider: 'v8',
      include: ['src/**/*.{ts,vue}'],
      exclude: ['src/env.d.ts']
    }
  },
  resolve: {
    alias: {
      '@': resolve(__dirname, 'src')
    },
  },
  build: {
    lib: {
      name: 'vuelor-gradient',
      entry: resolve(__dirname, 'src/index.ts'),
      fileName: 'index',
      formats: ['es'],
    },
    rollupOptions: {
      external: ['vue', 'reka-ui', '@vuelor/picker'],
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
