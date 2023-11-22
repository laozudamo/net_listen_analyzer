<script setup>
import { ref, onMounted, nextTick, reactive } from 'vue'
import { httpInfo } from '@/api/pcap.js'
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

const tabList = ref([
  {
    label: "状态",
    value: "http",
    type: 'stat',
    key: "0",
    content: ""
  },
  {
    label: "树状态",
    value: "http",
    type: 'tree',
    key: "1",
    content: ""
  },
  {
    label: "URI请求路径",
    value: "http_req",
    type: 'tree',
    key: "2",
    content: ""
  },
  {
    label: "请求URL",
    value: "http_seq",
    type: 'tree',
    key: "3",
    content: ""
  },
  {
    label: "请求和响应",
    value: "http_srv",
    type: "tree",
    key: "4",
    content: ""
  },
])

let loading = ref(false)

async function getInfo (item) {
  try {
    let params = {
      protocol: item.value,
      statistical_type: item.type,
      ...props.query,
      display_filter: filterName.value,
    }
    let { data } = await httpInfo(params)
    item.content = data

  } catch (error) {
    loading.value = false
    console.log(error)
  }
}

async function getAllData () {

  const value = await myIndexedDB.getItem('pcapHttp');

  if (value) {
    tabList.value = JSON.parse(value)

    let data = tabList.value[0].content
    await xTable.value.loadData(data)
    return
  }

  await handleData()

  let data = tabList.value[0].content
  await xTable.value.loadData(data)
  loading.value = false
  myIndexedDB.setItem("pcapHttp", JSON.stringify(tabList.value))
}

async function handleData () {
  loading.value = true
  const promises = []
  tabList.value.forEach((item, i) => {
    let j = getInfo(item)
    promises.push(j)
  })
  await Promise.allSettled(promises)
  loading.value = false
}

let current = ref(0)

function changeTab (i) {
  current.value = i
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

onMounted(() => {
  getAllData()
})

let filterName = ref("")

async function searchEvent () {
  if (filterName.value) {
    await handleData()
    console.log(tabList.value)
    let data = tabList.value[current.value].content
    const $table = xTable.value
    $table.loadData(data)
  } else {
    const value = await myIndexedDB.getItem('pcapHttp');
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
      <vxe-input style="width: 300px;margin-right: 5px;margin-left: 20px;" v-model="filterName" type="search"
        placeholder="显示过滤···"></vxe-input>
      <n-button style="margin-left: 10px;margin-right: 10px;" @click="searchEvent">搜索</n-button>
    </template>
  </vxe-toolbar>

  <n-tabs @update:value="changeTab" size="small" type="line" default-value="0">
    <n-tab-pane v-for="(tab, i) in tabList" :name="tab.key" :tab="tab.label">
    </n-tab-pane>
  </n-tabs>

  <vxe-table :export-config="{ filename: '端点统计_' + query.file_name, mode: all, original: true, }" id="idx"
    :custom-config="{ storage: true }" size="mini" :loading="loading" show-overflow :tooltip-config="{ showAll: true }"
    keep-source ref="xTable" border height="800"
    :row-config="{ isHover: true, isCurrent: true, useKey: true, keyField: 'id' }"
    :column-config="{ useKey: true, resizable: true }" :scroll-y="{ enabled: true, gt: 0, scrollToTopOnChange: true }"
    :scroll-x="{ enabled: true, gt: 20 }" :tree-config="{}">
    <!-- <vxe-column field="协议(protocol)" title="协议(protocol)"></vxe-column>
    <vxe-column field="大小(bytes)" title="大小(bytes)"></vxe-column> -->
    <vxe-column field="id" title="id" tree-node></vxe-column>
    <vxe-column field="Topic / Item" title="Topic / Item"></vxe-column>
    <vxe-column field="Count" title="Count"></vxe-column>
    <vxe-column field="Average" title="Average"></vxe-column>
    <vxe-column field="Min Val" title="Min Val"></vxe-column>
    <vxe-column field="Max Val" title="Max Val"></vxe-column>
    <vxe-column field="Rate (ms)" title="Rate (ms)"></vxe-column>
    <vxe-column field="Percent" title="Percent"></vxe-column>
    <vxe-column field="Burst Rate" title="Burst Rate"></vxe-column>
    <vxe-column field="Burst Start" title="Burst Start"></vxe-column>

  </vxe-table>
</template>

<style lang="scss" scoped></style>