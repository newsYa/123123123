import Vue from 'vue'

// 自动注册组件
const requireCom = require.context('./Td', true, /\.vue/)
requireCom.keys().forEach(key => {
  function strUp(str) {
    return str.charAt(0).toUpperCase() + str.slice(1)
  }
  const _com = requireCom(key)
  const _comName = strUp(key.replace(/^\.\//, '').replace(/\.\w+$/, ''))
  Vue.component(_comName, _com.default || _com)
})

