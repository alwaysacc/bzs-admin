import http from '../utils/axios'

// 用户
export const getHomeInfo = (params) => {
  return http.fetchPost('/account/info/getHomeInfo', params)
}
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
export const getUserNameList = (params) => {
  return http.fetchPost('/account/info/getUserNameList', params)
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
export const getOrderListByAdmin = (params) => {
  return http.fetchPost('/orderinfo/getOrderListByAdmin', params)
}
export const getOrderDetails = (params) => {
  return http.fetchPost('/orderinfo/getOrderDetail', params)
}

export const getListByAdmin = (params) => {
  return http.fetchPost('/verification/getListByAdmin', params)
}
// 提现
export const updateVerificationStatus = (params) => {
  return http.fetchPost('/verification/updateVerificationStatus', params)
}
export const getVeriftcationDetail = (params) => {
  return http.fetchPost('/verification/getVeriftcationDetail', params)
}
// 佣金提成
export const commissionList = (params) => {
  return http.fetchPost('/commission/percentage/list', params)
}
export const updateCommission = (params) => {
  return http.fetchPost('/commission/percentage/update', params)
}
export const getDrawCashList = (params) => {
  return http.fetchPost('/draw/cash/getDrawCashList', params)
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

// 爬虫
export const getCrawlingList = (params) => {
  return http.fetchPost('/crawling/excelinfo/list', params)
}
export const startCrawling = (params) => {
  return http.fetchPost('/crawling/carinfo/startCrawling', params)
}
export const exportCrawlingDataList = (params) => {
  return http.fetchGet('/crawling/carinfo/exportCrawlingDataList?seriesNo=' + params, '')
}
export const getProgress = (params) => {
  return http.fetchPost('/crawling/carinfo/getProgress', params)
}
export const getCrawlingAdminList = (params) => {
  return http.fetchPost('/thirdAccount/getCrawlingAdminList', params)
}
export const getUserNameAndId = (params) => {
  return http.fetchPost('/account/info/getUserNameAndId', params)
}
export const addThirdAccount = (params) => {
  return http.fetchPost('/thirdAccount/add', params)
}
export const updateThirdAccount = (params) => {
  return http.fetchPost('/thirdAccount/update', params)
}
export const deleteThirdAccount = (params) => {
  return http.fetchPost('/thirdAccount/delete', params)
}
