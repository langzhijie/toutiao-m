<template>
<!-- 小智同学组件 -->
  <div class='container'>
     <van-nav-bar
  title="小智同学"
  left-text="返回"
  left-arrow
  :fixed="fixed"
  @click-left="$router.back()"

></van-nav-bar>

  <div class="chat-list" ref="myList">
    <!-- 左侧是小智 -->
    <!-- 如果name为xz就是小智说的 -->
      <div class="chat-item" :class="{left:item.name==='xz',right:item.name!='xz'}" v-for="(item,index) in list" :key="index">
        <!-- 小智头像 -->
        <van-image v-if="item.name==='xz'" fit="cover" round :src="xzImg" />
        <!-- 小智说话 -->
        <div class="chat-pao">{{item.msg}}</div>
        <!-- 如果不等于小智就显示用户头像 -->
        <van-image  v-if="item.name!='xz'" fit="cover" round :src="photo" />
      </div>
      <!-- <div class="chat-item right">
        <div class="chat-pao">ewqewq</div>
        <van-image  fit="cover" round :src="photo" />
      </div> -->
    </div>
    <div class="reply-container van-hairline--top">
      <van-field v-model.trim="value" placeholder="说点什么...">
        <van-loading v-if="loading" slot="button" type="spinner" size="16px"></van-loading>
        <span v-else @click="send()" slot="button" style="font-size:12px;color:#999">提交</span>
      </van-field>
    </div>
  </div>
</template>

<script>
import Vue from 'vue'
import xzImg from '@/assets/touxiang.jpg' // 机器人头像
import { mapState } from 'vuex'
import io from 'socket.io-client' // 引入socket.io客户端
export default {
  data () {
    return {
      xzImg,
      fixed: true, // 固定导航栏到顶部
      list: [], // 聊天记录的数组
      loading: false, // 控制输入的状态
      value: ''// 输入的内容
    }
  },
  computed: {
    ...mapState(['photo', 'user']) // 头像地址 当前的最新头像地址
  },
  // 初始化钩子函数要建立socket.io-client连接
  created () {
    // 初始化webSocket
    // 规定还需要传参
    this.socket = io('http://ttapi.research.itcast.cn', {
      query: {
        token: this.user.token // vuex中的token
      }
    })// 用 this.socket 接收目的是 在其他方法中依然可以使用
    // 接收成功// 表示当前已经建立连接成功
    this.socket.on('connect', () => {
      this.list.push({ msg: '你好', name: 'xz' })
    })
    // 监听回复消息
    this.socket.on('message', data => {
      // data就是回复的消息 接收的都是小智说的
      this.list.push({ ...data, name: 'xz' })
      this.scrollBottom() // 接收消息也将滚动条设置在底部
    })
  },
  methods: {
    // 滚到到底部的方法
    scrollBottom () {
      // 将内容滚到到底部 设置滚动条 scrollTop(滚动条距离顶部的长度)=scrollHeight(整个容器的高度)
      // vuejs 内部渲染是异步的  不是同步的
      // 需要等到异步更新完成之后 采取执行滚动
      // this.$nextTick(() => {
      //   // 这是使用组件实例的方式
      //   // 在这个函数中 上一次的数据更新结果 已经更新完成 此时数据已经是最新的了
      //   this.$refs.myList.scrollTop = this.$refs.myList.scrollHeight
      // }) // 此函数表示在上次数据更新 并且完成页面渲染之后执行

      // 这是使用全局对象的方式
      Vue.nextTick(() => {
        this.$refs.myList.scrollTop = this.$refs.myList.scrollHeight
      })
    },
    async send () {
      // 点击提交调用websocket 发出一个消息
      if (!this.value) return false// 如果输入框没值就不能发消息
      // 如果不为空 首先需要将状态打开
      this.loading = true // 打开的目的放置重复提交
      await this.$sleep() // 强制休眠
      // 发送websocket 发送消息
      // this.socket.emit(消息类型,消息内容)
      const obj = {
        msg: this.value, // 消息内容
        timestamp: Date.now() // 当前时间戳
      }
      this.socket.emit('message', obj) // 发送消息
      // 发送后要追加到聊天记录数组
      this.list.push(obj)
      this.loading = false // 关闭状态
      this.value = '' // 清空消息内容
      this.scrollBottom()// 发消息的时候让滚动条在最底部
    }
  },
  beforeDestroy () {
    this.socket.close() // 关闭连接
  }
}
</script>

<style lang="less" scoped>
.container {
  height: 100%;
  width: 100%;
  position: absolute;
  left: 0;
  top: 0;
  box-sizing: border-box;
  background:#fafafa;
  padding: 46px 0 50px 0;
  .chat-list {
    height: 100%;
    overflow-y: scroll;
    .chat-item{
      padding: 10px;
      .van-image{
        vertical-align: top;
        width: 40px;
        height: 40px;
      }
      .chat-pao{
        vertical-align: top;
        display: inline-block;
        min-width: 40px;
        max-width: 70%;
        min-height: 40px;
        line-height: 38px;
        border: 0.5px solid #c2d9ea;
        border-radius: 4px;
        position: relative;
        padding: 0 10px;
        background-color: #e0effb;
        word-break: break-all;
        font-size: 14px;
        color: #333;
        &::before{
          content: "";
          width: 10px;
          height: 10px;
          position: absolute;
          top: 12px;
          border-top:0.5px solid #c2d9ea;
          border-right:0.5px solid #c2d9ea;
          background: #e0effb;
        }
      }
    }
  }
}
.chat-item.right{
  text-align: right;
  .chat-pao{
    margin-left: 0;
    margin-right: 15px;
    &::before{
      right: -6px;
      transform: rotate(45deg);
    }
  }
}
.chat-item.left{
  text-align: left;
  .chat-pao{
    margin-left: 15px;
    margin-right: 0;
    &::before{
      left: -5px;
      transform: rotate(-135deg);
    }
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
}
</style>
