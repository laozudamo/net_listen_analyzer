<script setup>
const props = defineProps({
  msg: {
    type: String,
  },
  type: {
    default: 'default',
  },
  size: {
    type: String,
    default: 'small',
  },
  quaternary: {
    type: Boolean,
    default: true,
  },
  position: {
    type: String,
    default: 'left',
  },
  color: {
    type: String,
    default: "#FFF",
  }
})

</script>

<template>
  <n-button :quaternary="quaternary" :size="size" :type="type" class="the-btn" :icon-placement="position">
    <template #icon>
      <n-icon :color="color">
        <slot></slot>
      </n-icon>
    </template>
    <span v-if="msg">{{ msg }}</span>
  </n-button>
</template>

<style lang="scss" scoped>
.the-btn {
  margin: 0 5px;
}
</style>