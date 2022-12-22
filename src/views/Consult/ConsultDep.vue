<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { getAllDep } from '@/services/consult'
import type { TopDep } from '@/types/consult'
import { useConsultStore } from '@/stores'
const store = useConsultStore()
const active = ref(0)
const allDep = ref<TopDep[]>([])
onMounted(async () => {
  const res = await getAllDep()
  console.log('res', res)
  allDep.value = res.data
})

// 二级科室根据一级科室变化而变化 注意: 初始化的时候是没有数据的,所以使用了可选链操作符
const subDep = computed(() => allDep.value[active.value]?.child)
</script>

<template>
  <div class="consult-dep-page">
    <cp-nav-bar title="选择科室"></cp-nav-bar>
    <div class="wrapper">
      <!-- 一级科室 -->
      <van-sidebar v-model="active">
        <van-sidebar-item
          v-for="top in allDep"
          :key="top.id"
          :title="top.name"
        />
      </van-sidebar>
      <!-- 二级科室 -->
      <div class="sub-dep">
        <router-link
          v-for="sub in subDep"
          :key="sub.id"
          to="/consult/illness"
          @click="store.setDep(sub.id)"
          >{{ sub.name }}</router-link
        >
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.van-sidebar {
  width: 114px;
  &-item {
    padding: 14px;
    color: var(--cp-tag);
    &--select {
      color: var(--cp-main);
      font-weight: normal;
      &::before {
        display: none;
      }
    }
  }
}
.consult-dep-page {
  padding-top: 46px;
}
.wrapper {
  height: calc(100vh - 46px);
  overflow: hidden;
  display: flex;
  .sub-dep {
    flex: 1;
    height: 100%;
    overflow-y: auto;
    > a {
      display: block;
      padding: 14px 30px;
      color: var(--cp-dark);
    }
  }
}
</style>
