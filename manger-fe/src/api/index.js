/**
 * api统一管理
 */

import request from "../utils/request";

export default {
  login(params) {
    return request({
      url: "/users/login",
      data: params,
      method: "post",
      //   mock: false,
    });
  },

  noticeCount(params) {
    return request({
      url: "/leave/count",
      data: params,
      method: "get",
    });
  },

  getMenuList() {
    return request({
      url: "/menu/list",
      method: "get",
      data: {},
    });
  },
};
