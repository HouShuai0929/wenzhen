<script setup lang="ts">
// 使用的时候传入图片名字即可
defineProps<{
  name: string
}>()
</script>

<template>
  <svg aria-hidden="true" class="cp-icon">
    <!-- #icon-文件夹名称-图片名称 -->
    <use :href="`#icon-${name}`" />
  </svg>
</template>

<style lang="scss" scoped>
.cp-icon {
  // 和字体一样大
  width: 1em;
  height: 1em;
}
</style>
