import { createApp } from 'vue'
import './styles.css'
import App from './App.vue'
import router from './router'
import { library } from "@fortawesome/fontawesome-svg-core";
import { fas } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";
import { dom } from "@fortawesome/fontawesome-svg-core";
import axios from 'axios';

const app = createApp(App)
app.use(router)
app.mount('#app')

library.add(fas);
dom.watch();

// Import our custom CSS
import './scss/styles.scss'
// Import all of Bootstrap's JS
import * as bootstrap from 'bootstrap'

axios.interceptors.request.use((config) => {
    const token = localStorage.getItem('token'); // ← ログイン時に保存したJWT
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  });
  