import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import '@/permission' // 权限拦截模块
import Vant from 'vant' // 引入vant
import 'vant/lib/index.less' // 引入vant的less文件 修改某些变量用
import 'amfe-flexible' // 引入适配文件
import '@/styles/index.less' // 引入自定义样式
Vue.config.productionTip = false
Vue.use(Vant) // 全局注册Vant
new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
