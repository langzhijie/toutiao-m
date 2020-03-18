// 此文件做导航守卫
import router from '@/router' // 引入router实例
import store from '@/store' // 引入store

// 前置守卫 当路由地址方生变化都只执行
router.beforeEach(function (to, from, next) {
  if (to.path.startsWith('/user') && !store.state.user.token) {
    //   如果地址以user地址为起时的要进行判断
    // 有token就放行 没有的token就要去登录
    next({
      path: '/login', // 要跳转的地址
      query: {
        redirectUrl: to.fullPath // fullpath会带?后面的参数 是完整的路径
      }
    })
  } else {
    //   如果不是就放行
    next()
  }
})
