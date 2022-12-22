import { createPinia } from 'pinia'
import persist from 'pinia-plugin-persistedstate'

// 创建pinia实例
const pinia = createPinia()
// 使用pinia持久化插件
pinia.use(persist)

// 导出pinia实例,给main使用
export default pinia

// 统一导出
// import { useUserStore } from './modules/user'
// export { useUserStore }
// 相当于下面
export * from './modules/user'
export * from './modules/consult'
