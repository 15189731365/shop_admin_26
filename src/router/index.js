// 将import放到最前面 不然会报错
import Vue from 'vue'
import Router from 'vue-router'
// 导入login组件
import Login from '@/components/Login.vue'
// 导入Home组件
import Home from '@/components/Home.vue'

Vue.use(Router)

const router = new Router({
  routes: [
    {
      path: '/',
      redirect: '/login'
    },
    {
      path: '/login',
      component: Login
    },
    {
      path: '/home',
      component: Home
    }
  ]
})

// 登陆拦截 配合 控制守卫来进行使用
// to 去哪儿 和to.path
// from 从哪儿来 from.path
// next() 表示放行 next(false) 表示就到这里中断
router.beforeEach((to, from, next) => {
  const token = localStorage.getItem('token')
  if (to.path === '/login' || token) {
    // 表示有token 那么就放行
    next()
  } else {
    // 没有token 那么就跳转到登陆页
    next('/login')
  }
})

export default router
