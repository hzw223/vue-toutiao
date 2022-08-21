<template>
  <div class="comment-post">
    <van-field
      class="post-field"
      v-model.trim="message"
      rows="2"
      autosize
      type="textarea"
      maxlength="50"
      placeholder="请输入留言"
      show-word-limit
      clearable
    />
    <van-button class="post-btn" @click="onAddComment" :disabled="!message"
      >发布</van-button
    >
  </div>
</template>

<script>
import { addComment } from '@/api/comment'
export default {
  name: 'CommentPost',
  components: {},
  props: {
    target: {
      type: [Number, String, Object],
      require: true
    },
    articleId: {
      type: [Number, String, Object],
      default: null
    }
  },
  data() {
    return {
      message: ''
    }
  },
  computed: {},
  watch: {},
  created() {},
  mounted() {},
  methods: {
    async onAddComment() {
      // 非空校验
      if (!this.message.length) {
        return
      }
      this.$toast.loading({
        duration: 0, // 持续展示 toast
        message: '发布中...',
        forbidClick: true // 是否禁止背景点击
      })
      console.log(this.target.toString(), this.message, this.articleId)
      try {
        const { data } = await addComment({
          target: this.target.toString(), // 评论文章即为文章id，对评论进行回复则为评论id
          cotent: this.message, // 评论的内容
          art_id: this.articleId ? this.articleId.toString() : null // 回复评论时要传，评论文章时不用传
        })
        console.log(data)
        this.$emit('post-success', data.data.new_obj) // 将接收的数据传给父组件
        // 清空文本框
        this.message = ''
        this.$toast.success('发布成功')
      } catch (error) {
        console.log(error)
        this.$toast.fail('发布失败')
      }
    }
  }
}
</script>

<style scoped lang="less">
.comment-post {
  display: flex;
  align-items: center;
  padding: 32px 0 32px 32px;
  .post-field {
    background-color: #f5f7f9;
  }
  .post-btn {
    width: 150px;
    border: none;
    padding: 0;
    color: #6ba3d8;
    &::before {
      display: none;
    }
  }
}
</style>
