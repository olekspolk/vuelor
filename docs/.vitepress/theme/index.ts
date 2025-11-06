import { h } from 'vue'
import DefaultTheme from 'vitepress/theme'
import HeroColorPicker from '../../components/HeroColorPicker.vue'
import ColorPickerShowcase from '../../components/Showcase.vue'

import './style.css'
import './vars.css'

export default {
  extends: DefaultTheme,
  enhanceApp({ app }) {
    app.component('HeroColorPicker', HeroColorPicker)
    app.component('ColorPickerShowcase', ColorPickerShowcase)
  },
  Layout() {
    return h(DefaultTheme.Layout, null, {
      'home-hero-image': () => h(HeroColorPicker)
    })
  }
}
