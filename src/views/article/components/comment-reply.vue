<template>
  <div class="comment-reply">
    <!-- 导航栏 -->
    <van-nav-bar :title="`${comment.reply_count}条回复`">
      <van-icon slot="left" name="cross" @click="$emit('click-close')" />
    </van-nav-bar>
    <!-- /导航栏 -->

    <!-- 当前评论项 -->
    <comment-item :comment="comment" />
    <!-- /当前评论项 -->

    <van-cell title="所有回复" />

    <!-- 评论的回复列表 -->
    <comment-list type="c" :source="comment.com_id" ref="commentList" />
    <!-- /评论的回复列表 -->

    <!-- 底部 -->
    <div class="article-bottom">
      <van-button
        class="comment-btn"
        type="default"
        round
        size="small"
        @click="isPostShow = true"
        >写评论</van-button
      >
    </div>
    <!-- /底部 -->
    <van-popup v-model="isPostShow" position="bottom">
      <comment-post
        :target="comment.com_id"
        :articleId="article_id"
        @post-success="onPostSuccess"
      />
    </van-popup>
  </div>
</template>

<script>
import CommentItem from './comment-item.vue'
import CommentList from './comment-list.vue'
import CommentPost from './comment-post.vue'
export default {
  name: 'CommentReply',
  components: {
    CommentItem,
    CommentList,
    CommentPost
  },
  props: {
    comment: {
      type: Object,
      required: true
    },
    article_id: {
      type: [Number, String, Object],
      require: true
    }
  },
  data() {
    return {
      isPostShow: false
    }
  },
  computed: {},
  watch: {},
  created() {},
  mounted() {
    // console.log('article_id', this.article_id)
    console.log('comment:', this.comment)
  },
  methods: {
    onPostSuccess(comment) {
      // 将发布成功的评论放到评论列表顶部
      this.$refs.commentList.list.unshift(comment)
      // 更新评论的回复数量
      this.comment.reply_count++
      // 关闭发布回复的弹出层
      this.isPostShow = false
    }
  }
}
</script>

<style lang="less" scoped>
.article-bottom {
  position: fixed;
  left: 0;
  right: 0;
  bottom: 0;
  display: flex;
  justify-content: space-around;
  align-items: center;
  box-sizing: border-box;
  height: 44px;
  border-top: 1px solid #d8d8d8;
  background-color: #fff;
  .comment-btn {
    width: 200px;
    height: 23px;
    border: 1px solid #eeeeee;
    font-size: 15px;
    line-height: 23px;
    color: #a7a7a7;
  }
}
</style>
