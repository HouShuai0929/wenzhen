import type { User } from '@/types/user'
import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useUserStore = defineStore(
  'cp-user',
  () => {
    // 用户信息
    const user = ref<User>()
    // 修改用户信息的方法
    const setUser = (u: User) => {
      user.value = u
    }
    // 清空用户, 退出时使用
    const delUser = () => {
      user.value = undefined
    }
    // 记录回跳地址
    const returnUrl = ref('')
    const setReturnUrl = (url: string) => (returnUrl.value = url)
    return {
      user,
      returnUrl,
      setUser,
      delUser,
      setReturnUrl
    }
  },
  {
    persist: true
  }
)
