import { resolve } from 'path'
import { defineConfig } from 'vite'
import dts from 'vite-plugin-dts'
import vue from '@vitejs/plugin-vue'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    dts(),
    vue(),
  ],
  resolve: {
    alias: {
      '@': resolve(__dirname, 'src')
    },
  },
  build: {
    lib: {
      entry: {
        index: resolve(__dirname, 'src/index.ts'),
        style: resolve(__dirname, 'src/style.ts')
      },
      name: 'VuelorColorPicker',
      fileName: (format, entryName) => {
        if (entryName === 'index') return `index.${format}.js`
        if (entryName === 'style') return `style.${format}.js`
        return `${entryName}.${format}.js`
      },
      formats: ['es'],
    },
    rollupOptions: {
      external: ['vue', 'reka-ui'],
      output: {
        globals: {
          vue: 'Vue',
        },
      },
    },
    cssCodeSplit: true,
  }
})
