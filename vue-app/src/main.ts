import './assets/main.css'
import { createApp } from 'vue'
import { createPinia } from 'pinia'

import App from './App.vue'
import router from './router'
// 初始化主题（导入即应用，避免 FOUC）
import './composables/useTheme'

const app = createApp(App)

app.use(createPinia())
app.use(router)

app.mount('#app')
