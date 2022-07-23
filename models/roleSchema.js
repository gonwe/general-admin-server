/**
 * 角色管理表集合
 */
const mongoose = require("mongoose");
const roleSchema = mongoose.Schema({

    /** 角色名称 */
    roleName: String,
    /** 备注 */
    remark: String,
    /** 权限列表 */
    permissionList: Object,
    /** 创建时间 */
    createTime: {
        type: Date,
        default: Date.now(),
    },
    /** 更新时间 */
    updateTime: {
        type: Date,
        default: Date.now(),
    },
});

module.exports = mongoose.model("role", roleSchema, "roles");
