<template>
  <div class="article-comments">
    <!-- 评论列表 -->
    <van-list
      v-model="loading"
      :finished="finished"
      finished-text="没有更多了"
      @load="onLoad"
    >
      <van-cell v-for="item in list" :key="item.com_id.toString()">
        <van-image
          slot="icon"
          round
          width="30"
          height="30"
          style="margin-right: 10px"
          :src="item.aut_photo"
        />
        <span style="color: #466b9d" slot="title">{{ item.aut_name }}</span>
        <div slot="label">
          <p style="color: #363636">{{ item.content }}</p>
          <p>
            <span style="margin-right: 10px">{{
              item.pubdate | relativeTime
            }}</span>
            <van-button size="mini" type="default" @click="onReply(item)"
              >回复{{ item.reply_count }}</van-button
            >
          </p>
        </div>
        <div>
          <van-icon
            slot="right-icon"
            :name="item.is_liking ? 'good-job' : 'good-job-o'"
            @click="onCommentLike(item)"
          />
          <span class="like-count">{{ item.like_count }}</span>
        </div>
      </van-cell>
    </van-list>
    <!-- 评论列表 -->
    <!-- 发布评论 -->
    <!-- <van-cell-group class="publish-wrap">
      <van-field clearable placeholder="请输入评论内容">
        <van-button slot="button" size="mini" type="info" @click="postComment">发布</van-button>
      </van-field>
    </van-cell-group> -->
    <!-- /发布评论 -->
  </div>
</template>

<script>
import { getComments, addCommentLike, deleteCommentLike } from '@/api/comment'
export default {
  name: 'ArticleComment',
  props: {
    // 源id，文章id或评论id
    source: {
      type: [Number, String, Object],
      required: true
    },
    // 评论类型，a-对文章(article)的评论，c-对评论(comment)的回复
    type: {
      type: String,
      default: 'a'
    }
  },
  data() {
    return {
      list: [], // 评论列表
      loading: false, // 上拉加载更多的 loading
      finished: false, // 是否加载结束
      offset: null, // 请求下一页数据的页码
      totalCount: 0 // 总数据条数
    }
  },
  mounted() {
    console.log(this.list)
  },
  methods: {
    async onLoad() {
      // 获取数据
      const { data } = await getComments({
        type: this.type, // 评论类型，a-对文章(article)的评论，c-对评论(comment)的回复
        source: this.source.toString(), // 源id，文章id或评论id
        offset: this.offset, // 获取评论数据的偏移量，值为评论id，表示从此id的数据向后取，不传表示从第一页开始读取数据
        limit: 10 // 每页大小
      })

      // 将评论数量传给父组件
      this.$emit('update-total-count', data.data.total_count)
      // 更新数据
      const { results } = data.data
      console.log(results)
      this.list.push(...results)
      this.totalCount = data.data.totalCount
      // 加载状态结束
      this.loading = false
      // 数据全部加载完成
      if (results.length) {
        this.offset = data.data.last_id // 更新获取下一页数据的页码
      } else {
        this.finished = true // 没有数据了，关闭加载更多
      }
    },
    async onCommentLike(comment) {
      // 如果已经赞了则取消点赞
      if (comment.is_liking) {
        await deleteCommentLike(comment.com_id)
      } else {
        // 如果没有赞，则点赞
        await addCommentLike(comment.com_id)
      }

      // 更新视图状态
      comment.is_liking = !comment.is_liking
      // this.$toast('操作成功')
    },
    onReply(item) {
      // console.log('item', item)
      // 将当前评论数据传给父组件
      this.$emit('comment-reply', item)
    }
  }
}
</script>

<style scoped lang="less">
.publish-wrap {
  position: fixed;
  left: 0;
  bottom: 0;
  width: 100%;
}

.van-list {
  margin-bottom: 45px;
}
.like-count {
  font-size: 14px;
}
</style>
