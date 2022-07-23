<template>
  <div class="update-birthday">
    <van-datetime-picker
      v-model="currentDate"
      type="date"
      title="选择年月日"
      :min-date="minDate"
      :max-date="maxDate"
      @cancle="$emit('close')"
      @confirm="onConfirm"
    />
  </div>
</template>

<script>
import { updateProfile } from '@/api/user.js'
import dayjs from 'dayjs'
export default {
  name: 'UpdateBirthday',
  components: {},
  props: {
    value: {
      type: String,
      required: true
    }
  },
  data() {
    return {
      minDate: new Date(1949, 0, 1),
      maxDate: new Date(),
      currentDate: new Date(this.value)
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
      console.log('this.currentDate', this.currentDate)
      const date = dayjs(this.currentDate).format('YYYY-MM-DD')
      await updateProfile({
        birthday: date
      })

      this.$toast.success('保存成功')

      // 更新成功，修改父组件name,关闭弹出层
      this.$emit('input', date)
      this.$emit('cancle')
    }
  }
}
</script>
<style scoped lang="less"></style>
