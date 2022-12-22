import { defineStore } from 'pinia'
import { ref } from 'vue'
import type { PartialConsult, ConsultIllness } from '@/types/consult'
import type { ConsultType } from '@/enums'
export const useConsultStore = defineStore(
  'cp-consult',
  () => {
    // 问诊记录数据
    const consult = ref<PartialConsult>({})
    // 设置问诊记录类型
    const setType = (type: ConsultType) => (consult.value.type = type)
    // 设置极速问诊类型
    const setIllnessType = (type: 0 | 1) => (consult.value.illnessType = type)
    // 设置科室
    const setDep = (id: string) => (consult.value.depId = id)
    // 设置病情描述
    const setIllness = (illness: ConsultIllness) => {
      consult.value.illnessDesc = illness.illnessDesc
      consult.value.illnessTime = illness.illnessTime
      consult.value.consultFlag = illness.consultFlag
      consult.value.pictures = illness.pictures
    }
    // 设置患者
    const setPatient = (id: string) => (consult.value.patientId = id)
    // 设置优惠券
    const setCoupon = (id?: string) => (consult.value.couponId = id)
    // 清空记录
    const clear = () => (consult.value = {})

    return {
      consult,
      setType,
      setIllnessType,
      setDep,
      setIllness,
      setPatient,
      setCoupon,
      clear
    }
  },
  {
    persist: true
  }
)
