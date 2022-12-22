import { createApp } from 'vue'
import pinia from './stores'
import App from './App.vue'
import router from './router'
import 'virtual:svg-icons-register'
// vant样式全局引入
import 'vant/lib/index.css'

// 在van样式下面引入 (覆盖)
import './styles/main.scss'
const app = createApp(App)

// type Person = {
//   name: string
//   age: number
// }

// Pick是从某个对象类型中取出某些属性
// type PickPerson = Pick<Person, 'age'>

// const person: PickPerson = {
//   age: 18
// }

// Omit可以从一个对象类型中 排除某些属性
// type OmitPerson = Omit<Person, 'age'>
// const person: OmitPerson = {
//   name: '老韩'
// }

// 创建枚举类型 enum是定义枚举的关键字 通常大写开头
// 成员值默认是从0开始自增
// enum Direction {
//   Up,
//   Down,
//   Left,
//   Right
// }
// 成员值修改成了10,那么之后的成员从10开始自增
// enum Direction {
//   Up = 10,
//   Down,
//   Left,
//   Right
// }
// 如果成员值修改成了字符串,那么之后的成员也得用字符串
// enum Direction {
//   Up,
//   Down = '张三',
//   Left = '李四',
//   Right = '老韩'
// }
// 使用枚举
// const changeDirection = (direction: Direction) => {
//   console.log('direction', direction)
// }
// changeDirection(Direction.Down)
app.use(pinia)
app.use(router)

app.mount('#app')
