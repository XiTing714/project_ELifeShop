// pages/address_add/index.js
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
    isPopUpShow: false,
    area: "",
    hideAreaAlert: true,
    name: "",
    hideNameAlert: true,
    tel: "",
    hideTelAlert: true,
    detail: "",
    hideDetailAlert: true,
    isAllFilled: false
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
    this.setData({
      area,
      hideAreaAlert: true,
      isPopUpShow: false,
      provinceName: res[0].name,
      cityName: res[1].name,
      countyName: res[2].name
    })
    this.checkAllFilled()
  },
  onNameInput(e) {
    let name = e.detail.value.trim()
    if (name) {
      this.setData({
        name,
        hideNameAlert: true
      })
    } else {
      this.setData({
        name,
        hideNameAlert: false
      })
      this.checkAllFilled()
    }
  },
  onTelInput(e) {
    let tel = e.detail.value.trim()
    if (tel && tel.length === 11) {
      this.setData({
        tel,
        hideTelAlert: true
      })
    } else {
      this.setData({
        tel,
        hideTelAlert: false
      })
    }
    this.checkAllFilled()
  },
  onDetailInput(e) {
    let detail = e.detail.value.trim()
    if (detail) {
      this.setData({
        detail,
        hideDetailAlert: true
      })
    } else {
      this.setData({
        detail,
        hideDetailAlert: false
      })
    }
    this.checkAllFilled()
  },
  checkAllFilled() {
    if (this.data.name && this.data.tel &&  this.data.hideTelAlert && this.data.area && this.data.detail) {
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
      let address = wx.getStorageSync("address") || []
      let addressInfo = {}
      addressInfo.userName = this.data.name + " "
      addressInfo.telNumber = this.data.tel + " "
      addressInfo.area = this.data.area
      addressInfo.provinceName = this.data.provinceName + " "
      addressInfo.cityName = this.data.cityName + " "
      addressInfo.countyName = this.data.countyName + " "
      addressInfo.detailInfo = this.data.detail + " "
      addressInfo.checked = true
      addressInfo.id = address.length + 1
      if (address) {
        address.forEach(item => item.checked = false)
      }
      address.push(addressInfo)
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