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
// 实名认证审核列表
export const getWaitCheckList = (params) => {
  return http.fetchPost('/idCardImg/getWaitCheckList', params)
}
// 实名认证驳回
export const updateAccountVerifiedStat = (params) => {
  return http.fetchPost('/account/info/updateAccountVerifiedStat', params)
}
// 验证实名认证
export const checkAccountVerified = (params) => {
  return http.fetchPost('/account/info/checkAccountVerified', params)
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
export const getCommissionListByDay = (params) => {
  return http.fetchPost('/commission/every/day/list', params)
}
export const deleteCommissionListByDay = (params) => {
  return http.fetchPost('/commission/every/day/delete', params)
}
export const deletesSomeCommissionListByDay = (params) => {
  return http.fetchPost('/commission/every/day/deleteSome', params)
}
export const updateCommission = (params) => {
  return http.fetchPost('/commission/percentage/update', params)
}
export const getDrawCashList = (params) => {
  return http.fetchPost('/draw/cash/getDrawCashList', params)
}
export const getShowToday = (params) => {
  return http.fetchPost('/sys/param/getShowToday', params)
}
export const getRole = (params) => {
  return http.fetchPost('/sys/param/getRole', params)
}

export const updateValue = (params) => {
  return http.fetchPost('/sys/param/update', params)
}
export const sysDetail = (params) => {
  return http.fetchPost('/sys/param/detail', params)
}

// 消息
export const addMessage = (params) => {
  return http.fetchPost('/message/add', params)
}
export const getMessageList = (params) => {
  return http.fetchPost('/message/list', params)
}
export const delMessage = (params) => {
  return http.fetchPost('/message/del', params)
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
  return http.fetchPost('/carinfo/getCarInfoAndQuoteList', params)
}
export const quoteDetails = (params) => {
  return http.fetchPost('/quoteinfo/quoteDetails', params)
}

// 爬虫
export const getCrawlingList = (params) => {
  return http.fetchPost('/crawling/excelinfo/list', params)
}
export const deleteCrawling = (params) => {
  return http.fetchPost('/crawling/excelinfo/delete', params)
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
export const getAccountById = (params) => {
  return http.fetchPost('/thirdAccount/getAccountById', params)
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
// 轮播图
export const swiperList = (params) => {
  return http.fetchPost('/swiper/list', params)
}
export const addSwiper = (params) => {
  return http.fetchPost('/swiper/add', params)
}
export const deleteSwiper = (params) => {
  return http.fetchPost('/swiper/delete', params)
}

export const getFeedbackList = (params) => {
  return http.fetchPost('/feedback/list', params)
}
export const updateFeedback = (params) => {
  return http.fetchPost('/feedback/update', params)
}
export const deleteFeedback = (params) => {
  return http.fetchPost('/feedback/delete', params)
}
export const getPartnerList = (params) => {
  return http.fetchPost('/partner/info/list', params)
}
export const addPartner = (params) => {
  return http.fetchPost('/partner/info/add', params)
}
export const delPartner = (params) => {
  return http.fetchPost('/partner/info/delete', params)
}
export const updatePartner = (params) => {
  return http.fetchPost('/partner/info/update', params)
}

export const getHeadlinesList = (params) => {
  return http.fetchPost('/headlines/list', params)
}
export const addHeadlines = (params) => {
  return http.fetchPost('/headlines/add', params)
}
export const delHeadlines = (params) => {
  return http.fetchPost('/headlines/delete', params)
}
export const updateHeadlines = (params) => {
  return http.fetchPost('/headlines/update', params)
}
