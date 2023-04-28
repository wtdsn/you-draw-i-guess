import { createApp } from 'vue'
import App from './App.vue'
import './common.less'
// route
import router from './router/index'

createApp(App).use(router).mount('#app')
