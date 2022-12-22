import axios, { type Method } from 'axios'
import { useUserStore } from '@/stores'
import { showToast } from 'vant'
import router from '@/router'

const baseURL = 'https://consult-api.itheima.net/'
// 1.创建axios实例, 进行基础配置
const instance = axios.create({
  baseURL,
  timeout: 10000
})

// 2. 请求拦截器, 携带token
instance.interceptors.request.use(
  (config) => {
    // 判断是否有token, 有的话携带token
    // 从useUserStore里面拿
    const store = useUserStore()
    if (store.user?.token && config.headers) {
      // Bearer后面有一个空格
      config.headers['Authorization'] = `Bearer ${store.user.token}`
    }
    return config
  },
  (err) => {
    return Promise.reject(err)
  }
)
// 3. 响应拦截器  (1) 剥离无效数据  (2) 401的拦截
instance.interceptors.response.use(
  (res) => {
    // 跟后台约定,响应成功,但是code不为10000,是业务失败(不同公司处理方案不一)
    if (res.data?.code !== 10000) {
      showToast(res.data?.message || '业务失败')
      return Promise.reject(res.data)
    }
    // 业务逻辑成功了 只需要返回data不需要其他字段
    return res.data
  },
  (err) => {
    // 响应出错
    // 遇见401状态码需要跳转到登录
    // 1. 举个栗子: 现在在/user/patient 页面,发了一个请求,但是token失效了,跳转到登录页
    // 2. 登录成功了需要跳回到 /user/patient页面 (默认跳转到/user页面)
    // vue2里  $router 路由实例提供路由的相关函数  $route 路由相关的信息 query  params path
    if (err.response.status === 401) {
      // 删除个人用户信息
      const store = useUserStore()
      store.delUser()
      // 跳转登录页, 带上失效的页面路径,登录成功之后,回跳用
      // 失效页面: /user/patient?id=100
      // path: /user/patient   不带查询参数
      // fullPath: /user/patient?id=100
      // currentRoute 是一个ref类型的数据 使用的时候用.value
      router.push(`/login?returnUrl=${router.currentRoute.value.fullPath}`)
    }
    return Promise.reject(err)
  }
)

// 4. 导出封装的axios
// get请求和post请求   (params: {})    (data: {})
// (1) 参数   url   method   submitData
// (2) 返回: 调用instance.request方法 (这样可以通过(.then 或者.catch)来进行后续处理

// 定义返回数据的泛型
type Data<T> = {
  code: string
  message: string
  data: T
}
// 定义的泛型 (形参)
const request = <T>(
  url: string,
  method: Method = 'GET',
  submitData?: object
) => {
  // 返回axios的request方法
  return instance.request<T, Data<T>>({
    url,
    method,
    // 因为key值根据method变化所以用[] get请求: params: submitData  非get请求:  data: submitData
    [method.toUpperCase() === 'GET' ? 'params' : 'data']: submitData
  })
}
// 举个例子: 使用 调用时候是  使用的具体类型(实参)
// request<{ id: string; age: number }>('xxxx').then((res) => {
//   return res.data
// })

export { baseURL, instance, request }
