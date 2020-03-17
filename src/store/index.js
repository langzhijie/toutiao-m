// 此文件专门处理 Vuex的模块

import Vue from 'vue'
import Vuex from 'vuex'
// 引入auth下的所有对象
import * as auth from '@/utils/auth'
Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    // 专门来放置共享的状态
    user: auth.getUser() // 就是token 信息的对象  本地缓存有token 就读取缓存中的token
  },
  mutations: {
    // 这里修改 state中的数据
    // 修改token
    updateUser (state, payload) {
      state.user = payload.user // 将载荷中的user数据赋值给state中的user
      auth.setUser(payload.user) // 将最新的数据也要进行数据本地化存储
    },
    // 删除token
    delUser (state) {
      state.user = {} // 将Vuex中的token将设置为空对象
      auth.delUser() // 删除本地中的token
    }
  },
  actions: {
  },
  modules: {
  }
})
