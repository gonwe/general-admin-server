/**
 * 用户管理模块
 */
const router = require("koa-router")();
const User = require("./../models/userSchema");
const util = require("./../utils/util");
const log4js = require("./../utils/log4j");
const json = require("koa-json");
const jwt = require("jsonwebtoken");
router.prefix("/users");

router.post("/login", async (ctx) => {
  console.log(ctx.request.body);
  // log4js.info(ctx.request.body);
  try {
    const { userName, userPwd } = ctx.request.body;
    /**
     * 返回自定义数据的三种方式
     * 1."userId " 字符串内用空格隔开
     * 2.{userId：0|1} 1表示传递 -0表示不传递
     * 3.().select('userName userId')字符串内用空格隔开
     */
    const res = await User.findOne({ userName, userPwd }).select(
      "userId userName userEmail role deptId roleList "
    );
    const data = res._doc;
    const token = jwt.sign(
      {
        data,
      },
      "gonwe",
      { expiresIn: "1h" }
    );
    data.token = token;
    if (res) {
      ctx.body = util.success(data, "登录成功！");
    } else {
      ctx.body = util.fail("账号或者密码不正确", util.CODE.USER_LOGIN_ERROR);
    }
  } catch (error) {
    ctx.body = util.fail(error.msg, util.CODE.USER_LOGIN_ERROR);
  }
});

// 用户列表
router.get("/list", async (ctx) => {
  const { userId, userName, state } = ctx.request.query;
  const { page, skipIndex } = util.pager(ctx.request.query);
  let params = {};
  if (userId) params.userId = userId;
  if (userName) params.userId = userName;
  if (state && state != "0") params.userId = state;
  try {
    const query = User.find(params, { _id: 0, userPwd: 0 });
    const list = await query.skip(skipIndex).limit(page.pageSize);
    const total = await User.countDocuments(params);
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
});

// 用户删除
router.post("/delete", async (ctx) => {
  const { userIds } = ctx.request.body;
  const res = await User.updateMany({ userId: { $in: userIds } }, { state: 2 });
  if (res.nModified) {
    ctx.body = util.success(res, `删除成功！共删除${nModified}条数据！`);
    return;
  }
  ctx.body = util.fail("删除失败");
});

// 用户新增/编辑
router.post("/operate", async (ctx) => {
  const { userId,userName, userEmail, mobile, job, state, roleList, deptId, action } =
    ctx.request.body;
  if (action == "add") {
    if (!userName || !userEmail || !deptId) {
      ctx.body = util.fail(util.CODE.PARPM_ERROR);
      return;
    }
    if (!deptId) {
      ctx.body = util.fail("部门不能为空");
      return;
    }
  }
  try {
   await User.findOneAndUpdate({userId}, { mobile, job, state, roleList, deptId});
    ctx.body = util.success({},"更新成功！")
  } catch (error) {
    ctx.body = util.fail(`${error.stack} 更新失败！`)
  }
});

module.exports = router;
