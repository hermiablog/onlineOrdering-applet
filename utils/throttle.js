/**
 * 节流函数
 * @param {Function} callback 需要被节流的函数
 * @param {Number} duration 距离上次执行超过多少毫秒才会执行被节流的函数
 * @desc 涉及知识点：闭包，this指向
 */
function throttle(callback, duration = 500) {
  // 最后执行函数时的时间戳
  let lastTime = 0;
  // 闭包
  return function () {
    // 获取当前时间戳
    const now = new Date().getTime();
    // 判断当前时间距离上一次执行函数的时间是否超过了duration设定的毫秒数
    if (now - lastTime >= duration) {
      // 超过了
      // 调用被节流的方法实现
      callback.call(this, ...arguments);
      // callback(...arguments)
      // 更新最后执行函数时的时间戳
      lastTime = now;
    }
    // 没超过，啥也不干
  };
}

export { throttle };