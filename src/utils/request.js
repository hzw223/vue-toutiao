/**
 * 封装 axios 请求模块
 */
import axios from 'axios'
import JSONbig from 'json-bigint'
// 在非组件模块中获取store 必须通过引用的发布方式
// 这里单独加载store,和在组件中this.$store是一个东西
import store from '@/store/'
import { Toast } from 'vant'
import router from '@/router'
const refreshTokenReq = axios.create({
  baseURL: 'http://toutiao.itheima.net/'
})
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
    // console.log('此时user:', user)
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
// 响应拦截器
// 通过响应拦截器处理token过期的情况
// use(两个参数)
request.interceptors.response.use(
  (res) => {
    // 请求成功对响应数据做处理
    // 该返回的数据则是axios.then(res)中接收的数据
    return res
  },
  async (err) => {
    // 超过2xx的状态码会进入这里
    const status = err.response.status
    if (status === 400) {
      Toast.fail('客户端请求参数异常')
    } else if (status === 401) {
      // token 无效
      // 没有user或user.token，说明没有登录，跳转登录
      console.log('没有user或user.token，跳转登录')
      const { user } = store.state
      if (!user || !user.token) {
        // 直接跳转登录页
        return redirectLogin()
      }
      // 使用refresh_token 请求获取新的token
      try {
        // 使用新的axios实例refreshTokenReq来发请求，这样就不会走request这个axios实例的拦截器了
        // 防止如果请求新token失败进入死循环
        const { data } = await refreshTokenReq({
          method: 'PUT',
          url: '/v1_0/authorizations',
          headers: {
            Authorization: `Bearer ${user.refresh_token}`
          }
        })
        // 新token放到vuex容器中
        // console.log(data)
        user.token = data.data.token
        store.commit('setUser', user)
        // 失败的请求重新发出去，这里用的是reques实例
        // 这样就会走request请求拦截器通过store容器访问已经更新的token
        // err.config是本次请求的相关配置对象，再重新发送失败的这次请求，此时用户token更新了，请求就会成功
        return request(err.config)
      } catch (error) {
        // 刷新token失败 重新登录
        redirectLogin()
      }
    } else if (status === 403) {
      Toast.fail('没用操作权限')
    } else if (status >= 500) {
      Toast.fail('服务端异常，请稍后重试')
    }
    // 该返回的数据则是axios.catch(err)中接收的数据
    return Promise.reject(err)
  }
)
// 跳转到登录页，并携带当且路由路径的query参数
function redirectLogin() {
  // replace不会形成历史记录
  router.replace({
    name: 'login',
    // 传递查询参数，查询参数会以？作为分隔符放到url后面
    query: {
      // router.currentRoute 与组件中获取的this.$route是一个东西
      // fullPath当前路由路径
      redirect: router.currentRoute.fullPath
    }
  })
}

export default request
