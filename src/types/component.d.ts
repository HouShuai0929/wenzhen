// 1. 引入了组件模块
import CpNavBar from '@/components/CpNavBar.vue'
import CpIcon from '@/components/CpIcon.vue'
import CpRadioBtn from '@/components/CpRadioBtn.vue'
// 2. 声明了vue 类型模块
declare module 'vue' {
  // 3. 给vue 添加了全局类型, 通过 interface进行了合并
  interface GlobalComponents {
    // 4. 定义具体的组件类型  typeof 获取了组件的实例类型
    CpNavBar: typeof CpNavBar
    CpIcon: typeof CpIcon
    CpRadioBtn: typeof CpRadioBtn
  }
}
