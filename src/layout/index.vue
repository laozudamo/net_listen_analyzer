<script setup>
import ToolBar from "./ToolBar.vue";
</script>

<template>
  <n-notification-provider placement="bottom-left">
    <div class="the-main">
      <tool-bar></tool-bar>
      <!-- 主要页面内容 -->
      <div class="the-content">
        <router-view></router-view>
      </div>
    </div>
  </n-notification-provider>
</template>

<style lang="scss" scoped>
.the-main {
  width: 100%;
  height: 100%;
  background-color: #E9EAEC;
}

.the-content {
  width: 100%;
  // margin-top: 20px;
  // overflow: hidden;
  background-color: #E9EAEC;
}
</style>
