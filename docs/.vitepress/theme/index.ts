import { h } from 'vue'
// -without-fonts: we ship Montserrat + Figtree instead of the default Inter.
import DefaultTheme from 'vitepress/theme-without-fonts'
import '@fontsource-variable/montserrat'
import '@fontsource-variable/figtree'

import VuelorHome from '../../components/home/VuelorHome.vue'
import ColorPickerShowcase from '../../components/Showcase.vue'
import ComponentDemo from '../../components/ComponentDemo.vue'
import InstallTerminal from '../../components/InstallTerminal.vue'
import GitHubStarButton from '../../components/GitHubStarButton.vue'

import './vars.css'
import './style.css'

export default {
  extends: DefaultTheme,
  enhanceApp({ app }) {
    app.component('VuelorHome', VuelorHome)
    app.component('ComponentDemo', ComponentDemo)
    app.component('ColorPickerShowcase', ColorPickerShowcase)
    app.component('InstallTerminal', InstallTerminal)

    const modules = import.meta.glob('../../components/examples/*.vue', { eager: true })

    for (const path in modules) {
      const component = modules[path].default
      const name = path.split('/').pop()?.replace('.vue', '') || ''
      app.component(name, component)
    }
  },
  Layout() {
    return h(DefaultTheme.Layout, null, {
      'nav-bar-content-after': () => h(GitHubStarButton)
    })
  }
}
