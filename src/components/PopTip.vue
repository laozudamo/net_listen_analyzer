<script setup>
import { QuestionCircle48Filled } from "@vicons/fluent";

const props = defineProps({
  des: {
    type: String,
    default: "请输入描述"
  }
})

</script>

<template>
  <n-popover trigger="hover" placement="right-start" width="500px">
    <template #trigger>
      <n-icon size="25">
        <QuestionCircle48Filled />
      </n-icon>
    </template>
    <div>
      {{ des }}
    </div>
  </n-popover>
</template>

<style lang="scss" scoped></style>