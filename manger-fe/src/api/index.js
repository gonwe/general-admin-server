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
};
