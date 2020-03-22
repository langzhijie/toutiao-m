// 此文件设置 文章的操作的请求
import store from '@/store' // 游客的key

import request from '@/utils/request'
const CACHE_CHANNEL_V = 'hm-94-toutiao-v' // 登录用户的key
const CACHE_CHANNEL_T = 'hm-94-toutiao-t' // 游客用户的key

// 获取文章的频道
// 在获取我的频道时 不管游客还是用户都可以获取 所以要进行本地存储
export function getMyChannels () {
  // return request({
  //   url: '/user/channels' // 获取文章列表的地址
  // })

  // 同token来检查是用户还是游客
  return new Promise(function (resolve, reject) {
    //   本地化缓存  要区分当前是登录用户还是游客用户 如何登录还是游客  可以根据当前有没有token 来判断 是否是登录
    const key = store.state.user.token ? CACHE_CHANNEL_V : CACHE_CHANNEL_T
    // 去缓存中读取 用户的频道数据
    const str = localStorage.getItem(key) // 通过缓存key 获取缓存中的用户频道信息
    if (str) {
      // 有本地缓存数据 就把本地数据进行释放
      resolve({ channels: JSON.parse(str) })
    } else {
      // 没有本地缓存的数据 就要通过请求进行拉取
      request({ url: '/user/channels' }).then(res => {
        // 将拉取的频道 存入本地
        localStorage.setItem(key, JSON.stringify(res.channels))

        resolve(res) // 表示直接成功执行了 获取用户频道
      })
    }
  })
}
// 获取全部的文章频道
export function getAllChannels () {
  return request({
    url: '/channels' // 请求全部文章频道的方法
  })
}

// 删除文章频道的请求
// 需要传入要删除的频道id
export function delChannel (id) {
  return new Promise(function (resolve, reject) {
    // 有id 就可以直接从缓存中删除对应id的数据
    // 删除频道时 无论如何都有数据的
    const key = store.state.user.token ? CACHE_CHANNEL_V : CACHE_CHANNEL_T // key根据当前的登录状态来判断
    const channels = JSON.parse(localStorage.getItem(key)) // 直接将本地缓存中的字符串转化成对象
    // // 第一种
    // // 直接用filter删除  直接返回一个新数组 返回不等于id的内容
    // // eslint-disable-next-line no-const-assign
    // channels = channels.filter(item => item.id !== id) // 得到一个新数组
    // // 应该重新写入缓存
    // localStorage.setItem(key, JSON.stringify(channels))
    // // console.log(channels)

    // 第二种方法
    // 如果id相同就找到 频道的下标
    const index = channels.findIndex(item => item.id === id)

    if (index > -1) {
      // 在数组中删除
      channels.splice(index, 1)
      // 存入本地
      localStorage.setItem(key, JSON.stringify(channels))

      resolve()
    } else {
      reject(new Error('没有找到对应的频道'))
    }
  })
}
