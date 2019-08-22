// components/navi/navi.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    title: String,
    hasLeft: Boolean,
    hasRight: Boolean
  },

  /**
   * 组件的初始数据
   */
  data: {
    leftNavi: "images/triangle@left.png",
    disLeftNavi: "images/triangle.dis@left.png",
    rightNavi: "images/triangle@right.png",
    disRightNavi: "images/triangle.dis@right.png"
  },

  /**
   * 组件的方法列表
   */
  methods: {
    onLeft() {
      if (this.properties.hasLeft) {
        this.triggerEvent('next', {behavior: 'next'})
      }
    },
    onRight() {
      if (this.properties.hasRight) {
        this.triggerEvent('prev', {behavior: 'previous'})
      }
    }
  }
})
