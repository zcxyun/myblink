// components/tag/tag.js
Component({
  options: {
    multipleSlots: true
  },

  externalClasses: ['tag-class'],
  /**
   * 组件的属性列表
   */
  properties: {
    comment: String
  },

  /**
   * 组件的初始数据
   */
  data: {

  },

  /**
   * 组件的方法列表
   */
  methods: {
    onTag() {
      this.triggerEvent('click', {text: this.properties.comment})
    }
  }
})
