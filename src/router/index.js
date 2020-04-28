import Vue from 'vue'
import VueRouter from 'vue-router'
// import Login from '../components/Login.vue'
const Login = () => import(/* webpackChunkName: "Login_Home_Welcome" */ '../components/Login.vue')
// import Home from '../components/Home.vue'
const Home = () => import(/* webpackChunkName: "Login_Home_Welcome" */ '../components/Home.vue')
// import Welcome from '../components/welcome.vue'
const Welcome = () => import(/* webpackChunkName: "Login_Home_Welcome" */ '../components/welcome.vue')
// import User from '../views/user/index.vue'
const User = () => import(/* webpackChunkName: "User_Rights_Rules" */ '../views/user/index.vue')
// import Rights from '../views/authority/index.vue'
const Rights = () => import(/* webpackChunkName: "User_Rights_Rules" */ '../views/authority/index.vue')
// import Rules from '../views/rule/index.vue'
const Rules = () => import(/* webpackChunkName: "User_Rights_Rules" */ '../views/rule/index.vue')

// import GoodCategories from '../views/goods/category/index.vue'
const GoodCategories = () => import(/* webpackChunkName: "GoodCategories_CategoryParams_GoodList" */ '../views/goods/category/index.vue')
// import CategoryParams from '../views/goods/params/index.vue'
const CategoryParams = () => import(/* webpackChunkName: "GoodCategories_CategoryParams_GoodList" */ '../views/goods/params/index.vue')
// import GoodList from '../views/goods/goodPage/index.vue'
const GoodList = () => import(/* webpackChunkName: "GoodCategories_CategoryParams_GoodList" */ '../views/goods/goodPage/index.vue')
// import addGoodPage from '../views/goods/goodPage/addGoodPage.vue'
const addGoodPage = () => import(/* webpackChunkName: "GoodCategories_CategoryParams_GoodList" */ '../views/goods/goodPage/addGoodPage.vue')

// import Order from '../views/order/index.vue'
const Order = () => import(/* webpackChunkName: "Order_Reports" */ '../views/order/index.vue')
// import Reports from '../views/data/index.vue'
const Reports = () => import(/* webpackChunkName: "Order_Reports" */ '../views/data/index.vue')


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
    component: Home,
    redirect:'/Welcome',
    children:[
      {
        path: '/Welcome',
        component:Welcome
      },
      {
        path: '/users',
        component:User
      },
      {
        path: '/rights',
        component:Rights
      },
      {
        path: '/roles',
        component:Rules
      },
      {
        path: '/categories', //商品分类
        component:GoodCategories
      },
      {
        path: '/params',//分类参数
        component:CategoryParams
      },
      {
        path: '/Goods',//商品列表
        component:GoodList
      },
      {
        path: '/addGoodPage',//商品添加页面
        component:addGoodPage
      },
      {
        path: '/orders',
        component:Order
      },
      {
        path: '/reports',
        component:Reports
      }

    ] 
  },

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
