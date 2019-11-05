const formatTime = date => {
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()
  const hour = date.getHours()
  const minute = date.getMinutes()
  const second = date.getSeconds()

  return [year, month, day].map(formatNumber).join('/') + ' ' + [hour, minute, second].map(formatNumber).join(':')
}

const formatNumber = n => {
  n = n.toString()
  return n[1] ? n : '0' + n
}

/**
 * 回调函数 promise 化
 */
const promisic = function (func) {
  return function ({...args}={}) {
    return new Promise((resolve, reject) => {
      const params = Object.assign(args, {
        success(res) {
          resolve(res)
        },
        fail(err) {
          reject(err)
        }
      })
      func(params)
    })
  }
}

const accessTokenKey = 'accessToken'
const refreshTokenKey = 'refreshToken'
const loginStatusKey = 'loginStatus'

const setTokensToStorage = function(accessToken, refreshToken) {
  wx.setStorageSync(accessTokenKey, `Bearer ${accessToken}`)
  wx.setStorageSync(refreshTokenKey, `Bearer ${refreshToken}`)
}

const getAccessTokenFromStorage = function() {
  return wx.getStorageSync(accessTokenKey) || null
}
const getRefreshTokenFromStorage = function() {
  return wx.getStorageSync(refreshTokenKey) || null
}

const setLoginStatusToStorage = function(status) {
  wx.setStorageSync(loginStatusKey, status)
}

const getLoginStatusOfStorage = function() {
  return wx.getStorageSync(loginStatusKey) || false
}

export {
  formatTime,
  promisic,
  setTokensToStorage,
  getAccessTokenFromStorage,
  getRefreshTokenFromStorage,
  setLoginStatusToStorage,
  getLoginStatusOfStorage,
}
