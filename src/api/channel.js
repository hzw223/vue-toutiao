/**
 * 所有频道数据接口
 */
import request from '@/utils/request'
/**
 * 获取所有频道
 */
export function getAllChannels() {
  return request({
    method: 'GET',
    url: '/v1_0/channels'
  })
}
/**
 * 添加频道
 */
export function addChannel(data) {
  return request({
    method: 'PATCH',
    url: '/v1_0/user/channels',
    data
  })
}

/**
 * 删除频道
 */
export const deleteUserChannel = (channelId) => {
  return request({
    method: 'DELETE',
    url: `/v1_0/user/channels/${channelId}`
  })
}
