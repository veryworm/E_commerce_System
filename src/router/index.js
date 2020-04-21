import Vue from 'vue'
import VueRouter from 'vue-router'
import Login from '../components/Login.vue'
import Home from '../components/Home.vue'

Vue.use(VueRouter)

const routes = [
  { 
    path:'/',
    redirect:'/Login'
  },
  {
    path: '/Login', 
    component: Login 
  },
  {
    path: '/Home', 
    component: Home 
  }
]

const router = new VueRouter({
  routes
})

// 为路由对象，添加beforeEach路由守卫
router.beforeEach((to,from,next)=>{
  // 如果用户访问的是登录页面直接放行
  if(to.path === '/login') return next()
  // 获取sessionStorage中的token值
  let userToken = window.sessionStorage.getItem('token')
  // 没有token，强制跳转/login
  if(!userToken) return next('/login') 
  next()
})

export default router
