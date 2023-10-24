<script setup>
import './PopTip.vue'
const props = defineProps({
  title: {
    type: String,
    default: "默认Title",
  },
  showTip: {
    type: Boolean,
    default: false,
  },
  des: {
    type: String,
    default: "请输入描述"
  }
})
</script>

<template>
  <div class="the-tile">
    <div class="title">{{ title }}</div>
    <PopTip v-if="showTip" :des="des">
    </PopTip>
  </div>
</template>

<style lang="scss" scoped>
.the-tile {
  display: flex;
  align-items: center;
  position: relative;
  padding-left: 12px;
  height: 44px;
  line-height: 44px;
  font-weight: 500;
  font-size: 20px;
  background: #F0F0F0;
}

.title {
  position: relative;
  padding-left: 20px;

  &::before {
    position: absolute;
    content: '';
    display: inline-block;
    top: 12px;
    left: 2px;
    width: 4px;
    height: 20px;
    background-color: #2969FF;
    margin-right: 10px;
  }
}
</style>