<template>
  <div class="channel-edit">
    <van-cell title="我的频道" :border="false" class="channel-title">
      <van-button
        size="mini"
        round
        type="danger"
        plain
        @click="isEdit = !isEdit"
        >{{ isEdit ? '完成' : '编辑' }}</van-button
      >
    </van-cell>
    <van-grid :gutter="10">
      <!-- :class="{ active: index === 激活的频道 }"让当前的频道高亮 -->
      <van-grid-item
        class="channel-item"
        :class="{ active: index === active }"
        :icon="isEdit && index !== 0 ? 'clear' : ''"
        v-for="(channel, index) in userChannels"
        :key="index"
        :text="channel.name"
        @click="onUserChannelClick(channel, index)"
      />
    </van-grid>
    <van-cell title="频道推荐" :border="false" class="channel-title"></van-cell>
    <van-grid :gutter="10">
      <van-grid-item
        class="channel-item"
        v-for="(channel, index) in recommendChannels"
        :key="index"
        :text="channel.name"
        @click="onAddChannel(channel)"
      />
    </van-grid>
  </div>
</template>

<script>
import { getAllChannels, addChannel, deleteUserChannel } from '@/api/channel'
import { setItem } from '@/utils/storage'
import { mapState } from 'vuex'
export default {
  name: 'ChannelEdit',
  components: {},
  props: {
    userChannels: {
      type: Array,
      required: true
    },
    active: {
      type: Number,
      required: true
    }
  },

  data() {
    return {
      allChannels: [], // 所有频道
      isEdit: false // 是否编辑
    }
  },
  computed: {
    recommendChannels() {
      return this.allChannels.filter((channel) => {
        // 所有频道 - 用户频道 = 推荐频道
        return !this.userChannels.find((userChannels) => {
          return userChannels.id === channel.id
        })
      })
    },
    ...mapState(['user'])
  },
  watch: {},
  created() {
    this.loadAllChannels()
  },
  mounted() {},
  methods: {
    async loadAllChannels() {
      const { data } = await getAllChannels()
      this.allChannels = data.data.channels
    },
    onUserChannelClick(channel, index) {
      if (this.isEdit) {
        // 执行删除操作
        this.deleteChannel(channel, index)
      } else {
        // 执行频道跳转
        // console.log('执行频道跳转')
        this.switchChannel(index)
      }
    },
    async deleteChannel(channel, index) {
      // 删除频道
      //  如果删除的是当前激活频道之前的频道
      if (index <= this.active) {
        this.$emit('update-active', this.active - 1)
      }
      this.userChannels.splice(index, 1)
      // 数据持久化
      if (this.user) {
        console.log('线上删除')
        // 登录了，数据存储到线上
        await deleteUserChannel(channel.id)
      } else {
        setItem('user-channels', this.userChannels)
      }
    },
    switchChannel(index) {
      // 点击切换频道
      //   console.log('切换频道')
      //   子组件向父组件发送切换频道信号
      this.$emit('update-active', index)
      //   子组件向父组件发送关闭遮罩层信号
      this.$emit('close')
    },
    async onAddChannel(channel) {
      this.userChannels.push(channel)
      //   数据持久化
      if (this.user) {
        console.log('线上存储')
        // 登录了，数据存储到线上
        await addChannel({
          channels: [
            {
              id: channel.id,
              seq: this.userChannels.length
            }
          ]
        })
      } else {
        console.log('本地存储')
        setItem('user-channels', this.userChannels)
      }
    }
  }
}
</script>

<style scoped lang="less">
.channel-edit {
  padding-top: 54px;
  .channel-title {
    font-size: 16px;
    color: #333333;
  }
  .channel-item {
    width: 80px;
    height: 43px;
    /deep/ .van-grid-item__content {
      background-color: #f5f5f6;
      .van-grid-item__text {
        color: #222;
        font-size: 14px;
        margin-top: 0;
      }
    }
    /deep/ .van-grid-item__icon {
      position: absolute;
      right: -5px;
      top: -5px;
      font-size: 20px;
      color: #ccc;
    }
  }
  .active {
    /deep/ .van-grid-item__text {
      color: red !important;
    }
  }
}
</style>
