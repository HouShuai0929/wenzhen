// 命名规范 useXxx  表示使用某功能
import { followDoctor } from '@/services/consult'
import { ref } from 'vue'
import type { FollowType } from '@/types/consult'
// 之前关注医生没传入type 是因为有默认值,封装成函数了,再想关注其他类型的,需要把类型传入
export const useFollow = (type: FollowType = 'doc') => {
  const loading = ref(false)
  // 对象类型多的可以传递给少的, 叫:类型兼容 需要的参数是 {a, b}   传值的时候传多了 {a,b,c}, 这样传值也是可以的,参数:多的可以给少的,  少的不可以给多的
  const follow = async (obj: { id: string; likeFlag: 0 | 1 }) => {
    loading.value = true
    try {
      await followDoctor(obj.id, type)
      obj.likeFlag = obj.likeFlag === 1 ? 0 : 1
      // if (doc.likeFlag === 1) {
      //   doc.likeFlag = 0
      // } else {
      //   doc.likeFlag = 1
      // }
    } finally {
      loading.value = false
    }
  }
  return {
    loading,
    follow
  }
}
