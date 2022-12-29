import { request } from '@/utils/request'
import type { OrderPre, AddressItem, OrderDetail, Logistics } from '@/types/order'
// 查询药品订单预支付信息
export const getMedicalOrderPre = (params: { prescriptionId: string }) =>
  request<OrderPre>('/patient/medicine/order/pre', 'GET', params)

// 获取收货地址列表
export const getAddressList = () => request<AddressItem[]>('/patient/order/address', 'GET')
// 创建药品订单
export const createMedicalOrder = (data: { id: string; addressId: string; couponId?: string }) =>
  request<{ id: string }>('/patient/medicine/order', 'POST', data)
// 获取药品订单详情
export const getMedicalOrderDetail = (id: string) =>
  request<OrderDetail>(`/patient/medicine/order/detail/${id}`)
// 获取药品订单物流信息
export const getMedicalOrderLogistics = (id: string) =>
  request<Logistics>(`/patient/order/${id}/logistics`)
