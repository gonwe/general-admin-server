/**
 * 通用函数封装
 */
const jwt = require("jsonwebtoken");
const log4js = require("./log4j");


const CODE = {
    SUCCESS: 200,
    PARPM_ERROR: 10001,
    USER_ACCOUNT_ERROR: 20001,
    USER_LOGIN_ERROR: 30001,
    BUSSINESS_ERROR: 4001,
    AUTH_ERROR: 50001,
};

module.exports = {
    /**
     * 分页查询
     * @param {number} pageNum
     * @param {number} pageSize
     * @returns
     */
    pager({ pageNum = 1, pageSize = 10 }) {
        pageNum *= 1;
        pageSize *= 1;
        const skipIndex = (pageNum - 1) * pageSize;
        return {
            page: {
                pageNum,
                pageSize,
            },
            skipIndex,
        };
    },
    success(data = "", msg = "", code = CODE.SUCCESS, success = true) {
        log4js.debug(msg);
        return {
            code,
            success,
            data,
            msg,
        };
    },
    fail(msg = "", code = CODE.BUSSINESS_ERROR, data = "", success = false) {
        log4js.debug(msg);
        return {
            code,
            success,
            data,
            msg,
        };
    },
    CODE,

    decoded(authorization, secret) {
        const token = authorization.split(" ")[1];
        if (token) {
            return jwt.verify(token, secret);
        } else {
            return null;
        }
    },

    getMenuTree(orgList, id, list) {
        orgList.forEach(item => {
            if (item.parentId.slice().pop() == id || String(item.parentId.slice().pop()) === String(id)) {
                list.push(item._doc);
            }
        })
        list.map(item => {
            item.children = [];
            this.getMenuTree(orgList, item._id, item.children);
            if (item.children.length == 0) {
                delete item.children;
            } else if (item.children.length > 0 && item.children[0].menuType == 2) {
                item.action = item.children;
            }
        });

        return list;
    }
};
