<script setup>
import { ref, onMounted, nextTick, reactive } from 'vue'
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
const xTable = ref(null)
const toolBar = ref(null)
let filterName = ref("")
let current = ref(0)

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
      ...props.query,
      display_filter: filterName.value
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
    let data = tabList.value[0].content
    await xTable.value.loadData(data)
    return
  }
  loading.value = true

  // for (const item of tabList.value) {
  //   await getInfo(item, item.key)
  // }
  await handleData()
  let data = tabList.value[0].content
  await xTable.value.loadData(data)
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


async function changeTab (i) {
  let data = tabList.value[i].content
  current.value = i
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

async function searchEvent () {
  if (filterName.value) {
    await handleData()
    console.log(tabList.value)
    let data = tabList.value[current.value].content
    const $table = xTable.value
    $table.loadData(data)
  } else {
    const value = await myIndexedDB.getItem('pcapConv');
    if (value) {
      tabList.value = JSON.parse(value)
      let data = tabList.value[current.value].content
      await xTable.value.loadData(data)
    }
  }
}

</script>
<template>
    <vxe-toolbar ref="toolBar" :export="true" :custom="true">
    <template #tools>
      <vxe-input style="width: 500px;margin-right: 5px;margin-left: 20px;" v-model="filterName" type="search"
        placeholder="显示过滤···"></vxe-input>
      <n-button style="margin-left: 10px;margin-right: 10px;" @click="searchEvent">搜索</n-button>
    </template>
  </vxe-toolbar>
  <n-tabs @update:value="changeTab" size="small" type="line" default-value="0">
    <n-tab-pane display-directive="show" v-for="(tab, i) in tabList" :name="tab.key" :tab="tab.label">
    </n-tab-pane>
  </n-tabs>

  <vxe-table :export-config="{ filename: '端点统计_' + query.file_name, mode: all, original: true, }" id="idx"
    :custom-config="{ storage: true }" size="mini" :loading="loading" show-overflow keep-source ref="xTable" border
    height="800" :row-config="{ isHover: true, isCurrent: true, useKey: true }"
    :column-config="{ useKey: true, resizable: true }" :scroll-y="{ enabled: true, gt: 0, scrollToTopOnChange: true }"
    :scroll-x="{ enabled: true, gt: 20 }">
    <vxe-column field="Address A" width="100" title="Address A" sortable></vxe-column>
    <vxe-column field="Address B" width="120" title="Address B" sortable></vxe-column>
    <vxe-column field="Packets" width="120" title="Packets" sortable></vxe-column>
    <vxe-column field="Bytes" width="120" title="Bytes" sortable></vxe-column>
    <vxe-column field="Packets A -> B" width="100" title="Packets A -> B" sortable></vxe-column>
    <vxe-column field="Bytes A -> B" width="120" title="Bytes A -> B" sortable></vxe-column>
    <vxe-column field="Packets B -> A" title="Packets B -> A" sortable></vxe-column>
    <vxe-column field="Bytes B -> A" title="Bytes B -> A" sortable></vxe-column>
    <vxe-column field="Rel Start" title="Rel Start" sortable></vxe-column>
    <vxe-column field="Duration" title="Duration" sortable></vxe-column>
  </vxe-table>
</template>

<style lang="scss" scoped></style>