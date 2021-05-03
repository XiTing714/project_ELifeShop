const WXAPI = require('apifm-wxapi')
const upSort = require('../../utils/upSort.js')
const downSort = require('../../utils/downSort.js')

Page({

  /**
   * Page initial data
   */
  data: {
    currentIndex: 0,
    subcateIndex: 0,
    tagIndex: 0,
    scrollX: 0,
    currentGoods: [],
    priceFilterIndex: null,
    cateName: ["为你推荐", "匠人精选", "艺术品"],
    subcate: ["生活节", "超级补贴"],
    tagList: ["乌龙茶", "绿茶", "红茶", "黑茶", "普洱", "白茶", "花草茶"],
    goodsList: [
      {
        name: "为你推荐",
        children: [
          {
            name: "出游季"
          },
          {
            name: "超级补贴"
          }
        ]
      },
      {
        name: "匠人精选",
        children: [
          {
            name: "茶",
            tag: [
              {
                name: "乌龙茶"
              },
              {
                name: "绿茶"
              },
              {
                name: "红茶"
              },
              {
                name: "黑茶"
              },
              {
                name: "普洱"
              },
              {
                name: "白茶"
              },
              {
                name: "花草茶"
              }
            ]
          },
          {
            name: "饰"
          },
          {
            name: "器物"
          }
        ]
      },
      {
        name: "艺术品",
      },
      {
        name: "文创用品",
      }

    ],
    isHideChooseBox: true,
    isPopUpShow: false,
    popUpGoods: null
  },
  // 改变大分类时
  changeCate(e) {
    //console.log(e.currentTarget.dataset.index)
    //先把当前商品重置为空数组
    this.setData({
      currentGoods: []
    })
    let currentIndex = e.currentTarget.dataset.index
    let subcate, tagList
    // 取子分类subcate
    if (this.data.goodsList[currentIndex].children) {
      subcate = this.data.goodsList[currentIndex].children.map(item => item.name)
      //取标签tagList
      let subcateIndex = 0
      if (this.data.goodsList[currentIndex].children[subcateIndex].tag) {
        tagList = this.data.goodsList[currentIndex].children[subcateIndex].tag.map(item => item.name)
        // 获取当前tag的数据: 
        let currentTagName = tagList[this.data.tagIndex]
        this.getCurrentGoods(currentTagName)
      } else {
        tagList = []
      }
    } else {
      subcate = []
      tagList = []
    }
   
    this.setData({
      currentIndex,
      subcate,
      tagList,
      subcateIndex: 0,
      tabIndex: 0,
      scrollX: 0,
    })
  },
  // 改变子分类时
  changeSubCate(e) {
    //console.log(e.currentTarget.dataset.index)
    //先把当前商品重置为空数组
    this.setData({
      currentGoods: []
    })
    let subcateIndex = e.currentTarget.dataset.index
    // 取标签tagList
    let tagList
    if (this.data.goodsList[this.data.currentIndex].children[subcateIndex].tag) {
      tagList = this.data.goodsList[this.data.currentIndex].children[subcateIndex].tag.map(item => item.name)
      // 获取当前tag的数据: 
      let currentTagName = tagList[this.data.tagIndex]
      this.getCurrentGoods(currentTagName)
    } else {
      tagList = []
    }
    this.setData({
      subcateIndex: e.currentTarget.dataset.index,
      tagList,
      tabIndex: 0,
      scrollX: 0
    })
  },
  //点击标签时
  tapTag(e) {
    //先把当前商品重置为空数组
    this.setData({
      currentGoods: []
    })
    let tagIndex = e.currentTarget.dataset.index
    let currentTagName = e.currentTarget.dataset.item
    // 获取当前tag的数据: 
    this.getCurrentGoods(currentTagName)
    // 点击标签然后标签栏进行滚动
    if (tagIndex === 0 || tagIndex === 1) {
      var scrollX = 0
    } else if (tagIndex > 1) {
      scrollX = 58 * (tagIndex - 1) //58是第一个标签的offsetLeft
    }
    this.setData({
      tagIndex,
      scrollX
    })
  },
  showChooseBox() {
    let isHideChooseBox = !this.data.isHideChooseBox
    this.setData({
      isHideChooseBox
    })
  },
  //获取目前展示商品
  async getCurrentGoods(currentTagName) {
    wx.showLoading({
      title: "快速加载中"
    })
    const res = await WXAPI.goods({
      categoryId: 221798,
      tagsLike: currentTagName
    })
    this.setData({
      currentGoods: res.data
    })
    wx.hideLoading()
    wx.setStorageSync("currentGoods", res.data)
    console.log(wx.getStorageSync("currentGoods"))
    //算出排序商品
    let upcurrentGoods = upSort(wx.getStorageSync("currentGoods"))
    let downcurrentGoods = downSort(wx.getStorageSync("currentGoods"))
    console.log(upcurrentGoods)
    console.log(downcurrentGoods)
    this.setData({
      upcurrentGoods,
      downcurrentGoods
    })

  },
  //点击综合排序
  clickCompreFilter() {
    this.setData({
      compreFilterIndex: 1,
      priceFilterIndex: null,
      currentGoods: wx.getStorageSync("currentGoods")
    })
  },
  //点击价格排序
  clickPriceFilter() {
    if (this.data.priceFilterIndex === 0) {
      this.setData({
        compreFilterIndex: null,
        priceFilterIndex: 1,
        currentGoods: this.data.downcurrentGoods
      }) 
    } else {
      this.setData({
        compreFilterIndex: null,
        priceFilterIndex: 0,
        currentGoods: this.data.upcurrentGoods
      })
    }

  },
  //加入购物车弹出层
  async getPopUpShow(e) {
    let isPopUpShow = !this.data.isPopUpShow
    this.setData({
      isPopUpShow
    })
    const goodsId = e.currentTarget.dataset.item
    const res = await WXAPI.goodsDetail(goodsId)
    console.log(res.data)
    let popUpGoods = res.data
    this.setData({
      popUpGoods
    })

  },
  onClose() {
    let isPopUpShow = !this.data.isPopUpShow
    this.setData({
      isPopUpShow
    })
  },
  /**
   * Lifecycle function--Called when page load
   */
  onLoad: function (options) {
    // 获取商品数据
    let cateName = this.data.goodsList.map(item => item.name)
    let subcate, tagList
    //console.log(cateName)
    // 取子分类subcate
    if (this.data.goodsList[this.data.currentIndex].children) {
      subcate = this.data.goodsList[this.data.currentIndex].children.map(item => item.name)
    } else {
      subcate = []
    }
    // 取标签tagList
    if (this.data.goodsList[this.data.currentIndex].children[this.data.subcateIndex].tag) {
      tagList = this.data.goodsList[this.data.currentIndex].children[this.data.subcateIndex].tag.map(item => item.name)
    } else {
      tagList = []
    }
    this.setData({
      cateName,
      subcate,
      tagList
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