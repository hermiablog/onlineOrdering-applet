// pages/cart/cart.js
//获取应用实例
const app = getApp()
Page({
  /**
   * 页面的初始数据
   */
  data: {
    //本地存储中的数据
    cartInfo: [],
    //结算价格
    payMoney: 0,
    //全选标志
    selectedAll: false,
    //选中的商品数量 用于结算时显示
    selectProductNum: 0,
    //保存结算的商品数据
    acountList: [],
    //保存结算的商品总金额
    acountMoney: 0
  },
  //接收数量组件传过来的值 更新到页面中
  handleChangeNum(e) {
    const cartInfo = this.data.cartInfo;
    const index = e.currentTarget.dataset.index
    //根据index修改storage接收到的对应商品的数量
    cartInfo[index].numInCart = e.detail.value
    //更新数据
    this.setData({
      cartInfo
    })
    app.setStorage("cartInfo", cartInfo)
    //修改数量组件时，更新价格
    this._updataMoney()
  },
  //选择按钮 
  handleSelect(e) {
    //购物车里的所有商品数据
    const cartInfo = this.data.cartInfo
    //所点击的商品下标
    const index = e.currentTarget.dataset.index;
    //给所点击的商品添加 selected字段 设置 选中 或 不选中 状态
    cartInfo[index].selected = !cartInfo[index].selected
    //更新数据
    this.setData({
      cartInfo
    })
    //更新 storage
    app.setStorage("cartInfo", cartInfo)
    //更新总价格
    this._updataMoney()
  },
  //全选 改变selected状态、总价
  handleSelectAllBtn(e) {
    const cartInfo = this.data.cartInfo;
    let selectedAll = this.data.selectedAll
    if (!selectedAll) {
      cartInfo.forEach(el => {
        //修改每个商品的selected字段 全选
        el.selected = true;
      });
      selectedAll = true;
    } else {
      cartInfo.forEach(el => {
        //修改每个商品的selected字段 全不选
        el.selected = false;
      });
      selectedAll = false
    }
    this.setData({
      cartInfo,
      selectedAll,
    })
    //更新 storage
    app.setStorage("cartInfo", cartInfo)
    //更新总价格
    this._updataMoney()
  },
  //更新商品总金额
  _updataMoney() {
    const cartInfo = this.data.cartInfo || data;
    //是否全部为选中状态
    let isSelectedAll = true;//默认为全选
    let totalprice = 0;
    //被选中商品数量
    let selectProductNum = 0
    cartInfo.forEach(el => {
      if (el.selected) {
        totalprice += el.numInCart * el.favorablePrice;
        selectProductNum += 1
      } else {
        //只要有一个商品是未选中 isSelectedAll就为false
        isSelectedAll = false;
      }
    })
    this.setData({
      payMoney: totalprice * 100,
      //更新被选中商品的数量
      selectProductNum
    })

    //更新selectedAll
    if (isSelectedAll) {
      this.setData({
        selectedAll: true
      })
    } else {
      this.setData({
        selectedAll: false,
      })
    }
  },
  //滑动删除购物车中的商品
  handleDelete(e) {
    const index = e.currentTarget.dataset.index
    const cartInfo = this.data.cartInfo;
    //删除index指向的元素
    cartInfo.splice(index, 1)
    //更新cartinfo和本地存储
    this.setData({
      cartInfo
    })
    console.log(cartInfo)
    app.setStorage("cartInfo", cartInfo)
    //更新徽标
    cartInfo.length > 0 ? wx.setTabBarBadge({
      index: 3,
      text: `${cartInfo.length}`,
    }) : wx.removeTabBarBadge({
      index: 3,
    })
  },
  //去结算
  onClickButton(e) {
    const cartInfo = this.data.cartInfo;
    let acountList = this.data.acountList
    //将被选中的商品存入数组
    cartInfo.forEach(el => {
      if (el.selected) {
        acountList.push(el)
      }
    });
    const acountMoney = Math.floor((this.data.acountMoney + this.data.payMoney / 100) * 100) / 100
    //传递给订单页的数据
    const acountData = {
      acountList,
      acountMoney
    }
    //将结算商品和总金额存入缓存
    app.setStorage("acountData", acountData)
    //删除购物车中提交结算的商品
    acountList.forEach(el => {
      for (let i = 0; i < cartInfo.length; i++) {
        if (el.id === cartInfo[i].id) {
          cartInfo.splice(i, 1)
          break;
        }
      }
    })
    this.setData({
      cartInfo
    })
    //更新缓存
    app.setStorage("cartInfo", cartInfo)

    //跳转到订单页
    wx.switchTab({
      url: '/pages/order/order',
    })
  },
  /**
   * 生命周期函数--监听页面显示
   */
  onShow() {
    //在页面初始化时 获取cartInfo的信息
    app.getStorage("cartInfo")
      .then(data => {
        //更新徽标
        data.length > 0 ? wx.setTabBarBadge({
          index: 3,
          text: `${data.length}`,
        }) : wx.removeTabBarBadge({
          index: 3,
        })
        //更新数据
        this.setData({
          cartInfo: data
        })
        //更新价格
        this._updataMoney()
      })
      //如果没有数据 就显示空购物车场景
      .catch(err => {
      });
    //在页面初始化时 获取acountData的信息，更新acountList acountMoney
    app.getStorage("acountData")
      .then(res => {
        this.setData({
          acountList: res.acountList,
          acountMoney: res.acountMoney
        })
      }).catch(err => { })
  },
  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide() {
    //页面切换/隐藏时，要获取购物车页面的最新数据，并更新cartInfo中
    app.getStorage("cartInfo")
      .then(res => {
        //更新徽标
        res.length > 0 ? wx.setTabBarBadge({
          index: 3,
          text: `${res.length}`,
        }) : wx.removeTabBarBadge({
          index: 3,
        })
        //更新数据
        this.setData({
          cartInfo: res
        })
      })
      .catch(err => { })
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