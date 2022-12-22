<script setup lang="ts">
import RoomStatus from './component/RoomStatus.vue'
import RoomMessage from './component/RoomMessage.vue'
import RoomAction from './component/RoomAction.vue'
import type { Socket } from 'socket.io-client'
import { io } from 'socket.io-client'
import { onMounted, onUnmounted } from 'vue'
import { baseURL } from '@/utils/request'
import { useUserStore } from '@/stores'
import { useRoute } from 'vue-router'
import { MsgType } from '@/enums'
import type { Message, TimeMessages } from '@/types/room'
import { ref, nextTick } from 'vue'
import { getConsultOrderDetail } from '@/services/consult'
import type { ConsultOrderItem, Image } from '@/types/consult'
import { OrderType } from '@/enums'
const store = useUserStore()
const route = useRoute()
const list = ref<Message[]>([])
let socket: Socket
onUnmounted(() => {
  // 关闭连接
  socket.close()
})

onMounted(() => {
  // 建立链接, 创建socket.id实例
  socket = io(baseURL, {
    auth: {
      token: `Bearer ${store.user?.token}`
    },
    // 需要根据orderId来判断跟谁连接起来(跟医生连接起来)
    query: {
      orderId: route.query.orderId
    }
  })

  socket.on('connect', () => {
    // 建立连接成功
    console.log('连接成功了')
  })

  socket.on('error', (event) => {
    // 出现错误打印一下
    console.log('错了', event)
  })

  socket.on('disconnect', () => {
    //已经断开链接
    console.log('断开连接')
  })

  // 聊天记录(默认消息)
  // 1. 监听消息记录事件, 后台连接成功,会主动发消息
  // 2. 拿到消息分组之后,处理成可用的消息列表
  // 3. 创建一个响应式数据, 接收数据,然后渲染
  socket.on('chatMsgList', ({ data }: { data: TimeMessages[] }) => {
    console.log('chatMsgList', data)
    // 处理消息: 增加一个分组时间,自己拼接一个通用消息,items取完放在新增消息的后面
    const arr: Message[] = []
    data.forEach((item) => {
      arr.push({
        msgType: MsgType.Notify,
        msg: { content: item.createTime },
        createTime: item.createTime,
        id: item.createTime
      })
      arr.push(...item.items)
    })
    // 追加到聊天消息列表里
    list.value.unshift(...arr)
  })

  // 订单状态监听
  socket.on('statusChange', async () => {
    const res = await getConsultOrderDetail(route.query.orderId as string)
    consult.value = res.data
    console.log('状态变更了')
  })

  // 接收消息
  socket.on('receiveChatMsg', async (event) => {
    console.log('接收消息', event)
    list.value.push(event)
    await nextTick()
    socket.emit('updateMsgStatus', event.id)
    // 滚动到底部
    window.scrollTo(0, document.body.scrollHeight)
  })
})
// 接诊状态的控制 (订单详情变化)
// 1. 组件挂载后,需要知道当前订单状态
// 2. 订单状态发生变更,需要知道变化,更新当前接诊状态
// 3. 状态栏 需要根据调解渲染   倒计时
// 4. 操作栏 需要禁用和启用

const consult = ref<ConsultOrderItem>()
// 在setup里生命周期可以写多次
onMounted(async () => {
  const res = await getConsultOrderDetail(route.query.orderId as string)
  consult.value = res.data
})

// 发送文字消息
// 1. 底部操作栏,输入信息,传递给父组件
// 2. 由父组件发送消息,通过emit发送消息: sendChatMsg
// 3. 接收消息: 用on: receiveChatMsg接收服务器返回的消息
// 4. 渲染的时候需要区分是自己发的还是医生发的
const sendText = (text: string) => {
  console.log('text', text)
  socket.emit('sendChatMsg', {
    from: store.user?.id,
    to: consult.value?.docInfo?.id,
    msgType: MsgType.MsgText,
    msg: {
      content: text
    }
  })
}

// 发送图片
// 1. 底部操作栏上传图片, 成功后把图片传递给父组件 {id, url}
// 2. 由父组件发送消息, 通过emit   sendChatMsg
// 3. 渲染时区分是自己发的还是医生发的
const sendImage = (img: Image) => {
  console.log('image', img)
}
</script>

<template>
  <div class="room-page">
    <cp-nav-bar title="问诊室" />
    <!-- 头部 -->
    <room-status
      :status="consult?.status"
      :countdown="consult?.countdown"
    ></room-status>

    <!-- 消息卡片区域 -->
    <room-message :list="list"></room-message>
    <!-- 操作栏 -->
    <room-action
      :disabled="consult?.status !== OrderType.ConsultChat"
      @send-text="sendText"
      @send-image="sendImage"
    ></room-action>
  </div>
</template>

<style lang="scss" scoped>
.room-page {
  padding-top: 90px;
  padding-bottom: 60px;
  min-height: 100vh;
  box-sizing: border-box;
  background-color: var(--cp-bg);
  .van-pull-refresh {
    width: 100%;
    min-height: calc(100vh - 150px);
  }
}
</style>
