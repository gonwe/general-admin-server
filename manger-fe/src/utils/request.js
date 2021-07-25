/**
 * axios二次封装
 */
import config from "../config";
import axios from "axios";
import { ElMessage } from "element-plus";
import router from "../router";
import storage from "./storage";

// 定义错误提示
const TONKEN_INVALID = "Tenkon认证失败，请重新登陆";
const NETWORK_ERROR = "网络连接失败，请重新重试";

// 创建axios实例对象，添加全局配置
const service = axios.create({
  baseURL: config.baseURL,
  timeout: 9000,
});

// 请求拦截
service.interceptors.request.use((req) => {
  // TODO
  const { token } = storage.getItem("userInfo");
  const headers = req.headers;
  if (!headers.Authorization) headers.Authorization = "Bearer " + token;
  return req;
});

// 响应拦截
service.interceptors.response.use((res) => {
  const { code, data, msg } = res.data;
  if (code === 200) {
    return data;
  } else if (code === 5001) {
    ElMessage.error(msg || TONKEN_INVALID);
    setTimeout(() => {
      router.push("/login");
    }, 300);
    // 在控制台打印错误信息
    return Promise.reject(msg || TONKEN_INVALID);
  } else {
    ElMessage.error(msg || NETWORK_ERROR);
    return Promise.reject(msg || NETWORK_ERROR);
  }
});

/**
 * 请求的核心函数
 * @param {*} options
 * @returns
 */
function request(options) {
  // debugger;
  options.method = options.method || "get";
  if (options.method.toLowerCase() == "get") {
    options.params = options.data;
  }

  if (typeof options.mock != "undefined") {
    config.mock = options.mock;
  }
  // 预防生产环境出问题
  if (config.env === "prod") {
    service.defaults.baseURL = config.baseApi;
  } else {
    service.defaults.baseURL = config.mock ? config.mockApi : config.baseApi;
  }
  return service(options);
}

// 扩展方法
["get", "post", "delete", "put", "patch"].forEach((item) => {
  request[item] = (url, data, options) => {
    return request({
      url,
      data,
      method: item,
      ...options,
    });
  };
});

export default request;
