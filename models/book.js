import Http from '../utils/http.js'

export default class Book extends Http {
  getHotList () {
    return this.request({
      url: 'book/hot_list'
    })
  }
  getBookById(id) {
    return this.request({
      url: `book/${id}/detail`
    })
  }
  getComments(bid) {
    return this.request({
      url: `book/${bid}/short_comment`
    })
  }
  getFavor(id) {
    return this.request({
      url: `book/${id}/favor`
    })
  }
  addComment(book_id, content) {
    return this.request({
      url: 'book/add/short_comment',
      method: 'POST',
      data: {
        book_id,
        content
      }
    })
  }
  search(q, start=0, count=20, summary=1) {
    return this.request({
      url: `book/search?start=${start}&count=${count}&summary=${summary}&q=${q}`
    })
  }

  getMyFavorCount() {
    return this.request({
      url: 'book/favor/count'
    })
  }
}
