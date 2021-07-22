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
  // console.log(ctx.request.body);
  // log4js.info(ctx.request.body);
  try {
    const { userName, userPwd } = ctx.request.body;
    const res = await User.findOne({ userName, userPwd });
    const data = res._doc;
    const token = jwt.sign({
      data:data,
    },'gonwe',{expiresIn:30})

    data.token = token;
    if (res) {
      
      ctx.body = util.success(data);
    } else {
      ctx.body = util.fail("账号或者密码不正确");
    }
  } catch (error) {
    ctx.body = util.fail("账号或者密码不正确");
  }
});

module.exports = router;
