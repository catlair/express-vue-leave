const exports = module.exports;

/**
 * 格式化时间
 * @param num 时间戳
 * @param format 返回时间的格式
 * @returns {string}
 */
exports.formatDate = function (num = 0, format = 'YY-MM-DD hh:mm:ss') {
  let date = new Date(Number(num));
  let year = date.getFullYear(),
      month = date.getMonth(),
      day = date.getDate(),
      hour = date.getHours(),
      min = date.getMinutes(),
      sec = date.getSeconds();

  let preArr = new Array(10).fill(0).map((el, index) => {
    return '0' + index;
  })

  return format.replace(/YY/g, String(year))
  .replace(/MM/g, preArr[month] || month)
  .replace(/DD/g, preArr[day] || day)
  .replace(/hh/g, preArr[hour] || hour)
  .replace(/mm/g, preArr[min] || min)
  .replace(/ss/g, preArr[sec] || sec);
}