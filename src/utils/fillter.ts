import type { IllnessTime } from '@/enums'
import { flagOptions, timeOptions } from '@/services/constants'
// 处理数据显示
export const getIllnessTimeText = (time: IllnessTime) => {
  return timeOptions.find((item) => item.value === time)?.label
}
export const getConsultFlagTimeText = (flag: 0 | 1) => {
  return flagOptions.find((item) => item.value === flag)?.label
}