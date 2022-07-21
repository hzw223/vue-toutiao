/**
 * 用户相关的请求模块
 */
import request from '@/utils/request'

/**
 * 用户登录
 */
export const login = (data) => {
  return request({
    method: 'POST',
    url: '/v1_0/authorizations',
    data
  })
}
/**
 * 发送短信验证码
 */
export const sendSms = (mobile) => {
  return request({
    method: 'GET',
    url: `/v1_0/sms/codes/${mobile}`
  })
}

/**
 * 获取用户登录信息
 */
export const getCurrentUser = () => {
  return request({
    method: 'GET',
    url: '/v1_0/user'
  })
}

/**
 * 获取用户频道
 */
export const getUserChannels = () => {
  return request({
    method: 'GET',
    url: '/v1_0/user/channels'
  })
}
/**
 * 添加关注
 */
export const addFollow = (userId) => {
  return request({
    method: 'POST',
    url: '/v1_0/user/followings',
    data: {
      target: userId
    }
  })
}

/**
 * 取消关注
 */
export const deleteFollow = (userId) => {
  return request({
    method: 'DELETE',
    url: `/v1_0/user/followings/${userId}`
  })
}
