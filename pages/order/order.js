// pages/order/order.js
import { throttle } from "../../utils/throttle"
//获取应用实例
const app = getApp()
Page({
  /**
   * 页面的初始数据
   */
  data: {
    // 顶部分类
    tabsList: ["全部", "待付款", "待配送", "配送中", "已完成"],
    //顶部导航当前索引
    currentTabIndex: 0,
    // 缓存里的商品数据
    acountList: [],
    orderNum: 5246541561546,
    acountMoney: 0
  },
  //切换顶部导航
  handleTopBar: throttle(function (e) {
    //接收页面传过来的index
    const index = e.currentTarget.dataset.index;
    //优化：只有目标索引！==当前索引时才调用该函数
    if (this.data.currentTabIndex === index) return
    this.setData({
      currentTabIndex: index
    })
  }),
  //处理滑动切换
  handlerTouchMove(e) {
    //接收wxs传入的direction
    const direction = e.direction;
    const currentTabIndex = this.data.currentTabIndex;
    //目标下标
    const targetIndex = this.data.currentTabIndex + direction
    if (targetIndex < 0 || targetIndex > this.properties.tabsList.length - 1) return;
    //改变currentTabIndex的值
    const event = {
      currentTarget: {
        dataset: {
          index: targetIndex
        }
      }
    }
    //调用handlerIndex函数
    this.handleTopBar(event)
  },
  //模拟微信支付效果
  handleToPay(e) {
    wx.showModal({
      title: '您确定要支付吗？',
      content: `总金额为${this.data.acountMoney}`,
      complete: (res) => {
        if (res.cancel) {
          wx.showToast({
            title: '支付失败，您可以返回订单页重新支付',
            icon: "none"
          })
        }
        if (res.confirm) {
          wx.showToast({
            title: '支付成功',
            icon: "none"
          })
        }
      }
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {

  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow() {
    // 获取缓存里的最新数据
    app.getStorage("acountData")
      .then(res => {
        this.setData({
          acountList: res.acountList,
          acountMoney: res.acountMoney,
        })
      })
      .catch(err => {

      })
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom() {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage() {

  }
})