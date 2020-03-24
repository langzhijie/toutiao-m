<template>
<!-- 搜索结果组件 -->
<div class='container'>
   <!-- fixed固定在顶部 -->
  <van-nav-bar fixed title="搜索结果"  left-text="返回"  left-arrow @click-left="$router.back()"></van-nav-bar>
 <!-- 防止搜索结果列表 -->
 <!-- offset距离底部距离 -->
    <van-list v-model="upLoading" @load="onload" :finished="finished">
      <van-cell-group>
        <!-- 点击搜索结果页中的每一项跳到文章详情页 -->
        <van-cell  :to="`/article?artId=${item.art_id.toString()}`"   v-for="item in articles" :key="item.art_id.toString()">
          <div class="article_item">
            <h3 class="van-ellipsis">{{item.title}}</h3>
            <div class="img_box" v-if="item.cover.type===3">
              <van-image class="w33" fit="cover" :src="item.cover.images[0]" />
              <van-image class="w33" fit="cover" :src="item.cover.images[1]" />
              <van-image class="w33" fit="cover" :src="item.cover.images[2]" />
            </div>
            <div class="img_box" v-if="item.cover.type===1">
              <van-image class="w100" fit="cover" :src="item.cover.images[0]" />
            </div>
            <div class="info_box">
              <span>{{item.aut_name}}</span>
              <span>{{item.comm_count}}评论</span>
              <span>{{item.pubdate|relTime}}</span>
            </div>
          </div>
        </van-cell>
      </van-cell-group>
    </van-list>
  </div>
</template>

<script>
import * as Articles from '@/api/articles' // 获取搜索结果请求
export default {
  data () {
    return {
      upLoading: false, // 上拉加载状态
      finished: false, // 表示当前的加载是否全部完成了 如果全部完成 应该将finished设置成true
      articles: [], // 放置搜索结果文章的
      page: {
        page: 1, // 当前第几页
        per_page: 10 // 每页的多少条
      }
    }
  },
  methods: {
    //   滚动条到底部时执行
    async onload () {
      const { q } = this.$route.query // 获取query参数
      const data = await Articles.getsearch({ ...this.page, q }) // 请求数据
      this.articles.push(...data.results) // 将请求回的数据追加到队尾
      this.upLoading = false // 关闭上拉加载状态

      // 如何来判断 已经上拉加载 把所有的数据全都查询过来了?
      // 接口并没有告诉我们 什么时候结束  可以根据当前 返回的数据 是否有记录
      // 如果你返回的查询记录是 0 我此时认为 没有下一页的数据了
      if (data.results.length) {
        this.page.page++
      } else {
        this.finished = true
      }
    }
  }
}
</script>

<style lang='less' scoped>
.container {
  padding-top: 46px;
  height: 100%;
  overflow-y: auto;
  box-sizing: border-box;
}
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
      height: 180px;
      width: 100%;
    }
  }
  .info_box {
    color: #999;
    line-height: 2;
    position: relative;
    span {
      padding-right: 10px;
    }
  }
}
</style>
