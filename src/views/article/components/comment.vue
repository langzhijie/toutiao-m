<template>
<!-- 此文件是评论区域的组件 -->
  <div class="comment">
      <!-- 列表组件 -->
    <van-list v-model="loading" :finished="finished" finished-text="没有更多了" @load="onload">
        <!-- 评论列表 -->
      <div class="item van-hairline--bottom van-hairline--top" v-for="item in comments" :key="item.com_id.toString()">
       <!-- 用户头像 -->
        <van-image
          round
          width="1rem"
          height="1rem"
          fit="fill"
          :src="item.aut_photo"
        />
        <div class="info">
          <p>
            <!-- 用户名称 -->
            <span class="name">{{item.aut_name}}</span>
            <span style="float:right">
              <span class="van-icon van-icon-good-job-o zan"></span>
              <!-- 点赞数量 -->
              <span class="count">{{item.like_count}}</span>
            </span>
          </p>
          <!-- 评论内容 -->
          <p>{{item.content}}</p>
          <p>
            <!-- 时间 -->
            <span class="time">{{item.pubdate | relTime}}</span>&nbsp;
            <!-- 回复数量 -->
            <van-tag plain @click="showReply=true">{{item.reply_count}} 回复</van-tag>
          </p>
        </div>
      </div>
    </van-list>
    <!-- 输入框 -->
    <div class="reply-container van-hairline--top">
      <van-field v-model="value" placeholder="写评论...">
        <van-loading v-if="submiting" slot="button" type="spinner" size="16px"></van-loading>
        <span class="submit" v-else slot="button">提交</span>
      </van-field>
    </div>
  </div>

  <!-- 都不输入框 -->
</template>

<script>
import { getComments } from '@/api/articles' // 获取评论
export default {
  data () {
    return {
      // 上拉加载中
      loading: false,
      // 全部加载完毕
      finished: false,
      // 输入的内容
      value: '',
      // 控制提交中状态数据
      submiting: false,
      // 评论列表的数组
      comments: [],
      // offset是偏移量 分页依据 第一页数据null 第二页数据offset第一页最后一个id
      offset: null
    }
  },
  methods: {
    // 当滚动条距离底部一定限制是时触发
    async onload () {
      const { artId } = this.$route.query
      const data = await getComments({
        type: 'a', // a表示当前文章的评论 c表示评论的回复
        source: artId, // 查询谁的评论
        offset: this.offset // 偏移量就赋值data中定义的

      })
      this.comments.push(...data.results) // 追加到评论数组
      // 关闭加载状态
      this.loading = false // 关闭上拉加载的状态
      // 判断是否还有下一页数据
      // 判断第一页最后一个id和第一个id是否相等 要是true就加载完毕
      this.finished = data.end_id === data.last_id
      // 如果不还有数据
      if (!this.finished) {
        // data.results.last_id 当前页的最后第一个id
        this.offset = data.last_id // 将求回的数据第一个id赋值给偏移量
      }
    }
  }
}
</script>

<style lang='less' scoped>
.comment {
  margin-top: 10px;
  /deep/ .item {
    display: flex;
    padding: 10px 0;
    .info {
      flex: 1;
      padding-left: 10px;
      .name{
        color:#069;
      }
      .zan{
        vertical-align:middle;
        padding-right:2px;
      }
      .count{
        vertical-align:middle;
        font-size:10px;
        color: #666;
      }
      .time{
        color: #666;
      }
      p {
        padding: 5px 0;
        margin: 0;
      }
    }
  }
  /deep/ .van-button:active::before {
    background: transparent;
  }
}
.reply-container {
  position: fixed;
  left: 0;
  bottom: 0;
  height: 44px;
  width: 100%;
  background: #f5f5f5;
  z-index: 9999;
  .submit {
    font-size: 12px;
    color: #3296fa;
  }
}
</style>
