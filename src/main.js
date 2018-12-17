import Vue from 'vue'
import App from './App'
// 导入路由 默认的index可以省略
import router from './router'

// 导入ElementUI的组件库
import ElementUI from 'element-ui'
// 导入其样式
import 'element-ui/lib/theme-chalk/index.css'

// 导入全局的css样式
import '@/assets/common.css'

// 引入富文本编辑器
import VueQuillEditor from 'vue-quill-editor'
// 引入富文本css样式
import 'quill/dist/quill.core.css'
import 'quill/dist/quill.snow.css'
import 'quill/dist/quill.bubble.css'

// 导入moment
import moment from 'moment'

// 在vue对象中添加一个axios方法 可以让每个组件不再引入axios
import axios from 'axios'
Vue.prototype.axios = axios

// 配置axios的全局默认baseURL
axios.defaults.baseURL = `http://localhost:8888/api/private/v1/`

// 不能讲token设置为全局默认的 因为每个用户token不一样 可以在拦截器里进行修改
// 添加请求拦截器
axios.interceptors.request.use(
  function(config) {
    // 在发送请求之前做些什么 拦截到请求，可以在里面设置token
    config.headers.Authorization = localStorage.getItem('token')
    // console.log(config)
    return config
  },
  function(error) {
    // 对请求错误做些什么
    return Promise.reject(error)
  }
)

// 添加响应拦截器 对于响应的数据 总是存在res.data中 可以返回的是res直接来获取数据
axios.interceptors.response.use(
  function(res) {
    // 对响应数据做点什么
    // console.log(res.data)
    return res.data
  },
  function(error) {
    // 对响应错误做点什么
    return Promise.reject(error)
  }
)

// 创建全局的时间过滤器
Vue.filter('dateFilter', (input, format = 'YYYY-MM-DD HH:mm:ss') => {
  return moment(input * 1000).format(format)
})

// 引入element-tree-grid插件
var ElTreeGrid = require('element-tree-grid')
// el-table-column就是标签名
Vue.component('el-table-tree-column', ElTreeGrid)
// 插件需要先用Vue.use来进行引用才可以
Vue.use(ElementUI)

// 使用富文本插件
Vue.use(VueQuillEditor)

Vue.config.productionTip = false

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  render: h => h(App)
})
