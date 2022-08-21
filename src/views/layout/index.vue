<template>
  <div class="layout-container">
    <!-- 子路由出口 -->
    <keep-alive>
      <!-- 这里加keep-alive 是因为这是首页的路由出口 -->
      <router-view />
    </keep-alive>
    <!-- /子路由出口 -->

    <!-- 底部导航栏 -->
    <van-tabbar v-model="active" route>
      <van-tabbar-item name="home" icon="home-o" to="/home"
        >首页</van-tabbar-item
      >
      <van-tabbar-item name="comment" icon="comment-o" to="/qa"
        >问答</van-tabbar-item
      >
      <van-tabbar-item name="video" icon="video-o" to="/video"
        >视频</van-tabbar-item
      >
      <van-tabbar-item name="manager" icon="manager-o" to="/my"
        >我的</van-tabbar-item
      >
    </van-tabbar>
    <!-- /底部导航栏 -->
  </div>
</template>

<script>
export default {
  name: 'LayoutIndex',
  components: {},
  props: {},
  data() {
    return {
      active: 'home'
    }
  },
  computed: {},
  watch: {},
  created() {},
  mounted() {
    // 渲染完成后，再重新添加缓存
    this.$store.commit('addCachePage', 'LayoutIndex')
  },
  methods: {}
}
</script>

<style scoped lang="less"></style>
