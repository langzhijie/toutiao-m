<template>
  <div class="container">
    <!-- 搜索组件一级路由   返回上一个页面-->
    <van-nav-bar title="搜索中心" left-text="返回" left-arrow @click-left="$router.back()"></van-nav-bar>
    <!-- 搜索组件 -->
    <!-- 搜索关键字绑定 v-model -->
    <!-- 监听搜索事件search -->
    <van-search  @search="onSearch" v-model.trim="q" placeholder="请输入搜索关键词" shape="round" />
    <van-cell-group class="suggest-box" v-if="q">
      <!-- 点击搜索联想跳转到结果页 -->
      <van-cell @click="toResult(item)" icon="search" v-for="(item,index) in suggestion" :key="index">
        {{item}}
      </van-cell>
    </van-cell-group>
    <!-- 历史记录 -->
    <div class="history-box" v-else>
      <!-- 历史记录部分 -->
      <!-- 利用v-if进行判断 如果历史记录数组有值就显示 -->
      <div class="head" v-if="historyList.length">
        <span>历史记录</span>
        <!-- 全部删除历史记录 -->
        <van-icon name="delete"  @click="delAllhistory"></van-icon>
      </div>
      <van-cell-group>
        <!-- 将历史记录进行循环 -->
        <!-- 动态点击事件 跳转到搜索结果 -->
        <van-cell v-for="(item,index) in historyList" :key="index" @click="toResult(item)">
          <!-- 每项历史进行渲染 -->
          <a class="word_btn">{{item}}</a>
          <!-- 点击删除X号进行删除 需要将点击的下标进行传入               stop阻止事件冒泡          -->
          <van-icon class="close_btn" slot="right-icon" name="cross" @click.stop="delhistory(index)" />
        </van-cell>
      </van-cell-group>
    </div>
  </div>
</template>

<script>
// 用来本地存储的历史记录key
import { getSuggestion } from '@/api/articles'
const key = 'toutiao-history'
export default {
  data () {
    return {
      q: '', // 关键字查询
      // 定义历史记录 用key去本地存储中取数据 要是没有数据就给个空数组
      historyList: JSON.parse(localStorage.getItem(key)) || [],
      suggestion: [] // 联想搜索数组
    }
  },
  watch: {
    // 监视data中的q 防抖写法
    // q () {
    //   clearTimeout(this.timer) // 清除定时器
    //   this.timer = setTimeout(async () => {
    //     // q里没值得时候不去发请求
    //     if (!this.q) {
    //       // 将联想数组赋值[]
    //       this.suggestion = []
    //       return
    //     }
    //     // 请求联想建议
    //     const data = await getSuggestion({ q: this.q })
    //     this.suggestion = data.options
    //   }, 300)
    // }

    // 节流写法
    q () {
      if (!this.timer) {
        this.timer = setTimeout(async () => {
          this.timer = null
          if (!this.q) {
          // 将联想数组赋值[]
            this.suggestion = []
            return
          }
          // 请求联想建议
          const data = await getSuggestion({ q: this.q })
          this.suggestion = data.options
        }, 500)
      }
    }

  },
  methods: {
    // 点击联想搜索结果跳到结果页
    toResult (q) {
      this.historyList.push(q) // 搜索结果存入本地
      this.historyList = Array.from(new Set(this.historyList)) // 去重复
      localStorage.setItem(key, JSON.stringify(this.historyList)) // 历史记录从新设置到本地
      this.$router.push({ path: '/search/result', query: { q } }) // 带着参数跳到结果页
    },
    // 删除历史记录的方法
    delhistory (index) {
      this.historyList.splice(index, 1) // 用传入的下标在历史数组中找到删除
      // 同时还要删除本地存储中的数据
      localStorage.setItem(key, JSON.stringify(this.historyList)) // 将删除的数据从新存入本地中去
    },
    // 跳转到搜索结果页
    // toSearchResult (text) {
    //   // 跳转到搜索结果
    //   // this.$router.push('/search/result?q=' + text)
    //   this.$router.push({ path: '/search/result', query: { text } }) // 对象形式的传参
    // },
    // 点击全部删除历史记录
    async delAllhistory () {
      try {
        // 删除前进行询问
        await this.$dialog.confirm({
          title: '提示',
          message: '您确定要删除全部历史记录吗？'

        })
        this.historyList = [] // 将历史数组设置为空
        localStorage.setItem(key, JSON.stringify(this.historyList)) // 从新存入本地
      } catch (error) {

      }
    },
    // 回车搜索
    onSearch () {
      // 在回车跳转前要将搜索内容存入本地
      if (!this.q) return
      this.historyList.push(this.q)// 将搜索记录加入数组
      // set 可以数组去重返回伪数组 需要转化为数组 再赋值给historyList
      this.historyList = Array.from(new Set(this.historyList)) // 去重复
      localStorage.setItem(key, JSON.stringify(this.historyList)) // 设置到本地缓存
      this.$router.push({ path: '/search/result', query: { q: this.q } })
    }
  }
}
</script>

<style lang='less' scoped>
.history-box {
  padding: 0 20px;
  .head {
    line-height: 36px;
    color: #999;
    .van-icon {
      font-size: 16px;
      float: right;
      margin-top: 10px;
    }
  }
  .van-cell {
    padding: 10px 0;
  }
  .word_btn {
    color: #3296fa;
  }
  .close_btn {
    margin-top: 5px;
    color: #999;
  }
}
.suggest-box {
  /deep/ .van-cell {
    padding: 10px 20px;
    color: #999;
    p {
      span {
        color: red;
      }
    }
  }
}
</style>
