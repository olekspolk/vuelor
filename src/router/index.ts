import { createMemoryHistory, createRouter } from 'vue-router'
import ColorPicker from '@/demos/ColorPicker.vue'
import ColorPickerMini from '@/demos/ColorPickerMini.vue'

const routes = [
  { path: '/', component: ColorPicker },
  { path: '/mini', component: ColorPickerMini },
]

export const router = createRouter({
  history: createMemoryHistory(),
  routes,
})
