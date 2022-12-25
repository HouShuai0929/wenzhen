import type { Medical } from './room'

export type OrderPre = {
  // 处方ID
  id: string
  // 优惠券ID
  couponId: string
  // 积分抵扣
  pointDeduction: number
  // 优惠券抵扣
  couponDeduction: number
  // 应付款
  payment: number
  // 邮费
  expressFee: number
  // 实付款
  actualPayment: number
  // 药品订单
  medicines: Medical[]
}
export type Address = {
  // 地址ID
  id: string
  // 联系方式
  mobile: string
  // 收件人
  receiver: string
  // 省
  province: string
  // 市
  city: string
  // 区
  county: string
  // 详细地址
  addressDetail: string
}

// 订单列表
export type AddressItem = Address & {
  // 是否默认地址，0 不是 1 是
  isDefault: 0 | 1
  // 邮政编码
  postalCode: string
}
