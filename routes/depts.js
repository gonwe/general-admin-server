const router = require("koa-router")();
const Dept = require("../models/deptSchema");
const util = require("../utils/util");

router.prefix("/dept");


router.get("/list", async (ctx) => {
    const { deptName } = ctx.request.query;
    let params = {};
    try {
        if (deptName) {
            params.deptName = deptName;
            ctx.body = util.success(await Dept.find(params), `${deptName}查询成功`);
        } else {
            const rawlist = await Dept.find() || [];
            ctx.body = util.success(getTree(rawlist, null, []), "查询成功");
        }
    } catch (error) {
        ctx.body = util.fail(`查询异常：${error.stack}`);
    }
})

//递归查询所有的子菜单
function getTree(rawList, id, result) {

    rawList.forEach(item => {
        if (item.parentId.slice().pop() == id || String(item.parentId.slice().pop()) === String(id)) {
            result.push(item._doc);
        }
    })

    result.map(item => {
        item.children = [];
        getTree(rawList, item._id, item.children);
        if (item.children.length == 0) delete item.children;
    });
    return result;
}

router.get("/alllist", async (ctx) => {
    try {
        ctx.body = util.success(await Dept.find({}, "_id deptName"));
    } catch (error) {
        ctx.body = util.fail(`查询异常：${error.stack}`);
    }
})


router.post("/operate", async (ctx) => {
    const { _id, action, ...params } = ctx.request.body;
    let res, info;
    try {
        if (action == "create") {
            res = await Dept.create(params);
            info = "新增成功！";
        } else if (action == "edit") {
            res = await Dept.findByIdAndUpdate(_id, params);
            info = "编辑成功！";
        } else if (action == "delete") {
            res = await Dept.findByIdAndRemove(_id, params);
            await Dept.deleteMany({ parentId: { $all: _id } });
            info = "删除成功！";
        }
        ctx.body = util.success(res, info);
    } catch (error) {
        info = `操作异常：${error.stack}`;
        ctx.body = util.fail(null, info);
    }
});

router.post("/update/permission", async (ctx) => {
    const { _id, permissionList } = ctx.request.body;
    try {
        const res = await Dept.findByIdAndUpdate(_id, { permissionList, updateTime: new Date() });
        ctx.body = util.success(res, "更新成功！");
    } catch (error) {
        ctx.body = util.fail(null, `更新异常：${error.stack}`);
    }
})
module.exports = router;
