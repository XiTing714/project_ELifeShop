// pages/address_manage/index.js
const APP = getApp()
Page({

  /**
   * Page initial data
   */
  data: {
    navHeight: (APP.menu.top - APP.system.statusBarHeight) * 2 + APP.menu.height, //导航栏高度
    statusBarHeight: APP.system.statusBarHeight,//状态栏高度
    menuHeight: APP.menu.height, //胶囊高度
    menuWidth: APP.menu.width, //胶囊宽度,
    address: []
  },
  toBackPage() {
    wx.navigateBack()
  },
  editAddress(e) {
    let index = e.currentTarget.dataset.index
    //console.log(e.currentTarget.dataset)
    wx.navigateTo({
      url: '/pages/address_edit/index?index=' + index,
    })
  },
  checkAddress(e) {
    let index = e.currentTarget.dataset.index
    //console.log(index)
    let address = this.data.address
    address.forEach(item => item.checked = false)
    address[index].checked = true
    this.setData({
      address
    })
    wx.setStorageSync("address", address)
  },
  delAddress(e) {
    let index = e.currentTarget.dataset.index
    let _this = this
    wx.showModal({
      title: '提示',
      content: '确认将该地址删除？',
      cancelText: "我再想想",
      confirmText: "删除",
      confirmColor: "#AD0E11",
      success(res) {
        if (res.confirm) {
          _this.data.address.splice(index, 1)
          _this.setData({
            address: _this.data.address
          })
          wx.setStorageSync("address", _this.data.address)
        } else if (res.cancel) {
          console.log('用户点击取消')
        }
      }
    })
  },
  toAddNew() {
    wx.navigateTo({
      url: '/pages/address_add/index',
    })
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
    let address = wx.getStorageSync("address") || []
    this.setData({
      address
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