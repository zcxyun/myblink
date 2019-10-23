import {promisic} from "../../utils/util.js"
import Book from "../../models/book.js"
import Classic from "../../models/classic.js"
import paginationBev from "../../components/behaviors/paginate.js"
import Token from '../../models/token.js'
import Member from '../../models/member.js'

const bookModel = new Book()
const classicModel = new Classic()
const tokenModel = new Token()
const memberModel = new Member()
const app = getApp()

Component({
  behaviors: [paginationBev],
  /**
   * 页面的初始数据
   */
  data: {
    authorized: false,
    userInfo: null,
    favorCount: 0
  },
  methods: {
    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
      this.userAuthorized()
      // this.getMyFavorCount()
      // this.getMyFavorClassices()
    },

    async userAuthorized() {
      const res = await promisic(wx.getSetting)()
      if (res.authSetting['scope.userInfo']) {
        const {userInfo} = await promisic(wx.getUserInfo)()
        const memberInfo = await memberModel.getInfo()
        if (memberInfo instanceof Object) {
          const isNotSame = this.equalInfo(memberInfo, userInfo)
          if (isNotSame) {
            memberModel.updateInfo(userInfo)
          }
        }
        this.setData({
          userInfo,
          authorized: app.loginStatus
        })
      }
    },

    equalInfo(memberInfo, userInfo) {
      const res = Object.keys(memberInfo).some(key => memberInfo[key] !== userInfo[key])
      return res
    },

    async onGetUserInfo(e) {
      const userInfo = e.detail.userInfo
      if (userInfo) {
        const {code} = await promisic(wx.login)()
        if (code) {
          const { accessToken, refreshToken } = await 
                                tokenModel.getTokens({ code, ...userInfo })
          if (accessToken && refreshToken) {
            tokenModel.setTokensToStorage(accessToken, refreshToken)
            app.loginStatus = true
            this.setData({
              userInfo,
              authorized: app.loginStatus
            })
          }
        }
      }
    },

    async getMyFavorCount() {
      const {count:favorCount} = await bookModel.getMyFavorCount()
      this.setData({
        favorCount
      })
    },

    async getMyFavorClassices() {
      const dataArray = await classicModel.getMyFavor()
      this.setData({
        dataArray,
        noResult: !dataArray.length
      })
    },

    onPreview(e) {
      const {cid, type} = e.detail
      wx.navigateTo({
        url: `/pages/classic-detail/classic-detail?cid=${cid}&type=${type}`,
      })
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
      // this._initPaginate()
      // this.getMyFavorCount()
      // this.getMyFavorClassices()
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
      this.loadMore()
    },

    async loadMore() {
      if(this._isLocked()) {
        return
      }
      if (this.data.isEnd) {
        return
      }
      this._lock(true)
      const moreData = await classicModel.getMyFavor(this._getCurrentStart())
                              .catch((e) => {this._lock(false)})
      this._lock(false)
      if(moreData.length) {
        this._setMoreData(moreData)
      } else {
        this._noMoreData()
      }
    },

    /**
     * 用户点击右上角分享
     */
    onShareAppMessage: function () {

    }
  }
})
