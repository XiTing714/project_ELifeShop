// pages/cart/index.js
const APP = getApp()
const AUTH = require('../../utils/auth')
Page({

  /**
   * Page initial data
   */
  data: {
    navHeight: (APP.menu.top - APP.system.statusBarHeight) * 2 + APP.menu.height, //导航栏高度
    statusBarHeight: APP.system.statusBarHeight,//状态栏高度
    menuHeight: APP.menu.height, //胶囊高度
    menuWidth: APP.menu.width, //胶囊宽度
    cartList: null,
    allChecked: false,
    totalPrice: null,
    totalNum: null,
    isPopUpShow: false,
    address: null,
    checkedAddress: null
  },
  delBtnWidth: 150,
  touchS(e) {
    //console.log(e.touches)
    //记录下开始触摸时触摸点在X轴的位置
    this.setData({
      startX: e.touches[0].clientX,
      startY: e.touches[0].clientY
    })
  },
  touchM(e) {
    var index = e.currentTarget.dataset.index
    if (e.changedTouches.length == 1) {
      let endX = e.changedTouches[0].clientX
      let endY = e.changedTouches[0].clientY
      let disX = this.data.startX - endX
      let disY = this.data.startY - endY
      let rate = disX / disY
      let left
      //如果rate>1或<-1才视为水平滑动
      if (rate > 1 || rate < -1) {
        //改变left
        if (disX >= 0) {
          //向左滑
          left = disX > this.delBtnWidth ? "margin-left:-" + this.delBtnWidth + "rpx" : "margin-left:-" +disX + "rpx"
        } else {
          //向右滑
          left = -disX > this.delBtnWidth ? "margin-left:0rpx" : "margin-left:-" + (this.delBtnWidth + disX) + "rpx"
          //console.log(left)
        }
      }
      let cartList = this.data.cartList
      cartList[index].left = left
      this.setData({
        cartList
      })
    }
  },
  touchE(e) {
    var index = e.currentTarget.dataset.index
    if (e.changedTouches.length == 1) {
      let endX = e.changedTouches[0].clientX
      let endY = e.changedTouches[0].clientY
      let disX = this.data.startX - endX
      let disY = this.data.startY - endY
      let rate = disX / disY
      let left
      //如果rate>1或<-1才视为水平滑动
      if (rate > 1 || rate < -1) {
        //如果距离小于删除按钮的1/2，不显示删除按钮
        if (disX >= 0) {
          left = disX > this.delBtnWidth / 3 ? "margin-left:-" + this.delBtnWidth + "rpx" : "margin-left:0rpx"
        } else {
          left = -disX > this.delBtnWidth / 3 ? "margin-left:0rpx" : "margin-left:-" + this.delBtnWidth + "rpx"
        }
      }
      let cartList = this.data.cartList
      cartList[index].left = left
      this.setData({
        cartList
      })
    }
  },
  changeChecked(e) {
    //console.log(e.currentTarget.dataset.index)
    let index = e.currentTarget.dataset.index
    let cartList = this.data.cartList
    cartList[index].checked = !cartList[index].checked
    this.setData({
      cartList
    })
    wx.setStorageSync("cartList", cartList)
    this.isAllChecked()
    this.compuTotalPrice()
    this.compuTotalNum()
  },
  plusTap(e) {
    let index = e.currentTarget.dataset.index
    let cartList = this.data.cartList
    cartList[index].buyNum += 1
    this.setData({
      cartList
    })
    wx.setStorageSync("cartList", cartList)
    this.compuTotalPrice()
  },
  minusTap(e) {
    let index = e.currentTarget.dataset.index
    let cartList = this.data.cartList
    let num = cartList[index].buyNum
    if (num <= 0) {
      return
    } else {
      cartList[index].buyNum -= 1
      this.setData({
        cartList
      })
      wx.setStorageSync("cartList", cartList)
    }
    this.compuTotalPrice()
  },
  changeInput(e) {
    let index = e.currentTarget.dataset.index
    let cartList = this.data.cartList
    let num = e.detail.value
    console.log(num)
    if (num == null || num == "") {
      return
    } else {
      cartList[index].buyNum = num
    }
    this.setData({
      cartList
    })
    wx.setStorageSync("cartList", cartList)
    this.compuTotalPrice()
  },
  delGoods(e) {
    let index = e.currentTarget.dataset.index
    let _this = this
    wx.showModal({
      title: '提示',
      content: '确认将该商品删除？',
      cancelText: "我再想想",
      confirmText: "删除",
      confirmColor: "#AD0E11",
      success(res) {
        if (res.confirm) {
          _this.data.cartList.splice(index, 1)
          _this.setData({
            cartList: _this.data.cartList
          })
          wx.setStorageSync("cartList", _this.data.cartList)
          _this.compuTotalPrice()
          _this.compuTotalNum()
          _this.isAllChecked()
        } else if (res.cancel) {
          console.log('用户点击取消')
        }
      }
    })
  },
  chooseAllChecked() {
    //如果全部为true，则全改为false
    //只要有一个不为true，则全改为true
    let cartList = this.data.cartList
    let result = cartList.every(item => item.checked === true)
    if (result) {
      cartList.forEach(item => item.checked = false)
    } else {
      cartList.forEach(item => item.checked = true)
    }
    this.setData({
      cartList
    })
    wx.setStorageSync("cartList", cartList)
    this.isAllChecked()
    this.compuTotalNum()
    this.compuTotalPrice()
  },
  isAllChecked() {
    //如果全部为true则为true，有一个不满足true则为false
    let result = this.data.cartList.every(item => item.checked === true)
    this.setData({
      allChecked: result
    })
  },
  compuTotalPrice() {
    let checkedList = this.data.cartList.filter(item => item.checked)
    let totalPrice = 0
    checkedList.forEach(item => {
      totalPrice = totalPrice + item.buyNum * item.basicInfo.minPrice
    })
    this.setData({
      totalPrice
    })
  },
  compuTotalNum() {
    let checkedList = this.data.cartList.filter(item => item.checked)
    this.setData({
      totalNum: checkedList.length
    })
  },
  /**
   * Lifecycle function--Called when page load
   */
  getPopUpShow() {
    AUTH.checkHasLogined().then(isLogined => {
      this.setData({
        wxlogin: isLogined
      })
      if (isLogined) {
        // 展示popUp
        console.log("已登录")
        this.setData({
          isPopUpShow: true
        })
      } else {
        console.log("未登录")
        AUTH.openLoginDialog()
      }
    })
    
  },
  onClose() {
    this.setData({
      isPopUpShow: false
    })
  },
  processLogin(e) {
    AUTH.login(this)
    //console.log(e.detail)
    wx.setStorageSync("userInfo", e.detail.userInfo)
  },
  async selWxAddress() {
    let addressInfo = await AUTH.chooseAddress()
    addressInfo.checked = true
    addressInfo.area = addressInfo.provinceName + addressInfo.cityName + addressInfo.countyName
    console.log(addressInfo)
    let address = wx.getStorageSync("address") || []
    addressInfo.id = address.length + 1
    address.push(addressInfo)
    this.setData({
      address
    })
    wx.setStorageSync("address", address)
  },
  addAddress() {
    wx.navigateTo({
      url: '/pages/address_add/index',
    })
  },
  onAddressRadio(e) {
    let index = e.currentTarget.dataset.index
    let address = this.data.address
    address.forEach(item => item.checked = false)
    address[index].checked = true
    this.setData({
      address
    })
    wx.setStorageSync("address", address)
    this.currentDetailInfo()
  },
  currentDetailInfo() {
    let checkedAddress = this.data.address.filter(item => item.checked)
    this.setData({
      checkedAddress
    })
  },
  toIndexPage() {
    wx.switchTab({
      url: "/pages/index/index"
    })
  },
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
        var cartList = wx.getStorageSync("cartList")
        var address = wx.getStorageSync("address")
        this.setData({
          cartList,
          address
        })
      } else {
        //console.log("未登录")
        //AUTH.openLoginDialog()
      }
      if (cartList) {
        this.isAllChecked()
        this.compuTotalPrice()
        this.compuTotalNum()
      }
      if (address) {
        this.currentDetailInfo()
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