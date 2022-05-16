import {
  apiUrl,
} from '../config/env.js'

/**
 * 封装request
 * @param {string} method 'POST','GET
 * @param {string} apiName 请求名称
 * @param {object} data 参数
 * @param {object} header 请求头
 * 
 */
const request = (method, apiName, data, header = {
  'content-type': 'application/json;charset=utfs-8'
}) => {
  return new Promise((resolve, reject) => {
    wx.request({
      url: apiUrl + apiName,
      data,
      dataType: 'json',
      header: header,
      method: method,
      responseType: 'text',
      success: (result) => {
        resolve(result)
      },
      fail: (res) => {
        reject(res)
      }
    })
  })

}

const post = (apiName, data, header = {
  'content-type': 'application/x-www-form-urlencoded;charset=utf-8'
}) => {
  return request('POST', apiName, data, header)
}

export const ajax = {
  post
}