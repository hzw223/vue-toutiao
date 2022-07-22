<template>
  <div class="update-photo">
    <img :src="image" class="image" alt="" ref="image" />
    <van-nav-bar
      class="toolBar"
      left-text="取消"
      right-text="确定"
      @click-left="$emit('close')"
      @click-right="onConfirm"
    />
  </div>
</template>

<script>
import { updateUserPhoto } from '@/api/user.js'
import 'cropperjs/dist/cropper.css'
import Cropper from 'cropperjs'
export default {
  name: 'UpdatePhoto',
  components: {},
  props: {
    file: {
      //   type: Object,
      required: true
    }
  },
  data() {
    return {
      image: window.URL.createObjectURL(this.file), // 将图片文件路径转为http格式的url
      cropper: null // 裁切器实例
    }
  },
  computed: {},
  watch: {},
  created() {},
  mounted() {
    const image = this.$refs.image
    this.cropper = new Cropper(image, {
      // 参数配置
      viewMode: 1,
      dragMode: 'move',
      aspectRatio: 1,
      cropBoxMovable: false, // 裁切框是否可拖动
      cropBoxResizable: false, // 裁切框能否缩放
      background: false,
      movable: true // 图片能否移动
    })
  },
  methods: {
    getCroppedCanvas() {
      return new Promise((resolve) => {
        this.cropper.getCroppedCanvas().toBlob((blob) => {
          resolve(blob)
        })
      })
    },
    async onConfirm() {
      this.$toast.loading({
        message: '保存中',
        forbidClick: true,
        duration: 0 // 展示时间，0表示持续展示
      })

      const file = await this.getCroppedCanvas()
      // 后端要求的Content-Type是multipart/form-data,
      // 则一定要提交FormData数据对象，专门用于文件上传
      const fd = new FormData()
      fd.append('photo', file)
      // 更新图像
      await updateUserPhoto(fd)
      // 更新成功，修改父组件photo,关闭弹出层
      this.$emit('update-photo', window.URL.createObjectURL(file))
      this.$emit('close')
      this.$toast.success('保存成功')
    }
  }
}
</script>
<style scoped lang="less">
.toolBar {
  position: fixed;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: #000;
}
/* Ensure the size of the image fit the container perfectly */
.image {
  display: block;

  /* This rule is very important, please don't ignore this */
  max-width: 100%;
}
</style>
