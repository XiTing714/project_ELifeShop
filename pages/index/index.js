const APP = getApp()
const WXAPI = require('apifm-wxapi')
import { request } from "../../utils/request"

Page({
  data: {
    navHeight: (APP.menu.top - APP.system.statusBarHeight) * 2 + APP.menu.height, //导航栏高度
    statusBarHeight: APP.system.statusBarHeight,//状态栏高度
    menuHeight: APP.menu.height, //胶囊高度
    menuWidth: APP.menu.width, //胶囊宽度
    banners: []
  },
  onLoad() {
    //console.log(this.data.navHeight, this.data.statusBarHeight, this.data.menuHeight)
    this.getBanners()
    this.getFloorList()
  },
  async getBanners() {
    const res = await WXAPI.banners({
      type: "index"
    })
    //console.log(res.data)
    this.setData({
      banners: res.data
    })
  },
  // 获取 楼层数据
  getFloorList(){
    request({ url: "/home/floordata" })
    .then(result => {
      this.setData({
        floorList: result
      })
    })
  },
  
})
