const VerifyCode = require('../database').VerifyCode;
const {TOKEN_ENCODE_STR} = require('./config');
const jwt = require('jsonwebtoken');
const {BMP24} = require('gd-bmp');

function rand(min, max) {
  return Math.floor(Math.random() * (max - min + 1) + min);
}

function createVerifyCode() {
  const img = new BMP24(100, 40);
  img.drawCircle(rand(0, 100), rand(0, 40), rand(10, 40), rand(0, 0xffffff));
  //边框
  img.drawRect(0, 0, img.w - 1, img.h - 1, rand(0, 0xffffff));
  img.fillRect(0, 0, 100, 40, 0xF1F1F1);  //设置验证码背景色
  // img.fillRect(rand(0, 100), rand(0, 40), rand(10, 35), rand(10, 35), rand(0, 0xffffff));
  img.drawLine(rand(0, 100), rand(0, 40), rand(0, 100), rand(0, 40), rand(0, 0xffffff));
  //画曲线
  let w = img.w / 2;
  let h = img.h;
  let y1 = rand(-5, 5); //Y轴位置调整
  let w2 = rand(10, 15); //数值越小频率越高
  let h3 = rand(4, 6); //数值越小幅度越大
  let bl = rand(1, 5);
  let color = rand(0, 0xffffff);
  //绘制中间的波浪线
  for (let i = -w; i < w; i += 0.1) {
    let y = Math.floor(h / h3 * Math.sin(i / w2) + h / 2 + y1);
    let x = Math.floor(i + w);
    for (let j = 0; j < bl; j++) {
      img.drawPoint(x, y + j, color);
    }
  }

  let p = "ABCDEFGHKMNPQRSTUVWXYZ3456789";
  let str = '';
  for (let i = 0; i < 4; i++) {
    str += p.charAt(Math.random() * p.length | 0);
  }

  // let fonts = [BMP24.font12x24, BMP24.font16x32];
  let fonts = [BMP24.font8x16, BMP24.font12x24, BMP24.font16x32];
  let x = 15, y = 8;
  for (let i = 0; i < str.length; i++) {
    let f = fonts[Math.random() * fonts.length | 0];
    y = 8 + rand(-5, 5);
    img.drawChar(str[i], x, y, f, rand(0, 0x666666)); //设置字符颜色
    x += f.w + rand(2, 8);
  }
  return {code: str, img}
}

async function verifyCode({code, token}) {
  try {
    // 验证码转大写
    code = code.toUpperCase();
    //验证验证码是否有效
    await jwt.verify(token, TOKEN_ENCODE_STR);
    // 读数据库进行验证，删除验证码
    let res = await VerifyCode.findOneAndDelete({code, token});
    if (res == null) {
      return false;
    }
  } catch (e) {
    return false;
  }
  return true;
}

module.exports = {
  verifyCode,
  createVerifyCode
}