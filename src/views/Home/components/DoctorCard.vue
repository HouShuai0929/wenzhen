<script lang="ts" setup>
// import { followDoctor } from '@/services/consult'
import type { Doctor } from '@/types/consult'
import { useFollow } from '@/composable'
// import { ref } from 'vue'
defineProps<{
  item: Doctor
}>()
// 关注操作
// const loading = ref(false)
// const follow = async (doc: Doctor) => {
//   loading.value = true
//   try {
//     await followDoctor(doc.id)
//     doc.likeFlag = doc.likeFlag === 1 ? 0 : 1
//     // if (doc.likeFlag === 1) {
//     //   doc.likeFlag = 0
//     // } else {
//     //   doc.likeFlag = 1
//     // }
//   } finally {
//     loading.value = false
//   }
// }
// hook函数形式封装调用关注操作
const { loading, follow } = useFollow()
</script>
<template>
  <div class="doctor-card">
    <van-image round :src="item.avatar" />
    <p class="name">{{ item.name }}</p>
    <p class="van-ellipsis">{{ item.hospitalName }} {{ item.depName }}</p>
    <p>{{ item.positionalTitles }}</p>
    <van-button
      :loading="loading"
      @click="follow(item)"
      round
      size="small"
      type="primary"
      >{{ item.likeFlag === 1 ? '已关注' : '+ 关注' }}</van-button
    >
  </div>
</template>
<style scoped lang="scss">
.doctor-card {
  width: 135px;
  height: 190px;
  background: #fff;
  border-radius: 20px;
  box-shadow: 0px 0px 11px 0px rgba(229, 229, 229, 0.2);
  text-align: center;
  padding: 15px;
  margin-left: 15px;
  display: inline-block;
  box-sizing: border-box;
  > .van-image {
    width: 58px;
    height: 58px;
    vertical-align: top;
    border-radius: 50%;
    margin: 0 auto 8px;
  }
  > p {
    margin-bottom: 0;
    font-size: 11px;
    color: var(--cp-tip);
    &.name {
      font-size: 13px;
      color: var(--cp-text1);
      margin-bottom: 5px;
    }
  }
  > .van-button {
    padding: 0 12px;
    height: 28px;
    margin-top: 8px;
    width: 72px;
  }
}
</style>
