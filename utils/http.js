import {config} from '../config.js'
// import Token from '../models/token.js'
import {promisic} from './util.js'

const app = getApp()
// const token = new Token()

export default class Http {
  
  async request({url, method='GET', data={}, refetch=true}) {
    const that = this
    const curl = config.api_base_url + url
    const reqConfig = this.getReqConfig(curl, method, data)
    const res = await promisic(wx.request)(reqConfig).catch(err => {
      that.showToast('对不起,出现了一个错误')
    })
    if (res) {
      return await this.dealRes(res)
    }
  }

  async dealRes(res) {
    const statusCode = res.statusCode.toString()
    if (statusCode.startsWith('2')) {
      return res.data
    } else {
      let { error_code, msg } = res.data
      const errMsg = this.getErrMsg(msg)
      console.log(errMsg)
      // 10100 refresh token 获取失败 10000 认证失败
      if (error_code === 10100 || error_code === 10000) {
        // 需要重新登录
        return this.dealAuthFail()
      }
      // 10040 令牌失效 10050 令牌过期
      if (error_code === 10040 || error_code === 10050) {
        if (!refetch) {
          return
        }
        // 用refreshToken重获accessToken并再次发起请求, refetch=false只再请求一次
        const accessToken = await this.refreshToken()
        if (accessToken) {
          return await this.request({ ...reqConfig, refetch: false })
        }
        return
      }
      this.showToast(errMsg)
    }
  }

  dealAuthFail() {
    wx.showModal({
      title: '提示',
      content: '请先登录',
      success(res) {
        if (res.confirm) {
          wx.switchTab({
            url: '/pages/my/my'
          })
        }
      }
    })
    app.loginStatus = false
  }

  async refreshToken() {
    const accessToken = await this.request({
      url: 'token/refresh'
    })
    wx.setStorageSync(this.accessTokenKey, accessToken)
    return accessToken
  }

  getErrMsg(msg) {
    let errMsg = msg
    if (msg instanceof Object) {
      Object.keys(msg).forEach((value, index) => {
        if (index === 0) {
          errMsg = msg[value]
        }
      })
    }
    return errMsg
  }

  getReqConfig(url, method, data) {
    const headers = this.getHeaders(url)
    return { url, method, data, headers }
  }

  getHeaders(url) {
    const headers = {
      'content-type': 'application/json'
    }
    if (url === 'v1/token/refresh') {
      const refreshToken = wx.getStorageSync('refreshToken')
      if (refreshToken) {
        headers.Authorization = refreshToken
      }
    } else {
      const accessToken = wx.getStorageSync('accessToken')
      if (accessToken) {
        headers.Authorization = accessToken
      }
    }
    return headers
  }

  showToast(content) {
    wx.showToast({
      title: content,
      icon: 'none'
    })
  }
}
