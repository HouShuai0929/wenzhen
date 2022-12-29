<script setup lang="ts">
import type { Message, Prescription } from '@/types/room'
import { MsgType } from '@/enums'
// import { flagOptions, timeOptions } from '@/services/constants'
import { PrescriptionStatus } from '@/enums'
import type { Image } from '@/types/consult'
import { showImagePreview, showToast } from 'vant'
import { useUserStore } from '@/stores'
import dayjs from 'dayjs'
// import { getPrescriptionPic } from '@/services/consult'
import { useRouter } from 'vue-router'
import EvaluteCard from './EvaluateCard.vue'
import { useShowPrescription } from '@/composable'
import { getConsultFlagTimeText, getIllnessTimeText } from '@/utils/fillter'
const formatTime = (time: string) => dayjs(time).format('HH:mm')
defineProps<{
  list: Message[]
}>()
const store = useUserStore()

// 处理数据显示
// const getIllnessTimeText = (time: IllnessTime) => {
//   timeOptions.find((item) => item.value === time)?.label
// }
// const getConsultFlagTimeText = (flag: 0 | 1) => {
//   flagOptions.find((item) => item.value === flag)?.label
// }

const previewImg = (pictures: Image[] | undefined) => {
  if (pictures && pictures.length)
    // showImagePreview需要的数据是图片url组成的数组,所以利用map处理一个由url组成的新数组
    showImagePreview(pictures.map((item) => item.url))
}
const router = useRouter()
// 购买药品
const buy = (pre: Prescription | undefined) => {
  console.log(pre)
  if (pre) {
    if (pre.status === PrescriptionStatus.Invalid) return showToast('处方已经失效')
    if (pre.status === PrescriptionStatus.NotPayment && !pre.orderId)
      return router.push(`/order/pay?id=${pre.id}`)
    router.push(`/order/${pre.orderId}`)
  }
}

// 查看处方
const { showPrescription } = useShowPrescription()
// const showPrescription = async (id: string) => {
//   if (id) {
//     const res = await getPrescriptionPic(id)
//     showImagePreview([res.data.url])
//   }
// }
</script>

<template>
  <template v-for="{ msgType, msg, from, createTime, fromAvatar } in list" :key="msg.id">
    <!-- 病情描述 -->
    <div class="msg msg-illness" v-if="msgType === MsgType.CardPat">
      <div class="patient van-hairline--bottom" v-if="msg.consultRecord">
        <p>
          {{ msg.consultRecord?.patientInfo.name }}
          {{ msg.consultRecord?.patientInfo.genderValue }}
          {{ msg.consultRecord?.patientInfo.age }}岁
        </p>
        <p>
          {{ getIllnessTimeText(msg.consultRecord.illnessTime) }} |
          {{ getConsultFlagTimeText(msg.consultRecord.consultFlag) }}
        </p>
      </div>
      <van-row>
        <van-col span="6">病情描述</van-col>
        <van-col span="18">{{ msg.consultRecord?.illnessDesc }}</van-col>
        <van-col span="6">图片</van-col>
        <van-col span="18" @click="previewImg(msg.consultRecord?.pictures)">点击查看</van-col>
      </van-row>
    </div>

    <!-- 温馨提示-通知 -->
    <div class="msg msg-tip" v-if="msgType === MsgType.NotifyTip">
      <div class="content">
        <span class="green">温馨提示：</span>
        <span>{{ msg.content }}</span>
      </div>
    </div>

    <!-- 通知 -->
    <div class="msg msg-tip" v-if="msgType === MsgType.Notify">
      <div class="content">
        <span>{{ msg.content }}</span>
      </div>
    </div>

    <!-- 发送文字 -->
    <div class="msg msg-to" v-if="msgType === MsgType.MsgText && store.user?.id === from">
      <div class="content">
        <div class="time">{{ formatTime(createTime) }}</div>
        <div class="pao">{{ msg.content }}</div>
      </div>
      <van-image :src="store.user?.avatar" />
    </div>

    <!-- 接收文字 -->
    <div class="msg msg-from" v-if="msgType === MsgType.MsgText && store.user?.id !== from">
      <van-image :src="fromAvatar" />
      <div class="content">
        <div class="time">{{ formatTime(createTime) }}</div>
        <div class="pao">{{ msg.content }}</div>
      </div>
    </div>
    <!-- 发送图片 -->
    <!-- 自己发的 -->
    <div class="msg msg-to" v-if="msgType === MsgType.MsgImage && store.user?.id === from">
      <div class="content">
        <div class="time">{{ formatTime(createTime) }}</div>
        <van-image fit="contain" :src="msg.picture?.url" />
      </div>
      <van-image :src="store.user?.avatar" />
    </div>
    <!-- 医生发的 -->
    <div class="msg msg-from" v-if="msgType === MsgType.MsgImage && store.user?.id !== from">
      <van-image :src="fromAvatar" />
      <div class="content">
        <div class="time">{{ formatTime(createTime) }}</div>
        <van-image fit="contain" :src="msg.picture?.url" />
      </div>
    </div>

    <!-- 处方消息 -->
    <div class="msg msg-recipe" v-if="msgType === MsgType.CardPre">
      <div class="content" v-if="msg.prescription">
        <div class="head van-hairline--bottom">
          <div class="head-tit">
            <h3>电子处方</h3>
            <p @click="showPrescription(msg.prescription!.id)">
              原始处方 <van-icon name="arrow"></van-icon>
            </p>
          </div>
          <p>
            {{ msg.prescription.name }} {{ msg.prescription.genderValue }}
            {{ msg.prescription.age }}岁 {{ msg.prescription.diagnosis }}
          </p>
          <p>开方时间：{{ msg.prescription.createTime }}</p>
        </div>
        <div class="body">
          <div class="body-item" v-for="med in msg.prescription.medicines" :key="med.id">
            <div class="durg">
              <p>{{ med.name }} {{ med.specs }}</p>
              <p>{{ med.usageDosag }}</p>
            </div>
            <div class="num">x{{ med.quantity }}</div>
          </div>
        </div>
        <div class="foot">
          <span @click="buy(msg.prescription)">购买药品</span>
        </div>
      </div>
    </div>

    <div
      class="msg msg-comment"
      v-if="msgType === MsgType.CardEva || msgType === MsgType.CardEvaForm"
    >
      <EvaluteCard :evaluateDoc="msg.evaluateDoc" />
    </div>

    <!-- 订单取消 -->
    <div class="msg msg-tip msg-tip-cancel" v-if="msgType === MsgType.NotifyCancel">
      <div class="content">
        <span>{{ msg.content }}</span>
      </div>
    </div>
  </template>
</template>

<style lang="scss" scoped>
@import '@/styles/room.scss';
</style>
