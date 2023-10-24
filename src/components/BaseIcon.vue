<script setup>
const props = defineProps({
  size: {
    type: String,
    default: "22px"
  },
  color: {
    type: String,
    default: "#888"
  }
})

</script>
<template>
  <div class="icon-wrap">
    <n-icon :size="size" :color="color">
      <slot></slot>
    </n-icon>
  </div>
</template>

<style lang="scss" scoped>
.icon-wrap {
  margin: 0 3px;
  display: flex;
  align-items: center;
  padding: 3px 3px;

  &:hover {
    background-color: rgb(232, 224, 224);
    border-radius: 5px;
  }
}
</style>