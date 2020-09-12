import axios from 'axios'
// 导入NProgress包和对应css
import NProgress from 'nprogress'
import 'nprogress/nprogress.css'
// axios.defaults.withCredentials = true// 允许请求头携带cookie

class HttpRequest {
  constructor (baseUrl) {
    this.baseUrl = baseUrl
    this.queue = {}
  }

  getInsideConfig () {
    const config = {
      baseURL: this.baseUrl
    }
    return config
  }

  destroy (url) {
    delete this.queue[url]
    if (!Object.keys(this.queue).length) {
      // Spin.hide()
    }
  }

  interceptors (instance, url) {
    // 请求拦截
    instance.interceptors.request.use(config => {
      // 添加全局的loading...
      if (!Object.keys(this.queue).length) {
        // Spin.show() // 不建议开启，因为界面不友好
      }
      this.queue[url] = true
      return config
    }, error => {
      return Promise.reject(error)
    })
    // 响应拦截
    instance.interceptors.response.use(res => {
      // 进行登录错误拦截
      this.destroy(url)
      const { data, status } = res
      //   if (status === 200) {
      // 未登录或token过期
      // if (data.code === 102) {
      //   setTimeout(() => {
      //     Router.push({ path: '/login', query: { redirect: Router.currentRoute.fullPath } })
      //   }, 1000)
      // }
      // 对于code错误码 识别 做统一处理
      // let errorMsg = ''
      // switch (data.code) {
      //   case 111:
      //     errorMsg = '1'
      //     break
      //   case 222:
      //     errorMsg = '2'
      //     break
      //   case 333:
      //     errorMsg = '3'
      //     break
      //   default:
      //     errorMsg = data.msg
      // }
      // data.msg = errorMsg
      //   }
      NProgress.done()
      return { data, status }
    }, error => {
      NProgress.done()
      this.destroy(url)
      let errorInfo = error.response
      if (!errorInfo) {
        const { request: { statusText, status }, config } = JSON.parse(JSON.stringify(error))
        errorInfo = {
          statusText,
          status,
          request: { responseURL: config.url }
        }
      }
      return Promise.reject(error)
    })
  }

  request (options) {
    NProgress.start()
    let intTemp = ''
    if (options.headers) {
      intTemp = axios.create()
    } else {
      intTemp = axios.create()
      options.headers = {
        // 根据真实场景选择是否添加这部分headers属性
      // 'Access-Control-Allow-Origin': '*',
      // 'Content-Type': 'application/x-www-form-urlencoded',
      // 'Access-Control-Allow-Methods': 'GET, POST, OPTIONS , PUT ,DELETE, PATCH'
        Authorization: window.sessionStorage.getItem('token')
      }
    }
    const instance = intTemp
    options = Object.assign(this.getInsideConfig(), options)
    this.interceptors(instance, options.url)
    return instance(options)
  }
}
export default HttpRequest
