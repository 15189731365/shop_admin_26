import Vue from 'vue'
import App from './App'
import router from './router'

// 导入ElementUI的组件库
import ElementUI from 'element-ui'
// 导入其样式
import 'element-ui/lib/theme-chalk/index.css'

// 导入全局的css样式
import '@/assets/common.css'

// 插件需要先用Vue.use来进行引用才可以
Vue.use(ElementUI)

Vue.config.productionTip = false

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  render: h => h(App)
})
