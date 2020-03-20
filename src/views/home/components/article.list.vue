<template>
  <!-- 文章列表组件 -->

  <!-- 返回值div的目的是形成滚动条 -->
  <!-- 为了以后实现阅读记忆 -->

  <div class="scroll-wrapper">
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
          <van-cell v-for="item in articles " :key="item">
            <!-- 文章列表的循环项 -->
            <!-- 三图的 -->
            <div class="article_item">
              <!-- 文章标题 -->
              <h3 class="van-ellipsis">凛冬散去,星河长明</h3>
              <!-- 文章封面 -->
              <div class="img_box">
                <van-image class="w33" fit="cover" src="https://img.yzcdn.cn/vant/cat.jpeg" />
                <van-image class="w33" fit="cover" src="https://img.yzcdn.cn/vant/cat.jpeg" />
                <van-image class="w33" fit="cover" src="https://img.yzcdn.cn/vant/cat.jpeg" />
              </div>
              <!-- 作者信息 -->
              <div class="info_box">
                <span>你像一阵风</span>
                <span>8评论</span>
                <span>10分钟前</span>
                <span class="close">
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
export default {
  data () {
    return {
      successText: '', // 下拉加载成功文案
      uploading: false, // 上拉加载状态是否开启 默认值是false
      finished: false, // 表示是否已经完成全部数据加载
      articles: [], // 文章列表
      downloading: false // 下拉刷新是否开启 开启布尔值就是false
    }
  },
  methods: {

    // 上拉加载
    onload () {
      // 如果加载完毕 就要把finished 设置为true 不再请求添加数据
      // 判断列表数据的长度是否大于50 大于50的话 就设置finished为true 表示加载完毕了
      if (this.articles.length > 50) {
        this.finished = true
      } else {
        const arr = Array.from(Array(13), (value, index) => index + 1)
        // 从后加入文章列表数组
        this.articles.push(...arr)
        // 关掉上拉加载状态
        this.uploading = false
        console.log(this.articles.length)
      }

      // setTimeout(() => {
      //   this.finished = true
      // }, 1000)
    },

    // 下拉刷新时触发的事件
    onRefresh () {
      setTimeout(() => {
        // 下拉刷新将获取的新数据加到列表最前面
        const arr = Array.from(
          Array(2),
          (value, index) => '新数据' + (index + 1)
        )
        // 从前添加到列表数组
        this.articles.unshift(...arr)
        // 手动关闭下拉加载的状态
        this.downloading = false
        this.successText = `更新${arr.length}了条数据`
      }, 1000)
    }
  }

}
</script>

<style lang="less">
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
