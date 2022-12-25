import { request } from '@/utils/request'
import type { OrderPre, AddressItem } from '@/types/order'

// 查询药品订单预支付信息
export const getMedicalOrderPre = (params: { prescriptionId: string }) =>
  request<OrderPre>('/patient/medicine/order/pre', 'GET', params)

// 获取收货地址列表
export const getAddressList = () => request<AddressItem[]>('/patient/order/address', 'GET')
