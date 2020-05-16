const crypto = require('crypto');

exports = module.exports;

function sha256(data) {
  const hash = crypto.createHash('sha256');
  return hash.update(data).digest('hex');
}

//生成盐
exports.createSalt = function () {
  return crypto.randomBytes(12);
}

//计算用户hash
exports.encryptUsername = function (username) {
  return sha256(username);
}

//计算密码hash
exports.encryptPassword = function (username, password, salt) {
  return sha256(
      sha256(username + sha256(password + salt)) + salt + sha256(username + salt)
  );
}
