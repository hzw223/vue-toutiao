/**
 * 封装 axios 请求模块
 */
import axios from 'axios'
import JSONbig from 'json-bigint'
// 在非组件模块中获取store 必须通过引用的发布方式
// 这里单独加载store,和在组件中this.$store是一个东西
import store from '@/store/'

const request = axios.create({
  baseURL: 'http://toutiao.itheima.net/', // 基础路径
  // transformResponse 允许自定义原始的响应数据（字符串）
  transformResponse: [
    function (data) {
      try {
        // 如果转换成功则返回转换的数据结果
        // 后端返回的数据如果超过 JS 安全整数范围，json-bigint 会把超出 JS 安全整数范围的数字转为一个 BigNumber 类型的对象，
        // 对象数据是它内部的一个算法处理之后的，我们要做的就是在使用的时候转为字符串来使用。
        return JSONbig.parse(data)
      } catch (err) {
        // 如果转换失败，则包装为统一数据格式并返回
        return {
          data
        }
      }
    }
  ]
})
// 请求拦截器
// 通过请求拦截器来添加请求头
request.interceptors.request.use(
  function (config) {
    const user = store.state.user
    if (user) {
      config.headers.Authorization = `Bearer ${user.token}`
    }
    // Do something before request is sent
    return config
  },
  function (error) {
    // Do something with request error
    return Promise.reject(error)
  }
)

export default request
