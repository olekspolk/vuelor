import tailwind from 'tailwindcss'
import autoprefixer from 'autoprefixer'
import { defineConfig } from 'vitepress'

// https://vitepress.dev/reference/site-config
export default defineConfig({
  title: 'Vuelor',
  description: 'A truly flexible, accessible, and Tailwind-ready color picker with developer experiance in mind.',
  head: [
    ['link', { rel: 'icon', href: '/logo.png' }],
    ['link', { rel: 'icon', href: '/logo.svg', type: 'image/svg+xml' }],
    ['link', { rel: 'canonical', href: 'https://vuelor.dev' }],
    ['meta', { name: 'keywords', content: 'vue, nuxt, component-library, reka-ui, vuelor, vuelor/picker, color-picker' }],
    ['meta', { property: 'og:title', content: 'Fully customizable ColorPicker for Vue.js' }],
    ['meta', { property: 'og:description', content: 'A truly flexible, accessible, and Tailwind-ready color picker with developer experiance in mind.' }],
    ['meta', { property: 'og:url', content: 'https://vuelor.dev' }],
    ['meta', { property: 'og:image', content: 'https://vuelor.dev/og.jpg' }],
    ['meta', { name: 'twitter:title', content: 'Fully customizable ColorPicker for Vue.js' }],
    ['meta', { name: 'twitter:description', content: 'A truly flexible, accessible, and Tailwind-ready color picker with developer experiance in mind.' }],
    ['meta', { name: 'twitter:image', content: 'https://vuelor.dev/og.jpg' }],
    ['meta', { name: 'twitter:card', content: 'summary_large_image' }],
  ],
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
