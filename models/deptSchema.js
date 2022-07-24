/**
 * 部门管理表集合
 * @author: Gonwe
 * @version: 1.0.0
 * @date: 2022-07-24
 */

const mongoose = require("mongoose");
const deptSchema = mongoose.Schema({
    /** 部门名称 */
    deptName: String,
    /** 部门负责人ID */
    userId: Number,
    /** 部门负责人 */
    userName: String,
    /** 部门负责人邮箱 */
    userEmail: String,
    /** 父级菜单 */
    parentId: {
        type: [mongoose.SchemaTypes.ObjectId]
    },
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

module.exports = mongoose.model("depts", deptSchema, "depts");
