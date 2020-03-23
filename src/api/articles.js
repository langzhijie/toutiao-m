// 处理文章模块的请求数据

import request from '@/utils/request'

// 获取文章推荐数据
// 还需传入 timestamp 时间戳 和 channel_id频道id
export function getArticles (params) {
  return request({
    url: 'http://ttapi.research.itcast.cn/app/v1_1/articles', // 请求地址文章地址
    // 将固定的置顶设置 和传入的参数合并
    params: { with_top: 1, ...params } // 置顶数据

  })
}
// 不感兴趣文章请求
export function disLikeArticle (data) {
  return request({
    url: '/article/dislikes', // 不喜欢文章的接口地址
    method: 'POST',
    data
  })
}

// 举报文章的请求

export function reportArticle (data) {
  return request({
    url: '/article/reports', // 举报文章的请求地址
    method: 'POST',
    data
  })
}
// 获取搜索建议
export function getSuggestion (params) {
  return request({
    url: '/suggestion', // 获取搜索建议
    params // query参数放置在 params中
  })
}
