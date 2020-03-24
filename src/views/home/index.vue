<template>
  <div class="container">
    <!-- 标签页组件 -->
    <!-- v-model绑定默认的激活页签 -->
    <van-tabs v-model="activeIndex">
      <!-- 子标签 -->
      <van-tab :title="item.name" v-for="item in channels" :key="item.id">
        <!-- 放置封装的组件 -->
        <!--@showAction 监听子组件触发的点击事件 -->
        <ArticleList :channel_id="item.id" @showAction="openAction"></ArticleList>
      </van-tab>
    </van-tabs>
    <!-- 放置展开图标用来编辑频道 -->
    <span class="bar_btn" @click="showChannelEdit=true">
      <van-icon name="wap-nav"></van-icon>
    </span>
    <!-- 点击X号显示的弹层组件 -->
    <van-popup :style="{ width: '80%' }" v-model="showMoreAction">
      <!-- 监听子组件的自定义事件 -->
      <!-- 子组件传的事件  不敢兴趣dislike 举报reports-->
      <!-- @事件名="方法名($event 参数)" -->
      <!-- $event 是事件参数 在H5标签中dom元素的事件参数 自定义事件中$event就是自定义事件传出的第一个参数 -->
      <MoreAction @dislike="dislikeOrReport('dislike')" @report="dislikeOrReport('report',$event)" />
    </van-popup>

    <!-- 频道管理的组件 -->
    <!-- 通过绑定控制显示与隐藏  round控制菜单是否为圆角   -->
    <van-action-sheet v-model="showChannelEdit" :round="false" title="频道管理">
      <!-- 将父组件的频道列表传入子组件渲染 -->
      <!-- 监听子组件的自定义事件  selectChannels-->
      <!-- 将激活的索引传到子组件进行添加样式 activeIndex-->
      <!-- 删除频道delChannels -->
      <!-- 加频道addChannel -->
      <Channeledit
        @addChannel="addChannel"
        :activeIndex="activeIndex"
        :channels="channels"
        @selectChannels="selectChannels"
        @delChannel="delChannel"
      ></Channeledit>
    </van-action-sheet>
  </div>
</template>

<script>
import ArticleList from './components/article.list' // 文章列表子组件
import MoreAction from './components/more-action' // 弹层组件
import Channeledit from './components/channel-edit' // 频道管理的子组件
import { addChannel, getMyChannels, delChannel } from '@/api/channels' // 请求文章频道
import { disLikeArticle, reportArticle } from '@/api/articles' // 不感兴趣的请求方法和举报
import eventbus from '@/utils/eventbus' // 公共事件广播
export default {
  components: {
    // 局部注册组件
    ArticleList,
    MoreAction, // 弹层组件
    Channeledit // 频道管理组件
  },
  data () {
    return {
      channels: [], // 文章的频道
      showMoreAction: false, // 控制弹层显示隐藏的变量 false不显示
      articleID: null, // 存储子组件传入的文章id
      activeIndex: 0, // 默认激活的页签为0
      showChannelEdit: false // 显示与隐藏频道管理 false为隐藏
    }
  },
  methods: {
    // 添加频道
    async addChannel (channel) {
      await addChannel(channel)
      this.channels.push(channel)
    },
    // 删除频道的方法 参数id要删除的id
    // 删除频道的方法
    async delChannel (id) {
      // 此时应该先调用api
      try {
        await delChannel(id) // 调用api方法  此时只是删除了 缓存中的数据
        // 如果此时成功的resolve了 我们 应该去移除 当前data中的数据
        const index = this.channels.findIndex(item => item.id === id) // 找到对应的索引
        // 找到对应的索引之后
        // 要根据当前删除的索引 和 当前激活的索引的 关系 来 决定 当前激活索引是否需要改变
        if (index <= this.activeIndex) {
          //  如果你删除的索引 是在当前激活索引之前的 或者等于当前激活索引的
          // 此时就要把激活索引 给往前挪一位
          this.activeIndex = this.activeIndex - 1
        }
        this.channels.splice(index, 1) // 删除对应的索引频道
      } catch (error) {
        this.$lnotify({ message: '删除频道失败' })
      }
    },

    // 获取文章频道的方法
    async getMyChannels () {
      const data = await getMyChannels() // 接收返回的结果
      this.channels = data.channels // 赋值给文章频道数组
    },
    // 我的频道的点击跳转到选择的频道
    selectChannels (index) {
      this.activeIndex = index // 赋值给默认激活页签
      this.showChannelEdit = false // 选择后关闭频道管理菜单
    },

    // 控制弹层显示的方法
    // airid 子组件传入的文章id
    openAction (airId) {
      // 设置弹层显示
      this.showMoreAction = true
      // 接收的文章id存入data变量
      this.articleID = airId
    },
    // 子组件moreAciton子组件自定义的不感兴趣的方法
    // operateType就是操作类型 dislike就是不感兴趣 reports就是举报
    async dislikeOrReport (operateType, type) {
      try {
        operateType === 'dislike'
          ? await disLikeArticle({
            target: this.articleID // 传入不感兴趣的文章ID
          })
          : await reportArticle({ target: this.articleID, type })
        this.$lnotify({
          type: 'success',
          message: '操作成功'
        })
        this.showMoreAction = false // 操作成功关闭弹窗
        // 广播事件 传入要删除的文章id
        // 参出文章id 和当前页签下标
        // this.channels[this.activeIndex].id 这个就是页签下标的对应的名
        eventbus.$emit(
          'delArticle',
          this.articleID,
          this.channels[this.activeIndex].id
        )
      } catch (error) {
        this.$lnotify({
          message: '操作失败'
        })
      }
    }
    // 举报文章
    // type就是子组件传过来的item.value
    // async reportsAction (type) {
    //   try {
    //     // 成功的话
    //     await reportArticle({ target: this.articleID, type })
    //     this.$lnotify({
    //       type: 'success',
    //       message: '操作成功'
    //     })
    //     this.showMoreAction = false // 操作成功关闭弹窗
    //     // 同样监听eventbus.$on 删除对应频道的举报的文章
    //     eventbus.$emit('delArtcile', this.articleID, this.channels[this.activeIndex].id)
    //   } catch (error) {
    //     this.$lnotify({
    //       message: '操作失败'
    //     })
    //   }
    // }
  },
  created () {
    this.getMyChannels() // 调用获取文章的方法
  }
}
</script>

<style lang='less' scoped>
// 处理弹出编辑面板的样式
.van-action-sheet {
  max-height: 100%;
  height: 100%;
  .van-action-sheet__header {
    background: #3296fa;
    color: #fff;
    .van-icon-close {
      color: #fff;
    }
  }
}
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
