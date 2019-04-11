import Vue from 'vue'
import VueRouter from 'vue-router'
import Login from '../components/login/Login.vue'
// import Home from '../components/home/Home.vue'
// import goodsAdd from '../components/goods-add/Goods-add.vue'
// import Users from '../components/users/User.vue'
// import Rights from '../components/rights/Rights.vue'
// import Roles from '../components/roles/Roles.vue'
// import Categories from '../components/categories/Categories.vue'
// import Goods from '../components/goods/Goods.vue'

// const Home = () => import({ /* 组件定义对象 */ })
const Users = () => import('../components/users/User.vue')
const Home = () => import('../components/home/Home.vue')
const Rights = () => import('../components/rights/Rights.vue')
const Roles = () => import('../components/roles/Roles.vue')
const Goods = () => import('../components/goods/Goods.vue')
const goodsAdd = () => import('../components/goods-add/Goods-add.vue')
const Categories = () => import('../components/categories/Categories.vue')
Vue.use(VueRouter)
const router = new VueRouter({
  routes: [
    { path: '/', redirect: '/login' },
    { path: '/login', component: Login },
    {
      path: '/home',
      component: Home,
      children: [
        { path: '/users/:page?', component: Users },
        { path: '/rights', component: Rights },
        { path: '/roles', component: Roles },
        { path: '/categories', component: Categories },
        { path: '/goods', component: Goods },
        { path: '/goods-add', component: goodsAdd }
      ]
    }
  ]
})
export default router
router.beforeEach((to, from, next) => {
  if (to.path === '/login') {
    next()
  } else {
    let token = localStorage.getItem('token')
    token ? next() : next('/login')
  }
})
