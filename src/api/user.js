// 此文件专门处理 用户相关的请求
import request from '@/utils/request' // 引入请求模块
// request 相当于 axios 的一个实例 和axios有同样的方法和属性

// 导出登录的方法
export function login (data) {
  return request({
    url: '/authorizations', // 请求登录地址
    method: 'POST',
    data // 请求参数 用户的信息

  })
//   返回一个promise对象
}

// 关注用户的方法
export function followUser (data) {
  return request({
    url: '/user/followings', // 关注用户的请求地址
    method: 'POST',
    data
  })
}

// 取消关注用户的方法
export function unfollowUser (autid) {
  return request({
    url: `/user/followings/${autid}`, // 取消关注的请求
    method: 'DELETE'

  })
}

/**
 * 获取用户自己的信息 粉丝数等
 *
 */
export function getUserInfo (params) {
  return request({
    url: '/user' // 获取用户信息的地址
  })
}

/****
 * 获取用户的个人资料
 *
 * ***/
export function getUserProfile () {
  return request({
    url: '/user/profile'
  })
}

// 修改头像
export function updatePhoto (data) {
  return request({
    url: '/user/photo',
    method: 'patch',
    data // body参数
  })
}
