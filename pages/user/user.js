// pages/user/user.js
//获取app实例
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    userInfo: {},
    hasUserInfo: false
  },
  //获取登录信息
  async handleToLogin(e) {
    //1、获取用户信息
    const { userInfo } = await wx.getUserProfile({
      desc: '用于完善会员资料',
    }).catch(err => {
      console.log(err)
    })
    if (userInfo) {
      //设置加载中的提示
      wx.showLoading({
        title: '正在授权中',
      });
      //调用云函数
      //把当前用户信息提交给后端，用于创建生成一个用户账号
      const res = await wx.cloud.callFunction({
        name: "login",
        data: {
          avatarUrl: userInfo.avatarUrl,
          nickName: userInfo.nickName,
        },
      });
      wx.hideLoading({
      })
      // 授权成功后
      // 将用户信息存储在 本地存储中，用于用户下次进入小程序时，不必重复授权登录
      app.setStorage("userInfo", res.result.data)
      this.setData({
        userInfo: res.result.data,
        hasUserInfo: true
      })
    }
  },
  //退出登录
  handleOutLogin(e) {
    //将userInfo置空
    this.setData({
      userInfo: {},
      hasUserInfo: false
    })
    app.rmStorage("userInfo")
  },
  /**
 * 生命周期函数--监听页面显示
 */
  async onShow() {
    //获取缓存中的用户信息
    const res = await app.getStorage("userInfo")
      .catch(err => {
        console.log(err)
      })
    if (res) {
      const user = await wx.cloud.database().collection('users').doc(res._id).get()
      //更新data
      this.setData({
        userInfo: user.data,
        hasUserInfo: true
      })
    }
  },
})