<template>
<!-- 编辑资料组件 -->
  <div class='container'>
     <van-nav-bar
  title="编辑资料"
  left-text="返回"
  left-arrow
  right-text="保存"
  @click-left="$router.back()"
  @click-right="saveUserInfo"

></van-nav-bar>
  <van-cell-group>
      <van-cell is-link title="头像"  center>
        <van-image
          slot="default"
          width="1.5rem"
          height="1.5rem"
          fit="cover"
          round
          @click="showPhoto=true"
          :src="user.photo"
        />
      </van-cell>
      <van-cell is-link title="名称"  @click="showName=true" :value="user.name" />
      <van-cell is-link title="性别"   @click="showGender=true" :value="user.gender===1?'女':'男'"/>
      <van-cell is-link title="生日"  @click="showData" :value="user.birthday" />
    </van-cell-group>
    <!-- 弹层组件 -->
    <!-- 头像弹层 -->
    <van-popup v-model="showPhoto" style="width:80%">
      <!-- 内容 -->
      <!-- 1 本地相册选择图片 -->
      <!-- 2 拍照 -->
       <van-cell is-link title="本地相册选择图片" @click="openPhoto"></van-cell>
       <van-cell is-link title="拍照"></van-cell>
    </van-popup>

    <!-- 昵称弹层 -->
     <!-- 弹昵称 -->
      <!-- 点击背景关闭弹窗 功能被禁用掉 close-on-click-overlay  -->
    <van-popup  v-model="showName" style="width:80%" :close-on-click-overlay="false">
       <!-- 编辑用户昵称  双向绑定用户的昵称-->
       <van-field :error-message="nameMessage" v-model="user.name" type='textarea'  rows="4"></van-field>
        <!-- 放置一个按钮来关闭弹层-->
        <!-- 按钮设置成块级元素 block -->
        <van-button type="info" size="large" block @click="closeName">确定</van-button>
    </van-popup>

    <!-- 性别弹层 -->
    <!-- select选中选项会触发 -->
    <van-action-sheet @select="selectItem" :actions="actions" v-model="showGender" cancel-text="取消"></van-action-sheet>

   <!-- 生日弹层 -->
      <van-popup v-model="showBirthDay" position="bottom">
      <!-- 选择出生日期  出生日期应该小于现在时间-->
      <!-- type表示 当前的日期类型 年月日 -->
      <!--  @cancel 是日历组件的关闭事件 -->
      <!-- confirm是完成事件 -->
      <van-datetime-picker
           v-model="currentDate"
           type="date"
          :min-date="minDate"
          :max-date="maxDate"
          @cancel="showBirthDay=false"
          @confirm="confirmDate"
         />

    </van-popup>
      <!-- 点击头像出现的上传头像 -->
      <!-- ref可以获取对象 -->
         <input ref="myfile" @change="upload()" type="file" style="display:none">
  </div>
</template>

<script>
import dayjs from 'dayjs' // 日期格式
import { getUserProfile, updatePhoto, saveUserInfo } from '@/api/user' // 获取用户个人信息 上传头像 修改信息
export default {
  data () {
    return {
      showPhoto: false, // 设置头像弹窗的显示隐藏
      showName: false, // 设置昵称弹层的显示隐藏
      showGender: false, // 设置性别弹层的显示隐藏
      showBirthDay: false, // 设置生日弹层的显示隐藏
      actions: [{ name: '男' }, { name: '女' }], // 关于性别数据
      minDate: new Date(1900, 1, 1), // 最小时间
      maxDate: new Date(), // 生日最大时间 永远是小于等于当前时间的
      currentDate: new Date(), // 当前时间
      nameMessage: '', // 用户的姓名输入框的值
      // 放置个人资料信息
      user: {
        name: '', // 用户昵称
        gender: 1, // 性别默认值1是女 0是男
        birthday: '', // 生日默认值
        photo: '' // 用户头像
      }
    }
  },
  methods: {
    //   关闭姓名弹层
    closeName () {
      if (this.user.name.length < 1 || this.user.name.length > 7) {
        this.nameMessage = '用户名应保持在1到7个字符'
        return
      }
      this.nameMessage = '' // 清空输入框
      this.showName = false // 关闭姓名弹层
    },
    //  性别弹层的控制
    selectItem (item, index) {
      this.user.gender = index // 将点击的性别下标赋值给user中定义的
      this.showGender = false // 关闭性别弹层
    },
    //  显示生日弹层
    showData () {
      this.showBirthDay = true // 打开生日弹层
      this.currentDate = new Date(this.user.birthday) // 将日期改变成正确格式
    },
    //  确认日期
    confirmDate () {
      this.user.birthday = dayjs(this.currentDate).format('YYYY-MM-DD') // 将date类型转化成字符串
      this.showBirthDay = false // 关闭弹层
    },
    //  获取用户个人信息
    async getUserInfo () {
      const data = await getUserProfile()
      this.user = data // 赋值给user
    },
    //  修改头像打开文件
    openPhoto () {
      this.$refs.myfile.click() // 打开文件对话框
    },
    //  上传头像
    async upload (params) {
      // console.dir(this.$refs.myfile.files[0])

      const data = new FormData()
      data.append('photo', this.$refs.myfile.files[0])
      const res = await updatePhoto(data)
      this.user.photo = res.photo
      this.showPhoto = false
    },
    //  保存修改信息
    async saveUserInfo () {
      try {
        await saveUserInfo(this.user)
        this.$lnotify({ type: 'success', message: '保存成功' })
      } catch (error) {
        this.$lnotify({ message: '保存失败' })
      }
    }
  },
  created () {
    //   调用获取用户信息的方法
    this.getUserInfo()
  }

}
</script>

<style>

</style>
