// 此文件修改vant组件库的主题样式
// 导出个对象
module.exports = {

  css: {
    //   css相关
    loaderOptions: {
      // 所有的相关样式loader相关选项
      less: {
        modifyVars: {
          // 这里改变变量
          blue: '#3296fa'
        }
      }
    }

  },
  publicPath: './' // 打包后的引用地址

}
