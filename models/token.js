import Http from '../utils/http.js'
import { setTokensToStorage } from '../utils/util.js'

export default class Token extends Http {
  async getTokens(data) {
    const tokens = await this.request({
      url: 'token/get',
      method: 'POST',
      data,
    })
    if (tokens) {
      setTokensToStorage(tokens.access_token, tokens.refresh_token)
      return {
        accessToken: tokens.access_token,
        refreshToken: tokens.refresh_token,
      }
    }
    return null
  }

  // 放入Http.js 中防止循环导入
  // async refreshToken() {
  //   const accessToken = await this.request({
  //     url: 'v1/token/refresh'
  //   })
  //   wx.setStorageSync(this.accessTokenKey, accessToken)
  //   return accessToken
  // }
}