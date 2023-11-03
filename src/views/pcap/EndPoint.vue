<script setup>
import { ref, onMounted } from 'vue'
import { endPointInfo } from '@/api/pcap.js'

const props = defineProps({
  query: {
    type: Object,
    required: true
  }
})

let content = ref(null)

const tabList = [
  {
    label: "IP端点",
    key: 'ip',
  },
  {
    label: "TCP端点",
    key: 'tcp',
  },
  {
    label: "UDP端点",
    key: 'udp',
  },
  {
    label: "Ethernet端点",
    key: "Ethernet"
  },
  {
    label: "IPv4端点",
    key: "IPv4"
  },
  {
    label: "IEEE 802.11",
    key: "IEEE 802.11"
  },
]

let loading = ref(false)

async function getInfo (protocol) {
  loading.value = true
  try {
    let params = {
      protocol,
      ...props.query
    }
    let { data } = await endPointInfo(params)
    content.value = data
    loading.value = false

  } catch (error) {
    loading.value = false
    console.log(error)
  }
}

function changeTab (v) {
  getInfo(v)
}

onMounted(() => {
  getInfo('ip')
})

</script>

<template>
  <n-tabs @update:value="changeTab" size="small" type="line" default-value="ip">
    <n-tab-pane v-for="(tab, i) in tabList" :name="tab.key" :tab="tab.label">

      <n-spin :show="loading">
        <template #description>
          加载中···
        </template>
        <div v-if="!content || content.length === 0" style="height: 100vh;white-space: pre-wrap;padding: 20px;margin-left: 20px;">
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