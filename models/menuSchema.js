/**
 * 菜单管理表集合
 */
const mongoose = require("mongoose");
const menuSchema = mongoose.Schema({

    /** 菜单类型 */
    menuType: Number,
    /** 菜单名称 */
    menuName: String,
    /** 权限标识 */
    menuCode: String,
    /** 菜单路径 */
    path: String,
    /** 菜单图标 */
    icon: String,
    /** 组件地址 */
    component: String,
    /** 菜单状态 */
    menuState: Number,
    /** 父级菜单 */
    parentId: {
        type:[mongoose.SchemaTypes.ObjectId],
        required: false
    },
    /** 菜单排序 */
    order: Number,
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

module.exports = mongoose.model("menu", menuSchema);
