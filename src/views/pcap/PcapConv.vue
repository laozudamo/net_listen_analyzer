<script setup>
import { ref, onMounted } from 'vue'
import { sessionInfo } from '@/api/pcap.js'

const props = defineProps({
  query: {
    type: Object,
    required: true
  }
})

let content = ref(null)

const tabList = [
  {
    label: "IP会话",
    key: 'ip',
  },
  {
    label: "TCP会话",
    key: 'tcp',
  },
  {
    label: "UDP会话",
    key: 'udp',
  },
  {
    label: "Ethernet会话",
    key: "Ethernet"
  },
  {
    label: "IPv4会话",
    key: "IPv4"
  },
  {
    label: "IEEE 802.11",
    key: "IEEE 802.11"
  },
]

let loading = ref(false)

async function getConInfo (protocol) {
  loading.value = true
  try {
    let params = {
      protocol,
      ...props.query
    }
    let { data } = await sessionInfo(params)
    content.value = data
    loading.value = false

  } catch (error) {
    loading.value = false
    console.log(error)
  }
}

function changeTab (v) {
  getConInfo(v)
}

onMounted(() => {
  getConInfo('ip')
})

</script>

<template>
  <n-tabs @update:value="changeTab" size="small" type="line" default-value="ip">
    <n-tab-pane v-for="(tab, i) in tabList" :name="tab.key" :tab="tab.label">

      <n-spin :show="loading">
        <template #description>
          加载中···
        </template>
        <div v-if="!content" style="height: 100vh;white-space: pre-wrap;padding: 20px;margin-left: 20px;">
          暂无数据
        </div>
        <div v-else style="height: 100vh;white-space: pre-wrap;padding: 20px;margin-left: 20px;">
          {{ content }}
        </div>
      </n-spin>

    </n-tab-pane>
  </n-tabs>
</template>

<style lang="scss" scoped></style>