import Vue from 'vue'
import VueRouter from 'vue-router'
const Home = () => import('@/views/home') // 主页组件
const Layout = () => import('@/views/layout') // 引入布局组件
const Question = () => import('@/views/question') // 问答组件
const Video = () => import('@/views/video') // 视频组件
const User = () => import('@/views/user') // 个人中心组件
const Profile = () => import('@/views/user/profile')// 编辑资料组件
const Chat = () => import('@/views/user/chat') // 小智同学
const Login = () => import('@/views/login') // 登录组件
const Search = () => import('@/views/search') // 搜索组件
const Result = () => import('@/views/search/result') // 搜索结果组件
const Article = () => import('@/views/article') // 文章详情
Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'home',
    component: Layout, // 一级路由组件
    children: [
      // 二级路由表
      {
        path: '/',
        component: Home, // 二级路由 首页
        // meta中可以放置当前路由的信息 根据此信息进行相关的判断
        // 如果一级路由存在默认的二级路由那么meta属性应该写在二级路由的对象上
        meta: { isAlive: true } // 路由元信息 isAlive表示是否进行缓存
      },
      {
        path: '/question',
        component: Question// 二级路由 问答组件
      },
      {
        path: '/video',
        component: Video// 二级 视频组件
      },
      {
        path: '/user',
        component: User // 二级个人中心组件
      }
    ]
  },
  {
    path: '/user/profile',
    component: Profile // 一级 编辑资料组件
  },
  {
    path: '/user/chat',
    component: Chat // 一级小智同学
  },
  {
    path: '/login',
    component: Login // 一级 登录组件
  },
  {
    path: '/search',
    component: Search // 一级搜索中心组件
  },
  {
    path: '/search/result',
    component: Result // 一级搜索结果
  }, {
    path: '/article',
    component: Article // 一级文章详情
  }

]

const router = new VueRouter({
  routes
})

export default router
