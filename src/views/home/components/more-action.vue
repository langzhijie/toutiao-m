<template>
  <div class="more-action">
      <!-- 单元格一 -->
      <!-- v-if表示条件满足就显示 不满足就显示v-else -->
        <!--  v-if="!isReport" 如果不举报就显示单元格一-->
    <van-cell-group v-if="!isReport">
        <!-- 点击事件要调父组件的方法 -->
      <van-cell @click="$emit('dislike')">不感兴趣</van-cell>
      <!-- 点击反馈垃圾内容就显示单元格二 -->
      <van-cell is-link @click="isReport=true">反馈垃圾内容</van-cell>
      <van-cell>拉黑作者</van-cell>
    </van-cell-group>
    <!-- 单元格二 -->
    <van-cell-group v-else>
      <van-cell icon="arrow-left" @click="isReport=false">返回</van-cell>
      <!-- 注册举报点击事件 -->
      <!--item.value是唯一的类型  -->
      <van-cell @click="$emit('report',item.value)" v-for="item in reports" :key="item.value">{{item.label}}</van-cell>

    </van-cell-group>
  </div>
</template>

<script>
import { reports } from '@/api/constants' // 引入定义的常量变量
import eventBus from '@/utils/eventbus'
export default {
  data () {
    return {
      isReport: false, // 表示是否举报
      reports // 这个变量就是定义的举报类型常量
    }
  },
  created () {
  //  一初始化就要开始监听
    eventBus.$on('delArticle', () => (this.isReport = false)) // 只要一开始删除 就把弹层中反馈组件重置为初始状态
  }

}

</script>

<style lang='less' scoped>
.more-action {
  border-radius: 4px;
}
</style>
