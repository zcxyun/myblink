import {config} from '../config.js'
import {promisic} from './util.js'
import { 
  setTokensToStorage, 
  getAccessTokenFromStorage, 
  getRefreshTokenFromStorage,
} from '../utils/util.js'

export default class Http {
  async request({url, method='GET', data={}, refetch=true}) {
    const that = this
    const header = this.getHeader(url)
    const curl = config.api_base_url + url
    const reqOriginConfig = { url, method, data, header }
    const reqConfig = { url:curl, method, data, header }
    const res = await promisic(wx.request)(reqConfig).catch(err => {
      that.showToast('对不起,出现了一个错误')
    })
    if (res) {
      return await this.dealRes(res, reqOriginConfig, refetch)
    }
  }

  async dealRes(res, reqOriginConfig, refetch) {
    const statusCode = res.statusCode.toString()
    if (statusCode.startsWith('2')) {
      return res.data
    } else {
      console.log(res.data)
      let { error_code, msg } = res.data
      const errMsg = this.getErrMsg(msg)
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
        const res = await this.refreshToken()
        if (res) {
          return await this.request({ ...reqOriginConfig, refetch: false })
        }
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
  }

  async refreshToken() {
    const tokens = await this.request({
      url: 'token/refresh'
    })
    if (tokens) {
      setTokensToStorage(tokens.access_token, tokens.refresh_token)
      return true
    }
    return false
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

  getHeader(url) {
    const header = {
      'content-type': 'application/json'
    }
    if (url === 'token/refresh') {
      const refreshToken = getRefreshTokenFromStorage()
      if (refreshToken) {
        header.Authorization = refreshToken
      }
    } else {
      const accessToken = getAccessTokenFromStorage()
      if (accessToken) {
        header.Authorization = accessToken
      }
    }
    return header
  }

  showToast(content) {
    wx.showToast({
      title: content,
      icon: 'none'
    })
  }
}
