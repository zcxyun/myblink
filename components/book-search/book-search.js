import Book from '../../models/book.js'
import Keyword from '../../models/keyword.js'
import paginateBeh from '../behaviors/paginate.js'
const bookModel = new Book()
const keywordModel = new Keyword()
Component({
  behaviors: [paginateBeh],
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
    searching: false,
    searchKeys: '',
    focus: true,
    loadingSearch: false,
  },

  observers: {
    async more () {
      if(!this.data.searchKeys) {
        return
      }
      if (this._isLocked()) {
        return
      }
      if (this._hasMore()) {
        this._lock(true)
        const books = await bookModel.search(
          this.data.searchKeys, this._getCurrentStart()
        ).catch(e => this._lock(false))

        this._lock(false)
        this._setMoreData(books.books)
      } else {
        this._noMoreData()
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
      this._initPaginate()
      this.triggerEvent('cancel')
    },
    onClear() {
      this._initPaginate()
      this._searching(false)
      this._showLoadingSearch(false)
      this._setInputValue('')
      this._focusInput()
    },
    async onConfirm(e) {
      this._initPaginate()
      this._showLoadingSearch(true)
      this._searching(true)
      const text = e.detail.value || e.detail.text
      this._setInputValue(text)
      this._addToHistory(text)
      const books = await bookModel.search(text)
      this._setTotal(books.total)
      this._showLoadingSearch(false)
      this._setMoreData(books.books)
    },
    onInput(e) {
      if (e.detail.value.length == 0) {
        this._searching(false)
        this._showLoadingSearch(false)
        this._initPaginate()
      }
    },
    _addToHistory(text) {
      this.setData({
        historyKeys: keywordModel.setHistoryKeys(text)
      })
    },
    _searching(searching) {
      this.setData({
        searching
      })
    },
    _showLoadingSearch(loadingSearch) {
      this.setData({
        loadingSearch
      })
    },
    _setInputValue(searchKeys) {
      this.setData({
        searchKeys
      })
    },
    _focusInput() {
      this.setData({
        focus: true
      })
    },
  }
})
