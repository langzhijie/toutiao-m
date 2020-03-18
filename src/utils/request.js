// 此文件对axios进行分装
import axios from 'axios'

import JSONBig from 'json-bigint' // 处理大数字 插件
import store from '@/store' // 引入Vue中的 store实例对象 相当于组件中的 this.$store
import router from '@/router' // 引入router
// axios.defaults 是对原有默认值进行修改

// axios.create() 相当于 new 了一个新的axios实例
// 创建一个axios的新实例
const instance = axios.create({
  // 请求的基地址
  baseURL: 'http://ttapi.research.itcast.cn/app/v1_0/',
  // 此函数是后台响应回来但是没进入到axios响应拦截器时执行
  // data就是后端响应回来的字符串
  transformResponse: [function (data) {
    // 判断返回的字符串是否为空 不为空转换大数字
    return data ? JSONBig.parse(data) : {}
  }]

})
// token的注入
// 在请求拦截器中注入
instance.interceptors.request.use(function (config) {
  // 成功时
  // 读取配置信息 注入token
  // 判断token是否有值
  if (store.state.user.token) {
    config.headers.Authorization = `Bearer ${store.state.user.token}` // 将token同一注入
  }
  return config // 返回配置
}, function (error) {
  // 返回错误
  return Promise.reject(error)
})
// 响应结果拦截器中处理返回的数据  将axios多嵌套的结构处来
instance.interceptors.response.use(function (response) {
  // 成功时会得到 response 已经被axios包裹了一层data 需要结构 data才是要的数据
  try {
    // 如果成功则返回 就返回两层
    return response.data.data
  } catch (error) {
    // 如果失败就返回一层 说明response.data不存在
    return response.data
  }
}, async function (error) {
  // 如果token失效或请求失败就会进入响应拦截器  401就是token失效
  // 没有token的导航守卫会拦截

  /*
   error
 * config  是出现这次错误的请求配置信息
 * request 请求对象
 * response 响应对象  status 状态码
 *
  */
  //  边界处理 先看看有返回值没
  if (error.response && error.response.status === 401) {
    // 首先判断有没有refresh_token
    const path = {

      path: '/login', // 地址
      query: {
        // 传递的query参数  需要就地址传过去
        redirectUrl: router.currentRoute.fullPath // 这就是登录页要跳转回来的地址
      }

    }
    if (store.state.user.refresh_token) {
      // 如果有refresh_token  就换取token 再存到本地
      // 现在的token已经失效了  要是用instance 还是会被请求拦截器注入无效的token
      // 所有要用没有拦截器的anios发刷新token的请求
      try {
        const result = await axios({
          method: 'put',
          url: 'http://ttapi.research.itcast.cn/app/v1_0/authorizations', // 换取的新token
          headers: { Authorization: `Bearer ${store.state.user.refresh_token}` } // 在请求头中注入refresh_token
        })
        // 更新vuex中的token  新的token存入本地
        store.commit('updateUser', {
          // 载荷数据
          user: {
            token: result.data.data.token, // 新token
            refresh_token: store.state.user.refresh_token // 还是传入原来的refresh_token
          }
        })
        // 在这个位置 说明你的token失效 401错误
        // 需要把错误的请求再次发送出去
        // 返回这个请求的目的 解决之前的执行
        return instance(error.config) // 相当于 执行之前401错误的请求
      } catch (error) {
        // 如果失败 意味着token换取失败
        // 需要回到登录页 从新登陆  从新登陆前 要删除本地的token 和refresh_token
        // 删除了token
        store.commit('delUser')
        router.push(path)
      }
    } else {
      // 如果没有refresh_token 直接跳到登录
      // 如果从A页面返回到登录页 拿到token后要保留在A页面登录后
      // 要在跳到登录页面的过程中 把当前页面地址传给登录页面
      // 如果有 登录成功后回到A页面
      // router.currentRoute 表示当前页面的路由信息对象 包含了地址和参数
      // router.currentRoute.fullPath  这是当前页面的完整地址 需要传入登录页
      store.commit('delUser') // 删除token token已经失效了
      router.push(path)
    }
  }

  // 返回失败
  return Promise.reject(error)
})

export default instance // 导出新实例
