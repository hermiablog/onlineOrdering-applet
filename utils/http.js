//导入API接口根地址
import APIConfig from "../config/api"
// 导入错误码字典
import exceptionMessage from "../config/exception-message"
import wxToPromise from "./wxToPromise"
/**
 * description 发起网络请求
 */
class Http {
  /**
   * 
   * @param {String} url 接口地址
   * @param {Object} data 向服务器发起请求，需要传递的参数
   * @param {String} method HTTP请求方法 (默认值 GET)
   */
  static async request({ url, data, method = "GET" }) {
    const res = await wxToPromise("request", {
      url: APIConfig.baseUrl + url,
      data,
      method,
    })
    // 上边通过 await 关键字等待后，直接返回结果，下边就可以直接使用了，就跟同步代码一样的用法
    // 同时，需要将整个成功的对象返回出去
    if (res.statusCode < 400) {
      return res.data.data;
    }
    // 请求失败（将接口中定义的相关失败的状态码，进行判断）
    if (res.statusCode === 401) {
      return;
    }
    // 错误信息比对校验
    Http._showError(res.data.code, res.data.desc);
  }
  /**
   * 错误信息比对校验
   * @param {String} errorCode 接口返回的错误码
   * @param {String} message 接口返回的错误信息内容
   */
  static _showError(errorCode, message) {
    let title = "";
    // 与错误字典中进行查找 在对象中通过 [] 的方式进行匹配
    //如果找到了会返回对应值，如果找不到就会返回undefined
    const errorMessage = exceptionMessage[errorCode];
    //判断返回的是否为有效字符
    //优先级：错误字典中的内容/原始接口内容/未知异常
    title = errorMessage || message || "未知异常"
    //在页面中展示信息
    wx.showToast({
      title,
      icon: "none",
    })
  }
}
export default Http;