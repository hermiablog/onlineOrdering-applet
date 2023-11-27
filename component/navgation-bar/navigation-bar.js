// component/navgation-bar/navigation-bar.js
const systemInfo = wx.getSystemInfoSync()
Component({

  /**
   * 组件的属性列表
   */
  properties: {

  },

  /**
   * 组件的初始数据
   */
  data: {
    //状态栏样式
    statusBarStyle: '',
    //导航栏样式
    navigationBarStyle: '',
    //顶部导航样式
    topNavStyle: '',
    //胶囊样式
    menuStyle: '',
    iconShow: "true"
  },

  lifetimes: {
    attached() {
      this.setData({
        statusBarStyle: this._getStatusBarStyle(),
        navigationBarStyle: this._getNavigationBarStyle(),
        topNavStyle: this._getTopNavStyle(),
        menuStyle: this._getMenuStyle()
      })
    }
  },
  /**
   * 组件的方法列表
   */
  methods: {
    //输入框的键盘输入事件
    handlerInput(e) {
      const value = e.detail.value;
      //修改iconShow的值 控制搜索按钮的显隐
      this.setData({
        iconShow: value ? false : true
      })
    },
    /**
        * 获取胶囊按钮位置
        */
    _getMenuPosition() {
      //胶囊距状态栏高度，距右边框距离，宽高
      let top = 4
      let right = 7
      let width = 87
      let height = 32
      //微信开发者工具-ios
      if (systemInfo.platform === 'devtools' && systemInfo.system.indexOf('Android') === -1) {
        // 6 10
        top = 4
        right = 7
      }
      //微信开发者平台-安卓系统
      else if (systemInfo.platform === 'devtools' && systemInfo.system.indexOf('Android') != -1) {
        top = 8
        right = 10
      }
      //Andriod
      else if (systemInfo.system.indexOf('Android') != -1) {
        // 8 10 95
        top = 7
        right = 9
        width = 95
      }
      return {
        //胶囊距顶部距离=状态栏高度+top
        top: systemInfo.statusBarHeight + top,
        //胶囊距左侧距离=可使用窗口宽度-胶囊宽度-胶囊距右边框距离
        left: systemInfo.windowWidth - width - right,
        //胶囊宽度
        width: width,
        //胶囊高度
        height: height
      }
    },
    /**
   * 获取胶囊按钮样式
   */
    _getMenuStyle() {
      return this._formatStyle(this._getMenuPosition())
    },
    /**
    * 获取状态栏样式
    */
    _getStatusBarStyle() {
      let statusBarPosition = {
        top: 0,
        left: 0,
        width: systemInfo.windowWidth,
        height: systemInfo.statusBarHeight
      }
      return this._formatStyle(statusBarPosition)
    },
    /**
    * 获取顶部导航栏样式
    */
    _getTopNavStyle() {
      let menuPosition = this._getMenuPosition()
      let topNavStylePosition = {
        top: systemInfo.statusBarHeight,
        left: 0,
        width: systemInfo.windowWidth,
        height: (menuPosition.top - systemInfo.statusBarHeight) * 2 + menuPosition.height
      }
      return this._formatStyle(topNavStylePosition)
    },
    /**
     * 获取导航条样式
     */
    _getNavigationBarStyle() {
      let menuPosition = this._getMenuPosition()
      //内边距=可使用窗口宽度-胶囊左侧距离-胶囊宽度
      let padding = systemInfo.windowWidth - menuPosition.left - menuPosition.width
      let navigationPosition = {
        top: menuPosition.top,
        left: padding,
        width: systemInfo.windowWidth - padding * 3 - menuPosition.width,
        height: menuPosition.height
      }
      return this._formatStyle(navigationPosition)
    },
    /**
     * 格式化Style
     */
    _formatStyle(position) {
      let styles = []
      for (let key in position) {
        styles.push(`${key}: ${position[key]}px;`)
      }
      // 将对象转成数组
      return styles.join(' ')
    },
  }
})