<script setup>
import { ref, reactive, onMounted, onUnmounted, nextTick } from 'vue';
import { CloseOutline } from '@vicons/ionicons5';
const emit = defineEmits(['afterLeave', 'confirm'])

const porps = defineProps({
  title: {
    type: String,
    default: ''
  },
  visible: {
    type: Boolean,
    default: false
  },
  showConfirm: {
    type: Boolean,
    default: true,
  },
  width: {
    type: String,
    default: '700px',
  },
  height: {
    type: String,
    default: '80vh',
  },
})

/* 处理高度和宽度 */

let visible = ref(false)

const modal = ref(null);
const modalWidth = porps.width
const modalHeight = porps.height
const top = ref(0);
const left = ref(0);
let key = ref(0)

function show () {
  visible.value = true
  nextTick(() => {
    centerModal()
  })
}

function close () {
  afterLeave()
  visible.value = false
}


const afterLeave = () => {
  emit('afterLeave')
}

const onConfirm = () => {
  emit('confirm')
}

function esc (event) {
  if (event.code === "Escape") {
    close()
  }
}

function addEsc () {
  document.addEventListener('keydown', esc)
}

function removeEsc () {
  document.removeEventListener('keydown', esc)
}

onMounted(() => {
  addEsc()
})

onUnmounted(() => {
  // afterLeave()
  removeEsc()
});

defineExpose({
  show,
  close
})

function mousedown (e) {
  let disX = e.clientX - modal.value.offsetLeft;
  let disY = e.clientY - modal.value.offsetTop;

  document.onmousemove = (e) => {
    // 用鼠标的位置减去鼠标相对元素的位置，得到元素的位置
    let tmpLeft = e.clientX - disX;
    let tmpTop = e.clientY - disY;

    if (tmpLeft <= 0) {
      left.value = 0
    } else if (tmpLeft >= (document.documentElement.clientWidth - modal.value.clientWidth)) {
      left.value = document.documentElement.clientWidth - modal.value.clientWidth
    } else if (tmpTop <= 0) {
      top.value = 0
    } else if (tmpTop >= (document.documentElement.clientHeight - modal.value.clientHeight)) {
      top.value = document.documentElement.clientHeight - modal.value.clientHeight
    }
    else {
      left.value = tmpLeft
      top.value = tmpTop
    }
  },

    document.onmouseup = e => {
      document.onmousemove = null;
      document.onmouseup = null;
    }
}

const centerModal = () => {
  const screenWidth = window.innerWidth;
  const screenHeight = window.innerHeight;
  left.value = (screenWidth - modal.value.clientWidth) / 2;
  top.value = (screenHeight - modal.value.clientHeight) / 2;
};


</script>

<template>
  <div :class="{ 'modal-overlay': visible }">
    <div class="the-dialog" ref="modal" v-if="visible"
      :style="{ marginLeft: left + 'px', marginTop: top + 'px', width: modalWidth }">
      <header class="header" @mousedown="mousedown">
        <div class="title">{{ title }}</div>
        <n-icon size="30" class="close-icon" @click="close">
          <CloseOutline />
        </n-icon>
      </header>
      <div class="dialog-content" :style="{ height: modalHeight }">
        <slot></slot>
      </div>
      <footer class="footer" v-show="showConfirm">
        <button class="confirm-btn" @click="onConfirm">确 认</button>
      </footer>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.the-dialog {
  z-index: 9999;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  overflow: auto;
  border-radius: 15px;
}

.dialog-content {
  overflow-y: auto;
  padding: 10px 24px 0px;
  width: 100%;
  height: 100%;
  background: #fff;
}

.title {
  font-size: 20px;
  color: #112d4e;
}

.header {
  height: 50px;
  background: #fff;
  display: flex;
  justify-content: space-between;
  padding: 0px 24px;
  align-items: center;
  cursor: move;

  .close-icon {
    cursor: pointer;

    &:hover {
      background-color: #88888853;
      border-radius: 5px;
    }
  }
}

.footer {
  padding-right: 20px;
  display: flex;
  align-items: center;
  justify-content: flex-end;
  height: 40px;
  background-color: #fff;
  background-color: rgb(250, 250, 252);;
}

.confirm-btn {
  width: 80px;
  height: 30px;
  border-radius: 5px;
  background: #2969FF;
  color: #fff;
  border: 1px solid #888;
  // &:hover {
  //   background-color: #1060C9FF;
  //   color: #fff;
  //   cursor: pointer;
  // }
}
.modal-overlay {
  z-index: 300;
  // position: absolute;
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100%;
  background-color: rgba(105, 100, 100, 0.3);
}
</style>

