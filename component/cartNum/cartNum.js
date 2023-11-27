// component/inToCart/inToCart.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    maxNum: {
      type: Number,
      value: 999
    },
    minNum: {
      type: Number,
      value: 1
    },
    num: {
      type: Number,
      value: 1
    },
    //点击增加事件的开关
    isAddClick: {
      type: Boolean,
      value: true
    },
    //点击减少事件的开关
    isMinClick: {
      type: Boolean,
      // value: false
    }
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
    //点击修改数量
    handleCartNum(e) {
      const step = Number(e.currentTarget.dataset.step)
      const { maxNum, minNum } = this.properties
      let num = this.properties.num + step;
      //超出边界时的弹出框，并将num拉回边界值
      if (num >= maxNum) {
        num = maxNum
        wx.showToast({
          title: '没有更多库存啦',
          icon: "none"
        })
      }
      if (num <= minNum) {
        num = minNum
        wx.showToast({
          title: '不能再减少了哦',
          icon: "none"
        })
      }

      //修改num值
      this.setData({
        num
      })

      //当num在边界里时，两边的按钮都要为true
      if (num > minNum && num < maxNum) {
        this.setData({
          isMinClick: true,
          isAddClick: true
        })
      }
      //当num减少到边界值时，将isMinClick变成false
      if (num <= minNum) {
        this.setData({
          isMinClick: false,
          isAddClick: true
        })
      }
      //当num增减到边界值时，将isAddClick变成false
      if (num >= maxNum) {
        this.setData({
          isMinClick: true,
          isAddClick: false
        })
      }
      this.triggerEvent("changePrice", { value: this.data.num })
    }
  }
})