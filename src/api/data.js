import request from '@/utils/request'
import http from '../utils/axios'

export const initData = (url, params) => {
  return http.fetchPost(url, params)
}
