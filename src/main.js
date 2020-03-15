import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import Vant from 'vant' // 引入vant
import 'vant/lib/index.css' // 引入vant的css文件
import 'amfe-flexible' // 引入适配文件
import '@/styles/index.less' // 引入自定义样式
Vue.config.productionTip = false
Vue.use(Vant) // 全局注册Vant
new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
