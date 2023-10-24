<script setup>

import { reactive, toRef, ref, computed, watch, toRefs } from 'vue';
import bus from 'vue3-eventbus'

const props = defineProps({
  capture: {
    type: Array,
  },
  capType: {
    type: String,
  }
})

let cardCapture = ref([])

function compare (p) {
  return function (m, n) {
    var a = m[p]
    var b = n[p]
    return a - b
  }
}

let clientPorts = ref([])
let serverPorts = ref([])

bus.on('checkClient', e => {
  clientPorts.value = e
})

bus.on('checkServer', e => {
  serverPorts.value = e
})


bus.on('selectClientPort', e => {
  clientPorts.value = e
})

bus.on('selectServerPort', e => {
  serverPorts.value = e
})

let tmpPort = computed(() => Array.from(new Set([...clientPorts.value, ...serverPorts.value])))

let curTab = ref(null)

watch(() => props.capture, () => {
  cardCapture.value = [...props.capture]
  curTab.value = cardCapture.value?.map(item => item.port)[0]
}, { immediate: true })

watch(tmpPort, () => {
  handleCapture()
})

function handleCapture () {
  let tmpCapture = tmpPort.value.map((item, i) => {

    let hasPort = cardCapture.value?.some((v, i) => v.port === item)

    let j = -1
    cardCapture.value?.forEach((v, i) => {
      if (v.port === item) {
        j = i
      }
    })

    if (hasPort && j >= 0) {
      return cardCapture.value[j]
    }
    return {
      port: [item],
      switch: true,
      bpf_filter: "",
      capture_file_size: "", //捕获文件大小
      limit: 1000,
      capture_file: props.capType + '_' + 'port' + item + '.pcap',
      mode: "fixed" // cyclic , fixed
    }
  })
  tmpCapture.sort(compare("port"))
  cardCapture.value = tmpCapture
  let ports = cardCapture.value.map(item => item.port)
  if (ports.length > 0) {
    curTab.value = ports[0]
  }

  console.log(curTab.value)
}

defineExpose({
  capture: cardCapture
})

const updateTab = (val) => {
  curTab.value = val
}


const statusVal = ref()
const feedBackVal = ref()
const capInput = (value) => {
  verifyInput(value.data)
}
const verifyInput = (str) => {
  let isRight = /[\u4E00-\u9FA5]/g.test(str)
  if (isRight) {
    statusVal.value = 'error'
    feedBackVal.value = '捕获名称不能包含中文'
  } else {
    statusVal.value = undefined
    feedBackVal.value = ''
  }
}
</script>

<template>
  <n-tabs type="segment" animated :value="curTab" @update:value="updateTab" justify-content="space-evenly">
    <n-tab-pane v-for="(item, i) in cardCapture" :name="item.port" :tab="`port${item.port}`">
      <n-form :model="item" label-align="left" label-placement="left" :style="{ maxWidth: '440px' }" label-width="140px">
        <n-form-item label="开启捕获">
          <n-switch v-model:value="item.switch" />
        </n-form-item>
        <n-form-item label="捕获名称" :validation-status="statusVal" @input="capInput" :feedback="feedBackVal"
          v-show="item.switch">
          <n-input v-model:value="item.capture_file" />
        </n-form-item>
        <n-form-item label="BPF捕获规则" v-show="item.switch">
          <n-input v-model:value="item.bpf_filter" />
        </n-form-item>
        <n-form-item label="捕获包数量(个)" v-show="item.switch">
          <n-input-number v-model:value="item.limit" />
        </n-form-item>
        <n-form-item label="捕获文件大小(MB)" v-show="item.switch">
          <n-input v-model:value="item.capture_file_size" />
        </n-form-item>
        <n-form-item label="捕获模式" path="radioGroupValue" v-show="item.switch">
          <n-radio-group v-model:value="item.mode" name="radiogroup1">
            <n-space>
              <n-radio value="fixed">
                固定捕获
              </n-radio>
              <n-radio value="cyclic">
                循环捕获
              </n-radio>
            </n-space>
          </n-radio-group>
        </n-form-item>
      </n-form>
    </n-tab-pane>
  </n-tabs>
</template>

<style lang="scss" scoped></style>