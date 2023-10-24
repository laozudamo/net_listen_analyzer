<script setup>
defineProps({
    triggerType: {
        type: String,
        default: "hover"
    },
    msg: {
        type: String
    },
    btnType:{
        type:String,
    }
})
</script>
<template>
    <n-tooltip :trigger="triggerType">
        <template #trigger>
            <n-button text :type="btnType" style="font-size: 22px">
                <n-icon size="22px">
                    <slot></slot>
                </n-icon>
            </n-button>
        </template>
        {{ msg }}
    </n-tooltip>
</template>
  
<style lang="scss" scoped>

</style>