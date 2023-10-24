<script setup>
const props = defineProps({
  msg: {
    required: true
  }
})
</script>

<template>
  <n-tooltip trigger="hover">
    <template #trigger>
      <div class="icon-wrap">
        <n-icon size="22px">
          <slot></slot>
        </n-icon>
      </div>
    </template>
    {{ msg }}
  </n-tooltip>

</template>

<style lang="scss" scoped>
.icon-wrap {
  margin: 0 3px;
  padding: 3px 3px;
  display: flex;
  align-items: center;

  &:hover {
    background-color: rgb(232, 224, 224);
    border-radius: 5px;
  }
}
</style>