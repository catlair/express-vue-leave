const jwt = require('jsonwebtoken');
const {TOKEN_ENCODE_STR, URL_YES_PASS} = require('../utils/config');
const User = require('../database').User;

module.exports = {
  createToken,
  checkToken
}

function createToken(str, expiresIn = '1h') {
  return jwt.sign({str}, TOKEN_ENCODE_STR, {expiresIn});
}

async function checkToken(ctx, next) {
  let url = ctx.url;
  if (ctx.method !== 'GET' && !URL_YES_PASS.includes(url)) {
    let token = ctx.get('Authorization');
    if (token === '') {
      ctx.response.status = 401;
      ctx.response.body = "你还没有登录,快去登录吧";
      return;
    }
    try {
      //验证token是否过期
      let {str = ''} = await jwt.verify(token, TOKEN_ENCODE_STR);
      //验证token与账号是否匹配
      let res = await User.find({username: str, token});
      if (res.length === 0) {
        ctx.response.status = 401;
        ctx.response.body = "登录过期，请重新登录!";
        return;
      }
      // 保存用户的_id，便于操作
      ctx._id = res[0]._id;
    } catch (e) {
      ctx.response.status = 401;
      ctx.response.body = "登录已过期请重新登录!";
      return;
    }
  }
  await next();
}
