<script setup>
import { ref, onMounted } from 'vue'
import { httpInfo } from '@/api/pcap.js'

const props = defineProps({
  query: {
    type: Object,
    required: true
  }
})

let content = ref(null)

const tabList = [
  {
    label: "状态",
    value: "http",
    type: 'stat',
    key: "0"
  },
  {
    label: "树状态",
    value: "http",
    type: 'tree',
    key: "1",
  },
  {
    label: "URI请求路径",
    value: "http_req",
    type: 'tree',
    key: "2",
  },
  {
    label: "请求URL",
    value: "http_seq",
    type: 'tree',
    key: "3",
  },
  {
    label: "请求和响应",
    value: "http_srv",
    type: "tree",
    key: "4"
  },
]

let loading = ref(false)

async function getInfo (protocol, statistical_type) {
  loading.value = true
  try {
    let params = {
      protocol,
      statistical_type,
      ...props.query
    }
    let { data } = await httpInfo(params)
    content.value = data
    loading.value = false

  } catch (error) {
    loading.value = false
    console.log(error)
  }
}

function changeTab (v) {
  let protocol = tabList[v].value
  let statistical_type = tabList[v].type
  getInfo(protocol, statistical_type)
}

onMounted(() => {
  getInfo("http", "stat")
})

</script>

<template>
  <n-tabs @update:value="changeTab" size="small" type="line" default-value="0">
    <n-tab-pane v-for="(tab, i) in tabList" :name="tab.key" :tab="tab.label">

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

    </n-tab-pane>
  </n-tabs>
</template>

<style lang="scss" scoped></style>