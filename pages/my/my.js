import {
  promisic,
  getLoginStatusOfStorage,
  setLoginStatusToStorage
} from "../../utils/util.js"
import Book from "../../models/book.js"
import Classic from "../../models/classic.js"
import paginationBev from "../../components/behaviors/paginate.js"
import Token from '../../models/token.js'
import Member from '../../models/member.js'
import Like from '../../models/like.js'

const likeModel = new Like()
const bookModel = new Book()
const classicModel = new Classic()
const tokenModel = new Token()
const memberModel = new Member()

Component({
  behaviors: [paginationBev],
  /**
   * 页面的初始数据
   */
  data: {
    authorized: false,
    userInfo: null,
    favorCount: 0,
    dataArray: [],
    emptyTip: '还没有喜欢的期刊~~',
  },
  methods: {
    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
    },

    async userAuthorized() {
      const res = await promisic(wx.getSetting)()
      if (res.authSetting['scope.userInfo']) {
        let loginStatus = false
        let {userInfo} = await promisic(wx.getUserInfo)()
        // 启动时检测更新后端头像
        const memberInfo = await memberModel.getInfo()
        if (memberInfo instanceof Object) {
          const isNotSame = this.equalInfo(memberInfo, userInfo)
          if (isNotSame) {
            await memberModel.updateInfo(userInfo)
          }
          loginStatus = true
        } else {
          userInfo = {}
        }
        this.setData({
          userInfo,
          authorized: loginStatus
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
          const res = await tokenModel.getTokens({ code, ...userInfo })
          if (res) {
            this.setData({
              userInfo,
              authorized: true
            })
            setLoginStatusToStorage(true)
            this.getMyFavorCount()
            this.getMyFavorClassices()
          }
        }
      }
    },

    async getMyFavorCount() {
      if (getLoginStatusOfStorage() === true) {
        const {count:favorCount} = await bookModel.getMyFavorCount()
        this.setData({
          favorCount
        })
      }
    },

    async getMyFavorClassices() {
      if (getLoginStatusOfStorage() === true) {
        const classics = await classicModel.getMyFavor()
        if (classics && classics.models) {
          this._initPaginate()
          this._setTotal(classics.total)
          this.setData({
            dataArray: classics.models,
            noResult: false,
          })
        } else {
          this.setData({
            dataArray: [],
            noResult: true,
          })
        }
      }
    },

    onPreview(e) {
      const {cid, type} = e.detail
      wx.navigateTo({
        url: `/pages/classic-detail/classic-detail?cid=${cid}&type=${type}`,
      })
    },

    async onLike(e) {
      const { isLike, cid, type } = e.detail
      await likeModel.like(cid, type, isLike)
      this.getMyFavorClassices()
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
      this.userAuthorized()
      this.getMyFavorCount()
      this.getMyFavorClassices()
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
      if (this._hasMore()) {
        this._lock(true)
        const moreData = await classicModel.getMyFavor(this._getCurrentStart())
        if(moreData && moreData.models) {
          // this._setTotal(moreData.total)
          this._setMoreData(moreData.models)
        }
        this._lock(false)
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
