import './index.css'
import './core/styles/index.css'
import { createApp } from 'vue'
import { router } from './router'
import App from './App.vue'

const app = createApp(App)
app.use(router)
app.mount('#app')
