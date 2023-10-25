<script setup lang="jsx">
import { ref, computed, onMounted, render } from 'vue'
import { Splitpanes, Pane } from 'splitpanes'
import { useElementSize } from '@vueuse/core'
import 'splitpanes/dist/splitpanes.css'
import { ArrowDownload16Filled as Down, ArrowExportUp24Filled as Up, ArrowLeft24Filled as Left, ArrowRight24Filled as Right } from "@vicons/fluent";
import { getData, getDetail } from '@/api/pcap.js'

const columns = [
  {
    title: "Name",
    key: "name",
  },
  {
    title: "Age",
    key: "age",
  },
]

const midEl = ref(null)
const midElementSize = useElementSize(midEl)

const xTable = ref(null)
const toolBar = ref(null)
const filterName = ref('')
let loading = ref(false)

let threeData = ref(null)
let codeData = ref(null)

async function scrollBottom () {
  const $xTable = xTable.value
  await $xTable.scrollToRow($xTable.getData(1000))
}

async function scrollTop () {
  const $xTable = xTable.value
  await $xTable.scrollToRow($xTable.getData(0))
}

const list = ref([])

onMounted(async () => {
  const $table = xTable.value
  if ($table) {
    await loadData()
  }
})

async function loadData () {
  try {
    loading.value = true
    const $table = xTable.value
    let { data } = await getData()
    list.value = data
    await $table.loadData(data)
    loading.value = false
  } catch (error) {
    loading.value = false
  }
}

let show = ref(false)

async function currentChange (v) {
  show.value = true
  let params = {
    idx: v.row.idx,
  }
  let { data } = await getDetail(params)
  threeData.value = data.protocol_tree
  codeData.value = data.protocol_binary
  show.value = false
}

const searchEvent = () => {
  const $xTable = xTable.value
  const filterVal = String(filterName.value).trim().toLowerCase()
  if (filterVal) {
    const filterRE = new RegExp(filterVal, 'gi')
    const searchProps = ['source', 'dst']
    const rest = list.value.filter(item => searchProps.some(key => String(item[key]).toLowerCase().indexOf(filterVal) > -1))
    let tmpData = rest.map(row => {
      const item = Object.assign({}, row)
      searchProps.forEach(key => {
        // item[key] = String(item[key]).replace(filterRE, match => `<span class="keyword-lighten">${match}</span>`)
        // item[key] = String(item[key]).replace(filterRE, (match) => render(<span class="keyword-lighten">{match}</span>))
      })
      return item
    })

    $xTable.loadData(tmpData)

  } else {
    $xTable.loadData(list.value)
    // loadData()
  }
}

</script>

<template>
  <splitpanes horizontal class="default-theme" :dbl-click-splitter="false">
    <pane style="background-color:#FFF" class="left-pane">
      <div style="height: 100%;background: #FFF;padding: 20px;" ref="midEl">
        <!-- <div style="margin-bottom: 20px;">
          <BtnIcon color="#000000" :quaternary="false" @click="scrollTop">
            <Up />
          </BtnIcon>
          <BtnIcon color="#000000" :quaternary="false" @click="scrollBottom">
            <Down />
          </BtnIcon>
        </div> -->

        <!--    <vxe-toolbar ref="toolBar" import export refresh>
          <template #tools>
            <vxe-input v-model="filterName" type="search" placeholder="试试全表搜索" @keyup="searchEvent"></vxe-input>
            <vxe-button type="text" icon="vxe-icon-undo" class="tool-btn"></vxe-button>
            <vxe-button type="text" icon="vxe-icon-funnel" class="tool-btn" @click="funnelEvent"></vxe-button>
          </template>
        </vxe-toolbar>
 -->
        <vxe-table @current-change="currentChange" :loading="loading" show-overflow keep-source ref="xTable" border
          height="430" :row-config="{ isHover: true, isCurrent: true, useKey: true }" :column-config="{ useKey: true }"
          :scroll-y="{ enabled: true, gt: 20, scrollToTopOnChange: true }">
          <vxe-column field="idx" width="80" title="序号"></vxe-column>
          <vxe-column field="time" title="时间"></vxe-column>
          <vxe-column field="source" title="源"></vxe-column>
          <vxe-column field="dst" title="目标"></vxe-column>
          <vxe-column field="protocol" title="协议"></vxe-column>
          <vxe-column field="len" title="长度"></vxe-column>
          <vxe-column field="info" title="信息" width="350"></vxe-column>
        </vxe-table>
      </div>
    </pane>
    <pane min-size="50" max-size="50" size="50" class="left-pane">
      <n-spin style="width: 100%;height: 100%;" v-if="show" :show="show" :delay="1000">
      </n-spin>
      <splitpanes :push-other-panes="false" :dbl-click-splitter="false">
        <pane style="background-color:#FFF;overflow-y: auto;" min-size="5" max-size="95" size="65">
          <div style="white-space: pre-wrap;padding: 20px;">
            {{ threeData }}
          </div>
          <div v-if="threeData === null">暂无数据</div>
        </pane>
        <pane style="background-color:#FFF;overflow-y: auto;" min-size="5" max-size="95" size="35">
          <div style="white-space: pre-wrap;padding: 20px;margin-left: 20px;">
            {{ codeData }}
          </div>
          <div v-if="codeData === null">暂无数据</div>
        </pane>


      </splitpanes>
    </pane>
  </splitpanes>
</template>

<style lang="scss" scoped>
::v-deep.splitpanes.default-theme .splitpanes__splitter {
  background-color: #E9EAEC;
}

// .keyword-lighten {
//   background-color: red!important;
// }
</style>