import Vue from 'vue'
import App from './App'
import router from './router'

// 导入ElementUI的组件库
import ElementUI from 'element-ui'
// 导入其样式
import 'element-ui/lib/theme-chalk/index.css'

Vue.use(ElementUI)

Vue.config.productionTip = false

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  render: h => h(App)
})
