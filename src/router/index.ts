import { createRouter, createWebHistory } from 'vue-router'
import { useUserStore } from '@/stores'
import NProgress from 'nprogress'
import 'nprogress/nprogress.css'
NProgress.configure({
  showSpinner: false
})

// vue2中 new VueRouter()
// history: history  hash

// vue3中 是通过引入函数的形式使用(函数式编程)
// createRouter() 创建路由实例
// createWebHistory() 开启history模式   http://xxx/user
// createWebHashHistory() 开启hash模式   http://xxx/#/user

// import.meta.env.BASE_URL 来自vite的配置 路由的基地址   默认是'/'
// https://vitejs.dev/guide/build.html#public-base-path
// 如果将来你部署的域名路径是：http://xxx/my-path/user
// vite.config.ts  添加配置  base: my-path，路由这就会加上 my-path 前缀了
const routes = [
  {
    path: '/login',
    component: () => import('@/views/Login/index.vue'),
    meta: {
      title: '登录'
    }
  },
  {
    path: '/',
    component: () => import('@/views/Layout/index.vue'),
    redirect: '/home',
    children: [
      {
        path: '/home',
        component: () => import('@/views/Home/index.vue'),
        meta: {
          title: '首页'
        }
      },
      {
        path: '/article',
        component: () => import('@/views/Article/index.vue'),
        meta: {
          title: '健康百科'
        }
      },
      {
        path: '/notify',
        component: () => import('@/views/Notity/index.vue'),
        meta: {
          title: '消息通知'
        }
      },
      {
        path: '/user',
        component: () => import('@/views/User/index.vue'),
        meta: {
          title: '个人中心'
        }
      }
    ]
  },
  {
    path: '/user/patient',
    component: () => import('@/views/User/PatientPage.vue'),
    meta: {
      title: '家庭档案'
    }
  },
  {
    path: '/consult/fast',
    component: () => import('@/views/Consult/ConsultFast.vue'),
    meta: {
      title: '极速问诊'
    }
  },
  {
    path: '/consult/dep',
    component: () => import('@/views/Consult/ConsultDep.vue'),
    meta: {
      title: '选择科室'
    }
  },
  {
    path: '/consult/illness',
    component: () => import('@/views/Consult/ConsultIllness.vue'),
    meta: {
      title: '病情描述'
    }
  },
  {
    path: '/consult/pay',
    component: () => import('@/views/Consult/ConsultPay.vue'),
    meta: {
      title: '问诊支付'
    }
  },
  {
    path: '/room',
    component: () => import('@/views/Room/index.vue'),
    meta: {
      title: '问诊室'
    },
    beforeEnter(to: any) {
      if (to.query.payResult === 'false') return '/user/consult'
    }
  },
  {
    path: '/user/consult',
    component: () => import('@/views/User/ConsultPage.vue'),
    meta: {
      title: '问诊记录'
    }
  },
  {
    path: '/user/consult/:id',
    component: () => import('@/views/User/ConsultDetail.vue'),
    meta: {
      title: '问诊详情'
    }
  },
  {
    path: '/order/pay',
    component: () => import('@/views/Order/OrderPay.vue'),
    meta: {
      title: '药品支付'
    }
  }
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes
})

// 访问权限控制 (结合路由守卫搞定页面跳转权限控制)
router.beforeEach((to) => {
  // 进入路由之前开启进度条
  NProgress.start()
  console.log('to', to)
  // 判断token是否存在
  const store = useUserStore()
  // 通过白名单控制不需要登录的页面
  const whiteList = ['/login']
  // 如果不在白名单且没有登录, 跳转到登录页面
  if (!store.user?.token && !whiteList.includes(to.path)) return '/login'
})

router.afterEach((to) => {
  // 处理标题
  document.title = `优医问诊-${to.meta.title || ''}`
  // 进入页面之后 关闭进度条
  NProgress.done()
})

export default router
