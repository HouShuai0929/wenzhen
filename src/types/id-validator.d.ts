declare module 'id-validator' {
  // 默认导出的是  class: es6    构造函数: es5
  export default class {
    // es6类中的方法, 对应es5的原型方法
    isValid(id: string): boolean
    getInfo(id: string): {
      sex: number
    }
  }
}
