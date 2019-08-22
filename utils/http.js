import {config} from '../config.js'
const error = {
  1: '抱歉，出现了一个错误',
  1000: '输入参数错误',
  1001: '输入的json格式不正确',
  1002: '找不到资源',
  1003: '未知错误',
  1004: '禁止访问',
  1005: '不正确的开发者key',
  1006: '服务器内部错误',
  2000: '你已经点过赞了',
  2001: '你还没点过赞',
  3000: '该期内容不存在'
}
export default class Http {
  request({url, method='GET', data={}}) {
    return this._request(url, method, data)
  }

  _request(url, method, data) {
    return new Promise((resolve, reject) => {
      wx.request({
        url: config.api_base_url + url,
        method,
        data,
        header: {
          'content-type': 'application/json',
          'appkey': 'sJq6cMa9thvl0mru'
        },
        success(res) {
          const statusCode = res.statusCode.toString()
          const data = res.data
          if (statusCode.startsWith('2')) {
            resolve(data)
          } else {
            reject()
            showError(data.error_code)
          }
        },
        fail(err) {
          reject()
          showError(data.error_code)
        }
      })
    })
  }
}

function showError(errorCode) {
  wx.showToast({
    title: error[errorCode] || error['1']
  })
}
