<script setup lang="jsx">
import { ref, computed, onMounted, render, reactive } from 'vue'
import { Splitpanes, Pane } from 'splitpanes'
import { useElementSize } from '@vueuse/core'
import 'splitpanes/dist/splitpanes.css'
import { ArrowDownload16Filled as Down, ArrowExportUp24Filled as Up, ArrowLeft24Filled as Left, ArrowRight24Filled as Right } from "@vicons/fluent";
import { getData, getDetail } from '@/api/pcap.js'
import bus from 'vue3-eventbus'

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

let options = reactive([
  [
    { code: 'TCP', name: '追踪TCP', disabled: true },
    { code: 'UDP', name: '追踪UDP', disabled: true },
    { code: 'DCCP', name: '追踪DCCP', disabled: true },
    { code: 'TLSv1.2', name: '追踪TLS', disabled: true },
    { code: 'HTTP', name: '追踪HTTP', disabled: true },
    { code: 'HTTP/2', name: '追踪HTTP/2', disabled: true },
  ]
])

const menuConfig = reactive({
  body: {
    options: options,
  },
  visibleMethod: v => {
    options[0].forEach(item => {
      item.disabled = true
      if (v.row.protocol === item.code) {
        item.disabled = false;
      }
    })
    return true
  }
})

const pagerConfig = reactive({
  enabled: true,
  pageSize: 10,
  pageSizes: [5, 10, 15, 20, 50, 100, 200, 500, 1000]
})

const midEl = ref(null)
const midElementSize = useElementSize(midEl)

const xTable = ref(null)
const toolBar = ref(null)
const filterName = ref('')
let loading = ref(false)

let sumOptions = ref([
  {
    label: "选项1",
    key: 1
  },
  {
    label: "选项2",
    key: 2
  },
  {
    label: "选项3",
    key: 3
  },
])


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

let query = ref(null)

bus.on("getNodeData", (data) => {
  console.log("sss", data)
  let params = {
    pcap_path: data.pcap_path,
    file_name: data.label
  }
  query.value = params

  codeData.value = null
  threeData.value = null

  const $table = xTable.value
  if ($table) {
    loadData(params)
  }
})


async function loadData (params) {
  try {
    loading.value = true
    const $table = xTable.value
    let { data } = await getData(params)
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
    ...query.value,
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

function showPanel (v) {
  console.log('showPanel', v)
}


const pageVO1 = reactive({
  currentPage: 1,
  pageSize: 30,
  total: 8
})

function scroll (v) {
  console.log('scroll', v)
}

</script>

<template>
  <splitpanes horizontal class="default-theme" :dbl-click-splitter="false">
    <pane style="background-color:#FFF">
      <div style="height: 100%;background: #FFF;padding: 10px;" ref="midEl">
        <vxe-toolbar ref="toolBar" refresh>
          <template #tools>
            <n-dropdown trigger="click" :options="sumOptions" @select="handleSelect">
              <n-button>统计</n-button>
            </n-dropdown>
            <vxe-input style="width: 500px;margin-right: 20px;margin-left: 20px;" v-model="filterName" type="search"
              placeholder="试试全表搜索" @keyup="searchEvent"></vxe-input>
          </template>
        </vxe-toolbar>

        <vxe-table @scroll="scroll" :pagerConfig="pagerConfig" size="mini" :menu-config="menuConfig"
          @menu-click="showPanel" @current-change="currentChange" :loading="loading" show-overflow keep-source
          ref="xTable" border height="500" :row-config="{ isHover: true, isCurrent: true, useKey: true }"
          :column-config="{ useKey: true }" :scroll-y="{ enabled: true, gt: 0, scrollToTopOnChange: true }"
          :scroll-x="{ enabled: true, gt: 10 }">
          <vxe-column field="idx" width="100" title="序号"></vxe-column>
          <vxe-column field="time" width="120" title="时间"></vxe-column>
          <vxe-column field="source" width="250" title="源"></vxe-column>
          <vxe-column field="dst" width="250" title="目标"></vxe-column>
          <vxe-column field="protocol" width="100" title="协议"></vxe-column>
          <vxe-column field="len" width="100" title="长度"></vxe-column>
          <vxe-column field="info" title="信息"></vxe-column>
        </vxe-table>
        <vxe-pager v-model:current-page="pageVO1.currentPage" v-model:page-size="pageVO1.pageSize"
          :total="pageVO1.total" />

      </div>
    </pane>
    <pane min-size="5" max-size="95" size="40">
      <n-spin style="width: 100%;height: 100%;" v-if="show" :show="show" :delay="1000">
      </n-spin>
      <splitpanes :push-other-panes="false" :dbl-click-splitter="false">
        <pane style="background-color:#FFF;overflow: auto;" min-size="5" max-size="95" size="65">
          <div style="white-space: pre-wrap;padding: 20px;min-width:870px;">
            {{ threeData }}
          </div>
          <div v-if="threeData === null">
            <div style="font-size: 20px;color: #999; display: flex;justify-content: center;align-items: center;">
              暂无数据
            </div>
          </div>
        </pane>
        <pane style="background-color:#FFF;overflow: auto;" min-size="5" max-size="95" size="35">
          <div style="white-space: pre-wrap;padding: 20px;margin-left: 20px;min-width: 530px;">
            {{ codeData }}
          </div>
          <div v-if="codeData === null">
            <div style="font-size: 20px;color: #999; display: flex;justify-content: center;align-items: center;">
              暂无数据
            </div>
          </div>
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