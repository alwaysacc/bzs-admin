import request from '@/utils/request'
import http from '@/utils/axios'
export const getMenuByAdminName = (params) => {
  return http.fetchPost('/admin/menu/getMenuByAdminName', params)
}
export const adminLogin = (params) => {
  return http.fetchPost('/admin/login', params)
}
export function login(username, password,code) {
  return request({
    url: 'admin/login',
    method: 'post',
    data: {
      username,
      password,
      code
    }
  })
}

export function getInfo() {
  return request({
    url: 'auth/info',
    method: 'get'
  })
}
