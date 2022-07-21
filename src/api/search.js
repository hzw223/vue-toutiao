// 文章搜索接口
/**
 * 搜索相关接口模块
 */
import request from '@/utils/request'
/**
 * 获取联想搜索建议
 */
export function getSuggestions(q) {
  return request({
    method: 'GET',
    url: '/v1_0/suggestion',
    params: {
      q // 搜索字符串
    }
  })
}

/**
 * 获取搜索结果
 */
export function getSearch(params) {
  return request({
    method: 'GET',
    url: '/v1_0/search',
    params
  })
}
