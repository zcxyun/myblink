// components/episode/episode.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    index: Number,
    pubdate: String,
  },

  /**
   * 组件的初始数据
   */
  data: {
    month: '',
    year: ''
  },

  observers: {
    pubdate(value) {
      const dateArr = value.split('-')
      if (dateArr.length != 0) {
        const [year, month] = dateArr
        const months = [
          '一月', '二月', '三月', '四月', '五月', '六月', '七月', '八月',
          '九月', '十月', '十一月', '十二月'
        ]
        const monthStr = months[Number(month) - 1]
        if (monthStr) {
          this.setData({
            year, 
            month: monthStr
          })
        }
      }
    }
  },
  /**
   * 组件的方法列表
   */
  methods: {

  }
})
