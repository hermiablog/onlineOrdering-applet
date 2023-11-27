// component/empty-Show/empty-Show.js
Component({

  /**
   * 组件的属性列表
   */
  properties: {
    //控制历史订单的显隐，type=order 用于订单页
    type: String
  },

  /**
   * 组件的初始数据
   */
  data: {

  },

  /**
   * 组件的方法列表
   */
  methods: {
    //点击事件 跳转到菜单页
    handleToOrder(e) {
      wx.switchTab({
        url: '/pages/menu/menu',
      })
    },
    //点击事件 跳转到订单页
    handleToHistory(e) {
      wx.switchTab({
        url: '/pages/order/order',
      })
    }
  }
})