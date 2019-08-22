import ClassicModel from '../../models/classic.js'
import LikeModel from '../../models/like.js'

const classicModel = new ClassicModel()
const likeModel = new LikeModel()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    classic: null,
    hasLeft: false,
    hasRight: false,
    likeStatus: false,
    likeCount: 0
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.loadLatestClassic()
  },

  async loadLatestClassic() {
    const latestClassic = await classicModel.getLatest()
    this.setClassic(latestClassic, true)
  },

  async setClassic(classic, islatest) {
    if (islatest) { 
      var [likeStatus, likeCount] = [classic.like_status, classic.fav_nums]
    } else {
      var {like_status:likeStatus, fav_nums:likeCount} = await likeModel.getFavor(classic.type, classic.id)
    }
    this.setData({
      classic,
      hasLeft: classicModel.hasNext(classic.index),
      hasRight: classicModel.hasPrev(classic.index),
      likeStatus,
      likeCount
    })
  },

  onNext(e) {
    if (classicModel.hasNext(this.data.classic.index)) {
      this.getClassic(e.detail.behavior)  
    }
  },

  onPrev(e) {
    if (classicModel.hasPrev(this.data.classic.index)) {
      this.getClassic(e.detail.behavior)
    }
  },

  async getClassic(behavior) {
    const index = this.data.classic.index
    const classic = await classicModel.getClassic(index, behavior)
    this.setClassic(classic, false)
  },

  onLike(e) {
    likeModel.like(this.data.classic.id, this.data.classic.type, e.detail.isLike)
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})