<template>
  <div id="app">
   <!-- 一级路由容器 -->
   <!-- 如果不加控制会缓存所有的组件实例  keep-alive包裹的-->
   <keep-alive>
     <!-- 当缓存时生效 -->
       <router-view v-if="$route.meta.isAlive"/>
   </keep-alive>
   <!-- 条件渲染 -->
   <router-view v-if="!$route.meta.isAlive"></router-view>
  <!-- 根据$router.meta中的isAlive的属性来决定是否缓存组件 -->
  </div>
</template>

<style lang="less">
// #app {
//   font-family: Avenir, Helvetica, Arial, sans-serif;
//   -webkit-font-smoothing: antialiased;
//   -moz-osx-font-smoothing: grayscale;

//   color: #2c3e50;
// }

// #nav {
//   padding: 30px;

//   a {
//     font-weight: bold;
//     color: #2c3e50;

//     &.router-link-exact-active {
//       color: #42b983;
//     }
//   }
// }
</style>
