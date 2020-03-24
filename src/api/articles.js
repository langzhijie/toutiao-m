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
// 获取搜索建议点击请求数据

export function getsearch (params) {
  return request({
    url: '/search',
    params // 关键词 及分页信息
  })
}

// 获取文章详情页
export function getArticleInfo (artId) {
  return request({
    url: `/articles/${artId}` // 获取文章详情地址
  })
}

// 获取文章评论或回复
export function getComments (params) {
  return request({
    url: 'comments',
    params // type(是文章的的回复还是回复的回复)  source(来源id)  offset(偏移量 分页依据)
    //  查第二页的数据 传第一页的最后一个id 查第三页的数据  传第二页最后一个id ....
  })
}
