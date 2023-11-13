<script setup>
import { ref, onMounted, nextTick } from 'vue'
import { IoStatInfo, IoPhsInfo } from '@/api/pcap.js'
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

let content = ref(null)

const tabList = ref([
  {
    label: "分析包量和字节大小",
    key: '0',
    content: ""
  },
  {
    label: "层次结构及包量",
    key: '1',
    content: ""
  },
])

let loading = ref(false)

async function getAllData () {
  const value = await myIndexedDB.getItem('pcapSum');

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
  myIndexedDB.setItem("pcapSum", JSON.stringify(tabList.value))
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

async function getInfo (item, i) {
  if (i == 0) {
    await getStatInfo(item)
  } else {
    await getPhsInfo(item)
  }

}

async function getStatInfo (item) {
  try {
    let params = {
      interval: 0,
      io_type: "stat",
      ...props.query
    }
    let { data } = await IoStatInfo(params)
    item.content = data

  } catch (error) {
    console.log(error)
  }
}


async function getPhsInfo (item) {
  try {
    let params = {
      io_type: "phs",
      ...props.query
    }
    let { data } = await IoPhsInfo(params)
    item.content = data

  } catch (error) {
    console.log(error)
  }
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

onMounted(() => {
  getAllData()
})

</script>

<template>
  <n-tabs @update:value="changeTab" size="small" type="line" default-value="0">
    <n-tab-pane v-for="(tab, i) in tabList" :name="tab.key" :tab="tab.label">
    </n-tab-pane>
  </n-tabs>
  <vxe-toolbar ref="toolBar" :custom="true">
    <template #tools>
      <vxe-input  style="width: 300px;margin-right: 5px;margin-left: 20px;" v-model="filterName"
        type="search" placeholder="试试全表搜索"></vxe-input>
      <n-button  style="margin-left: 10px;" @click="searchEvent">搜索</n-button>
    </template>
  </vxe-toolbar>

  <vxe-table id="idx" :custom-config="{ storage: true }" size="mini" :loading="loading" show-overflow keep-source
    ref="xTable" border height="800" :row-config="{ isHover: true, isCurrent: true, useKey: true }"
    :column-config="{ useKey: true, resizable: true }" :scroll-y="{ enabled: true, gt: 0, scrollToTopOnChange: true }"
    :scroll-x="{ enabled: true, gt: 20 }">
    <vxe-column field="协议(protocol)" title="协议(protocol)"></vxe-column>
    <vxe-column field="大小(bytes)" title="大小(bytes)"></vxe-column>
    <vxe-column field="帧数(frames)" title="帧数(frames)"></vxe-column>
  </vxe-table>
</template>

<style lang="scss" scoped></style>