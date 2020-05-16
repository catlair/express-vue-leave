const mongoose = require('mongoose')

//连接数据库
mongoose.connect("mongodb://localhost:27017/comment?authSource=admin", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useCreateIndex: true
}, (err) => {
  if (err) {
    console.log('连接数据库错误')
    console.error(err)
  } else {
    console.log('连接数据库成功')
  }
})

//设计数据库
const Schema = mongoose.Schema

//用户
const userSchema = new Schema({
  nickname: String,
  username: String,
  password: String,
  token: String,
  salt: String
})

//留言
const commentSchema = new Schema({
  user_id: {
    type: mongoose.Schema.ObjectId,
    ref: 'User'
  },
  content: String,
  createTime: {
    type: String,
    default: Date.now
  }
})

// 验证码
// 设置ttl为3分钟(3分钟后自动清除)
let verifycodeSchema = new Schema({
  code: String,
  token: String,
  expireAt: {
    type: Date,
    default: new Date(),
    index: {expires: 180}
  }
})

exports.User = mongoose.model('User', userSchema);
exports.Comment = mongoose.model('Comment', commentSchema);
exports.VerifyCode = mongoose.model('Verifycode', verifycodeSchema)