// 此文件设置 文章的操作的请求

import request from '@/utils/request'
// 获取文章的频道
export function getMyChannels () {
  return request({
    url: '/user/channels' // 获取文章列表的地址

  })
}
