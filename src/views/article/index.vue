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
        <!-- 添加监听控制关注取消关注 -->
        <!-- loading 按钮加载转态 -->
        <van-button :loading="loading "   @click="follow" round size="small" type="info">{{actilesList.is_followed?'取消关注':'+关注'}}</van-button>
      </div>
      <div class="content" v-html='actilesList.content'>

      </div>
      <div class="zan">
        <van-button round size="small" :class="{active: actilesList.attitude === 1}" plain icon="like-o">点赞</van-button>
        &nbsp;&nbsp;&nbsp;&nbsp;
        <van-button round size="small"  :class="{active:actilesList.attitude === 0}"  plain icon="delete" >不喜欢</van-button>
      </div>
      <!-- 评论列表的组件 -->
      <Comment></Comment>
    </div>

    <!-- 遮罩层 -->
    <van-overlay :show="loading">
      <div class="show_loading">
        <!-- loading加载 -->
      <van-loading type="spinner" />
      </div>
    </van-overlay>

  </div>
</template>

<script>
import { getArticleInfo } from '@/api/articles' // 获取文章详情的请求
import { followUser, unfollowUser } from '@/api/user' // 关注取消关注的请求
import Comment from './components/comment' // 评论组件
export default {
  components: {
    Comment // 注册组件
  },
  data () {
    return {
      actilesList: {}, // 存放文章详情的数组
      followloading: false, // 按钮加载状态
      loading: false // 遮罩层的打开关闭
    }
  },
  methods: {
    // 获取文章详情页的方法
    async getActileInfo () {
      // 请求前打开页面遮罩层
      this.loading = true
      const { artId } = this.$route.query // 从路由地址中获取参数articleId
      this.actilesList = await getArticleInfo(artId) // 将拿到的id 发请求 返回数据存入data中数组
      // 请求回来关闭遮罩层
      this.loading = false
    },
    // 关注取消关注的方法
    async follow () {
      this.followloading = true // 点击完打开加载
      try {
        // 先判断现在关注还是没关注
        if (this.actilesList.is_followed) {
          await unfollowUser(this.actilesList.aut_id) // 传入作者id
        } else {
          await followUser({ target: this.actilesList.aut_id }) // 传入作者id
        }

        this.actilesList.is_followed = !this.actilesList.is_followed // 就关注的转态换成对立的
        this.$lnotify({ message: '操作成功' })
      } catch (error) {
        this.$lnotify({ message: '操作失败' })
      } finally {
        // 无论成功还是失败都会进入finally
        this.followloading = false // 关闭加载
      }
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
.show_loading{
  height: 100%;
  width: 100%;
  display: flex;
  justify-content: center;
  align-content: center;

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
