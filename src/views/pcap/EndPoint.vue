<script setup>
import { ref, onMounted, nextTick, reactive } from 'vue'
import { endPointInfo } from '@/api/pcap.js'
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
    label: "IPV4端点",
    key: '0',
    value: 'ip',
    content: null
  },
  {
    label: "IPV6端点",
    key: '1',
    value: 'ipv6',
    content: null
  },
  {
    label: "TCP端点",
    key: '2',
    value: 'tcp',
    content: null
  },
  {
    label: "UDP端点",
    key: '3',
    value: 'udp',
    content: null
  },
  {
    label: "Ethernet端点",
    key: "4",
    value: 'ethernet',
    content: null
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
    let { data } = await endPointInfo(params)
    item.content = data

  } catch (error) {
    loading.value = false
    console.log(error)
  }
}

async function getAllData () {
  const value = await myIndexedDB.getItem('tabList');

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
  myIndexedDB.setItem("tabList", JSON.stringify(tabList.value))
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

let currentTab = ref(0)

function changeTab (i) {
  let data = tabList.value[i].content
  current.value = i
  currentTab.value = i

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
    const value = await myIndexedDB.getItem('tabList');
    if (value) {
      tabList.value = JSON.parse(value)
      let data = tabList.value[current.value].content
      await xTable.value.loadData(data)
      console.log("加载原数据")
    }
  }
}


</script>

<template>
  <vxe-toolbar size="mini" ref="toolBar" :export="false" :custom="true">
    <template #tools>
      <vxe-input style="width: 300px;margin-right: 5px;margin-left: 20px;" v-model="filterName" type="search"
        placeholder="显示过滤···"></vxe-input>
      <n-button size="small" style="margin-left: 10px;margin-right: 10px;" @click="searchEvent">搜索</n-button>
    </template>
  </vxe-toolbar>
  <n-tabs @update:value="changeTab" size="small" type="line" default-value="0">
    <n-tab-pane display-directive="show" v-for="(tab, i) in tabList" :name="tab.key" :tab="tab.label">
      <!-- <n-spin :show="loading">
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
      </n-spin> -->

    </n-tab-pane>
  </n-tabs>


  <!-- :export-config="{ filename: '端点统计_' + query.file_name, mode: all, original: true, }" -->
  <!-- :export-config="{ filename: '端点统计_' + query.file_name, mode: all, original: true, }" -->
  <vxe-table :export-config="{ filename: '端点统计_' + query.file_name, mode: all, original: true, }" id="idx"
    :custom-config="{ storage: true }" size="mini" :loading="loading" show-overflow keep-source ref="xTable" height="800"
    :row-config="{ isHover: true, isCurrent: true, useKey: true }" :column-config="{ useKey: true, resizable: true }"
    :scroll-y="{ enabled: true, gt: 0, scrollToTopOnChange: true }" :scroll-x="{ enabled: true, gt: 20 }">
    <vxe-column field="Address" title="Address" sortable></vxe-column>
    <vxe-column field="Packets" title="Packets" sortable></vxe-column>
    <vxe-column field="Bytes" title="Bytes" sortable></vxe-column>
    <vxe-column field="Tx Packets" title="Tx Packets" sortable></vxe-column>
    <vxe-column field="Tx Bytes" title="Tx Bytes" sortable></vxe-column>
    <vxe-column field="Rx Packets" title="Rx Packets" sortable></vxe-column>
    <vxe-column field="Rx Bytes" title="Rx Bytes" sortable></vxe-column>
    <vxe-column field="Country" title="Country" v-if="currentTab == 0 || currentTab == 1"></vxe-column>
    <vxe-column field="City" title="City" v-if="currentTab == 0 || currentTab == 1"></vxe-column>
    <vxe-column field="As Number" title="As Number" v-if="currentTab == 0 || currentTab == 1"></vxe-column>
    <vxe-column field="As Organization" title="As Organization" v-if="currentTab == 0 || currentTab == 1"></vxe-column>
  </vxe-table>
</template>

<style lang="scss" scoped></style>