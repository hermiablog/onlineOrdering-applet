// component/product-detail/product-detail.js
//获取应用实例
const app = getApp()
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    //商品详细信息
    detailInfo: Object,
    //显隐开关
    detailFlag: Boolean,
  },

  /**
   * 组件的初始数据
   */
  data: {
    //要购买的商品数量
    productNum: 1,
    //商品总价
    totalMoney: 0,
    //最低购买数量
    minNum: 1,
    //点击增加事件的开关
    isAddClick: true,
    //点击减少事件的开关
    isMinClick: false,
    //添加到购物车的商品数量
    totalNum: 0
  },
  /**
   * 组件的方法列表
   */
  methods: {
    //点击选择商品规格
    handleSelected(e) {
      const { specsId, specsDesc, specsItemId } = e.target.dataset
      let specsDescItem;
      for (let i = 0; i < specsDesc.length; i++) {
        //将当前分类的所有选项都变成false
        specsDesc[i].isActive = false;
        if (specsDesc[i].id === specsItemId) {
          //被点击具体的选项
          specsDescItem = specsDesc[i];
          //将所点击的选项变成true
          specsDesc[i].isActive = true;
        }
      }
      //获取当前商品信息
      const detailInfo = this.properties.detailInfo;
      const specs = detailInfo.specs;
      //将数据更新进产品数据里
      specs.forEach(el => {
        if (el.id === specsId) {
          el.specsDesc = specsDesc
        }
      });
      //将改变后的数据更新到页面
      this.setData({
        detailInfo,
      })
    },
    //事件处理函数 接收子组件传来的数量
    handlechangePrice(e) {
      const num = e.detail.value;
      const price = this.properties.detailInfo.favorablePrice;
      const totalMoney = (num * price).toFixed(2);
      this.setData({
        productNum: num,
        totalMoney
      })
    },
    //点击加入购物车 使用本地存储保存数据
    async handleToCart(e) {
      const detailInfo = this.properties.detailInfo;//当前添加的商品数据
      detailInfo.selectNum = this.data.productNum;//当前选择的商品数量
      await app.getStorage("cartInfo")
        .then(data => {
          //本地存储里有数据时
          const currentProductId = detailInfo.id;//当前产品的id
          //遍历本地存储里的数据，保存它的id，对比前后两个id是否一致
          let isExist = false;
          data.forEach(el => {
            //如果storage里的数据id和当前商品id一致，表示有一样的产品
            if (el.id === currentProductId) {
              isExist = true;//存在相同产品
              //如果是同一个产品，更新数量
              el.numInCart += detailInfo.selectNum;
              //判断库存
              this._judgeStock(el.numInCart, el.stock, data)
            }
          });
          //如果没有相同产品，就push到数组里，并更新storage
          if (!isExist) {
            detailInfo.numInCart = detailInfo.selectNum
            data.push(detailInfo)
            //判断库存
            this._judgeStock(detailInfo.numInCart, detailInfo.stock, data)
          }
        })
        .catch(err => {
          //没有数据，第一次添加本地存储
          //添加numInCart字段 表示添加商品的总数
          detailInfo.numInCart = detailInfo.selectNum
          const cartArray = [];
          cartArray.push(detailInfo)
          //检测库存
          this._judgeStock(detailInfo.numInCart, detailInfo.stock, cartArray)
        })
      //关闭详情页
      this.handleCloseDetail()
    },
    /**
     * 检测是否超过库存，如果不超过库存，就添加进storage，超过了就提示
     * @param {Number} total 已添加数量
     * @param {Number} stock 库存数
     * @param {Array} arr 购物车数组
     */
    _judgeStock(total, stock, arr) {
      //判断库存
      if (total <= stock) {
        //如果小于库存，就允许添加
        app.setStorage("cartInfo", arr)
        wx.showToast({
          title: '成功加入购物车',
          icon: "success",
          duration: 2000,
        })
      } else {
        //如果大于库存，就提示库存不足
        wx.showToast({
          title: '对不起，今日已经没货啦',
          icon: "none"
        })
      }
    },
    //点击关闭详情页
    handleCloseDetail(e) {
      this.setData({
        detailFlag: true,
        totalMoney: 0,
        productNum: this.data.minNum,
        //点击增加事件的开关
        isAddClick: true,
        //点击减少事件的开关
        isMinClick: false
      })
      app.getStorage("cartInfo")
        .then(res => {
          res.length > 0 ? wx.setTabBarBadge({
            index: 3,
            text: `${res.length}`,
          }) : wx.removeTabBarBadge({
            index: 3,
          })
        }).catch(err => { })
    },
  }
})