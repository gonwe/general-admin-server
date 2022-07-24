const router = require("koa-router")();
const Menu = require("../models/menuSchema");
const util = require("../utils/util");

router.prefix("/menu");

router.get("/list", async (ctx, next) => {
    const { menuName, menuState } = ctx.request.query;
    let params = {};
    if (menuName) params.menuName = menuName;
    if (menuState) params.menuState = Number(menuState);
    const orgList = await Menu.find(params) || [];
    const list = await util.getMenuTree(orgList, null, []);
    ctx.body = util.success(list, '菜单列表查询成功');
})



router.post("/operate", async (ctx) => {
    const { _id, action, ...params } = ctx.request.body;
    let res, info;
    try {
        if (action == "create") {
            // res = await Menu.create(params);
            const menu = new Menu(params);
            res = await menu.save();
            info = "新增成功！";
        } else if (action == "edit") {
            res = await Menu.findByIdAndUpdate(_id, params);
            info = "编辑成功！";
        } else if (action == "delete") {
            res = await Menu.findByIdAndRemove(_id, params);
            await Menu.deleteMany({ parentId: { $all: _id } });
            info = "删除成功！";
        }
        ctx.body = util.success(res, info);
    } catch (error) {
        info = `操作异常：${error.stack}`;
        ctx.body = util.error(null, info);
    }
});

module.exports = router;
