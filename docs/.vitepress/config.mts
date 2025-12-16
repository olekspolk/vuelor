import fs from 'fs'
import path from 'path'
import container from 'markdown-it-container'
import tailwind from 'tailwindcss'
import autoprefixer from 'autoprefixer'
import { defineConfig } from 'vitepress'

// https://vitepress.dev/reference/site-config
export default defineConfig({
  title: 'Vuelor',
  description: 'A truly flexible, accessible, and Tailwind-ready color picker with developer experience in mind.',
  head: [
    ['link', { rel: 'icon', href: '/logo.png' }],
    ['link', { rel: 'icon', href: '/logo.svg', type: 'image/svg+xml' }],
    ['link', { rel: 'canonical', href: 'https://vuelor.dev' }],
    ['meta', { name: 'keywords', content: 'vue, nuxt, component-library, reka-ui, vuelor, vuelor/picker, color-picker' }],
    ['meta', { property: 'og:title', content: 'Fully customizable ColorPicker for Vue.js' }],
    ['meta', { property: 'og:description', content: 'A truly flexible, accessible, and Tailwind-ready color picker with developer experience in mind.' }],
    ['meta', { property: 'og:url', content: 'https://vuelor.dev' }],
    ['meta', { property: 'og:image', content: 'https://vuelor.dev/og.jpg' }],
    ['meta', { name: 'twitter:title', content: 'Fully customizable ColorPicker for Vue.js' }],
    ['meta', { name: 'twitter:description', content: 'A truly flexible, accessible, and Tailwind-ready color picker with developer experience in mind.' }],
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
          { text: 'ColorPicker SE', link: '/examples/color-picker-sliders' },
          { text: 'ColorPicker Mini', link: '/examples/color-picker-mini' },
          { text: 'ColorPicker Pro', link: '/examples/color-picker-pro' },
          { text: 'ColorPicker Max', link: '/examples/color-picker-max' },
          { text: 'ColorPicker Ultra', link: '/examples/color-picker-ultra' },
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
  markdown: {
    config(md) {
      md.use(container, 'demo', {
        render(tokens, idx) {
          const token = tokens[idx]
          if (token.nesting === 1) {
            const sourceFileToken = token.info.trim().match(/^demo\s+(.*)$/)
            const sourceFile = sourceFileToken ? sourceFileToken[1] : ''
            if (!sourceFile) throw new Error('Incorrect syntax: ::: demo <path>')
            const sourcePath = path.resolve(__dirname, '../components/examples', sourceFile)
            let sourceCode = ''
            try {
              sourceCode = fs.readFileSync(sourcePath, 'utf-8')
            } catch (e) {
              console.error(`Could not read file: ${sourcePath}`, e)
            }

            const highlightedCode = md.options.highlight
              ? md.options.highlight(sourceCode, 'vue', '')
              : sourceCode

            const componentName = sourceFile.replace('.vue', '')

            return `
              <ComponentDemo path="${sourceFile}">
                <template #demo>
                  <${componentName} />
                </template>
                <template #code>
                  ${highlightedCode}
                </template>
            `
          } else {
            return '</ComponentDemo>\n'
          }
        }
      })
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
