<template>
 <div class="container">
   <!-- 标签页组件 -->
   <van-tabs>
     <!-- 子标签 -->
       <van-tab :title="item.name" v-for="item in channels" :key="item.id">
         <!-- 放置封装的组件 -->
        <ArticleList></ArticleList>
       </van-tab>
       <!-- 放置展开图标用来编辑频道 -->
      <span class="bar_btn">
         <van-icon name="wap-nav"></van-icon>
      </span>
   </van-tabs>
 </div>
</template>

<script>
import ArticleList from './components/article.list'
import { getMyChannels } from '@/api/channels'

export default {
  components: {
    // 局部注册组件
    ArticleList
  },
  data () {
    return {
      channels: [] // 文章的频道
    }
  },
  methods: {
    // 获取文章频道的方法
    async getMyChannels () {
      const data = await getMyChannels() // 接收返回的结果
      this.channels = data.channels // 赋值给文章频道数组
    }
  },
  created () {
    this.getMyChannels()
  }

}
</script>

<style lang="less" scoped>
.van-tabs {
  height: 100%;
  display: flex;
  flex-direction: column;
  /deep/ .van-tabs__wrap {
    height: 36px;
    padding-right: 36px;
    .van-tab {
      line-height: 36px;
    }
    .van-tabs__line {
      background-color: #3296fa;
      height: 2px;
    }
  }
  /deep/ .van-tabs__content{
    flex: 1;
    overflow: hidden;
  }
  /deep/ .van-tab__pane{
    height: 100%;
    .scroll-wrapper{
      height: 100%;
      overflow-y: auto;
    }
  }
}
.bar_btn {
  width: 36px;
  height: 35px;
  position: absolute;
  top: 0;
  right: 0;
  &::before {
    content: "";
    width: 100%;
    height: 100%;
    position: absolute;
    z-index: 999;
    box-shadow: 0 0 10px #999;
    transform: scale(1, 0.6);
  }
  .van-icon-wap-nav {
    width: 100%;
    height: 100%;
    background: #fff;
    text-align: center;
    line-height: 35px;
    position: relative;
    z-index: 1000;
    &::before {
      font-size: 20px;
    }
  }
}
</style>
