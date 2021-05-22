// pages/user/index.js
const AUTH = require('../../utils/auth')
const APP = getApp()
Page({

  /**
   * Page initial data
   */
  data: {
    navHeight: (APP.menu.top - APP.system.statusBarHeight) * 2 + APP.menu.height, //导航栏高度
    statusBarHeight: APP.system.statusBarHeight,//状态栏高度
    menuHeight: APP.menu.height, //胶囊高度
    menuWidth: APP.menu.width, //胶囊宽度
    userInfo: {},
  },
  processLogin(e) {
    AUTH.login(this)
    //console.log(e.detail)
    wx.setStorageSync("userInfo", e.detail.userInfo)
  },
  toLogin() {
    AUTH.openLoginDialog()
  },
  toAddrMag() {
    if (this.data.wxlogin) {
      wx.navigateTo({
        url: '/pages/address_manage/index',
      })
    } else {
      //console.log("未登录")
      AUTH.openLoginDialog()
    }
  },
  /**
   * Lifecycle function--Called when page load
   */
  onLoad: function (options) {
    
  },

  /**
   * Lifecycle function--Called when page is initially rendered
   */
  onReady: function () {

  },

  /**
   * Lifecycle function--Called when page show
   */
  onShow: function () {
    AUTH.checkHasLogined().then(isLogined => {
      this.setData({
        wxlogin: isLogined
      })
      if (isLogined) {
        //console.log("已登录")
        let userInfo = wx.getStorageSync("userInfo")
        this.setData({
          userInfo
        })
      } else {
        //console.log("未登录")
      }
    })
  },

  /**
   * Lifecycle function--Called when page hide
   */
  onHide: function () {

  },

  /**
   * Lifecycle function--Called when page unload
   */
  onUnload: function () {

  },

  /**
   * Page event handler function--Called when user drop down
   */
  onPullDownRefresh: function () {

  },

  /**
   * Called when page reach bottom
   */
  onReachBottom: function () {

  },

  /**
   * Called when user click on the top right corner to share
   */
  onShareAppMessage: function () {

  }
})