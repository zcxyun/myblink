// components/preview/preview.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    category: String,
    likeStatus: Boolean,
    likeCount: Number,
    image: String,
    summary: String,
    readOnly: Boolean
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
    onLike(e) {
      const { isLike } = e.detail
      this.triggerEvent('like', {isLike})
    }
  }
})
