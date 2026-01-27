import { createApp } from 'vue'
import { MotionPlugin } from '@vueuse/motion'
import App from './App.vue'
import router from './router'
import { validateEnv } from './config/env'
import './style.css'

// 显示环境配置信息（不强制要求环境变量）
validateEnv()

const app = createApp(App)
app.use(router)
app.use(MotionPlugin)
app.mount('#root')

