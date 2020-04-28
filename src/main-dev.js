import Vue from 'vue' 
import App from './App.vue'
import router from './router'
// 导入element文件
import './plugins/element.js'
// 导入全局样式
import './assets/css/global.css'
// 导入字体图标
import './assets/fonts/iconfont.css'
// 导入grid表格
import ZkTable from 'vue-table-with-tree-grid'
Vue.component('tree-table', ZkTable)
// 导入moment
import moment from 'moment'
Vue.filter('datafmt',function(val){
  if(val){
    return moment(val).format('YYYY-MM-DD HH:mm:ss')
  }
})
// 导入富文本,在可视化面板中依赖里面安装
import VueQuillEditor from 'vue-quill-editor'
import 'quill/dist/quill.core.css' // import styles
import 'quill/dist/quill.snow.css' // for snow theme
import 'quill/dist/quill.bubble.css' // for bubble theme
Vue.use(VueQuillEditor)
// 导入nprogess进度条
import nprogess from 'nprogress'
import 'nprogress/nprogress.css'

// 配置axios
import axios from 'axios'
axios.defaults.baseURL = 'http://127.0.0.1:8888/api/private/v1/'
// 1.Api 认证统一使用token认证
// 2.需要授权的api，必须在请求头中使用Authorization字段中提供token令牌
// 3.登录时只是获取令牌，使用Authorization为null，如果再次请求，Authorization就为一个真正的令牌，否则驳回操作
axios.interceptors.request.use(config => {
  console.log(config)
  // 1.当请求时启动进度条
  nprogess.start()
  config.headers.Authorization = window.sessionStorage.getItem('token')
  return config
})

axios.interceptors.response.use(config => {
  // 1.当服务器响应时关闭进度条
  nprogess.done()
  return config
})
Vue.prototype.$http = axios

Vue.config.productionTip = false

new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
