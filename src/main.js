import Vue from 'vue'

import 'normalize.css/normalize.css' // A modern alternative to CSS resets
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import locale from 'element-ui/lib/locale/lang/zh-CN' // lang i18n
import mavonEditor from 'mavon-editor'
import 'mavon-editor/dist/css/index.css'

import '@/styles/index.scss' // global css

import App from './App'
import router from './router/routers'
import permission from './components/permission'
import store from './store'
import util from '@/utils/similar'
import '@/icons' // icon
import Cookies from 'js-cookie'
import './router/index' // permission control
Vue.prototype.util = util
Vue.use(mavonEditor)
Vue.use(permission)
import db from '@/utils/localstorage'
Vue.use(ElementUI, {
  size: Cookies.get('size') || 'mini' // set element-ui default size
})
Vue.use(db)
Vue.use(ElementUI, { locale })
Vue.config.productionTip = false
require('babel-polyfill')

new Vue({
  el: '#app',
  router,
  store,
  render: h => h(App)
})
