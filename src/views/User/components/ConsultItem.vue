<script setup lang="ts">
import type { ConsultOrderItem } from '@/types/consult'
// import { deleteOrder } from '@/services/consult'
import { OrderType } from '@/enums'
// import { ref } from 'vue'
// import { showFailToast, showSuccessToast } from 'vant'
import { useShowPrescription } from '@/composable'
import { useCancelOrder, useDeleteOrder } from '@/composable'
const { showPrescription } = useShowPrescription()
const { item } = defineProps<{
  item: ConsultOrderItem
}>()

// const showPopover = ref(false)
// const actions = computed(() => [
//   { text: '查看处方', disabled: !item.prescriptionId },
//   { text: '删除订单' }
// ])
// const onSelect = (action: { text: string }, i: number) => {
//   if (i === 0) {
//     showPrescription(item.prescriptionId as string)
//   }
//   if (i === 1) {
//     deleteConsultOrder(item)
//   }
// }

// 取消功能
const { loading, cancelConsultOrder } = useCancelOrder()
// const loading = ref(false)
// const cancelConsultOrder = (item: ConsultOrderItem) => {
//   loading.value = true
//   cancelOrder(item.id)
//     .then(() => {
//       // 取消成功之后,改一下当前的项的状态
//       item.status = OrderType.ConsultCancel
//       item.statusValue = '已取消'
//       showSuccessToast('取消成功')
//       loading.value = false
//     })
//     .catch(() => {
//       showFailToast('取消失败')
//       loading.value = false
//     })
//   // 两种形式都可以
//   // .finally(() => {
//   //   loading.value = false
//   // })
// }

// 删除功能
const emit = defineEmits<{
  (e: 'on-delete', id: string): void
}>()
const { deleteLoading, deleteConsultOrder } = useDeleteOrder(() => {
  emit('on-delete', item.id)
})
// const deleteLoading = ref(false)
// const deleteConsultOrder = (item: ConsultOrderItem) => {
//   deleteLoading.value = true
//   deleteOrder(item.id)
//     .then(() => {
//       emit('on-delete', item.id)
//       showSuccessToast('删除成功')
//     })
//     .catch(() => {
//       showFailToast('删除失败')
//     })
//     // 其实是有finally方法的,项目默认的ts编译库没有finally方法,不用管
//     .finally(() => {
//       deleteLoading.value = false
//     })
// }
</script>

<template>
  <div class="consult-item" v-if="item">
    <div class="head van-hairline--bottom">
      <img class="img" src="@/assets/avatar-doctor.svg" />
      <p>{{ item.docInfo?.name || '暂未分配医生' }}</p>
      <span
        :class="{
          orange: item.status === OrderType.ConsultPay,
          green: item.status === OrderType.ConsultChat
        }"
        >{{ item.statusValue }}</span
      >
    </div>
    <div class="body" @click="$router.push(`/user/consult/${item.id}`)">
      <div class="body-row">
        <div class="body-label">病情描述</div>
        <div class="body-value">{{ item.illnessDesc }}</div>
      </div>
      <div class="body-row">
        <div class="body-label">价格</div>
        <div class="body-value">¥ {{ item.payment.toFixed(2) }}</div>
      </div>
      <div class="body-row">
        <div class="body-label">创建时间</div>
        <div class="body-value tip">{{ item.createTime }}</div>
      </div>
    </div>

    <!-- 待支付：取消问诊+去支付
         待接诊：取消问诊+继续沟通
         咨询中：查看处方（如果开了）+继续沟通
         已完成：更多（查看处方，如果开了，删除订单）+问诊记录+（未评价?写评价:查看评价）
         已取消：删除订单+咨询其他医生 -->

    <!-- 待支付 -->
    <div class="foot" v-if="item.status === OrderType.ConsultPay">
      <van-button
        :loading="loading"
        @click="cancelConsultOrder(item)"
        class="gray"
        plain
        size="small"
        round
        >取消问诊</van-button
      >
      <van-button type="primary" plain size="small" round :to="`/user/consult/${item.id}`"
        >去支付</van-button
      >
    </div>
    <!-- 待接诊 -->
    <div class="foot" v-if="item.status === OrderType.ConsultWait">
      <van-button
        :loading="loading"
        @click="cancelConsultOrder(item)"
        class="gray"
        plain
        size="small"
        round
        >取消问诊</van-button
      >
      <van-button type="primary" plain size="small" round :to="`/room?orderId=${item.id}`"
        >继续沟通</van-button
      >
    </div>

    <!-- 咨询中 -->
    <div class="foot" v-if="item.status === OrderType.ConsultChat">
      <van-button v-if="item.prescriptionId" class="gray" plain size="small" round
        >查看处方</van-button
      >
      <van-button type="primary" plain size="small" round :to="`/room?orderId=${item.id}`"
        >继续沟通</van-button
      >
    </div>

    <!-- 已完成 -->
    <div class="foot" v-if="item.status === OrderType.ConsultComplete">
      <div class="more">
        <!-- <van-popover
          placement="top-start"
          v-model:show="showPopover"
          :actions="actions"
          @select="onSelect"
        >
          <template #reference> 更多 </template>
        </van-popover> -->
        <cp-consult-more
          :disabled="!item.prescriptionId"
          @on-delete="deleteConsultOrder(item)"
          @on-preview="showPrescription(item.prescriptionId as string)"
        ></cp-consult-more>
      </div>
      <van-button
        v-if="item.prescriptionId"
        class="gray"
        plain
        size="small"
        round
        :to="`/room?orderId=${item.id}`"
        >问诊记录</van-button
      >
      <van-button
        v-if="!item.evaluateId"
        type="primary"
        plain
        size="small"
        round
        :to="`/room?orderId=${item.id}`"
        >写评价</van-button
      >
      <van-button v-else type="primary" plain size="small" round :to="`/room?orderId=${item.id}`"
        >查看评价</van-button
      >
    </div>

    <!-- 已取消 -->
    <div class="foot" v-if="item.status === OrderType.ConsultCancel">
      <van-button
        :loading="deleteLoading"
        @click="deleteConsultOrder(item)"
        class="gray"
        plain
        size="small"
        round
        >删除订单</van-button
      >
      <van-button type="primary" plain size="small" round to="/">咨询其他医生</van-button>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.consult-item {
  border-radius: 4px;
  box-shadow: 0px 0px 22px 0px rgba(245, 245, 245, 0.1);
  background-color: #fff;
  margin-bottom: 10px;
  .head {
    display: flex;
    align-items: center;
    height: 50px;
    padding: 0 15px;
    .img {
      width: 20px;
      height: 20px;
    }
    > p {
      flex: 1;
      font-size: 15px;
      padding-left: 10px;
    }
    > span {
      color: var(--cp-tag);
      &.orange {
        color: #f2994a;
      }
      &.green {
        color: var(--cp-primary);
      }
    }
  }
  .body {
    padding: 15px 15px 8px 15px;
    .body-row {
      display: flex;
      margin-bottom: 7px;
    }
    .body-label {
      width: 62px;
      font-size: 13px;
      color: var(--cp-tip);
    }
    .body-value {
      width: 250px;
      &.tip {
        color: var(--cp-tip);
      }
    }
  }
  .foot {
    padding: 0 15px 15px 15px;
    display: flex;
    justify-content: flex-end;
    align-items: center;
    .van-button {
      margin-left: 10px;
      padding: 0 16px;
      &.gray {
        color: var(--cp-text3);
        background-color: var(--cp-bg);
      }
    }
    .more {
      color: var(--cp-tag);
      flex: 1;
      font-size: 13px;
    }
  }
}
</style>
