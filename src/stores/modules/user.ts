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
    return {
      user,
      setUser,
      delUser
    }
  },
  {
    persist: true
  }
)
