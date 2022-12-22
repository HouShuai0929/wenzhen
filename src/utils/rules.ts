// 表单校验
const mobileRules = [
  { required: true, message: '请输入手机号' },
  { pattern: /^1[3-9]\d{9}$/, message: '手机号格式不正确' }
]
const passwordRules = [
  { required: true, message: '请输入密码' },
  { pattern: /^\w{8,24}$/, message: '密码需要8-24位' }
]

const codeRules = [
  { required: true, message: '请输入验证码' },
  { pattern: /^\d{6}$/, message: '验证码是6个数字' }
]

export { mobileRules, passwordRules, codeRules }
