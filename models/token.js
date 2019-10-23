import Http from '../utils/http.js'

export default class Token extends Http {

  accessTokenKey = 'accessToken'
  refreshTokenKey = 'refreshToken'
  
  async getTokens(data) {
    const {accessToken, refreshToken} = await this.request({
      url: 'token/get',
      method: 'POST',
      data
    })
    this.setTokensToStorage(accessToken, refreshToken)
    return {
      accessToken,
      refreshToken
    }
  }

  // 放入Http.js 中防止循环导入
  // async refreshToken() {
  //   const accessToken = await this.request({
  //     url: 'v1/token/refresh'
  //   })
  //   wx.setStorageSync(this.accessTokenKey, accessToken)
  //   return accessToken
  // }

  setTokensToStorage(accessToken, refreshToken) {
    wx.setStorageSync(this.accessTokenKey, `Bearer ${accessToken}`)
    wx.setStorageSync(this.refreshTokenKey, `Bearer ${refreshToken}`)
  }

  getAccessTokenFromStorage() {
    return wx.getStorageSync(this.accessTokenKey) || null
  }
}