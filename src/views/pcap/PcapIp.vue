<script setup>
import { ref, onMounted } from 'vue'
import { ipInfo } from '@/api/pcap.js'

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
    label: "IPv4地址占比",
    key: '0',
    value: 'ip_hosts',
    content: ""
  },

  {
    label: "IPv4源地址和目标地址占比",
    value: 'ip_srcdst',
    key: '1',
    content: ""
  },

  {
    label: "IPv6地址占比",
    value: 'ip6_hosts',
    key: '2',
    content: ""
  },
  {
    label: "IPv6源地址和目标地址占比",
    value: 'ip6_srcdst',
    key: '3',
    content: ""
  },
])

let loading = ref(false)

async function getInfo (item) {
  try {
    let params = {
      protocol: item.value,
      ...props.query
    }
    let { data } = await ipInfo(params)
    item.content = data

  } catch (error) {
    loading.value = false
    console.log(error)
  }
}


async function getAllData () {
  const value = await myIndexedDB.getItem('pcapIp');

  if (value) {
    tabList.value = JSON.parse(value)
    content.value = tabList.value[0].content
    return
  }

  loading.value = true

  // for (const item of tabList.value) {
  //   await getInfo(item, item.key)
  // }`
  await handleData()
  content.value = tabList.value[0].content

  loading.value = false
  myIndexedDB.setItem("pcapIp", JSON.stringify(tabList.value))
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