<script setup>
import { ref } from "vue";
const emit = defineEmits(['afterLeave', 'confirm'])
const props = defineProps({
  title: {
    type: String,
    default: "",
  },
  width: {
    type: String,
    default: '800px',
  },
  height: {
    type: String,
    default: '80vh',
  },
  showMore: {
    type: Boolean,
    default: false,
  },
  theStepList: {
    type: Array,
    default: []
  },
  showConfirm: {
    type: Boolean,
    default: true,
  }
});

let showModel = ref(false);

const show = () => {
  showModel.value = true;
};
const close = () => {
  showModel.value = false;
}

const afterLeave = () => {
  emit('afterLeave')
}

const onConfirm = () => {
  emit('confirm')
}

let current = ref(1);
const carousel = ref(null)

const changeCurrent = (v) => {
  carousel.value.to(v - 1)
}

defineExpose({
  show,
  close
})
</script>

<template>
  <n-modal :style="`width:${width};`" class="the-model" :title="title" v-model:show="showModel" @after-leave="afterLeave"
    preset="dialog" size="small" footer-style="flexEnd">
    <div class="the-step" v-if="showMore">
      <n-steps v-model:current="current" size="small" @update:current="changeCurrent">
        <n-step :title="item" v-for="(item, index) in theStepList" :key="item"></n-step>
      </n-steps>
    </div>
    <n-carousel show-arrow v-if="showMore" :style="`height:${height}`" :show-dots="false" ref="carousel">
      <slot></slot>
    </n-carousel>

    <div :style="`overflow-y:auto;height:${height}`" v-else>
      <slot></slot>
    </div>

    <template #action>
      <div class="footer-box" v-show="showConfirm">
        <!-- <button @click="onConfirm">确认</button> -->
        <n-button size="small" type="primary" @click="onConfirm">
          确认
        </n-button>
      </div>
    </template>
  </n-modal>
</template>


<style scoped lang="scss">
.footer-box {
  display: flex;
  justify-content: flex-end;
}

.the-step {
  margin-bottom: 20px;
}

:deep(.n-tabs .n-tabs-nav-scroll-content) {
  margin-bottom: 10px !important;
}
</style>
