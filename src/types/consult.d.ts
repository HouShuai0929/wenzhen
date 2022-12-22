// 文章类型   关注医生页面文章 | 推荐  | 减脂  | 饮食
export type KnowledgeType = 'like' | 'recommend' | 'fatReduction' | 'food'

// 文章信息类型
export type Knowledge = {
  id: string
  title: string
  coverUrl: string[]
  topics: string[]
  collectionNumber: number
  commentNumber: number
  creatorName: string
  creatorAvatar: string
  creatorHospatalName: string
  likeFlag: 0 | 1
  content: string
  creatorDep: string
  creatorTitles: string
  creatorId: string
  topic: string
}

// 文章列表
export type KnowledgeList = Knowledge[]

// 带分页的文章列表
export type KnowledgePage = {
  pageTotal: number
  total: number
  rows: KnowledgeList
}

// 文章列表查询参数
// export type KnowledgeParams = {
//   type: KnowledgeType
//   current: number
//   pageSize: number
// }

// 通用的分页查询参数
export type PageParams = {
  // 当前页码
  current: number
  // 每页条数
  pageSize: number
}

// 文章列表查询参数
export type KnowledgeParams = PageParams & {
  // 文章类型
  type: KnowledgeType
}

// 医生卡片对象
export type Doctor = {
  // 医生ID
  id: string
  // 医生名称
  name: string
  // 头像
  avatar: string
  // 医院名称
  hospitalName: string
  // 医院等级
  gradeName: string
  // 科室
  depName: string
  // 职称
  positionalTitles: string
  // 是否关注，0 未关注 1 已关注
  likeFlag: 0 | 1
  // 接诊服务费
  serviceFee: number
  // 接诊人数
  consultationNum: number
  // 评分
  score: number
  // 主攻方向
  major: string
}

// 医生列表
export type DoctorList = Doctor[]

// 医生分页
export type DoctorPage = {
  pageTotal: number
  total: number
  rows: DoctorList
}

// 关注的类型，医生|文章|百科话题|疾病
export type FollowType = 'doc' | 'knowledge' | 'topic' | 'disease'

import { ConsultType, IllnessTime } from '@/enums'

// 图片列表
export type Image = {
  // 图片ID
  id: string
  // 图片地址
  url: string
}
// 问诊记录
export type Consult = {
  // 问诊记录ID
  id: string
  // 问诊类型
  type: ConsultType
  // 快速问诊类型，0 普通 1 三甲
  illnessType: 0 | 1
  // 科室ID
  depId: string
  // 疾病描述
  illnessDesc: string
  // 疾病持续时间
  illnessTime: IllnessTime
  // 是否就诊过，0 未就诊过  1 就诊过
  consultFlag: 0 | 1
  // 图片数组
  pictures: Image[]
  // 患者ID
  patientId: string
  // 优惠券ID
  couponId: string
}

// 问诊记录-全部可选
export type PartialConsult = Partial<Consult>
// Required 转换为全部必须   Partial 转换问全部可选  两个内置的泛型类型

// 科室
export type SubDep = {
  // 科室ID
  id: string
  // 科室名称
  name: string
}

export type TopDep = SubDep & {
  // 二级科室数组
  child: SubDep[]
}

export type ConsultIllness = Pick<
  PartialConsult,
  'illnessDesc' | 'illnessTime' | 'consultFlag' | 'pictures'
>

// 问诊订单预支付传参
export type ConsultOrderPreParams = Pick<PartialConsult, 'type' | 'illnessType'>

// 问诊订单预支付信息
export type ConsultOrderPreData = {
  // 积分抵扣
  pointDeduction: number
  // 优惠券抵扣
  couponDeduction: number
  // 优惠券ID
  couponId: string
  // 需付款
  payment: number
  // 实付款
  actualPayment: number
}

// 问诊订单单项信息
export type ConsultOrderItem = Consult & {
  // 创建时间
  createTime: string
  // 医生信息
  docInfo?: Doctor
  // 患者信息
  patientInfo: Patient
  // 订单编号
  orderNo: string
  // 订单状态
  status: OrderType
  // 状态文字
  statusValue: string
  // 类型问诊文字
  typeValue: string
  // 倒计时时间
  countdown: number
  // 处方ID
  prescriptionId?: string
  // 评价ID
  evaluateId: number
  // 应付款
  payment: number
  // 优惠券抵扣
  couponDeduction: number
  // 积分抵扣
  pointDeduction: number
  // 实付款
  actualPayment: number
}
