// components/previews/previews.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    datas: Array
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
    onPreview(e) {
      const { cid, type } = e.currentTarget.dataset
      this.triggerEvent('click', {cid,type})
    }
  }
})
