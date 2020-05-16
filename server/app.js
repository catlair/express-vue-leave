const Koa = require('koa')
const app = new Koa()
const json = require('koa-json')
const onerror = require('koa-onerror')
const bodyparser = require('koa-bodyparser')
const logger = require('koa-logger')
const router = require('./routers/index')
const {checkToken} = require('./utils/token')
const cors = require('koa2-cors')

//解决跨域问题
app.use(cors({
  // origin: function (ctx) {
  //   if (ctx.url === '/test') {
  //     return "*"; // 允许来自所有域名请求
  //   }
  //   return 'http://localhost:8080';
  // },
  exposeHeaders: ['WWW-Authenticate', 'Server-Authorization'],
  maxAge: 5,
  credentials: true,
  allowMethods: ['GET', 'POST', 'DELETE'],
  allowHeaders: ['Content-Type', 'Authorization', 'Accept'],
}))


onerror(app)

app.use(bodyparser({
  enableTypes: ['json', 'form', 'text']
}))
app.use(json())
app.use(logger())

//设置静态资源
app.use(require('koa-static')(__dirname + '/public'))
app.use(require('koa-static')(__dirname + '/apidoc'))

//使用验证token中间件
app.use(checkToken)

// logger
app.use(async (ctx, next) => {
  const start = new Date()
  await next()
  const ms = new Date() - start
  console.log(`${ctx.method} ${ctx.url} - ${ms}ms`)
})

app.use(router.routes())
.use(router.allowedMethods())

app.listen(3001)