import { createApp } from 'vue'
import App from './App.vue'
import axios from 'axios'
import router from './router'

const app = createApp(App) // ← インスタンスを変数に代入
app.config.globalProperties.$axios = axios // ← ここに登録
app.use(router) // ← ルーターを使用
app.mount('#app') // ← 最後にマウント！
