import { createRouter, createWebHashHistory } from "vue-router";
import Home from "./../components/Home.vue";
const routes = [
  {
    name: "home",
    path: "/",
    meta: {
      title: "首页",
    },
    component: Home,
    redirect: "/welcome",
    children: [
      {
        name: "welcome",
        path: "welcome",
        meta: {
          title: "欢迎页",
        },
        component: () => import("./../views/Welcom.vue"),
      },
      {
        name: "system",
        path: "system",
        meta: {
          title: "系统管理",
        },
        children: [],
      },
      {
        name: "user",
        path: "user",
        meta: {
          title: "用户管理",
        },
        component: () => import("./../views/User.vue"),
      },
    ],
  },
  {
    name: "login",
    path: "/login",
    meta: {
      title: "登录",
    },
    component: () => import("./../views/Login.vue"),
  },
];
const router = createRouter({
  history: createWebHashHistory(),
  routes,
});

export default router;
