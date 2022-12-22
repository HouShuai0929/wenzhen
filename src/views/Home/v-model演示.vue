<script setup lang="ts">
import { ref } from 'vue'
import ComA from './components/com-a.vue'
const car = ref('小黄车')
const count = ref(10)
// vue3 v-model="count" === v-model:modelValue='count'  等价于  :modelValue='count' emit: 绑定了update:modelValue事件
// :后面的才是给子组件动态绑定的属性
// v-model:xxx='car'  相当于  :xxx='car'     @update:xxx='car=$event'
</script>

<template>
  <div class="home-page">
    父组件: {{ count }} ---- {{ car }}
    <ComA v-model="count" v-model:car="car"></ComA>
    <!-- <ComA
      :modelValue="count"
      @update:modelValue="count = $event"
      :car="car"
      @update:car="car = $event"
    ></ComA> -->
  </div>
</template>

<style lang="scss" scoped></style>
