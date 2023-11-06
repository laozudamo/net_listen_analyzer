<script setup>
import { ref, onMounted } from 'vue'
import { ipInfo } from '@/api/pcap.js'

const props = defineProps({
  query: {
    type: Object,
    required: true
  }
})

let content = ref(null)

const tabList = [
  {
    label: "IPv4地址占比",
    key: '1',
    value: 'ip_hosts'
  },

  {
    label: "IPv4源地址和目标地址占比",
    value: 'ip_srcdst',
    key: '2',
  },

  {
    label: "IPv6地址占比",
    value: 'ip6_hosts',
    key: '3',
  },
  {
    label: "IPv6源地址和目标地址占比",
    value: 'ip6_srcdst',
    key: '4',
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
    let { data } = await ipInfo(params)
    content.value = data
    loading.value = false

  } catch (error) {
    loading.value = false
    console.log(error)
  }
}


// async function getPhsInfo (protocol) {
//   loading.value = true
//   try {
//     let params = {
//       protocol,
//       ...props.query
//     }
//     let { data } = await ipInfo(params)
//     content.value = data
//     loading.value = false

//   } catch (error) {
//     loading.value = false
//     console.log(error)
//   }
// }

function changeTab (v) {
  let val = tabList[v - 1].value
  getInfo(val)
}

onMounted(() => {
  getInfo("ip_hosts")
})

</script>

<template>
  <n-tabs @update:value="changeTab" size="small" type="line" default-value="1">
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