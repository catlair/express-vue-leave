const VerifyCode = require('../database').VerifyCode;
const {createVerifyCode} = require('../utils/verifyCode');
const {createToken} = require('../utils/token');

module.exports = {
  /**
   * @api {get} /verifycode 获取图片验证码
   * @apiName verifyCodeImg
   * @apiGroup VerifyCode
   * @apiVersion 0.1.0
   *
   * @apiSuccess {String} token 验证码的校验码.
   * @apiSuccess {String} img  base64验证码图片.
   *
   * @apiSuccessExample {json} 成功响应
   *
   * {
   * "token": "sjdh.asgdjh.kashdk",
   * "img": "data:image/bmp;base64,dsfldsjfklsdj"
   * }
   */
  async verifycode(ctx) {
    try {
      let {code, img} = createVerifyCode();
      let token = createToken(code, 180);
      await new VerifyCode({
        code,
        token,
        expireAt: new Date()
      }).save();

      ctx.body = {
        code: 200,
        msg: '获取验证码成功！',
        test: `别看图了,没错验证码就是${code}`,
        data: {
          token,
          img: "data:image/bmp;base64," + img.getFileData().toString('base64')
        }
      }
    } catch (e) {
      console.log(e);
      ctx.body = {
        code: 500,
        msg: '获取验证码失败！'
      }
    }
  }
}