import Vue from 'vue'
import App from './App.vue'
import router from './router'
import i18n from './locale'
// import './plugins/element.js'
// 导入字体图标
import './assets/fonts/iconfont.css'
// 导入全局样式表
import './assets/css/global.css'
import TreeTable from 'vue-table-with-tree-grid'

// 导入富文本编辑器
import VueQuillEditor from 'vue-quill-editor'
// require styles 导入富文本编辑器对应样式
// import 'quill/dist/quill.core.css'
// import 'quill/dist/quill.snow.css'
// import 'quill/dist/quill.bubble.css'



// --------开始  如果用了进一步封装的axios（src/libs/axios    src/api），这里就不需要了--------
// 导入NProgress包和对应css
import NProgress from 'nprogress'
import 'nprogress/nprogress.css'
import axios from 'axios'
// 配置请求的根路径
const nowBaseUrl = process.env.NODE_ENV === 'development' ? window.Glob.baseUrl.dev : window.Glob.baseUrl.pro
axios.defaults.baseURL = nowBaseUrl
// 在拦截器中，展示进度条
axios.interceptors.request.use(config => {
  NProgress.start()
  config.headers.Authorization = window.sessionStorage.getItem('token')
  return config
})
// 在response 拦截器中隐藏进度条
axios.interceptors.response.use(config => {
  NProgress.done()
  return config
})
Vue.prototype.$http = axios
// --------结束  如果用了进一步封装的axios（src/libs/axios    src/api），这里就不需要了--------



/**
 * @description 全局注册抽离的外部配置
 */
Vue.prototype.$_global = window.Glob

Vue.config.productionTip = false

Vue.component('tree-table', TreeTable)
// 将富文本编辑器注册为全局可用的组件
Vue.use(VueQuillEditor)
// 过滤器
Vue.filter('dateFormat', function() {
  const dt = new Date()
  const y = dt.getFullYear()
  const m = (dt.getMonth() + 1 + '').padStart(2, '0')
  const d = (dt.getDate() + '').padStart(2, '0')
  const hh = (dt.getHours() + '').padStart(2, '0')
  const mm = (dt.getMinutes() + '').padStart(2, '0')
  const ss = (dt.getSeconds() + '').padStart(2, '0')
  return `${y}-${m}-${d} ${hh}:${mm}:${ss}`
})

new Vue({
  router,
  i18n,
  render: h => h(App)
}).$mount('#app')
