<template>
<!-- 文章详情模块 -->
  <div class='container'>
    <van-nav-bar fixed title="文章详情" left-arrow left-text="返回" @click-left="$router.back()" />
    <div class="detail">
      <h3 class="title">{{actilesList.title}}</h3>
      <div class="author">
        <van-image round width="1rem" height="1rem" fit="fill" :src="actilesList.aut_photo" />
        <div class="text">
          <p class="name">{{actilesList.aut_name}}</p>
          <p class="time">{{actilesList.pubdate|relTime}}</p>
        </div>
        <van-button round size="small" type="info">{{actilesList.is_followed?'取消关注':'+关注'}}</van-button>
      </div>
      <div class="content" v-html='actilesList.content'>

      </div>
      <div class="zan">
        <van-button round size="small" :class="{active:actilesList.attitude==1}" plain icon="like-o">点赞</van-button>
        &nbsp;&nbsp;&nbsp;&nbsp;
        <van-button round size="small"   plain icon="delete"  :class="{active:actilesList.attitude==1}" >不喜欢</van-button>
      </div>
    </div>
  </div>
</template>

<script>
import { getArticleInfo } from '@/api/articles' // 获取文章详情的请求
export default {
  data () {
    return {
      actilesList: [] // 存放文章详情的数组
    }
  },
  methods: {
    async getActileInfo () {
      const { artId } = this.$route.query // 从路由地址中获取参数articleId
      this.actilesList = await getArticleInfo(artId) // 将拿到的id 发请求 返回数据存入data中数组
    }
  },
  created () {
    this.getActileInfo() // 加载完成自己调用获取文章内容
  }
}
</script>

<style lang='less' scoped>
.container {
  height: 100%;
  overflow-y: auto;
  box-sizing: border-box;
}
.loading-container {
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
}
.van-overlay {
  background: none;
}
.detail {
  padding: 46px 10px 44px;
  .title {
    font-size: 18px;
    line-height: 2;
  }
  .zan{
    text-align: center;
    padding: 10px 0;
    .active{
      border-color:red;
      color: red;
    }
  }
  .author {
    padding: 10px 0;
    display: flex;
    position:sticky;
    background-color: #fff;
    top:46px;
    z-index: 2;
    .text {
      flex: 1;
      padding-left: 10px;
      line-height: 1.5;
      .name {
        font-size: 14px;
        margin: 0;
      }
      .time {
        margin: 0;
        font-size: 12px;
        color: #999;
      }
    }
  }
  .content {
    padding: 20px 0;
    overflow: hidden;
    white-space: pre-wrap;
    word-break: break-all;
    /deep/ img{
      max-width:100%;
      background: #f9f9f9;
    }
    /deep/ code{
      white-space: pre-wrap;
    }
  }
}
</style>
