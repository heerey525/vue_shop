window.Glob = {
  /**
   * @description token在Cookie中存储的天数，默认1天
   */
  cookieExpires: 3,
  /**
   * @description 是否使用国际化，默认为false
   *              如果不使用，则需要在路由中给需要在菜单中展示的路由设置meta: {title: 'xxx'}
   *              用来在菜单中显示文字
   */
  useI18n: true,
  /**
   * @description 默认打开的首页的路由name值，默认为home
   */
  homeName: 'home',
  baseUrl: {
    dev: 'http://127.0.0.1:8888/api/private/v1/',
    pro: 'http://127.0.0.1:8888/api/private/v1/'
  }
}
