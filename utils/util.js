/**
 * 通用函数封装
 */
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
};
