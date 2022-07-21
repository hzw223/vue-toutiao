<template>
  <div class="article-list">
    <van-pull-refresh v-model="isRefreshLoading" @refresh="onRefresh">
      <van-list
        v-model="loading"
        :finished="finished"
        finished-text="没有更多了"
        @load="onLoad"
      >
        <article-item
          v-for="(article, index) in list"
          :key="index"
          :article="article"
        />
      </van-list>
    </van-pull-refresh>
  </div>
</template>

<script>
import { getArticles } from '@/api/article'
import ArticleItem from '@/components/article-item'
export default {
  name: 'ArticleList',
  components: {
    ArticleItem
  },
  props: {
    channel: {
      type: Object,
      required: true
    }
  },
  data() {
    return {
      list: [], // 数据列表
      loading: false, // 控制加载中的loading状态
      finished: false, // 控制加载结束的状态，当加载结束，不再触发加载更多
      timestamp: null, // 请求下一页的时间戳
      isRefreshLoading: false // 下拉刷新
    }
  },
  computed: {},
  watch: {},
  created() {},
  mounted() {},
  methods: {
    async onLoad() {
      // 异步更新数据
      //   1获取数据
      const { data } = await getArticles({
        channel_id: this.channel.id,
        timestamp: this.timestamp || Date.now() // this.timestamp获取下一页数据的时间戳，Date.now() 表示获取当前最新数据
      })
      //   2将数据放到list数组中
      const { results } = data.data
      this.list.push(...results) // 将results数组合并到list中
      // 3设置本次加载状态结束
      this.loading = false
      // 4数据全部加载完成
      if (results.length) {
        // 更新获取下一页数据的页码
        this.timestamp = data.data.pre_timestamp
      } else {
        // 没有数据就将加载状态设置为结束
        this.finished = true
      }
    },
    async onRefresh() {
      // 1. 请求获取最新数据
      const { data } = await getArticles({
        channel_id: this.channel.id,
        timestamp: Date.now() // 获取最新数据传递当前最新时间戳即可
      })
      // 2. 把数据放到列表的顶部
      const results = data.data.results
      this.list.unshift(...results)
      // 3. 停止下拉刷新的转圈圈
      this.isRefreshLoading = false
      // 4. 提示用户刷新成功
      const message = results.length
        ? `更新了${results.length}条数据`
        : '暂无数据更新'
      this.$toast(message)
    }
  }
}
</script>

<style scoped lang="less">
.article-list {
  position: fixed;
  left: 0;
  right: 0;
  bottom: 50px;
  top: 90px;
  overflow-y: auto;
}
</style>
