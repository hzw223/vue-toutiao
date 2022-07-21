import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'

import './utils/vant'
import './styles/index.less'
// 执行lib-flexible 动态设置rem基准值
import 'amfe-flexible'
import './utils/dayjs'
Vue.config.productionTip = false

new Vue({
  router,
  store,
  render: (h) => h(App)
}).$mount('#app')
