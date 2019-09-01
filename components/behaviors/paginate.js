export default Behavior({
  data: {
    total: null,
    loadingMore: false,
    noResult: false,
    dataArray: [],
    isEnd: false
  },
  methods: {
    _initPaginate() {
      this.setData({
        dataArray: [],
        noResult: false,
        total: null,
        loadingMore: false,
        isEnd: false
      })
    },
    _setTotal(total) {
      this.setData({
        total,
        noResult: !total
      })
    },
    _lock(loadingMore) {
      this.setData({
        loadingMore
      })
    },
    _isLocked() {
      return this.data.loadingMore
    },
    _setMoreData(moreData) {
      this.setData({
        dataArray: this.data.dataArray.concat(moreData)
      })
    },
    _hasMore() {
      return this._getCurrentStart() < this.data.total
    },
    _noMoreData() {
      this.setData({
        isEnd: true
      })
    },
    _getCurrentStart() {
      return this.data.dataArray.length
    },
    _setNoResult(noResult) {
      this.setData({
        noResult
      })
    }
  }
})
