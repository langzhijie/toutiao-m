<template>
  <div class='container'>
     <van-nav-bar
  title="登录"
  left-text="返回"
  left-arrow
  @click-left="$router.back()"></van-nav-bar>
  <!--  CellGroup 作为容器来提供外边框 -->
  <van-cell-group>
     <!-- 登录手机号 -->
 <van-field @blur="checkMobile"   :error-message="errormessage.mobile" v-model.trim="loginFrom.mobile"  label="手机号" placeholder="请输入手机号" ></van-field>
   <!-- 验证码 -->
  <van-field  :error-message="errormessage.code"  v-model.trim="loginFrom.code" label="验证码" placeholder="请输入验证码" @blur="checkCode">
     <!-- 验证码按钮 -->
 <van-button slot="button" size="small" type="primary">发送验证码</van-button>
  </van-field>
  </van-cell-group>
  <!-- round 圆形按钮 -->
  <!-- block 块级元素 -->
   <div class="login-button">
  <van-button type="info" block  size="small" round @click="login">登录</van-button>
   </div>

   </div>
</template>

<script>
import { login } from '@/api/user'
import { mapMutations } from 'vuex' // 辅助函数 把mutations方法映射到methods方法中
export default {
  data () {
    return {
      //  表单数据
      loginFrom: {
        mobile: '13911111111', // 手机号
        code: '246810'// 验证码
      },
      // 错误信息的提示
      errormessage: {
        mobile: '', // 手机号消息提示
        code: ''// 验证码消息提示
      }
    }
  },
  methods: {
    // 可以导入需要的方法 直接把updataUser方法映射到当前的methods方法
    ...mapMutations(['updateUser']),

    //   校验手机号的方法
    checkMobile () {
      if (!this.loginFrom.mobile) {
        // 表示为空
        this.errormessage.mobile = '手机号不能为空'
        // 此时表示没有不要再往下进行了
        return false // 返回一个false  false表示 此轮校验没通过 如果通过了 返回true
      }
      // 手机号校验第二轮校验格式
      // 如果拿到的手机号不满足正则表达式取反进入if给出错误提示
      if (!/^1[3-9]\d{9}$/.test(this.loginFrom.mobile)) {
        this.errormessage.mobile = '手机号格式不正确'
        return false
      }
      // 能到这来表示手机号通过验证
      this.errormessage.mobile = ''
      return true
    },
    //  校验验证码
    checkCode () {
      if (!this.loginFrom.code) {
        this.errormessage.code = '验证码不能为空'
        return false
      }
      if (!/^\d{6}$/.test(this.loginFrom.code)) {
        this.errormessage.code = '验证码格式不正确'
        return false
      }
      this.errormessage.code = ''
      return true
    },
    //  点击登录验证表单
    async login () {
      const validateMobile = this.checkMobile() // 手机号
      const validateCode = this.checkCode()// 验证码
      // 这里进行判断两个方法 是否都通过
      // 定义定量来判断 因为&&号有一个通过他就不做提示了
      // 所以用变量来定义
      if (validateMobile && validateCode) {
        // console.log('校验通过')
        // 验证通过后  发请求去登录
        // 需要传入用户的手机号和验证码
        try {
          const result = await login(this.loginFrom)

          // 拿到了token后 设置给vuex中的state
          //  this.store.commit('')
          this.updateUser({ user: result }) // 更新当前的token和refresh_token
          // 跳转到主页  如果有之前的401错误 保存的地址登录后还要跳回保存的地址
          // 判断有没有query参数 要是有就跳到哪里  没有跳到主页
          const { redirectUrl } = this.$route.query // 也就是?号的参数
          this.$router.push(redirectUrl || '/') // 有值就跳哪里 没值就跳/
        } catch (error) {
          // 告诉用户登录失败
          this.$notify({ message: '用户名或者验证码错误', duration: 5000 })
        }
      }
    }
  }

}
</script>

<style lang="less" scoped>
.login-button{
   padding:10px 10px;
}

</style>
