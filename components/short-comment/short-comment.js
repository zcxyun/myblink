import Book from '../../models/book.js'
import Like from '../../models/like.js'
const bookModel = new Book()
const likeModel = new Like()
Component({

  properties: {
    bookId: Number
  },

  data: {
    likeStatus: false,
    favNums: 0,
    likeReadOnly: true
  },

  observers: {
    bookId(value) {
      this.loadBookLikeData(value)
    }
  },

  methods: {
    async loadBookLikeData() {
      if (this.properties.bookId ) {
        this.closeLikeReadOnly()
        const bookLikeData = await bookModel.getFavor(this.properties.bookId)
        this.setBookLikeData(bookLikeData.like_status, bookLikeData.fav_nums)
      }
    },
    setBookLikeData(likeStatus, favNums) {
      this.setData({
        likeStatus,
        favNums
      })
    },
    closeLikeReadOnly() {
      this.setData({
        likeReadOnly: false
      })
    },
    onLike (e) {
      if (this.properties.bookId && !this.properties.likeReadOnly) {
        const isLike = e.detail.isLike
        likeModel.like(this.properties.bookId, 400, isLike)
      }
    }
  }
})
