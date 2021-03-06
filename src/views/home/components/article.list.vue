<template>
  <!-- 文章列表组件 -->

  <!-- 返回值div的目的是形成滚动条 -->
  <!-- 为了以后实现阅读记忆 -->

  <div class="scroll-wrapper" @scroll="remember" ref="myScroll">
    <!-- 组件van-list可以帮助我们完成上拉加载 -->
    <!-- 初始化完成 就会检测自己距离底部的长度 超过限定就会执行load事件 自动把绑定的loading变成true -->
    <!-- 滚动条与底部距离小于 offset 时触发load事件 -->
    <!-- 加载完成提示文案 finished-text -->
    <!-- 下拉刷新组件要包裹van-list -->
    <!-- refresh下拉刷新时触发 -->
    <van-pull-refresh v-model="downloading" @refresh="onRefresh" :success-text="successText">
      <!-- loading表示当前是否在上拉加载 需要v-model双向加载 -->
      <!-- finished 表示当前列表的所有数据是否都已经加载完毕 -->
      <van-list
        v-model="uploading"
        :finished="finished"
        @load="onload"
        offset="500"
        finished-text="没有更多了"
      >
        <!-- CellGroup是单元格的框 -->
        <van-cell-group>
          <!-- 列表的单元格 -->
          <!-- item.art_id 是个大数字的类型 key要用字符串或数字代替 -->
          <van-cell
            :to="`/article?artId=${item.art_id.toString()}`"
            v-for="item in articles "
            :key="item.art_id.toString()"
          >
            <!-- 文章列表的循环项 -->
            <!-- 三图的 -->
            <div class="article_item">
              <!-- 文章标题 -->
              <h3 class="van-ellipsis">{{item.title}}</h3>
              <!-- 文章封面 -->
              <!-- 三图 -->
              <div class="img_box" v-if="item.cover.type===3">
                <!-- lazy-load 表示图片懒加载处理 -->
                <van-image lazy-load class="w33" fit="cover" :src="item.cover.images[0]" />
                <van-image lazy-load class="w33" fit="cover" :src="item.cover.images[1]" />
                <van-image lazy-load class="w33" fit="cover" :src="item.cover.images[2]" />
              </div>
              <!-- 单图 -->
              <div class="img_box" v-if="item.cover.type===1">
                <van-image lazy-load class="w33" fit="cover" :src="item.cover.images[0]" />
              </div>
              <!-- 作者信息 -->
              <div class="info_box">
                <span>{{ item.aut_name }}</span>
                <span>{{ item.comm_count }}评论</span>
                <!-- 使用过滤器 -->
                <span>{{ item.pubdate | relTime }}</span>
                <!-- 此叉号的显示 应该根据当前的登录状态来判断 如果登录了 可以显示 如果没有登录 不显示 -->
                <!-- 最原始方式 -->
                <!-- <span class="close" v-if="$store.state.user.token"> -->
               <!-- 辅助函数的形式 -->
               <!-- @事件名="逻辑处理"  点击事件中触发一个 显示反馈的事件 传出 点击的文章id-->
               <span @click.stop="$emit('showAction', item.art_id.toString())" class="close" v-if="user.token">
                  <van-icon name="cross"></van-icon>
                </span>
              </div>
            </div>
          </van-cell>
        </van-cell-group>
      </van-list>
    </van-pull-refresh>
  </div>
</template>

<script>
import { getArticles } from '@/api/articles' // 引入获取文章请求方法
import { mapState } from 'vuex' // vuex辅助函数
import eventbus from '@/utils/eventbus'
export default {
  created () {
    // 初始化函数
    // 监听eventbus广播的事件
    // 每个组件都在监听$on的事件
    // arteID文章的id  channelId激活页签的id
    eventbus.$on('delArticle', (artID, channelId) => {
      // 判断 传来的频道等于自身的频道 如果等于就可以进行删除
      if (channelId === this.channel_id) {
        const index = this.articles.findIndex(
          item => item.art_id.toString() === artID
        )
        if (index > -1) {
          // 删除对应下标的数据
          this.articles.splice(index, 1)
        }
        // 如果删除数据删光了 就不会触发load事件
        // 列表长度为0 就掉加载数据
        if (this.articles.length === 0) {
          this.onload()
        }
      }
    })
    eventbus.$on('changeTab', (id) => {
      // 传入的id就是当前激活的tab页签的频道id
      // 要判断 当前的文章列表 接受的id 是否等于此id 如果相等表示该文章列表实例就是需要滚动的实例
      if (id === this.channel_id) {
        // this.$nextTick()// 异步渲染 等到上一次的执行结果渲染完成 保证上一次异步渲染完成
        this.$nextTick(() => {
          if (this.scrollTop && this.$refs.myScroll) {
          // 当滚动执行不为0并且滚动元素存在的情况下
            this.$refs.myScroll.scrollTop = this.scrollTop // 滚动到记录的位置
          }
        })
      }
    })
  },
  computed: {
    ...mapState(['user']) // 将user对象映射到计算属性中
  },
  // 父组件传过来的数据  对象形式的接收数据
  props: {
    // key就是props的属性名  value就是对象
    channel_id: {
      required: true, // 此属性的含义是必填
      type: Number, // 表示要传入prop属性的类型
      default: null // 默认值的意思 假如没有传入属性 默认值就会启用
    }
  },
  data () {
    return {
      successText: '', // 下拉加载成功文案
      uploading: false, // 上拉加载状态是否开启 默认值是false
      finished: false, // 表示是否已经完成全部数据加载
      articles: [], // 文章列表
      downloading: false, // 下拉刷新是否开启 开启布尔值就是false
      timestamp: null, // 用来存储历史事件戳
      scrollTop: 0 // 定义滚动的位置
    }
  },
  methods: {
    // 记录滚动事件
    remember (event) {
    //  函数防抖 降频记录最后一次滚动
      clearTimeout(this.timer)
      this.timer = setTimeout(() => {
        // 记录滚到到哪个位置
        this.scrollTop = event.target.scrollTop // 记录下滚动位置
      }, 500)
    },
    // 上拉加载
    async onload () {
      // 如果加载完毕 就要把finished 设置为true 不再请求添加数据
      // 判断列表数据的长度是否大于50 大于50的话 就设置finished为true 表示加载完毕了
      // if (this.articles.length > 50) {
      //   this.finished = true
      // } else {
      //   const arr = Array.from(Array(13), (value, index) => index + 1)
      //   // 从后加入文章列表数组
      //   this.articles.push(...arr)
      //   // 关掉上拉加载状态
      //   this.uploading = false
      //   console.log(this.articles.length)
      // }
      await this.$sleep(1000) // 人为的控制请求时间
      // 开始加载文章列表加载数据
      const res = await getArticles({
        channel_id: this.channel_id, // 参数channel_id  当前的文章频道id
        timestamp: this.timestamp || Date.now() // 时间戳 如果现在的时间戳不为空就用 为空就用新的时间戳
      })
      // 请求回来的 添加到文章列表队尾
      this.articles.push(...res.results)
      this.uploading = false // 关闭加载状态
      // 要将历史时间戳给 timestamp 赋值前要判断历史时间戳为0吗
      // 要是为0就表示没数据了
      if (res.pre_timestamp) {
        // 如果有历史时间戳就是还有数据
        this.timestamp = res.pre_timestamp
      } else {
        // 要是历史时间戳为0 就表示没有数据了
        this.finished = true
      }
    },

    // 下拉刷新时触发的事件
    async onRefresh () {
      // setTimeout(() => {
      //   // 下拉刷新将获取的新数据加到列表最前面
      //   const arr = Array.from(
      //     Array(2),
      //     (value, index) => '新数据' + (index + 1)
      //   )
      //   // 从前添加到列表数组
      //   this.articles.unshift(...arr)
      //   // 手动关闭下拉加载的状态
      //   this.downloading = false
      //   this.successText = `更新${arr.length}了条数据`
      // }, 1000)
      await this.$sleep(1000) // 人为的控制请求时间
      const data = await getArticles({
        // 下拉刷新发送最新的时间戳
        channel_id: this.channel_id,
        timestamp: Date.now() // 最新事件戳
      })
      // 手动关闭 下拉刷新的状态
      this.downloading = false
      // 需要判断返回的数据长度  最新的时间戳能否换来数据 能的话就替换列表的数据 不能就提示没有了
      if (data.results.length) {
        // 有的话就替换所有数据
        this.articles = data.results
        // 覆盖了全部数据  假如你把数据拉倒了低端 也就意味着 finished 已经为true
        if (data.pre_timestamp) {
          // 如果下拉刷新 换来了新数据 就有了历史时间戳
          this.finished = false // 从新唤醒列表继续上拉加载
          this.timestamp = data.pre_timestamp // 记录历史时间戳
        }
        this.successText = `更新了${data.results.length}条数据`
      } else {
        // 没有的话
        this.successText = '当前已是最新'
      }
    }

  },
  activated () {
    // 再激活函数中判断滚动条是否发生了变化
    if (this.$refs.myScroll && this.scrollTop) {
      // 判断滚动条是否大于0
      this.$refs.myScroll.scrollTop = this.scrollTop // 将记录的位置滚回去
    }
  }
}
</script>

<style lang='less' scoped>
.article_item {
  h3 {
    font-weight: normal;
    line-height: 2;
  }
  .img_box {
    display: flex;
    justify-content: space-between;
    .w33 {
      width: 33%;
      height: 90px;
    }
    .w100 {
      width: 100%;
      height: 180px;
    }
  }
  .info_box {
    color: #999;
    line-height: 2;
    position: relative;
    font-size: 12px;
    span {
      padding-right: 10px;
      &.close {
        border: 1px solid #ddd;
        border-radius: 2px;
        line-height: 15px;
        height: 12px;
        width: 16px;
        text-align: center;
        padding-right: 0;
        font-size: 8px;
        position: absolute;
        right: 0;
        top: 7px;
      }
    }
  }
}
</style>
