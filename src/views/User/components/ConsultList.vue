<script setup lang="ts">
import { ref } from 'vue'
import type { ConsultOrderItem, ConsultOrderListParams } from '@/types/consult'
import { getConsultOrderList } from '@/services/consult'
import ConsultItem from './ConsultItem.vue'
import type { ConsultType } from '@/enums'

const props = defineProps<{
  type: ConsultType
}>()
const loading = ref(false)
const finished = ref(false)
const list = ref<ConsultOrderItem[]>([])
// 接口参数
const params = ref<ConsultOrderListParams>({
  type: props.type,
  current: 1,
  pageSize: 5
})
const onLoad = async () => {
  const res = await getConsultOrderList(params.value)
  console.log('res', res)
  list.value.push(...res.data.rows)
  // 数据是否加载完了
  if (params.value.current < res.data.pageTotal) {
    params.value.current++
  } else {
    finished.value = true
  }
  loading.value = false
}

// 删除功能(list里删除掉传出的这项)
const onDelete = (id: string) => {
  list.value = list.value.filter((item) => item.id !== id)
}
</script>

<template>
  <div class="consult-list">
    <van-list
      v-model:loading="loading"
      :finished="finished"
      finished-text="没有更多了"
      @load="onLoad"
    >
      <consult-item v-for="item in list" :key="item.id" :item="item" @on-delete="onDelete" />
    </van-list>
  </div>
</template>

<style lang="scss" scoped>
.consult-list {
  padding: 10px 15px;
}
</style>
