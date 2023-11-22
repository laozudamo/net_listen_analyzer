<script setup>
import { ref, onMounted, nextTick } from 'vue'
import { expertInfo } from '@/api/pcap.js'

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
    label: "错误信息",
    key: '0',
    value: "Errors",
    title: "",
    content: ""
  },

  {
    label: "警告信息",
    key: '1',
    value: "Warns",
    title: "",
    content: ""
  },

  {
    label: "关键信息",
    key: '2',
    value: "Notes",
    title: "",
    content: ""
  },
  {
    label: "会话信息",
    key: '3',
    value: "Chats",
    title: "",
    content: ""
  },
])

let loading = ref(false)

async function getInfo () {
  loading.value = true
  try {
    let params = {
      ...props.query,
      display_filter: filterName.value
    }
    let { data } = await expertInfo(params)
    // console.log(data)

    handleData(data)
    loading.value = false
    // item.content = data

  } catch (error) {
    loading.value = false
    console.log(error)
  }
}

function handleData (data) {
  tabList.value.forEach(item => {
    let index = data.findIndex(ele => ele.key.includes(item.value))
    let found = data.find(ele => ele.key.includes(item.value))
    if (index >= 0) {
      tabList.value[index].content = found.values
      tabList.value[index].title = found.key
    }

  })
}

async function getAllData () {
  const value = await myIndexedDB.getItem('expertInfo');

  if (value) {
    tabList.value = JSON.parse(value)
    let data = tabList.value[0].content
    await xTable.value.loadData(data)
    return
  }

  await getInfo()
  let data = tabList.value[0].content
  await xTable.value.loadData(data)

  // loading.value = false
  myIndexedDB.setItem("expertInfo", JSON.stringify(tabList.value))
}


function changeTab (i) {
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
    await getInfo()
    // console.log(tabList.value)
    let data = tabList.value[current.value].content
    const $table = xTable.value
    $table.loadData(data)
  } else {
    const value = await myIndexedDB.getItem('expertInfo');
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
  <vxe-toolbar ref="toolBar" :export="true" :custom="true">
    <template #tools>
      <vxe-input style="width: 300px;margin-right: 5px;margin-left: 20px;" v-model="filterName" type="search"
        placeholder="显示过滤···"></vxe-input>
      <n-button style="margin-left: 10px;" @click="searchEvent">搜索</n-button>
    </template>
  </vxe-toolbar>

  <n-tabs @update:value="changeTab" size="small" type="line" default-value="0">
    <n-tab-pane v-for="(tab, i) in tabList" :name="tab.key" :tab="tab.label">
      {{ tabList[i].title }}
    </n-tab-pane>
  </n-tabs>

  <vxe-table :export-config="{ filename: '端点统计_' + query.file_name, mode: all, original: true, }" id="idx"
    :custom-config="{ storage: true }" size="mini" :loading="loading" show-overflow :tooltip-config="{ showAll: true }"
    keep-source ref="xTable" border height="800" :row-config="{ isHover: true, isCurrent: true, useKey: true }"
    :column-config="{ useKey: true, resizable: true }" :scroll-y="{ enabled: true, gt: 0, scrollToTopOnChange: true }"
    :scroll-x="{ enabled: true, gt: 20 }">
    <!-- <vxe-column field="协议(protocol)" title="协议(protocol)"></vxe-column>
    <vxe-column field="大小(bytes)" title="大小(bytes)"></vxe-column> -->
    <vxe-column field="出现次数(Frequency)" title="出现次数(Frequency)" sortable></vxe-column>
    <vxe-column field="分组(Group)" title="分组(Group)"></vxe-column>
    <vxe-column field="协议(Protocol)" title="协议(Protocol)"></vxe-column>
    <vxe-column field="概要(Summary)" title="概要(Summary)"></vxe-column>
  </vxe-table>
</template>

<style lang="scss" scoped></style>