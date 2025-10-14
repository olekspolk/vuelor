import { createMemoryHistory, createRouter } from 'vue-router'
import ColorPicker from '@/demos/ColorPicker.vue'
import ColorPickerMini from '@/demos/ColorPickerMini.vue'
import ColorPickerPro from '@/demos/ColorPickerPro.vue'

const routes = [
  { path: '/', component: ColorPicker },
  { path: '/mini', component: ColorPickerMini },
  { path: '/pro', component: ColorPickerPro },
]

export const router = createRouter({
  history: createMemoryHistory(),
  routes,
})
