const router = require("koa-router")();
const Role = require("../models/roleSchema");
const util = require("../utils/util");

router.prefix("/role");

router.get("/list", async (ctx, next) => {
    const { roleName} = ctx.request.query;
    let params = {};
    if (roleName) params.roleName = roleName;
    const orgList = await Role.find(params) || [];
    const list = getTree(orgList, null, []);
    ctx.body = util.success(list, '菜单列表查询成功');
})

//递归查询所有的子菜单
function getTree(orgList, id, list) {
    orgList.forEach(item => {
        if (item.parentId.slice().pop() == id || String(item.parentId.slice().pop()) === String(id)) {
            list.push(item._doc);
        }
    })
    list.map(item => {
        item.children = [];
        getTree(orgList, item._id, item.children);
        if (item.children.length == 0) {
            delete item.children;
        } else if (item.children.length > 0 && item.children[0].roleType == 2) {
            item.action = item.children;
        }
    });

    return list;
}

router.post("/operate", async (ctx) => {
    const { _id, action, ...params } = ctx.request.body;
    let res, info;
    try {
        if (action == "create") {
            res = await Role.create(params);
            info = "新增成功！";
        } else if (action == "edit") {
            res = await Role.findByIdAndUpdate(_id, params);
            info = "编辑成功！";
        } else if (action == "delete") {
            res = await Role.findByIdAndRemove(_id, params);
            await Role.deleteMany({ parentId: { $all: _id } });
            info = "删除成功！";
        }
        ctx.body = util.success(res, info);
    } catch (error) {
        info = `操作异常：${error.stack}`;
        ctx.body = util.error(null, info);
    }
});

module.exports = router;
