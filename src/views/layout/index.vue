<template>
  <!-- 公用布局 -->
  <div class="container">
    <!-- 顶部导航栏 -->
    <!-- fixed 是否固定在顶部 默认值是false -->
    <van-nav-bar v-if="showNavBar" fixed title="黑马头条" right-text="搜索" @click-right="$router.push('/search')"></van-nav-bar>
      <!-- :class="{ 名称: 布尔值 } -->
    <div class="my-wrapper" :class="{noTop:!showNavBar}">
      <!-- 缓存二级路由容器 -->
      <keep-alive>
        <!-- 包裹后的路由容器中的组件就不会被销毁了 -->
        <router-view></router-view>
      </keep-alive>

    </div>
    <!-- 底部标签栏 -->
    <!-- route 开启路由 -->
    <van-tabbar route>
      <!-- 标签项 -->
      <van-tabbar-item icon="wap-home-o" to="/">首页</van-tabbar-item>
      <van-tabbar-item icon="chat-o" to="/question">问答</van-tabbar-item>
      <van-tabbar-item icon="tv-o" to="/video">视频</van-tabbar-item>
      <van-tabbar-item icon="user-o" to="/user">我的</van-tabbar-item>
    </van-tabbar>
  </div>
</template>

<script>
export default {
  computed: {
    // 如果路由地址是user的话 就用V-if 隐藏头部导航
    showNavBar () {
      return this.$route.path !== '/user'
    }
  }

}
</script>

<style lang="less" scoped>
.container {
  width: 100%;
  height: 100%;
  position: relative;
  .my-wrapper {
    width: 100%;
    height: 100%;
    overflow: hidden;
    padding-top: 46px;
    padding-bottom: 50px;
    box-sizing: border-box;
    &.noTop {
      padding-top: 0;
    }
  }
}
</style>
