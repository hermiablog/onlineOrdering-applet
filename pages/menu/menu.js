// pages/menu/menu.js
import Menu from "../../model/Menu"
Page({
  /**
   * 页面的初始数据
   */
  data: {
    //取单的方式，默认为外卖
    takeWayIndex: 1,
    //点击时 左侧菜单栏的下标
    navLeftIndex: 0,
    //左侧菜单栏的数据
    navLeftItems: [],
    //右侧商品信息
    navRightItems: [],
    //产品列表
    productList: [],
    //被点击的商品所对应的数据
    detailInfo: [],
    //商品详情的开关
    detailFlag: true,
    //控制骨架屏的显隐
    loading: true
  },
  //点击切换取餐方式
  handleTakeWay(e) {
    this.setData({
      takeWayIndex: e.currentTarget.dataset.index
    })
  },
  //获取菜单页数据
  async _getMenuList() {
    const menuList = await Menu.getMenuList()
    this.setData({
      navLeftItems: menuList.navLeftItems,
      navRightItems: menuList.navRightItems,
      productList: menuList.productList
    })
  },
  //左侧菜单栏切换
  handleSwitch(e) {
    this.setData({
      navLeftIndex: e.currentTarget.dataset.index
    })
  },
  //点击打开商品详情
  async handleToDetail(e) {
    //拿到商品id
    const id = e.currentTarget.dataset.id
    //根据 id 获取详情信息
    const detailInfo = await Menu.getDetailInfo(id)
    this.setData({
      detailFlag: false,
      detailInfo
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    if (!(JSON.stringify(options) === "{}")) {
      this.setData({
        takeWayIndex: options.index
      })
    }
    //初始化菜单页数据
    this._getMenuList();
    this.setData({
      loading: false
    })
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