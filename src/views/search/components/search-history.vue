<template>
  <div class="search-history">
    <van-cell title="搜索历史">
      <div v-if="isDelete">
        <span @click="deleteAllHistories()">全部删除</span>
        &nbsp;&nbsp;
        <span @click="isDelete = false">完成</span>
      </div>
      <van-icon name="delete" v-else @click="isDelete = true" />
    </van-cell>
    <van-cell
      :title="text"
      v-for="(text, index) in searchHistories"
      :key="index"
    >
      <van-icon
        name="close"
        v-show="isDelete"
        @click="deleteHistories(text, index)"
      />
    </van-cell>
  </div>
</template>

<script>
import { setItem } from '@/utils/storage'
export default {
  name: 'SearchHistory',
  components: {},
  props: {
    searchHistories: {
      type: Array,
      required: true
    }
  },
  data() {
    return {
      isDelete: false
    }
  },
  computed: {},
  watch: {},
  created() {},
  mounted() {},
  methods: {
    deleteHistories(text, index) {
      this.searchHistories.splice(index, 1)
    },
    deleteAllHistories() {
      this.$dialog
        .confirm({
          title: '删除全部',
          message: '确认删除全部吗？'
        })
        .then(() => {
          // on confirm
          this.searchHistories = []
          setItem('search-history', this.searchHistories)
        })
        .catch(() => {
          // on cancel
        })
    }
  }
}
</script>

<style scoped lang="less"></style>
