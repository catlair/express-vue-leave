const {User} = require('../database');
const {createToken} = require('../utils/token');
const {verifyCode} = require('../utils/verifyCode');
const crypto = require('../utils/crypto');

/**
 * @api {post} /user/reg 用户注册
 * @apiName regUser
 * @apiGroup User
 * @apiVersion 0.1.0
 *
 * @apiParam {String} nickname 用户昵称,用于显示.
 * @apiParam {String} username 用户账号.
 * @apiParam {String} password 用户密码.
 * @apiParam {String} rePassword 重复密码.
 * @apiParam {String} codeToken 验证码的校验值.
 * @apiParam {String} code 验证码.
 *
 * @apiSuccess {String} nickname 用户昵称,用于显示.
 *
 */
async function register(ctx) {
  let {nickname = '', username = '', password = '', rePassword = '', code = '', codeToken = ''} = ctx.request.body;
  try {

    if (username === '' || nickname === '' || password === '') {
      ctx.body = {
        code: 100,
        msg: '注册失败,注册信息不全'
      }
      return
    }

    // if (password.length < 6) {
    //   ctx.body = {
    //     code: 101,
    //     msg: '注册失败,密码最少为6位'
    //   }
    //   return
    // }

    if (password !== rePassword) {
      ctx.body = {
        code: 102,
        msg: '注册失败,两次输入密码不一致'
      }
      return
    }

    //验证码判断
    let mark = await verifyCode({code, token: codeToken});
    if (!mark) {
      ctx.body = {
        code: 103,
        msg: '注册失败,验证码错误!'
      }
      return
    }

    //防止重复用户
    let res = await User.find({username});
    if (res.length !== 0) {
      ctx.body = {
        code: 104,
        msg: '注册失败，登录账号重复了，换一个吧！'
      }
      return
    }

    //创建token
    const token = createToken(username);
    //生成盐
    const salt = crypto.createSalt();
    //计算加密用户名
    username = crypto.encryptUsername(username);
    //计算加盐密码
    password = crypto.encryptPassword(username, password, salt);
    let user = new User({username, nickname, password, token, salt});
    res = await user.save();

    if (res._id != null) {
      ctx.body = {
        code: 200,
        msg: "注册成功!",
        data: {
          _id: res._id,
          nickname,
          token
        }
      }
    } else {
      ctx.body = {
        code: 500,
        msg: "注册失败，服务器异常!"
      }
    }

  } catch (e) {
    ctx.body = {
      code: 500,
      msg: "注册失败，服务器异常！"
    }
  }
}

/**
 * @api {post} /user/login 用户登录
 * @apiName loginUser
 * @apiGroup User
 * @apiVersion 0.1.0
 *
 * @apiParam {String} username 用户账号.
 * @apiParam {String} password 用户密码.
 * @apiParam {String} codeToken 验证码的校验值.
 * @apiParam {String} code 验证码.
 *
 * @apiSuccess {String} nickname 用户昵称,用于显示.
 *
 */
async function login(ctx) {
  let {username = '', password = '', code = '', codeToken = ''} = ctx.request.body;
  try {
    if (username === '' || password === '') {
      ctx.body = {
        code: 401,
        msg: "登录失败，请输入登录账号或密码!"
      }
      return;
    }
    // 验证码判断
    let mark = await verifyCode({code, token: codeToken});
    if (!mark) {
      ctx.body = {
        code: 401,
        msg: '登录失败，验证码错误!'
      }
      return;
    }

    //计算加密用户名
    username = crypto.encryptUsername(username);
    //获取盐
    try {
      let {salt} = await User.findOne({username}, {salt: true});

      //计算加盐密码
      password = crypto.encryptPassword(username, password, salt);
      //查询匹配的用户和密码
      let res = await User.find({username, password});

      if (res.length === 0) {
        ctx.body = {
          code: 401,
          msg: '登录失败，用户名或者密码错误!'
        }
        return;
      }

      //生成token
      let token = createToken(username);

      res[0].token = token;
      res[0].save();
      ctx.body = {
        code: 200,
        msg: "登录成功!",
        data: {
          _id: res[0]._id,
          nickname: res[0].nickname,
          token
        }
      }
    } catch (e) {
      ctx.body = {
        code: 401,
        msg: '登录失败，用户名或者密码错误!'
      }
    }

  } catch (e) {
    console.log(e)
    ctx.body = {
      code: 500,
      msg: '登录失败，服务器异常!'
    }
  }
}

/**
 * @api {get} /user 用户查询
 * @apiName queryUser
 * @apiGroup User
 * @apiVersion 0.1.0
 *
 * @apiParam {String} _id 用户id.
 *
 * @apiSuccess {String} nickname 用户昵称,用于显示.
 *
 */
async function query(ctx) {
  let _id = ctx.query._id;
  if (_id == null) {
    ctx.body = {
      code: -1,
      msg: '参数错误'
    }
    return
  }
  if (_id.length !== 24) {
    ctx.body = {
      code: 401,
      msg: '查询失败，_id错误！'
    }
    return;
  }
  try {
    let res = await User.findOne({_id}, {_id: true, nickname: true});
    ctx.body = {
      code: 200,
      msg: '查询成功！',
      data: res
    }
  } catch (e) {
    ctx.body = {
      code: 500,
      msg: '查询失败，服务器异常，请稍后再试!'
    }
  }
}

module.exports = {
  register,
  login,
  query
}