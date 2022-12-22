<script setup lang="ts">
// 支持传入title 和rightText 点击右侧文字的行为(props传入)
// vue3的router 和 route 需要引入方法然后获取
import { useRouter } from 'vue-router'
const router = useRouter()
const props = defineProps<{
  title?: string
  rightText?: string
  // 提供一个back props  当左侧点击事件想自定义时,可以传入
  back?: () => void
}>()

// 点击左侧按钮 返回功能
const onClickLeft = () => {
  if (props.back) {
    return props.back()
  }
  // 判断一下历史记录里可不可以回退
  console.log('历史', history)
  console.log('router', router)
  if (history.state.back) {
    router.back()
  } else {
    // 没有历史记录就跳到首页
    router.push('/')
  }
}
// 右侧点击行为
const emit = defineEmits<{
  (e: 'click-right'): void
}>()
// 点击右侧按钮
const onClickRight = () => {
  emit('click-right')
}
</script>

<template>
  <van-nav-bar
    fixed
    :title="title"
    :right-text="rightText"
    left-arrow
    @click-left="onClickLeft"
    @click-right="onClickRight"
  />
</template>

<style lang="scss" scoped>
::v-deep() {
  .van-nav-bar {
    &__arrow {
      font-size: 18px;
      color: var(--cp-text1);
    }
    &__text {
      font-size: 15px;
    }
  }
}
</style>
