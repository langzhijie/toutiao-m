<template>
  <!-- 此文件是频道管理 -->
  <div class="channel-edit">
    <!-- 我的频道 -->
    <div class="channel">
      <div class="tit">
        我的频道：
        <span class="tip">点击可进入频道</span>
        <van-button v-if="!editing" @click="editing=true" size="mini" type="info" plain>编辑</van-button>
        <van-button v-else @click="editing=false" size="mini" type="danger" plain>完成</van-button>
      </div>
      <van-grid class="van-hairline--left">
        <van-grid-item v-for="item in channels" :key="item.id">
          <span class="f12">{{item.name}}</span>
          <van-icon class="btn" name="cross"></van-icon>
        </van-grid-item>
      </van-grid>
    </div>
    <!-- 可选频道 -->
    <!-- 可选频道=全部频道-我的频道 -->
    <div class="channel">
      <div class="tit">可选频道：</div>
      <van-grid class="van-hairline--left">
        <van-grid-item v-for="item in optionalChannels" :key="item.id">
          <span class="f12">{{item.name}}</span>
          <van-icon class="btn" name="plus"></van-icon>
        </van-grid-item>
      </van-grid>
    </div>
  </div>
</template>

<script>
import { getAllChannels } from '@/api/channels' // 请求全部文章频道
export default {
  data () {
    return {
      editing: false, // 控制显示删除图标
      allChannels: [] // 全部文章列表的数组
    }
  },
  methods: {
    //  定义获取全部文章频道的方法
    async getAllChannels () {
      const data = await getAllChannels()
      this.allChannels = data.channels // 将请求回来的全部频道赋值给data中定义的变量
    }

  },
  computed: {
    // 计算属性中必须要有返回值 用全部文章列表的数组-我的文章频道得到可选的文章频道
    //   可选频道
    optionalChannels () {
      return this.allChannels.filter(
        item => !this.channels.some(i => i.id === item.id)
      )
    }
  },
  created () {
    this.getAllChannels() // 调用获取全部频道的方法
  },
  props: {
    channels: {
      required: true, // 必传项
      type: Array // 传的类型数组
      //   default: () => [] // 默认值是空数组 可以不写
    }
  }
}
</script>

<style lang='less' scoped>
.channel-edit {
  .channel {
    padding: 10px;
    .tit {
      line-height: 3;
      .tip {
        font-size: 10px;
        color: #999;
      }
    }
    .van-button {
      float: right;
      margin-top: 7px;
    }
    .btn {
      position: absolute;
      bottom: 0;
      right: 0;
      background: #ddd;
      font-size: 12px;
      color: #fff;
    }
    .f12 {
      font-size: 12px;
      color: #555;
    }
    .red {
      color: red;
    }
  }
}
</style>
