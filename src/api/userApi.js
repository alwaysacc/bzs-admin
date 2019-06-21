import http from '../utils/axios'

// 用户
export const getUserList = (params) => {
  return http.fetchPost('/account/info/list', params)
}
export const saveUser = (params) => {
  return http.fetchPost('/account/info/add', params)
}
export const updateUser = (params) => {
  return http.fetchPost('/account/info/updateAccount', params)
}
export const deleteUser = (params) => {
  return http.fetchPost('/account/info/deleteUser', params)
}
export const checkUserLoginName = (params) => {
  return http.fetchPost('/account/info/checkUserLoginName', params)
}
// 管理员
export const adminLogin = (params) => {
  return http.fetchPost('/admin/login', params)
}
export const saveAdmin = (params) => {
  return http.fetchPost('/admin/add', params)
}
export const getAdminList = (params) => {
  return http.fetchPost('/admin/list', params)
}
export const deleteAdmin = (params) => {
  return http.fetchPost('/admin/delete', params)
}
export const updateAdmin = (params) => {
  return http.fetchPost('/admin/updateAdmin', params)
}
export const checkAdminLoginName = (params) => {
  return http.fetchPost('/admin/checkAdminLoginName', params)
}
// 角色
export const getRoleList = (params) => {
  return http.fetchPost('/admin/role/list', params)
}
export const addRoleAndMenu = (params) => {
  return http.fetchPost('/admin/role/addRoleAndMenu', params)
}
export const deleteRole = (params) => {
  return http.fetchPost('/admin/role/deleteRole', params)
}
export const updateRole = (params) => {
  return http.fetchPost('/admin/role/updateRoleAndMenu', params)
}
// 订单
export const getOrderList = (params) => {
  return http.fetchPost('/orderinfo/getOrderList', params)
}
export const getOrderDetails = (params) => {
  return http.fetchPost('/orderinfo/getOrderDetail', params)
}

export const getListByAdmin = (params) => {
  return http.fetchPost('/verification/getListByAdmin', params)
}

export const updateVerificationStatus = (params) => {
  return http.fetchPost('/verification/updateVerificationStatus', params)
}
// 佣金提成
export const commissionList = (params) => {
  return http.fetchPost('/commission/percentage/list', params)
}
export const updateCommission = (params) => {
  return http.fetchPost('/commission/percentage/update', params)
}
// 菜单
export const getMenuByAdminName = (params) => {
  return http.fetchPost('/admin/menu/getMenuByAdminName', params)
}
export const getMenulist = (params) => {
  return http.fetchPost('/admin/menu/getMenuList', params)
}
export const getMenuIdByRoleId = (params) => {
  return http.fetchPost('/admin/menu/getMenuIdByRoleId', params)
}
// 报价记录
export const getCarInfoQuote = (params) => {
  return http.fetchPost('/carinfo/getCarInfoQuote', params)
}
export const quoteDetails = (params) => {
  return http.fetchPost('/quoteinfo/quoteDetails', params)
}
