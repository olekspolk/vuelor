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
      entry: resolve(__dirname, 'src/index.ts'),
      name: 'VuelorColorPicker',
      fileName: (format) => `index.${format}.js`
    },
    rollupOptions: {
      external: ['vue', 'reka-ui'],
      output: {
        globals: {
          vue: 'Vue',
        },
      },
    },
    sourcemap: true,
    cssCodeSplit: true,
  }
})
