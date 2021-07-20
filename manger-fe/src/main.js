import { createApp } from "vue";
import App from "./App.vue";
import router from "./router";
import ElementPlus from "element-plus";
import "element-plus/lib/theme-chalk/index.css";
import request from "./utils/request";
import storage from "./utils/storage";
import api from "./api/index";
import store from './store';

console.log(import.meta.env);
const app = createApp(App);

app.config.globalProperties.$request = request; //全局属性挂载request
app.config.globalProperties.$ls = storage; //全局属性挂载storage
app.config.globalProperties.$api = api; //全局属性挂载api
app.use(router).use(store).use(ElementPlus).mount("#app");
