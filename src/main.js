import {createApp} from 'vue'
import App from './App.vue'
import store from './store'
import router from './router'
import 'bootstrap-icons/font/bootstrap-icons.css'
import './assets/css/app.css'

createApp(App).use(router).use(store).mount('#app')
