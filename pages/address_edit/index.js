// pages/address_edit/index.js
import { areaList } from './area.js'

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
    areaList,
    addressInfo: {},
    hideNameAlert: true,
    hideTelAlert: true,
    hideAreaAlert: true,
    hideDetailAlert: true,
    isAllFilled: true
  },
  toBackPage() {
    wx.navigateBack()
  },
  getPopUpShow() {
    this.setData({
      isPopUpShow: true
    })
  },
  onClose() {
    if (!this.data.area) {
      this.setData({
        hideAreaAlert: false
      })
    }
    this.setData({
      isPopUpShow: false
    })
  },
  getArea(e) {
    //console.log(e.detail.values)
    let res = e.detail.values
    let area = ""
    res.forEach(item => {
      area = area + item.name + " "
    })
    //console.log(area)
    let addressInfo = this.data.addressInfo
    addressInfo.area = area
    addressInfo.provinceName =  res[0].name
    addressInfo.cityName = res[1].name
    addressInfo.countyName = res[2].name
    this.setData({
      area,
      addressInfo,
      hideAreaAlert: true,
      isPopUpShow: false,
    })
    this.checkAllFilled()
  },
  onNameInput(e) {
    let name = e.detail.value.trim()
    let addressInfo = this.data.addressInfo
    addressInfo.userName = name
    this.setData({
      name,
      addressInfo
    })
    if (name) {
      this.setData({
        hideNameAlert: true
      })
    } else {
      this.setData({
        hideNameAlert: false
      })
      this.checkAllFilled()
    }
  },
  onTelInput(e) {
    let tel = e.detail.value.trim()
    let addressInfo = this.data.addressInfo
    addressInfo.telNumber = tel
    this.setData({
      tel,
      addressInfo
    })
    if (tel && tel.length === 11) {
      this.setData({
        hideTelAlert: true
      })
    } else {
      this.setData({
        hideTelAlert: false
      })
    }
    this.checkAllFilled()
  },
  onDetailInput(e) {
    let detail = e.detail.value.trim()
    let addressInfo = this.data.addressInfo
    addressInfo.detailInfo = detail
    this.setData({
      detail,
      addressInfo
    })
    if (detail) {
      this.setData({
        hideDetailAlert: true
      })
    } else {
      this.setData({
        hideDetailAlert: false
      })
    }
    this.checkAllFilled()
  },
  checkAllFilled() {
    let add = this.data.addressInfo
    if (add.userName && add.telNumber && this.data.hideTelAlert && add.area && add.detailInfo) {
      this.setData({
        isAllFilled: true
      })
    } else {
      this.setData({
        isAllFilled: false
      })
    }
  },
  saveAddress() {
    if (this.data.isAllFilled) {
      let address = wx.getStorageSync("address")
      let index = this.data.index
      let addressInfo = this.data.addressInfo
      address[index] = addressInfo
      wx.setStorageSync("address", address)
      wx.navigateBack()
    } else {
      return
    }
  },
  /**
   * Lifecycle function--Called when page load
   */
  onLoad: function (options) {
    console.log(options)
    let index = options.index
    let address = wx.getStorageSync("address")
    let addressInfo = address[index]
    this.setData({
      index,
      addressInfo
    })
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