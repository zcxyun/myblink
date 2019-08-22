Component({

  properties: {
    likeStatus: Boolean,
    favNums: Number,
    readOnly: Boolean,
    comments: Array
  },

  data: {
    likeStatus: false,
    favNums: 0
  },

  methods: {
    onLike (e) {
      const isLike = e.detail.isLike
      this.triggerEvent('like', {isLike})
    }
  }
})
