<template>
  <div class="user-profile">
    <!-- 导航栏 -->
    <van-nav-bar
      class="page-nav-bar"
      title="个人信息"
      left-arrow
      @click-left="$router.back()"
    />
    <!-- /导航栏 -->
    <input
      type="file"
      hidden
      ref="file"
      accept="image/*"
      @change="onFileChange"
    />
    <!-- 个人信息 -->
    <van-cell
      class="avatar-cell"
      title="头像"
      is-link
      center
      @click="$refs.file.click()"
    >
      <van-image class="avatar" round fit="cover" :src="user.photo" />
    </van-cell>
    <van-cell
      title="昵称"
      :value="user.name"
      is-link
      @click="isPostShow = true"
    />
    <van-cell
      title="性别"
      :value="user.gender === 0 ? '男' : '女'"
      is-link
      @click="isGenderPostShow = true"
    />
    <van-cell
      title="生日"
      :value="user.birthday"
      is-link
      @click="isBirthdayShow = true"
    />
    <!-- /个人信息 -->

    <!-- 修改弹出层 -->
    <!-- 修改昵称 -->
    <van-popup
      v-model="isPostShow"
      position="bottom"
      style="
         {
          height: '100%';
        }
      "
    >
      <!-- 当父组件传递给子组件的数据既要使用又要修改，如下面的user.name
        :name="user.name"
        @update-name="user.name = $event"
      此时可以用v-model简写
     -->
      <!-- v-model="user.name" 默认传递 :value="user.name"
     默认监听input事件 @input="user.name = $event"
     其本质还是父子组件通信 -->
      <!-- <update-name
        @cancle="isPostShow = false"
        :name="user.name"
        @update-name="user.name = $event"
      /> -->
      <update-name
        v-if="isPostShow"
        @cancle="isPostShow = false"
        v-model="user.name"
      />
    </van-popup>
    <!-- 修改性别 -->
    <van-popup v-model="isGenderPostShow" position="bottom">
      <update-gender
        v-if="isGenderPostShow"
        @close="isGenderPostShow = false"
        v-model="user.gender"
      />
    </van-popup>
    <!-- 修改生日 -->
    <van-popup v-model="isBirthdayShow" position="bottom">
      <update-birthday
        v-if="isBirthdayShow"
        @close="isBirthdayShow = false"
        v-model="user.birthday"
      />
    </van-popup>
    <!-- 修改头像 -->
    <van-popup
      class="update-photo-popup"
      v-model="isEditPhotoShow"
      position="bottom"
      style="
         {
          height: '100%';
        }
      "
    >
      <update-photo
        v-if="isEditPhotoShow"
        @close="isEditPhotoShow = false"
        :file="previewImage"
        @update-photo="user.photo = $event"
      />
    </van-popup>
    <!-- 修改弹出层 -->
  </div>
</template>

<script>
import { getProfile } from '@/api/user.js'

import UpdateName from './components/update-name.vue'
import UpdateGender from './components/update-gender.vue'
import UpdateBirthday from './components/update-birthday.vue'
import UpdatePhoto from './components/update-photo.vue'
export default {
  name: 'UserProfile',
  components: {
    UpdateName,
    UpdateGender,
    UpdateBirthday,
    UpdatePhoto
  },
  props: {},
  data() {
    return {
      user: {}, // 用户个人资料
      isPostShow: false, // 修改昵称的显示状态
      isGenderPostShow: false,
      isBirthdayShow: false,
      isEditPhotoShow: false,
      previewImage: null // 上传预览图片
    }
  },
  computed: {},
  watch: {},
  created() {
    this.getUserProfile()
  },
  mounted() {},
  methods: {
    async getUserProfile() {
      // 获取用户个人资料
      const { data } = await getProfile()
      this.user = data.data
      // console.log(this.user.birthday)
    },
    onFileChange() {
      // 弹出层里面预览图片
      const file = this.$refs.file.files[0]
      this.previewImage = file
      this.isEditPhotoShow = true
      // 为了解决相同文件不触发change事件
      this.$refs.file.value = ''
    }
  }
}
</script>

<style scoped lang="less">
.user-profile {
  .avatar-cell {
    .van-cell__value {
      display: flex;
      flex-direction: row-reverse;
    }
    .avatar {
      width: 60px;
      height: 60px;
    }
  }
}
.update-photo-popup {
  background-color: #000;
}
</style>
