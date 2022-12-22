// 用户信息
export type User = {
  // token
  token: string
  refreshToken: string
  // 头像
  avatar: string
  // 脱敏手机号
  mobile: string
  // 用户名
  account: string
  // 用户id
  id: string
}

// 验证码类型
export type CodeType =
  | 'login'
  | 'register'
  | 'changeMobile'
  | 'forgetPassword'
  | 'bindMobile'

// 除了token其他属性都要
type OmitUser = Omit<User, 'token'>

export type UserInfo = OmitUser & {
  likeNumber: number
  collectionNumber: number
  score: number
  couponNumber: number
  orderInfo: {
    paidNumber: number
    receivedNumber: number
    shippedNumber: number
    finishedNumber: number
  }
}

// 家庭档案-患者信息
export type Patient = {
  // 患者ID
  id?: string
  // 患者名称
  name: string
  // 身份证号
  idCard: string
  // 0不默认  1默认
  defaultFlag: 0 | 1
  // 0 女  1 男
  gender: 0 | 1
  // 性别文字
  genderValue?: string
  // 年龄
  age?: number
}

// 家庭档案-患者信息列表
export type PatientList = Patient[]
