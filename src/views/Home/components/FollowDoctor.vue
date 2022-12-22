<script setup lang="ts">
import DoctorCard from './DoctorCard.vue'
import { useWindowSize } from '@vueuse/core'
import { getDoctorPage } from '@/services/consult'
import type { DoctorList } from '@/types/consult'
import { ref, onMounted } from 'vue'
// 原生实现监听设备宽度变化
// const width = ref(0)
// const setWidth = () => (width.value = window.innerWidth)
// onMounted(() => {
//   // 设置一下当前设备宽
//   setWidth()
//   window.addEventListener('resize', setWidth)
// })

// onUnmounted(() => {
//   window.removeEventListener('resize', setWidth)
// })
// vueuse包 一行解决问题
const { width } = useWindowSize()

const list = ref<DoctorList>()
const loadData = async () => {
  const res = await getDoctorPage({
    current: 1,
    pageSize: 5
  })
  list.value = res.data.rows
}

onMounted(() => {
  loadData()
})
</script>

<template>
  <div class="follow-doctor">
    <div className="head">
      <p>推荐关注</p>
      <a href="javascript:;"> 查看更多<i class="van-icon van-icon-arrow" /></a>
    </div>
    <div class="body">
      <!-- swipe 组件 -->
      <van-swipe
        :width="(150 / 375) * width"
        :show-indicators="false"
        :loop="false"
      >
        <van-swipe-item v-for="item in list" :key="item.id">
          <DoctorCard :item="item" />
        </van-swipe-item>
      </van-swipe>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.follow-doctor {
  background-color: var(--cp-bg);
  height: 250px;
  .head {
    display: flex;
    justify-content: space-between;
    height: 45px;
    align-items: center;
    padding: 0 15px;
    font-size: 13px;
    > a {
      color: var(--cp-tip);
    }
  }
  .body {
    width: 100%;
    overflow: hidden;
  }
}
</style>
