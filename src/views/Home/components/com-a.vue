<script setup lang="ts">
defineProps<{
  modelValue: number
  car: string
}>()

const emit = defineEmits<{
  (e: 'update:modelValue', count: number): void
  (e: 'update:car', car: string): void
}>()
</script>

<template>
  <div class="coma-page">
    子组件:
    <div>{{ modelValue }}</div>
    <button @click="emit('update:modelValue', modelValue + 1)">
      改变count
    </button>
    <div>{{ car }}</div>
    <button @click="emit('update:car', '法拉利')">换车</button>
  </div>
</template>

<style lang="scss" scoped></style>
