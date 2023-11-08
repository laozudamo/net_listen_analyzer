<script setup>
import { ref, onMounted } from 'vue'
import { sessionInfo } from '@/api/pcap.js'
import localforage from 'localforage'

const myIndexedDB = localforage.createInstance({
  name: 'myIndexedDB',
})


const props = defineProps({
  query: {
    type: Object,
    required: true
  }
})

let content = ref(null)

const tabList = ref([
  {
    label: "IPV4会话",
    key: '0',
    value: "ip",
    content: ""
  },
  {
    label: "IPv6会话",
    key: '1',
    value: "ipv6",
    content: ""
  },
  {
    label: "TCP会话",
    key: '2',
    value: "tcp",
    content: ""
  },
  {
    label: "UDP会话",
    key: '3',
    value: "udp",
    content: ""
  },
  {
    label: "Ethernet会话",
    key: "4",
    value: "eth",
    content: ""
  },
])

let loading = ref(false)

async function getInfo (item, i) {
  try {
    let params = {
      protocol: item.value,
      ...props.query
    }
    let { data } = await sessionInfo(params)
    item.content = data

  } catch (error) {
    loading.value = false
    console.log(error)
  }
}

async function getAllData () {
  const value = await myIndexedDB.getItem('pcapConv');

  if (value) {
    tabList.value = JSON.parse(value)
    content.value = tabList.value[0].content
    return
  }

  loading.value = true

  // for (const item of tabList.value) {
  //   await getInfo(item, item.key)
  // }

  await handleData()
  content.value = tabList.value[0].content

  loading.value = false
  myIndexedDB.setItem("pcapConv", JSON.stringify(tabList.value))
}

async function handleData () {
  loading.value = true
  const promises = []
  tabList.value.forEach((item, i) => {
    let j = getInfo(item, item.key)
    promises.push(j)
  })
  await Promise.allSettled(promises)
  loading.value = false
}

function changeTab (i) {
  content.value = tabList.value[i].content
}

onMounted(async () => {
  await getAllData()
})


</script>
<template>
  <n-tabs @update:value="changeTab" size="small" type="line" default-value="0">
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