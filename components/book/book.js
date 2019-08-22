// components/book/book.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    imgUrl: String,
    title: String,
    author: String,
    favNums: Number,
    bid: Number
  },

  /**
   * 组件的初始数据
   */
  data: {

  },

  /**
   * 组件的方法列表
   */
  methods: {
    onTap() {
      wx.navigateTo({
        url: '/pages/book-detail/book-detail?bid=' + this.properties.bid,
      })
    }
  }
})
