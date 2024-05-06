/*
 * @Author: fremember
 * @Date: 2024-03-21 21:46:05
 * @Description: 
 */
import { createApp } from 'vue'
import router from './router'
import './assets/css/reset.css'

import App from './App.vue'

createApp(App).use(router).mount('#app')
