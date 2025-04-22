import { createApp } from 'vue'
import App from './App.vue'
import axios from 'axios'

const app = createApp(App) // ← インスタンスを変数に代入
app.config.globalProperties.$axios = axios // ← ここに登録
app.mount('#app') // ← 最後にマウント！
