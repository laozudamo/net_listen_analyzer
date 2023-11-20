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

const loading = ref(false)
const xTable = ref(null)
const toolBar = ref(null)
let filterName = ref("")

let listData = ref(null)

async function getPhsInfo (item) {
  loading.value = true
  try {
    let params = {
      io_type: "phs",
      ...props.query
    }
    let { data } = await IoPhsInfo(params)

    listData.value = data
    loading.value = false
  } catch (error) {
    loading.value = false
    console.log(error)
  }
}

nextTick(() => {
  const $table = xTable.value
  const $toolbar = toolBar.value
  if ($table && $toolbar) {
    $table.connect($toolbar)
  }
})

onMounted(async () => {
  const value = await myIndexedDB.getItem('pcapSum');
  if (value) {
    listData.value = JSON.parse(value)
    return
  }
  await getPhsInfo()
  myIndexedDB.setItem("pcapSum", JSON.stringify(listData.value))
})


async function searchEvent () {
  if (filterName.value) {
    await getPhsInfo()
  } else {
    const value = await myIndexedDB.getItem('pcapConv');
    if (value) {
      listData.value = JSON.parse(value)
    }
  }
}

</script>

<template>
  <vxe-toolbar ref="toolBar" :export="false" :custom="true">
    <template #tools>
      <vxe-input style="width: 300px;margin-right: 5px;margin-left: 20px;" v-model="filterName" type="search"
        placeholder="显示过滤···"></vxe-input>
      <n-button style="margin-left: 10px;margin-right: 10px;" @click="searchEvent">搜索</n-button>
    </template>
  </vxe-toolbar>

  <vxe-table :export-config="{ filename: '端点统计_' + query.file_name, mode: all, original: true, }" :data="listData"
    id="idx" :custom-config="{ storage: true }" size="mini" :loading="loading" show-overflow keep-source ref="xTable"
    border height="800" :row-config="{ isHover: true, isCurrent: true, useKey: true }"
    :column-config="{ useKey: true, resizable: true }" :scroll-y="{ enabled: true, gt: 0, scrollToTopOnChange: true }"
    :scroll-x="{ enabled: true, gt: 20 }">
    <vxe-column field="协议(protocol)" title="协议(protocol)"></vxe-column>
    <vxe-column field="帧数(frames)" title="帧数(frames)"></vxe-column>
    <vxe-column field="大小(bytes)" title="大小(bytes)"></vxe-column>
  </vxe-table>
</template>

<style lang="scss" scoped></style>