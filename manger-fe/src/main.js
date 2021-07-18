import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import ElementPlus from 'element-plus'
import 'element-plus/lib/theme-chalk/index.css';
import config from './config/index'
import axios from 'axios'


console.log(import.meta.env);
const app = createApp(App)
axios.get(config.mockApi + '/login').then((res)=>{
    console.log(res.data);
})
app.use(router).use(ElementPlus).mount('#app')
