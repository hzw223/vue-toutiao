<template>
  <div class="search-suggestion">
    <van-cell
      icon="search"
      v-for="(str, index) in suggestions"
      :key="index"
      @click="$emit('search', str)"
    >
      <div slot="title" v-html="highlight(str)"></div>
    </van-cell>
  </div>
</template>

<script>
import { getSuggestions } from '@/api/search'
import { debounce } from 'lodash'
export default {
  name: 'SearchSuggestion',
  components: {},
  props: {
    searchText: {
      type: String,
      required: true
    }
  },
  data() {
    return {
      suggestions: []
    }
  },
  computed: {},
  watch: {
    // // 监视对应的数据
    // searchText(){

    // }
    searchText: {
      // 当数据发生变化，执行handler
      //  lodash 防抖
      handler: debounce(async function () {
        const { data } = await getSuggestions(this.searchText)
        console.log(data)
        this.suggestions = data.data.options
      }, 200),

      immediate: true // 该回调将会在侦听开始之后被立即调用
    }
  },
  created() {},
  mounted() {},
  methods: {
    // 搜索关键词高亮
    highlight(str) {
      const reg = new RegExp(this.searchText, 'gi')
      return str.replace(
        reg,
        `<span style="color: #3296fa">${this.searchText}</span>`
      )
    }
  }
}
</script>

<style scoped lang="less"></style>
