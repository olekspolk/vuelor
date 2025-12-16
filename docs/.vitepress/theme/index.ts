import { h } from 'vue'
import DefaultTheme from 'vitepress/theme'
import HeroColorPicker from '../../components/HeroColorPicker.vue'
import ColorPickerShowcase from '../../components/Showcase.vue'
import ComponentDemo from '../../components/ComponentDemo.vue'

import './style.css'
import './vars.css'

export default {
  extends: DefaultTheme,
  enhanceApp({ app }) {
    app.component('ComponentDemo', ComponentDemo)
    app.component('HeroColorPicker', HeroColorPicker)
    app.component('ColorPickerShowcase', ColorPickerShowcase)

    const modules = import.meta.glob('../../components/examples/*.vue', { eager: true })

    for (const path in modules) {
      const component = modules[path].default
      const name = path.split('/').pop()?.replace('.vue', '') || ''
      app.component(name, component)
    }
  },
  Layout() {
    return h(DefaultTheme.Layout, null, {
      'home-hero-image': () => h(HeroColorPicker)
    })
  }
}
