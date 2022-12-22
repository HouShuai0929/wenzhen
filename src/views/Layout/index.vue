<script setup lang="ts"></script>

<template>
  <div class="layout-page">
    <router-view></router-view>
    <van-tabbar route>
      <van-tabbar-item replace to="/home"
        >首页
        <template #icon="{ active }">
          <cp-icon
            :name="`home-index-${active ? 'active' : 'default'}`"
          ></cp-icon> </template
      ></van-tabbar-item>
      <van-tabbar-item replace to="/article"
        >健康百科
        <template #icon="{ active }">
          <cp-icon
            :name="`home-article-${active ? 'active' : 'default'}`"
          ></cp-icon> </template
      ></van-tabbar-item>
      <van-tabbar-item replace to="/notify"
        >消息中心
        <template #icon="{ active }">
          <cp-icon
            :name="`home-notice-${active ? 'active' : 'default'}`"
          ></cp-icon> </template
      ></van-tabbar-item>
      <van-tabbar-item replace to="/user"
        >我的
        <template #icon="{ active }">
          <cp-icon
            :name="`home-mine-${active ? 'active' : 'default'}`"
          ></cp-icon> </template
      ></van-tabbar-item>
    </van-tabbar>
  </div>
</template>

<style lang="scss" scoped>
.layout-page {
  ::v-deep() {
    .van-tabbar-item {
      &__icon {
        font-size: 21px;
      }
      &__text {
        font-size: 11px;
      }
    }
  }
}
</style>
