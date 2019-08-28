Component({

  properties: {
    likeStatus: Boolean,
    favNums: Number,
    readOnly: Boolean,
    comments: Array,
  },

  data: {
    postTip: '',
    posting: false
  },

  observers: {
    comments(value) {
      if (value.length) {
        this.setPostTip('仅可点击标签 +1')
      } else {
        this.setPostTip('暂无短评')
      }
    }
  },

  methods: {
    onLike (e) {
      const isLike = e.detail.isLike
      this.triggerEvent('like', {isLike})
    },
    onPost() {
      this.showPostPanel(true)
    },
    onPostCancel() {
      this.showPostPanel(false)
    },
    setPostTip(text) {
      this.setData({
        postTip: text
      })
    },
    showPostPanel(show) {
      this.setData({
        posting: show
      })
    },
    onMask() {
      this.showPostPanel(false)
    },
    onTag(e) {
      this.triggerEvent('click-tag', e.detail)
    },
    onConfirm(e) {
      this.triggerEvent('input-confirm', e.detail)
      this.showPostPanel(false)
    }
  }
})
