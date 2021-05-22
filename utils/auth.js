import Dialog from '@vant/weapp/dialog/dialog'

// 检测登录状态，返回 true / false
async function checkHasLogined() {
  //检测是否已获取token/code
  const loginCode = wx.getStorageSync('loginCode')
  if (!loginCode) {
    //console.log("没有code")
    return false
  }
  //检测登录状态是否过期
  const loggined = await checkSession()
  if (!loggined) {
    //console.log("登录过期")
    wx.removeStorageSync('loginCode')
    return false
  }
  return true
}

// 检测登录状态是否过期
async function checkSession() {
  return new Promise((resolve, reject) => {
    wx.checkSession({
      success() {
        resolve(true)
        //console.log("没过期啊/")
      },
      fail() {
        resolve(false)
        //console.log("过期了啊/")
      }
    })
  })
}

//打开登录提示
function openLoginDialog() {
  Dialog.confirm({
    selector: '#van-dialog-auth-login',
    message: '需要登陆后才能继续操作',
    confirmButtonText: '立即登陆',
    cancelButtonText: '暂不登陆',
    confirmButtonOpenType: 'getUserInfo',
    lang: 'zh_CN'
  }).then(() => {
    // Dialog.close()
  }).catch(() => {
    // Dialog.close()
  })
}

function login(page) {
  wx.login({
    success(res) {
      wx.setStorageSync('loginCode', res.code)
      wx.showToast({
        title: ' 登录成功！',
        icon: 'none',
      })
      if (page) {
        page.onShow()
      }
    }
  })
}

async function chooseAddress() {
  return new Promise((resolve, reject) => {
    wx.chooseAddress({
      success: (result) => {
        resolve(result)
      },
      fail: (err) => {
        reject(err)
      }
    })
  })
}

module.exports = {
  checkHasLogined: checkHasLogined,
  openLoginDialog: openLoginDialog,
  login: login,
  chooseAddress: chooseAddress
}