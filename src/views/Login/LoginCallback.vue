<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { mobileRules, codeRules } from '@/utils/rules'
import { useSendMobileCode } from '@/composable'
import { LoginByQQ, bindMobile } from '@/services/user'
import type { User } from '@/types/user'
import { useUserStore } from '@/stores'
import { useRouter } from 'vue-router'
import { showToast } from 'vant'
// 页面加载需要调用第三方登录, 若果成功了,直接跳转走,如果失败得绑定手机号

// 1. 获取openId
const openId = ref('')
const isBind = ref(false)
onMounted(() => {
  if (window.QC.Login.check()) {
    window.QC.Login.getMe((id) => {
      openId.value = id
      // 2. 登录
      LoginByQQ(id)
        .then((res) => {
          // 登录成功的话直接跳走
          console.log('登录成功了,只不过现在没跳转', id)
          loginSuccess(res)
        })
        .catch(() => {
          // 登录失败
          console.log('登录失败了')
          isBind.value = true
        })
    })
  }
})

const mobile = ref('')
const code = ref('')
// 绑定手机号
const bind = async () => {
  const res = await bindMobile({
    mobile: mobile.value,
    code: code.value,
    openId: openId.value
  })
  loginSuccess(res)
}
const store = useUserStore()
const router = useRouter()
// 登录成功
const loginSuccess = (res: { data: User }) => {
  store.setUser(res.data)
  router.replace(store.returnUrl || '/user')
  store.setReturnUrl('')
  showToast('登录成功')
}
// 发送验证码
const { form, time, send } = useSendMobileCode(mobile, 'bindMobile')
</script>

<template>
  <div class="login-page" v-if="isBind">
    <cp-nav-bar></cp-nav-bar>
    <div class="login-head">
      <h3>手机绑定</h3>
    </div>
    <van-form autocomplete="off" ref="form" @submit="bind">
      <van-field
        v-model="mobile"
        :rules="mobileRules"
        name="mobile"
        placeholder="请输入手机号"
      ></van-field>
      <van-field v-model="code" :rules="codeRules" name="code" placeholder="请输入验证码">
        <template #button>
          <span class="btn-send" :class="{ active: time > 0 }" @click="send">{{
            time > 0 ? `${time}s后再次发送` : '发送验证码'
          }}</span>
        </template>
      </van-field>
      <div class="cp-cell">
        <van-button block round type="primary" native-type="submit"> 立即绑定 </van-button>
      </div>
    </van-form>
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
