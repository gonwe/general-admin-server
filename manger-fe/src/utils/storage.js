/**
 * Storage二次封装
 * @author Gonwe
 * @date 202107192252
 */
import config from "../config";
export default {
  //获取初始化命名空间
  getStorage() {
    return JSON.parse(window.localStorage.getItem(config.namespace) )|| {};
  },

  // 存储数据
  setItem(key, val) {
    let storage = this.getStorage();
    storage[key] = val; // [key]是动态的，不加[]会变成静态
    window.localStorage.setItem(config.namespace, JSON.stringify(storage));
  },

  // 读取数据
  getItem(key) {
    this.getStorage()[key];
  },

  //清除数据
  clearItem(key) {
    let storage = this.getStorage();
    delete storage[key];
    window.localStorage.setItem(config.namespace, JSON.stringify(storage));
  },
  //清空数据
  clearAll() {
    window.localStorage.clearAll;
  },
};
