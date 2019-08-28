import Http from '../utils/http.js'

export default class Keyword extends Http {
  maxLength = 8
  historyKeys = 'historyKeys'
  getHotKeys() {
    return this.request({
      url: 'book/hot_keyword'
    })
  }
  getHistoryKeys() {
    return wx.getStorageSync(this.historyKeys) || []
  }
  setHistoryKeys(key) {
    const keys = this.getHistoryKeys()
    if (!keys.includes(key)) {
      keys.unshift(key)
      if (keys.length > this.maxLength) {
        keys.pop()
      }
      wx.setStorageSync(this.historyKeys, keys)
    }
    return keys
  }
}
