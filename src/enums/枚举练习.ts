// export {}
// // 枚举应用: 1.性别

// enum GenderType {
//   Girl,
//   Boy
// }

// const showGender = (gender: GenderType) => {
//   // 枚举让成员特别语义化 好理解代码
//   if (gender === GenderType.Boy) {
//     console.log('性别男')
//   }
//   // if (gender === 1) {
//   //   console.log('性别男')
//   // }
// }
// showGender(GenderType.Boy)

// // 订单状态
// enum OrderStatus {
//   UnPay = 1,
//   Payed = 5,
//   Complete = 8
// }
// const showOrderStatus = (status: OrderStatus) => {
//   if (status === OrderStatus.UnPay) {
//     console.log('状态: 未付款')
//   }
//   if (status === OrderStatus.Payed) {
//     console.log('状态: 已付款')
//   }
//   if (status === OrderStatus.Complete) {
//     console.log('状态: 已完成')
//   }
//   // 对比 不用枚举 直接用数字判断 可读性不好,维护性差
//   // if (status === 1) {
//   //   console.log('状态: 未付款')
//   // }
//   // if (status === 5) {
//   //   console.log('状态: 已付款')
//   // }
//   // if (status === 8) {
//   //   console.log('状态: 已完成')
//   // }
// }
// showOrderStatus(OrderStatus.Complete)
