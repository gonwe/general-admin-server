const Koa = require("koa");
const app = new Koa();
const views = require("koa-views");
const json = require("koa-json");
const onerror = require("koa-onerror");
const logger = require("koa-logger");
const log4js = require("./utils/log4j");
const users = require("./routes/users");
const menu = require("./routes/menu");
const router = require("koa-router")();
const bodyparser = require("koa-bodyparser");
const jwt = require("jsonwebtoken")
const koajwt = require("koa-jwt");
const util = require("./utils/util");

// error handler
onerror(app);

// middlewares
app.use(
  bodyparser({
    enableTypes: ["json", "form", "text"],
  })
);
// database connect
require("./config/db");

app.use(json());
app.use(logger());
app.use(require("koa-static")(__dirname + "/public"));

app.use(
  views(__dirname + "/views", {
    extension: "pug",
  })
);

// logger
app.use(async (ctx, next) => {
  const start = new Date();
  log4js.info(`get params:${JSON.stringify(ctx.request.query)}`)
  log4js.info(`post params:${JSON.stringify(ctx.request.body)}`)
  await next().catch((err)=>{
   if (err.status == 401) {
    ctx.status = 200,
    ctx.body=util.fail("Tonken认证失败！请重新登陆",util.CODE.AUTH_ERROR)
   }else{
     throw err
   }
  });
});
// tokrn
app.use(koajwt({secret:"gonwe"}).unless({ path: [/^\/api\/users\/login/] }))


// routes
router.prefix("/api");

// router.get("/leave/count",(ctx)=>{
//   // const token = ctx.request.headers.authorization.split(" ")[1]
//   // // console.log(ctx.request.headers);
//   // const playload = jwt.verify(token,"gonwe")
//   ctx.body="nody"
// })
router.use(users.routes(), users.allowedMethods());
router.use(menu.routes(), menu.allowedMethods());


app.use(router.routes(), users.allowedMethods());




// error-handling
app.on("error", (err, ctx) => {
  // console.error("server error", err, ctx);
  log4js.error(err.stack);
});

module.exports = app;
