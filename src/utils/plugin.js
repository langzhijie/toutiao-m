// 此文件处理 有用的小函数 以及Vue中常用的过滤器函数

export default {
  // 导出默认对象
  install (Vue) {
    //   该方法会在 Vue.use后调用
    // 给Vue的原型属性赋值一个自定义函数
    Vue.prototype.$lnotify = (params) => Vue.prototype.$notify({ duration: 800, ...params })
  }
}
