import { createApp } from "vue";
import App from "./App.vue";
import router from "./router";
import ElementPlus from "element-plus";
import "element-plus/lib/theme-chalk/index.css";
import request from "./utils/request";

console.log(import.meta.env);
const app = createApp(App);

app.config.globalProperties.$request = request; //全局属性挂载
app.use(router).use(ElementPlus).mount("#app");
