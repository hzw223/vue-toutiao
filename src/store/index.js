import Vue from 'vue'
import Vuex from 'vuex'
import { setItem, getItem } from '@/utils/storage'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    user: getItem('user') // 从本地存储中获取当前用户的登录状态
  },
  mutations: {
    setUser(state, data) {
      state.user = data

      // 为了防止刷新丢失 state 中的 user 状态，我们把它放到本地存储
      setItem('user', state.user)
    }
  },
  actions: {},
  modules: {}
})
