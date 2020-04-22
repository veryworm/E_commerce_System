import Vue from 'vue' 
import App from './App.vue'
import router from './router'
import './plugins/element.js'
// 导入全局样式
import './assets/css/global.css'
// 导入字体图标
import './assets/fonts/iconfont.css'
// 配置axios
import axios from 'axios'
axios.defaults.baseURL = 'http://127.0.0.1:8888/api/private/v1/'
// 1.Api 认证统一使用token认证
// 2.需要授权的api，必须在请求头中使用Authorization字段中提供token令牌
// 3.登录时只是获取令牌，使用Authorization为null，如果再次请求，Authorization就为一个真正的令牌，否则驳回操作
axios.interceptors.request.use(config => {
  config.headers.Authorization = window.sessionStorage.getItem('token')
  return config
})
Vue.prototype.$http = axios

Vue.config.productionTip = false

new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
