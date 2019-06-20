import axios from 'axios'
import qs from 'qs'
import {Notification} from "element-ui";
axios.defaults.timeout = 100000
axios.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded'
// axios.defaults.baseURL = 'https://baozhishun.com/api'
axios.defaults.baseURL = 'http://192.168.1.106:8082/'
// axios.defaults.baseURL = 'http://192.168.1.106:9527'
export default {
  fetchGet(url, params = {}) {
    return new Promise((resolve, reject) => {
      axios.get(url, params).then(res => {
        console.log(res)
        resolve(res.data)
      }).catch(error => {
        reject(error)
      })
    })
  },
  fetchPost(url, params = {}) {
    return new Promise((resolve, reject) => {
      axios.post(url, qs.stringify(params)).then(res => {
        console.log(res)
        const code = res.data.code
        if (code ===400 ) {
          Notification.error({
            title: res.data.message
          })
          return Promise.reject('error')
        } else if (code ===500 ) {
          Notification.error({
            title: '内部错误'
          })
          return Promise.reject('error')
        } else {
          resolve(res.data)
        }
      }).catch(error => {
        reject(error)
      })
    })
  }
}
