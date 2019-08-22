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
}
