/**
 * api统一管理
 */

import request from "../utils/request";

export default {
  login(params) {
    console.log(params);
    return request({
      url: "/users/login",
      data: params,
      method: "post",
      mock: false,
    });
  },

  noticeCount(params) {
    return request({
      url: "/leave/count",
      data: params,
      method: "get",
      mock: true,
    });
  },

  getMenuList() {
    return request({
      url: "/menu/list",
      method: "get",
      data: {},
      mock: true,
    });
  },

  getUserList(params) {
    console.log(params);
    return request({
      url: "/users/list",
      method: "get",
      data: params,
      mock: true,
    });
  },
  userDel(params) {
    console.log(params);
    return request({
      url: "/users/delete",
      method: "post",
      data: params,
      mock: true,
    });
  },
  getDeptList(params) {
    console.log(params);
    return request({
      url: "/dept/list",
      method: "get",
      data: params,
      mock: true,
    });
  },
  getRoleList(params) {
    console.log(params);
    return request({
      url: "/roles/alllist",
      method: "get",
      data: params,
      mock: true,
    });
  },
  userSumbit(params) {
    console.log(params);
    return request({
      url: "/users/operate",
      method: "post",
      data: params,
      mock: true,
    });
  },
};
