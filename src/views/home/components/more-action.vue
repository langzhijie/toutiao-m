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
      <van-cell>侵权</van-cell>
      <van-cell>色情</van-cell>
      <van-cell>暴力</van-cell>
      <van-cell>低俗</van-cell>
      <van-cell>不适</van-cell>
      <van-cell>错误</van-cell>
      <van-cell>其他</van-cell>
    </van-cell-group>
  </div>
</template>

<script>
export default {
  data () {
    return {
      isReport: false // 表示是否举报
    }
  }

}

</script>

<style lang='less' scoped>
.more-action {
  border-radius: 4px;
}
</style>
