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
            <!-- 点击回复弹出回复面板 -->
            <!-- 记录评论id -->
            <van-tag plain @click="openReply(item.com_id.toString())">{{item.reply_count}} 回复</van-tag>
          </p>
        </div>
      </div>
    </van-list>
    <!-- 输入框 -->
    <div class="reply-container van-hairline--top">
      <van-field v-model="value" placeholder="写评论...">
        <!-- v-if="submiting" 点击了提交隐藏提交按钮 防止重复提交 -->
        <van-loading v-if="submiting" slot="button" type="spinner" size="16px"></van-loading>
        <span class="submit" v-else slot="button" @click="submit">提交</span>
      </van-field>
    </div>
    <!-- 放置评论的评论页面结构 -->
        <!-- 回复 -->
        <!-- 关闭面板时@closed清空记录的评论id -->
    <van-action-sheet @close="reply.commentId=null"  v-model="showReply" :round="false" class="reply_dialog" title="回复评论">
      <!-- 关闭自动执行load事件  immediate-check-->
      <van-list  :immediate-check="false" v-model="reply.loading" :finished="reply.finished" finished-text="没有更多了">
        <div class="item van-hairline--bottom van-hairline--top" v-for="item in this.reply.list" :key="item.com_id.toString()">
          <van-image round width="1rem" height="1rem" fit="fill" src="https://img.yzcdn.cn/vant/cat.jpeg" />
          <div class="info">
            <p><span class="name">{{  item.aut_name }}</span></p>
            <p>{{item.content }}</p>
            <p><span class="time">{{ item.pubdate | relTime }}</span></p>
          </div>
        </div>
      </van-list>
    </van-action-sheet>
  </div>

  <!-- 都不输入框 -->
</template>

<script>
import { getComments, commentOrReply } from '@/api/articles' // 获取评论 提交评论

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
      offset: null,
      // 回复面板的显示与隐藏
      showReply: false,
      // 专门放置面板加载信息
      reply: {
        loading: false, // 评论的回复
        finished: false, // 评论的回复是否加载完毕
        offet: null, // 评论回复的偏移量
        list: [], // 评论回复的数组
        commentId: null // 评论id 查询评论回复使用
      }

    }
  },
  methods: {
    // 提交评论
    async submit () {
      // 点击提交时  要判断用户是否登录 如果没有登录就禁止评论 登录后才能评论
      if (this.$store.state.user.token) {
        // 有token才能进行评论 判断是否输入评论内容 没有输入直接返回
        if (!this.value) return false // 没有内容直接返回
        // 如果有内容
        this.submiting = true // 先把状态打开 表示提交中 避免重复的提交 提交完毕后关闭状态
        // 调用提交方法
        // 休眠函数控制执行速度
        await this.$sleep(500)
        try {
          const data = await commentOrReply({
          // 要是有评论id就是评论id false就是文章id
            target: this.reply.commentId ? this.reply.commentId : this.$route.query.artId, // 要么是文章id 就是评论的id
            content: this.value, // 评论内容
            art_id: this.reply.commentId ? this.$route.query.artId : null// 文章id 如果是对评论回复就要传此参数 对文章评论不需要传
          })
          // data.new_obj 此obj数据就是添加成功的一条数据 添加到评论列表
          // 清空输入框 并且直接添加到评论列表里
          if (this.reply.commentId) {
            // 如果commentId存在就是评论的回复 需要添加到评论回复数组中
            this.reply.list.unshift(data.new_obj)
            // 评论回复 需要找到对应id 将评论id的回复数+1
            // 寻找文章评论中 等于评论id的id
            const comment = this.comments.find(item => item.com_id.toString() === this.reply.commentId)
            comment && comment.reply_count++ // 如果找到了就将回复数+1
          } else {
            // 如果不是就是添加到文章频论
            this.comments.unshift(data.new_obj) // 加到频论头部
          }
          this.value = '' // 清空输入框
        } catch (error) {
          this.$lnotify({ message: '评论失败' })
        }

        // 关闭状态 请求后
        this.submiting = false
      } else {
        try {
          // 没有登录的用户
          await this.$dialog.confirm({
            message: '请先登录'
          })
          // 跳转到登录页     用户登录成功后回到当前页面
          this.$router.push({ path: 'login', query: { redirectUrl: this.$route.fullPath } }) // 需要跳回的页面
        } catch (error) {
          // 点击取消后
        }
      }
    },
    // 打开回复面板
    async  openReply (commentId) {
      this.showReply = true // 打开面板
      this.reply.commentId = commentId // 记录评论id
      // 清空之前的数据
      this.reply.list = []
      this.reply.offset = null // 点击面板的时候是新的数据 从第一数据
      this.reply.finished = false //
      this.reply.loading = true // 主动打开加载状态
      await this.getReply() // 获取评论
    },
    // 获取评论回复
    async getReply () {
      const data = await getComments({
        type: 'c', // 表示是评论的评论
        source: this.reply.commentId, // 获取谁的评论的评论
        offset: this.reply.offset // 评论的评论的分页依据

      })
      this.reply.list.push(...data.results) // 追加到评论回复的列表
      // 关闭加载状态
      this.reply.loading = false
      // 判断判断第一页最后一个id和第一个id是否相等 要是true就加载完毕
      this.reply.finished = data.last_id === data.end_id

      // 如果还有数据
      if (!this.reply.finished) {
        // data.results.last_id 当前页的最后第一个id
        this.reply.offset = data.last_id // 将求回的数据第一个id赋值给偏移量
      }
    },
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
.reply_dialog {
  height: 100%;
  max-height: 100%;
  display: flex;
  overflow: hidden;
  flex-direction: column;
  .van-action-sheet__header {
    background: #3296fa;
    color: #fff;
    .van-icon-close {
      color: #fff;
    }
  }
  .van-action-sheet__content{
    flex: 1;
    overflow-y: auto;
    padding: 0 10px 44px;
  }
}
</style>
