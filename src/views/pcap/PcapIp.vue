<script setup>
import { ref, onMounted, nextTick } from 'vue'
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

const xTable = ref(null)
const toolBar = ref(null)

// let content = ref(null)

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
    value: 'ipv6_hosts',
    key: '2',
    content: ""
  },
  {
    label: "IPv6源地址和目标地址占比",
    value: 'ipv6_srcdst',
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
    let data = tabList.value[0].content

    await xTable.value.loadData(data)
    return
  }

  loading.value = true

  // for (const item of tabList.value) {
  //   await getInfo(item, item.key)
  // }`
  await handleData()

  let data = tabList.value[0].content
  await xTable.value.loadData(data)

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
  let data = tabList.value[i].content

  const $table = xTable.value
  $table.loadData(data)
}

nextTick(() => {
  const $table = xTable.value
  const $toolbar = toolBar.value
  if ($table && $toolbar) {
    $table.connect($toolbar)
  }
})

onMounted(async () => {
  await getAllData()
})
</script>

<template>
  <n-tabs @update:value="changeTab" size="small" type="line" default-value="0">
    <n-tab-pane v-for="(tab, i) in tabList" :name="tab.key" :tab="tab.label">
    </n-tab-pane>
  </n-tabs>

  <vxe-toolbar ref="toolBar" :custom="true">
    <template #tools>
      <vxe-input style="width: 300px;margin-right: 5px;margin-left: 20px;" v-model="filterName" type="search"
        placeholder="试试全表搜索"></vxe-input>
      <n-button style="margin-left: 10px;" @click="searchEvent">搜索</n-button>
    </template>
  </vxe-toolbar>

  <vxe-table id="idx" :custom-config="{ storage: true }" size="mini" :loading="loading" show-overflow keep-source
    ref="xTable" border height="800" :row-config="{ isHover: true, isCurrent: true, useKey: true }"
    :column-config="{ useKey: true, resizable: true }" :scroll-y="{ enabled: true, gt: 0, scrollToTopOnChange: true }"
    :scroll-x="{ enabled: true, gt: 20 }">
    <vxe-column field="Topic / Item" title="Topic / Item"></vxe-column>
    <vxe-column field="Burst Rate" title="Burst Rate"></vxe-column>
    <vxe-column field="Burst Start" title="Burst Start"></vxe-column>
    <vxe-column field="Rate (ms)" title="Rate (ms)"></vxe-column>
    <vxe-column field="Percent" title="Percent"></vxe-column>
    <vxe-column field="Min Val" title="Min Val"></vxe-column>
    <vxe-column field="Max Val" title="Max Val"></vxe-column>
    <vxe-column field="Average" title="Average"></vxe-column>
    <vxe-column field="Count" title="Count"></vxe-column>
  </vxe-table>
</template>

<style lang="scss" scoped></style>