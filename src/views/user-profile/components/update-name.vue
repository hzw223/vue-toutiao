<template>
  <div class="update-name">
    <van-nav-bar
      title="昵称"
      left-text="取消"
      right-text="确定"
      @click-left="$emit('cancle')"
      @click-right="onConfirm"
    />
    <div class="name-field-wrap">
      <van-field
        v-model="localName"
        rows="2"
        autosize
        type="textarea"
        placeholder="请输入昵称"
        maxlength="7"
        show-word-limit
      />
    </div>
  </div>
</template>

<script>
import { updateProfile } from '@/api/user.js'
export default {
  name: 'UpdateName',
  components: {},
  props: {
    value: {
      type: String,
      required: true
    }
  },
  data() {
    return {
      localName: this.value // 修改localName,this.value不受影响
    }
  },
  computed: {},
  watch: {},
  created() {},
  mounted() {},
  methods: {
    async onConfirm() {
      this.$toast.loading({
        message: '保存中',
        forbidClick: true
      })
      try {
        const res = await updateProfile({
          name: this.localName
        })
        console.log(res)
        this.$toast.success('保存成功')

        // 更新成功，修改父组件name,关闭弹出层
        this.$emit('input', this.localName)
        this.$emit('cancle')
      } catch (err) {
        if (err && err.response && err.response.status === 409) {
          this.$toast.fail('昵称已存在')
        }
      }
    }
  }
}
</script>
<style scoped lang="less">
/deep/.van-nav-bar__text {
  color: #fff;
}
</style>
