import Book from '../../models/book.js'
import Keyword from '../../models/keyword.js'
const bookModel = new Book()
const keywordModel = new Keyword()
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    more: String
  },

  /**
   * 组件的初始数据
   */
  data: {
    hotKeys: [],
    historyKeys: [],
    books: [],
    searching: false,
    noResult: false,
    searchKeys: '',
    focus: true,
    loadingSearch: false,
    loadingMore: false,
    total: 0,
    locked: false
  },

  observers: {
    async more () {
      if(!this.data.searchKeys) {
        return
      }
      if (this.data.locked) {
        return
      }
      if (this._hasMore()) {
        this._lock(true)
        this._showLoadingMore(true)
        const books = await bookModel.search(
          this.data.searchKeys, this._getCurrentStart()
        ).catch(
          this._lock(false)
        )
        this._lock(false)
        this._showLoadingMore(false)
        this._setBooksData(books.books)
      }
    }
  },

  lifetimes: {
    async attached() {
      const hotKeys = await keywordModel.getHotKeys()
      const historyKeys = keywordModel.getHistoryKeys()
      this.setData({
        hotKeys: hotKeys.hot,
        historyKeys
      })
    }
  },
  /**
   * 组件的方法列表
   */
  methods: {
    onCancel() {
      this.triggerEvent('cancel')
    },
    onClear() {
      this._searching(false)
      this._showNoResult(false)
      this._setInputValue('')
      this._focusInput()
    },
    async onConfirm(e) {
      this._showLoadingSearch(true)
      this._searching(true)
      const text = e.detail.value || e.detail.text
      this._setInputValue(text)
      this._addToHistory(text)
      const books = await bookModel.search(text)
      this._setTotal(books.total)
      this._showLoadingSearch(false)
      this._setBooksData(books.books)
    },
    onInput(e) {
      if (e.detail.value.length == 0) {
        this._searching(false)
        this._showNoResult(false)
      }
    },
    _hasMore() {
      return this._getCurrentStart() < this.data.total
    },
    _getCurrentStart() {
      return this.data.books.length
    },
    _setTotal(total) {
      this.setData({
        total
      })
    },
    _addToHistory(text) {
      this.setData({
        historyKeys: keywordModel.setHistoryKeys(text)
      })
    },
    _searching(searching) {
      this.setData({
        searching,
        books: searching ? [] : this.data.books
      })
    },
    _showLoadingSearch(loadingSearch) {
      this.setData({
        loadingSearch
      })
    },
    _showLoadingMore(loadingMore) {
      this.setData({
        loadingMore
      })
    },
    _setInputValue(searchKeys) {
      this.setData({
        searchKeys
      })
    },
    _setBooksData(books) {
      this.setData({
        books: this.data.books.concat(books),
        noResult: !books.length
      })
    },
    _focusInput() {
      this.setData({
        focus: true
      })
    },
    _showNoResult(noResult) {
      this.setData({
        noResult
      })
    },
    _lock(locked) {
      this.setData({
        locked
      })
    }
  }
})
