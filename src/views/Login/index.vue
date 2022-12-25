<script setup lang="ts">
import { onUnmounted, ref } from 'vue'
import { mobileRules, passwordRules, codeRules } from '@/utils/rules'
import { showToast, showSuccessToast, type FormInstance } from 'vant'
import { loginByPassword, sendMobileCode, loginByMobile } from '@/services/user'
import { useUserStore } from '@/stores'
import { useRoute, useRouter } from 'vue-router'
const store = useUserStore()
const router = useRouter()
const route = useRoute()
console.log('router', router)
console.log('route', route)
const agree = ref(false)
// 表单数据
const mobile = ref('13230000100')
const password = ref('abc12345')
const code = ref('')
// 控制密码是否显示
const show = ref(false)
// 登录方法(分为账号密码登录和验证码登录)
const login = async () => {
  if (!agree.value) return showToast('请勾选我已同意')
  // 校验通过,进行登录(当isPass为true时是账号密码登录)
  const res = isPass.value
    ? await loginByPassword(mobile.value, password.value)
    : await loginByMobile(mobile.value, code.value)
  console.log(res.data)
  // 设置个人信息数据
  store.setUser(res.data)
  // 如果有回跳的页面就进行回跳,没有跳到个人中心
  router.push((route.query.returnUrl as string) || 'user')
  // 登录成功给个提示
  showSuccessToast('登录成功')
}
// 控制显示密码还是验证码
const isPass = ref(true)

// 发送验证码
const time = ref(0)
// 定时器Id 用于后续清除定时器
let timeId: number
const send = async () => {
  // 已经倒计时时 time值大于0, 此时不能发送验证码
  if (time.value > 0) return
  await form.value?.validate('mobile')
  // 手机号符合规范才去调用接口
  await sendMobileCode(mobile.value, 'login')
  showSuccessToast('发送验证码成功')
  time.value = 60
  timeId = window.setInterval(() => {
    time.value--
    if (time.value <= 0) window.clearInterval(timeId)
  }, 1000)
}
// 组件卸载的时候需要清空定时器,防止内存泄漏
onUnmounted(() => {
  window.clearInterval(timeId)
})

// form的ref数据
const form = ref<FormInstance>()
</script>

<template>
  <div class="login-page">
    <cp-nav-bar
      right-text="注册"
      @click-right="$router.push('/register')"
    ></cp-nav-bar>
    <div class="login-head">
      <h3>{{ isPass ? '密码登录' : '短信验证码登录' }}</h3>
      <a href="javascript:;" @click="isPass = !isPass">
        <span>{{ !isPass ? '密码登录' : '短信验证码登录' }}</span>
        <van-icon name="arrow"></van-icon>
      </a>
    </div>
    <!-- form 表单 -->
    <van-form autocomplete="off" @submit="login" ref="form">
      <van-field
        :rules="mobileRules"
        v-model="mobile"
        name="mobile"
        placeholder="请输入手机号"
        type="tel"
      />
      <!-- 密码 -->
      <van-field
        v-if="isPass"
        :type="show ? 'text' : 'password'"
        v-model="password"
        placeholder="请输入密码"
        :rules="passwordRules"
      >
        <template #button>
          <cp-icon
            @click="show = !show"
            :name="`login-eye-${show ? 'on' : 'off'}`"
          ></cp-icon>
        </template>
      </van-field>
      <!-- 验证码 -->
      <van-field
        v-else
        v-model="code"
        placeholder="短信验证码"
        :rules="codeRules"
        ><template #button>
          <span class="btn-send" :class="{ active: time > 0 }" @click="send">{{
            time > 0 ? `${time}s后再次发送` : '发送验证码'
          }}</span>
        </template>
      </van-field>
      <div class="cp-cell">
        <van-checkbox v-model="agree">
          <span>我已同意</span>
          <a href="javascript:;">用户协议</a>
          <span>及</span>
          <a href="javascript:;">隐私条款</a>
        </van-checkbox>
      </div>
      <div class="cp-cell">
        <van-button round block type="primary" native-type="submit">
          登 录
        </van-button>
      </div>
      <div class="cp-cell">
        <a href="javascript:;">忘记密码？</a>
      </div>
    </van-form>

    <div class="login-other">
      <van-divider>第三方登录</van-divider>
      <div class="icon">
        <img src="@/assets/qq.svg" alt="" />
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.login {
  &-page {
    padding-top: 46px;
  }
  &-head {
    padding: 30px 30px 50px;
    display: flex;
    justify-content: space-between;
    align-items: flex-end;
    line-height: 1;
    h3 {
      font-weight: normal;
      font-size: 24px;
    }
    a {
      font-size: 15px;
    }
  }
  &-other {
    margin-top: 60px;
    padding: 0 30px;
    .icon {
      display: flex;
      justify-content: center;
      img {
        width: 36px;
        height: 36px;
        padding: 4px;
      }
    }
  }
}
.van-form {
  padding: 0 14px;
  .cp-cell {
    height: 52px;
    line-height: 24px;
    padding: 14px 16px;
    box-sizing: border-box;
    display: flex;
    align-items: center;
    .van-checkbox {
      a {
        color: var(--cp-primary);
        padding: 0 5px;
      }
    }
  }
  // van-form 下添加
  .btn-send {
    color: var(--cp-primary);
    &.active {
      color: rgba(22, 194, 163, 0.5);
    }
  }
}
</style>
