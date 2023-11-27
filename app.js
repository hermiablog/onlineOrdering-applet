// app.js
import { Storage } from './utils/storage'
const storage = new Storage();
App({
  storage,
  getStorage: storage.get,
  setStorage: storage.set,
  rmStorage: storage.rm,
  /**
   * 当小程序初始化完成时，会触发 onLaunch（全局只触发一次）
   */
  onLaunch: function () {
    //小程序启动时，查看是否有历史数据
    this.getStorage("cartInfo")
      .then(res => {
        res.length > 0 ? wx.setTabBarBadge({
          index: 3,
          text: `${res.length}`,
        }) : wx.removeTabBarBadge({
          index: 3,
        })
      })
      .catch(err => { })
    //小程序端初始化
    wx.cloud.init({
      //API 调用的默认环境配置
      env: 'online-order-8gxjm7lib19d97a0',
      //将用户访问记录到用户管理中，在控制台中可见
      traceUser: true
    })
  },

  /**
   * 当小程序启动，或从后台进入前台显示，会触发 onShow
   */
  onShow: function (options) {

  },

  /**
   * 当小程序从前台进入后台，会触发 onHide
   */
  onHide: function () {

  },

  /**
   * 当小程序发生脚本错误，或者 api 调用失败时，会触发 onError 并带上错误信息
   */
  onError: function (msg) {

  }
})
