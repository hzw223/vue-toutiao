<template>
  <div class="home-container">
    <!-- 导航栏 -->
    <van-nav-bar class="app-nav-bar">
      <van-button
        slot="title"
        class="search-btn"
        round
        type="info"
        size="small"
        icon="search"
        to="/search"
        >搜索</van-button
      >
    </van-nav-bar>
    <!-- /导航栏 -->

    <!-- 标签组件只有在第一次查看标签的时候才会渲染里面的内容 -->
    <!-- 文章频道列表栏 -->
    <van-tabs v-model="active" class="channel-tabs">
      <van-tab
        v-for="channel in channels"
        :key="channel.id"
        :title="channel.name"
      >
        <!-- 3 文章列表组件 使用 -->
        <article-list :channel="channel" />
        <!-- /文章列表 -->
      </van-tab>
      <!-- 它默认会把你写的其它内容渲染到内容的底部 -->
      <div slot="nav-right" class="van-tab" style="flex: 0 0 8%"></div>
      <van-icon
        slot="nav-right"
        class="wap-nav"
        name="wap-nav"
        @click="isChannelEditShow = true"
      />
    </van-tabs>
    <!-- /文章频道列表栏 -->
    <!-- 页面弹出层 -->
    <van-popup
      v-model="isChannelEditShow"
      position="bottom"
      class="channel-edit-popup"
      closeable
      close-icon-position="top-left"
      get-container="body"
      style="height: 100%"
    >
      <!-- 模板中的event表示事件参数，即子组件传递给父组件的参数 -->
      <channel-edit
        :user-channels="channels"
        :active="active"
        @update-active="active = $event"
        @close="isChannelEditShow = false"
      />
    </van-popup>
    <!-- /页面弹出层 -->
  </div>
</template>

<script>
import { getUserChannels } from '@/api/user'
// 1 文章列表组件加载
import ArticleList from './components/article-list.vue'
// 频道编辑组件加载
import ChannelEdit from './components/channel-edit'
import { mapState } from 'vuex'
import { getItem } from '@/utils/storage'
export default {
  name: 'homeIndex',
  components: {
    // 2 文章列表组件注册
    ArticleList,
    ChannelEdit
  },
  props: {},
  data() {
    return {
      active: 0,
      channels: [],
      isChannelEditShow: false
    }
  },
  computed: {
    ...mapState(['user'])
  },
  watch: {},
  created() {
    this.loadChannels()
  },
  mounted() {},
  methods: {
    async loadChannels() {
      let channels = []
      if (this.user) {
        // 已登录，获取线上的用户频道
        const { data } = await getUserChannels()
        // console.log(data)
        channels = data.data.channels
      } else {
        // 没有登录
        const localChannels = getItem('user-channels')
        // 如果有本地存储的频道，则使用本地存储的频道列表数据
        if (localChannels) {
          channels = localChannels
        } else {
          // 没有本地存储,获取默认推荐的频道列表
          // console.log('没有本地存储,获取默认推荐的频道列表')
          const { data } = await getUserChannels()
          // console.log(data)
          channels = data.data.channels
        }
      }
      this.channels = channels
    }
  }
}
</script>

<style scoped lang="less">
.home-container {
  /deep/ .van-nav-bar__title {
    max-width: none;
  }
  .search-btn {
    width: 277px;
    height: 32px;
    background: #5babfb;
    border: none;
    .van-icon {
      font-size: 16px;
    }
    .van-button__text {
      font-size: 14px;
    }
  }
  .channel-tabs {
    .wap-nav {
      position: fixed;
      right: 0;
      background-color: #fff;
      opacity: 0.8;
      font-size: 26px;
      line-height: 43px;
    }
    /deep/ .van-tab {
      border-right: 1px solid #edeff3;
      border-bottom: 1px solid #edeff3;
    }
    /deep/.van-tabs__line {
      width: 15px !important;
      height: 3px;
      background-color: #3296fa;
      bottom: 20px;
    }
  }
}
</style>
