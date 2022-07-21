<template>
  <div class="search-container">
    <!-- 搜索栏 -->
    <form action="/">
      <van-search
        v-model="searchText"
        show-action
        clearable
        placeholder="请输入搜索关键词"
        @search="onSearch"
        @cancel="onCancel"
        @focus="isResultShow = false"
      />
    </form>
    <!-- 搜索结果 -->
    <search-result v-if="isResultShow" :q="searchText" />
    <!-- /搜索结果 -->

    <!-- 搜索建议 -->
    <search-suggestion
      v-else-if="searchText"
      :search-text="searchText"
      @search="onSearch"
    />
    <!-- /搜索建议 -->

    <!-- 历史记录 -->
    <search-history v-else :searchHistories="searchHistory" />
    <!-- /历史记录 -->
  </div>
</template>

<script>
import SearchSuggestion from './components/search-suggestion.vue'
import SearchHistory from './components/search-history.vue'
import SearchResult from './components/search-result.vue'
import { getItem, setItem } from '@/utils/storage'
export default {
  name: 'SearchIndex',
  components: {
    SearchSuggestion,
    SearchHistory,
    SearchResult
  },
  props: {},
  data() {
    return {
      searchText: '',
      isResultShow: false,
      searchHistory: getItem('search-history') || []
    }
  },
  computed: {},
  watch: {
    searchHistory(newVal) {
      setItem('search-history', newVal)
    }
  },
  created() {},
  mounted() {},
  methods: {
    // 当search-suggestion子组件发送search信号，并传入str参数，父组件触发onSearch方法
    onSearch(searchText) {
      // 把输入框设置成你要搜索的文本
      this.searchText = searchText
      // 历史记录
      const index = this.searchHistory.indexOf(searchText)
      if (index !== -1) {
        // 删除重复项
        this.searchHistory.splice(index, 1)
      }
      this.searchHistory.unshift(searchText)

      //   展示搜索结果
      this.isResultShow = true
    },
    onCancel() {
      console.log('onCancel')
      this.$router.back()
    }
  }
}
</script>

<style scoped lang="less"></style>
