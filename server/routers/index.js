const router = require('koa-router')({prefix: '/api'})
const user = require('./user')
const leave = require('./leave')
const other = require('./other')

router.get('/', (ctx) => {
  //跳转路由
  ctx.redirect('/')
})
.post("/user/reg", user.register)  //　用户注册
.post("/user/login", user.login) // 用户登录
.get('/user', user.query) // 根据用户_id查询用户
.get('/verifycode', other.verifycode)// 验证码获取
.post("/leave", leave.addLeaver)// 添加留言
.get("/leave", leave.getLeaves)// 留言获取
.delete("/leave/:id", leave.deleteLeaver) // 删除留言


module.exports = router