// 命名规范 useXxx  表示使用某功能
import { ref } from 'vue'
import { followDoctor, getPrescriptionPic, cancelOrder, deleteOrder } from '@/services/consult'
import type { FollowType, ConsultOrderItem } from '@/types/consult'
import { OrderType } from '@/enums'
import { showImagePreview, showSuccessToast, showFailToast } from 'vant'
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
export const useShowPrescription = () => {
  // 查看处方
  const showPrescription = async (id: string) => {
    if (id) {
      const res = await getPrescriptionPic(id)
      showImagePreview([res.data.url])
    }
  }

  return {
    showPrescription
  }
}
// 封装取消订单逻辑
export const useCancelOrder = () => {
  const loading = ref(false)
  const cancelConsultOrder = (item: ConsultOrderItem) => {
    loading.value = true
    cancelOrder(item.id)
      .then(() => {
        // 取消成功之后,改一下当前的项的状态
        item.status = OrderType.ConsultCancel
        item.statusValue = '已取消'
        showSuccessToast('取消成功')
        loading.value = false
      })
      .catch(() => {
        showFailToast('取消失败')
        loading.value = false
      })
    // 两种形式都可以
    // .finally(() => {
    //   loading.value = false
    // })
  }

  return {
    loading,
    cancelConsultOrder
  }
}

// 封装删除订单逻辑
export const useDeleteOrder = (cb: () => void) => {
  const deleteLoading = ref(false)
  const deleteConsultOrder = (item: ConsultOrderItem) => {
    deleteLoading.value = true
    deleteOrder(item.id)
      .then(() => {
        // emit('on-delete', item.id)
        cb && cb()
        // if (cb) {
        //   cb()
        // }
        showSuccessToast('删除成功')
        deleteLoading.value = false
      })
      .catch(() => {
        showFailToast('删除失败')
        deleteLoading.value = false
      })
    // 其实是有finally方法的,项目默认的ts编译库没有finally方法,不用管
    // .finally(() => {
    //   deleteLoading.value = false
    // })
  }

  return {
    deleteLoading,
    deleteConsultOrder
  }
}
