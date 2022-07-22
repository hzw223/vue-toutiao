<template>
  <div class="update-gender">
    <van-picker
      title="性别"
      show-toolbar
      :columns="columns"
      :default-index="localIndex"
      @confirm="onConfirm"
      @change="onGenderChange"
      @cancel="$emit('close')"
    />
  </div>
</template>

<script>
import { updateProfile } from '@/api/user.js'
export default {
  name: 'UpdateGender',
  components: {},
  props: {
    value: {
      type: Number,
      required: true
    }
  },
  data() {
    return {
      localIndex: this.value, // 保存对应性别的index
      columns: ['男', '女']
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
        await updateProfile({
          gender: this.localIndex
        })
        this.$toast.success('保存成功')

        // 更新成功，修改父组件name,关闭弹出层
        this.$emit('input', this.localIndex)
        this.$emit('close')
      } catch (err) {
        // if (err && err.response && err.response.status === 409) {
        //   this.$toast.fail('昵称已存在')
        // }
        console.log(err)
      }
    },
    onGenderChange(picker, value, index) {
      this.localIndex = index
    }
  }
}
</script>
<style scoped lang="less"></style>
