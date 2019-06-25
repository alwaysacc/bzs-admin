import { login, getInfo, adminLogin } from '@/api/login'
import { getToken, setToken, removeToken } from '@/utils/auth'
import Cookies from "js-cookie";

const user = {
  state: {
    token: getToken(),
    user: '' || Cookies.get('user'),
    roles: [],
    // 第一次加载菜单时用到
    loadMenus: false
  },

  mutations: {
    SET_TOKEN: (state, token) => {
      state.token = token
    },
    SET_USER: (state, user) => {
      state.user = user
      Cookies.set('user', user)
    },
    SET_ROLES: (state, roles) => {
      state.roles = roles
    },
    SET_LOAD_MENUS: (state, loadMenus) => {
      state.loadMenus = loadMenus
    }
  },

  actions: {
    // 登录
    Login({ commit }, userInfo) {
      const username = userInfo.username
      const password = userInfo.password
      const rememberMe = userInfo.rememberMe
      const code = '123'
      const param = {
        username: userInfo.username,
        password: userInfo.password,
        code: '123'
      }
      return new Promise((resolve, reject) => {
        adminLogin(param).then(res => {
          setToken('123', rememberMe)
          commit('SET_TOKEN', '123')
          commit('SET_USER', JSON.stringify(res.data.user))
          setUserInfo(res.data, commit)
          // 第一次加载菜单时用到， 具体见 src 目录下的 permission.js
          commit('SET_LOAD_MENUS', true)
          resolve()
        }).catch(error => {
          reject(error)
          console.log(error)
        })
      })
    },

    // 获取用户信息
    GetInfo({ commit }) {
      setUserInfo(1, commit)
     /* return new Promise((resolve, reject) => {
        getInfo().then(res => {
          setUserInfo(res, commit)
          resolve(res)
        }).catch(error => {
          reject(error)
        })
      })*/
    },

    // 登出
    LogOut({ commit }) {
      return new Promise((resolve, reject) => {
        commit('SET_TOKEN', '')
        commit('SET_ROLES', [])
        removeToken()
        resolve()
      })
    },

    updateLoadMenus({ commit }) {
      return new Promise((resolve, reject) => {
        commit('SET_LOAD_MENUS', false)
      })
    }
  }
}

export const setUserInfo = (res, commit) => {
  // 如果没有任何权限，则赋予一个默认的权限，避免请求死循环
  commit('SET_ROLES', ['ROLE_SYSTEM_DEFAULT'])
  if (res.id=== 1) {
    commit('SET_ROLES', ['ROLE_SYSTEM_DEFAULT'])
  } else {
    commit('SET_ROLES', res.roles)
  }
 // commit('SET_USER', res)
}

export default user
