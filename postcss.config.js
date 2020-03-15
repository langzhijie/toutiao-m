module.exports = {
  plugins: {
    autoprefixer: {},
    'postcss-pxtorem': {
      // rootValue 是转换px的基准值
      rootValue: 37.5,
      propList: ['*'] // 全部文件都适配
    }
  }
}
