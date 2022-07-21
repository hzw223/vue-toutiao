<template>
  <div class="login-container">
    <van-nav-bar title="登录" left-arrow @click-left="$router.back()" />
    <!-- 登录表单 -->
    <!-- 只有当表单验证通过时，才会调用submit -->
    <van-form
      :show-error="false"
      :show-error-message="false"
      validate-first
      ref="login-form"
      @failed="onFailed"
      @submit="onLogin"
    >
      <van-cell-group>
        <van-field
          v-model="user.mobile"
          center
          icon-prefix="toutiao"
          left-icon="shouji"
          placeholder="请输入手机号"
          name="mobile"
          :rules="formRules.mobile"
        />
        <van-field
          v-model="user.code"
          clearable
          center
          icon-prefix="toutiao"
          left-icon="yanzhengma"
          placeholder="请输入验证码"
          name="验证码"
          :rules="formRules.code"
        >
          <template #button>
            <van-count-down
              v-if="isCountDownShow"
              :time="1000 * 60"
              format="ss s"
              @finish="isCountDownShow = false"
            />
            <van-button
              v-else
              size="mini"
              class="send-btn"
              round
              type="primary"
              :loading="isSendSmsLoading"
              @click.prevent="onSendSms"
              >发送验证码</van-button
            >
          </template>
          <!-- /登录表单 -->
        </van-field>
      </van-cell-group>
      <div class="login-btn-wrap">
        <van-button type="info" block>登录</van-button>
      </div>
    </van-form>
  </div>
</template>

<script>
import { login, sendSms } from '@/api/user'
export default {
  name: 'LoginIndex',
  components: {},
  props: {},
  data() {
    return {
      user: {
        mobile: '',
        code: ''
      },
      // 验证规则
      formRules: {
        mobile: [
          { required: true, message: '请填写用手机号' },
          { pattern: /^1[3|5|7|8|9]\d{9}$/, message: '手机号格式错误' }
        ],
        code: [
          { required: true, message: '请输入验证码' },
          { pattern: /^\d{6}$/, message: '验证码格式错误' }
        ]
      },
      isSendSmsLoading: false,
      isCountDownShow: false
    }
  },
  computed: {},
  watch: {},
  created() {},
  mounted() {},
  methods: {
    async onLogin() {
      // 登录状态提示
      this.$toast.loading({
        duration: 0, // 持续时间，0表示持续展示不停止
        forbidClick: true, // 是否禁止背景点击
        message: '登录中...' // 提示消息
      })
      try {
        const { data } = await login(this.user)
        console.log('登陆成功', data)
        // 将后端返回的用户登陆状态（token等）放到Vuex容器中
        this.$store.commit('setUser', data.data)
        // 提示 success 或者 fail 的时候，会先把其它的 toast 先清除
        this.$toast.success('登录成功')
        // 登录成功，跳转回原来的页面
        this.$router.back() // 这种方式有缺陷
      } catch (err) {
        if (err.response.status === 400) {
          console.log('登录失败', err)
          this.$toast.fail('登录失败，手机号或验证码错误')
        }
      }
    },
    onFailed(error) {
      if (error.errors[0]) {
        this.$toast({
          message: error.errors[0].message, // 提示消息
          position: 'top' // 防止手机键盘太高看不见提示消息
        })
      }
    },
    async onSendSms() {
      try {
        // 校验手机号
        await this.$refs['login-form'].validate('mobile')
        // 验证通过 -> 请求发送验证码 -> 用户接收短信 -> 输入验证码 -> 请求登录
        this.isSendSmsLoading = true
        await sendSms(this.user.mobile)
        // 请求发送验证码 -> 隐藏发送按钮，显示倒计时
        this.isCountDownShow = true
        // 倒计时结束 -> 隐藏倒计时，显示发送按钮(监视倒计时的 finish 事件处理)
      } catch (err) {
        let message = ''
        if (err && err.response && err.response.status === 429) {
          // 发送短信失败的错误提示
          message = '发送短信太频繁，请稍后重试'
        } else if (err.name === 'mobile') {
          message = err.message
        } else {
          // 未知错误
          message = '发送失败，请稍后重试'
        }
        // 提示用户
        this.$toast({
          message,
          position: 'top'
        })
      }
      this.isSendSmsLoading = false
    }
  }
}
</script>

<style scoped lang="less">
.login-container {
  .login-btn-wrap {
    padding: 26px 16px;
    .login-btn {
      background-color: #6db4fb;
      border: none;
      .van-button__text {
        font-size: 15px;
      }
    }
  }
  .send-btn {
    width: 76px;
    height: 23px;
    background-color: #ededed;
    .van-button__text {
      font-size: 11px;
      color: #666666;
    }
  }
}
</style>
