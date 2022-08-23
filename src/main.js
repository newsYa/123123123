import Vue from 'vue'

import 'normalize.css/normalize.css' // A modern alternative to CSS resets

import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
// import locale from 'element-ui/lib/locale/lang/en' // lang i18n

import '@/styles/index.scss' // global css

import App from './App'
import store from './store'
import router from './router'

import '@/icons' // icon
import '@/permission' // permission control
import '@/utils/import'
import requests from './utils/request.js' // 记得改为你的路径
Vue.prototype.rq = requests // 此处命名为rq,你可以改
/**
 *如果你不想使用模拟服务器
 * 你想使用 MockJs 作为 mock api
 * 你可以执行： mockXHR（）
 *
 * 目前 MockJs 将用于生产环境，
 *请先删除它，然后再上线！！！
 */
/* if (process.env.NODE_ENV === 'production') {
  require('../mock/mock')
} */
require('../mock/mock.js')
// set ElementUI lang to EN
// Vue.use(ElementUI, { locale })
// 如果想要中文版 element-ui，按如下方式声明
Vue.use(ElementUI)

Vue.config.productionTip = false
console.log('123123');
new Vue({
  el: '#app',
  router,
  store,
  render: h => h(App)
})
