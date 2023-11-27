/**
 *  用于转换原生不支持Promise的官方API
 * @param {String} method 需要调用的小程序官方API
 * @param {Object} options 调用时需要传递的参数
 */
export default function wxToPromise(method, options = {}) {
  return new Promise((resolve, reject) => {
    options.success = resolve;
    options.fail = (err) => {
      reject(err)
    };
    wx[method](options)
  })
}