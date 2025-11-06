import tailwind from 'tailwindcss'
import autoprefixer from 'autoprefixer'
import { defineConfig } from 'vitepress'

// https://vitepress.dev/reference/site-config
export default defineConfig({
  title: "Vuelor",
  description: "Vuelor - Truly customizable Vue Color Picker built for a great developer experience.",
  themeConfig: {
    // https://vitepress.dev/reference/default-theme-config
    nav: [
      { text: 'Home', link: '/' },
      { text: 'Guide', link: '/guide/introduction' },
      { text: 'Examples', link: '/examples/' },
    ],

    sidebar: [
      {
        text: 'Guide',
        items: [
          { text: 'Introduction', link: '/guide/introduction' },
          { text: 'Getting Started', link: '/guide/getting-started' },
          { text: 'Customization', link: '/guide/customization' },
          { text: 'API Reference', link: '/guide/api-reference' },
        ]
      },
      {
        text: 'Examples',
        items: [
          { text: 'ColorPicker Mini', link: '/examples/color-picker-mini' },
          { text: 'ColorPicker Pro', link: '/examples/color-picker-pro' },
          { text: 'ColorPicker Sliders', link: '/examples/color-picker-sliders' },
        ]
      }
    ],

    socialLinks: [
      { icon: 'github', link: 'https://github.com/olekspolk/vuelor' }
    ],

    footer: {
      message: 'Released under the MIT License.',
      copyright: 'Copyright © 2025'
    }
  },
  srcDir: 'content',
  vite: {
    css: {
      postcss: {
        plugins: [
          tailwind(),
          autoprefixer(),
        ]
      }
    }
  }
})
