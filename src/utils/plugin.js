// 此文件处理 有用的小函数 以及Vue中常用的过滤器函数
import dayjs from 'dayjs' // 引入处理时间的插件
import 'dayjs/locale/zh-cn' // 设置dayjs的语言
import relativeTime from 'dayjs/plugin/relativeTime' // 处理相对时间

dayjs.extend(relativeTime) // 相对时间插件扩展到处理时间的插件

export default {
  // 导出默认对象
  install (Vue) {
    //   该方法会在 Vue.use后调用
    // 给Vue的原型属性赋值一个自定义函数
    Vue.prototype.$lnotify = (params) => Vue.prototype.$notify({ duration: 800, ...params })
    Vue.prototype.$sleep = sleep // 定义了个原型属性 $slee
    // 时间格式的 过滤器
    Vue.filter('relTime', relTime) // 注册全局过滤器
  }
}

// 处理用户过快的刷新数据过快 设置此休眠函数
// 如果没传time就用500 传了就使用传入的
function sleep (time = 500) {
  return new Promise(function (resolve, reject) {
    // 成功执行resolve
    setTimeout(() => resolve(), time)
  })
}

// 处理文章列表时间格式的函数(相对时间)

function relTime (date) {
  // date是传入的日期
  // locale()语言转化
  return dayjs().locale('zh-cn').from(date) // from(中的值是 日期或者dayjs得到的日期)
}
