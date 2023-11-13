<script setup>
import { ref, onMounted, nextTick } from 'vue'
import { getIO } from '@/api/pcap.js'

const props = defineProps({
  query: {
    type: Object,
    required: true
  }
})


let content = ref(null)
let loading = ref(false)

async function getIoData (protocol) {
  loading.value = true
  try {
    let params = {
      flow_type: "any",
      addresses: "standard",
      ...props.query
    }
    let { data } = await getIO(params)
    content.value = data
    loading.value = false

  } catch (error) {
    loading.value = false
    console.log(error)
  }
}


onMounted(() => {
  getIoData()

})


</script>

<template>
  <div>
    流量图表
    <n-spin :show="loading">
      <template #description>
        加载中···
      </template>
      <div v-if="!content || content.length === 0"
        style="height: 100vh;white-space: pre-wrap;padding: 20px;margin-left: 20px;">
        暂无数据
      </div>
      <div v-else style="height: 100vh;white-space: pre-wrap;padding: 20px;margin-left: 20px;">
        {{ content }}
      </div>
    </n-spin>
  </div>
</template>

<style lang="scss" scoped></style>