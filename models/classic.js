import Http from '../utils/http.js'

export default class ClassicModel extends Http {
  maxIndexKey = 'maxIndex'
  async getLatest() {
    const res = await this.request({
      url: 'classic/latest'
    })
    this.setMaxIndex(res.index)
    this.setClassicToStorage(this.makeClassicKey(res.index), res)
    return res
  }
  async getClassic(curIndex, behavior) {
    let index = behavior == 'next' ? curIndex+1 : 
                    (behavior == 'previous' ? curIndex-1 : curIndex)
    const classic = this.getClassicFromStorage(this.makeClassicKey(index))
    if (classic) {
      return classic
    }
    const res = await this.request({
      url: `classic/${curIndex}/${behavior}`
    })
    this.setClassicToStorage(this.makeClassicKey(res.index), res)
    return res
  }
  setMaxIndex(maxIndexValue) {
    const maxIndex = this.getMaxIndex(this.maxIndexKey)
    if (!maxIndex) {
      wx.setStorageSync(this.maxIndexKey, maxIndexValue)
    }
  }
  getMaxIndex() {
    return wx.getStorageSync(this.maxIndexKey)
  }
  setClassicToStorage(classicKey, classic) {
    const classicInStorage = this.getClassicFromStorage(classicKey)
    if (!classicInStorage) {
      wx.setStorageSync(classicKey, classic)
    }
  }
  getClassicFromStorage(classicKey) {
    return wx.getStorageSync(classicKey)
  }
  hasNext(index) {
    return this.getMaxIndex() > index
  }
  hasPrev(index) {
    return index > 1
  }
  makeClassicKey(index) {
    return 'classic-' + index
  }
}