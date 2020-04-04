<template>
  <!-- 用户模块 -->
  <div class="container">
    <div class="user-profile">
      <div class="info">
        <!-- 头像 -->
        <van-image round :src="UserInfo.photo" />
        <h3 class="name">
          <!-- 用户名 -->
         {{UserInfo.name}}
          <br />
          <van-tag size="mini">申请认证</van-tag>
        </h3>
      </div>
      <van-row>
        <van-col span="8">
          <p>{{UserInfo.art_count}}</p>
          <p>动态</p>
        </van-col>
        <van-col span="8">
          <p>{{UserInfo.follow_count}}</p>
          <p>关注</p>
        </van-col>
        <van-col span="8">
          <p>{{UserInfo. fans_count}}</p>
          <p>粉丝</p>
        </van-col>
      </van-row>
    </div>
    <van-row class="user-links">
      <van-col span="8">
        <van-icon name="newspaper-o" color="#7af" />我的作品
      </van-col>
      <van-col span="8">
        <van-icon name="star-o" color="#f00" />我的收藏
      </van-col>
      <van-col span="8">
        <van-icon name="tosend" color="#fa0" />阅读历史
      </van-col>
    </van-row>

    <van-cell-group class="user-group">
      <van-cell icon="edit" title="编辑资料" to="/user/profile" is-link />
      <van-cell icon="chat-o" title="小智同学" to="/user/chat" is-link />
      <van-cell icon="setting-o" title="系统设置" is-link />
      <van-cell icon="warning-o" title="退出登录" @click="lgout" is-link />
    </van-cell-group>
  </div>
</template>

<script>
import { getUserInfo } from '@/api/user' // 获取用户自己的信息
import { mapMutations } from 'vuex'
export default {
  data () {
    return {
      UserInfo: [] // 存放用户个人信息的数组
    }
  },
  methods: {
    ...mapMutations(['delUser', 'updataPhoto']), // uodatePhoto更新用户头像
    // 退出登录
    async lgout () {
      try {
        await this.$dialog.confirm({
          messages: '您确定要退出吗？'
        })
        this.delUser() // 点击确定之后调用vuex中删除token的方法
        this.$router.push('/login') // 跳到登录页
      } catch (error) {
        // 退出失败
      }
    },
    // 获取用户个人资料
    async getUseerInfo () {
      this.UserInfo = await getUserInfo() // 调用获取用户个人信息的方法
      this.updataPhoto({ photo: this.UserInfo.photo }) // 设置用户头像
    }

  },
  created () {
    this.getUseerInfo() // 自调用获取用户的信息
  }
}
</script>

<style lang="less" scoped>
.user {
  &-profile {
    width: 100%;
    height: 150px;
    display: block;
    background: #3296fa;
    color: #fff;
    .info {
      display: flex;
      padding: 20px;
      align-items: center;
      .van-image{
        width: 64px;
        height: 64px;
      }
      .name {
        font-size: 16px;
        font-weight: normal;
        margin-left: 10px;
      }
      .van-tag {
        background: #fff;
        color: #3296fa;
      }
    }
    p{
      margin: 0;
      text-align: center;
    }
  }
  &-group {
    margin-bottom: 15px;
  }
  &-links {
    padding: 15px 0;
    font-size: 12px;
    text-align: center;
    background-color: #fff;
    .van-icon {
      display: block;
      font-size: 24px;
      padding-bottom: 5px;
    }
  }
}

</style>
