const WXAPI = require('apifm-wxapi')
const CONFIG = require('config.js')

App({
  globalData: {},
  onLaunch: function() {
    //获取系统信息
    wx.getSystemInfo({
      success: res => {
        this.system = res
      }
    })
    //获取胶囊信息
    this.menu = wx.getMenuButtonBoundingClientRect()
    //打印数据
    console.log('系统信息', this.system)
    console.log('胶囊信息', this.menu)

    // 使用WXAPI前的配置
    const subDomain = wx.getExtConfigSync().subDomain
    if (subDomain) {
      WXAPI.init(subDomain)
    } else {
      WXAPI.init(CONFIG.subDomain)
      WXAPI.setMerchantId(CONFIG.merchantId)
    }
  }
})
