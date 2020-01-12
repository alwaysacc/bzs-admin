import axios from 'axios'
import qs from 'qs'
import { Notification } from 'element-ui'
import NProgress from 'nprogress' // progress bar
import 'nprogress/nprogress.css'// progress bar style
axios.defaults.timeout = 100000
axios.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded'
axios.defaults.baseURL = 'https://baozhishun.com/api'
// axios.defaults.baseURL = 'http://127.0.0.1:8082/'
// axios.defaults.baseURL = process.env.BASE_API
export default {
  fetchGet(url, params = {}) {
    return new Promise((resolve, reject) => {
      axios.get(url, params).then(res => {
        resolve(res.data)
      }).catch(error => {
        reject(error)
      })
    })
  },
  fetchPost(url, params = {}) {
    NProgress.start()
    return new Promise((resolve, reject) => {
      axios.post(url, qs.stringify(params)).then(res => {
        NProgress.done()
        const code = res.data.code
        if (code === 200) {
          resolve(res.data)
          return Promise.reject('error')
        } else if (code === 500) {
          Notification.error({
            title: '内部错误'
          })
          return Promise.reject('error')
        } else if (code === 400) {
          resolve(res.data)
          return Promise.reject('error')
        }
      }).catch(error => {
        reject(error)
      })
    })
  }
}
