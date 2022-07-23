const router = require("koa-router")();
const Role = require("../models/roleSchema");
const util = require("../utils/util");

router.prefix("/role");

router.get("/list", async (ctx, next) => {
    const { roleName } = ctx.request.query;
    const { page, skipIndex } = util.pager(ctx.request.query);
    let params = {};
    if (roleName) params.roleName = roleName;
    try {
        const query = Role.find(params);
        const list = await query.skip(skipIndex).limit(page.pageSize);
        const total = await Role.countDocuments(params);
        ctx.body = util.success({
            page: {
                ...page,
                total,
            },
            list,
        });
    } catch (error) {
        ctx.body = util.fail(`查询异常：${error.stack}`);
    }
})


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

router.post("/update/permission", async (ctx) => {
    const { _id, permissionList } = ctx.request.body;
    try {
        const res = await Role.findByIdAndUpdate(_id, { permissionList });
        ctx.body = util.success(res, "更新成功！");
    } catch (error) {
        ctx.body = util.error(null, `更新异常：${error.stack}`);
    }
})
module.exports = router;
