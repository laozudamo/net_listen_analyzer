<script setup lang="jsx">
import { computed, onMounted, reactive, ref, watch } from 'vue'
import { DocumentCopy16Filled as Copy, Edit20Filled as Edit, DocumentText24Filled as Detail, AirplaneTakeOff16Regular as Run } from "@vicons/fluent";
import useCommon from '@/components/hooks/handle.js'
import { list, create, del, update, copy, details } from '@/api/testcase/layer23.js'
import { userPort } from '@/api/serve/port.js'
import { useRouter } from 'vue-router'

const router = useRouter()
const model = ref(null)

const { dataSource, pagination, isEdit, updateCheckVal, afterLeave, addData, refresh, delData, confirm, runCase, copyData, editData, rowKey, checkRowKeys, key, filterData } = useCommon({ list, create, update, del, details, copy, resetFormVal, setFormVal, isHandForm: true, handForm });

const columns = [
  {
    type: "selection",
  },
  {
    title: '编号',
    key: 'id'
  },
  {
    title: '实例名称',
    key: 'case_name',
    width: 300,
  },
  {
    title: '创建时间',
    key: 'create_time'
  },
  {
    title: '更新时间',
    key: 'update_time'
  },
  {
    title: '操作',
    titleAlign: 'center',
    width: 300,
    render: (row) => {
      return (
        <div>
          <BtnIcon color="#2969FF" msg="编辑" type="default" onClick={() => editData(model, row.id)}>
            <Edit></Edit>
          </BtnIcon>
          <BtnIcon color="#2969FF" msg="流组" type="default" onClick={() => editFlowGroup(row)}>
            <Edit></Edit>
          </BtnIcon>
          <BtnIcon color="#2969FF" msg="运行" type="default" onClick={() => runCase(row.id)}>
            <Run></Run>
          </BtnIcon>
        </div>
      )
    }
  },
]

function editFlowGroup(row) {
  console.log("row", row.config.json_file_name)
  
  router.push({
    path: '/testCase/layer23/flow',
    query: {
      name: row.case_name,
      json_file_name: row.config.json_file_name
    }
  })
}

let userPortOptions = ref([])

async function getBindPorts () {
  const { data } = await userPort()
  userPortOptions.value = data.map(item => {
    return {
      label: "PORT" + item,
      value: item
    }
  })
}

onMounted(() => {
  getBindPorts()
})

let clientConfig = ref([])
let serverConfig = ref([])

let capturePort = computed(() => {
  return Array.from(new Set([...clientConfig.value, ...serverConfig.value]))
})

function updateClient (v) {
  theForm.capture = capturePort.value.map((item) => {
    return {
      port: [item],
      switch: true,
      bpf_filter: "",
      capture_file_size: "",
      limit: 10000,
      capture_file: "streams" + captureKey + "_port" + item + ".pcap",
      mode: "fixed"
    }
  })
  theForm.network_config.client_config = clientConfig.value.map(item => {
    return {
      port: item
    }
  })

  // console.log("theForm", theForm)
}

function updateServe (v) {
  theForm.capture = capturePort.value.map((item) => {
    return {
      port: [item],
      switch: true,
      bpf_filter: "",
      capture_file_size: "",
      limit: 10000,
      capture_file: "streams" + captureKey + "_port" + item + ".pcap",
      mode: "fixed"
    }
  })
  theForm.network_config.server_config = serverConfig.value.map(item => {
    return {
      port: item
    }
  })
}


const theForm = reactive({
  case_name: "streams6",
  case_type: 9,
  total_time: 30,
  network_config: {
    client_config: [],
    server_config: []
  },
  config: {
    json_file_name: "strames" + Date.now() + ".json",
    start_config: {
      mult: 25,
      interaction_occurrence: false
    }
  },
  capture: []
})

const copyForm = JSON.parse(JSON.stringify(theForm))

function resetFormVal () {
  for (let key in copyForm) {
    theForm[key] = copyForm[key]
  }
  clientConfig.value = []
  serverConfig.value = []
  if ('id' in theForm) {
    delete theForm.id
  }
}

let curTab = ref('')
watch(() => theForm.capture, (newVal)=> {
  if(newVal.length !== 0) {
    curTab.value = newVal[0].port[0]
    console.log("curTab", curTab.value)
  }
}, {immediate: true})

let captureKey = 0

function setFormVal (data) {
  ++captureKey
  for (let key in theForm) {
    theForm[key] = data[key]
  }
  clientConfig.value = data.network_config.client_config.map(item => item.port)
  serverConfig.value = data.network_config.server_config.map(item => item.port)
  theForm.id = data.id
}


function handForm (theForm, netCfgData, capture) {

  console.log("netCfgData", netCfgData)
  let tmpObj = {
    network_config: netCfgData,
    capture: capture
  }
  const newForm = Object.assign({}, theForm, tmpObj)

  return newForm
}

const capName = ref('')
const caseName = () => {
  const date = new Date()
  theForm.case_name = 'layer2-3_' + date.getFullYear() + (date.getMonth() + 1) + date.getDate() + date.getHours() + date.getMinutes() + date.getSeconds()
  capName.value = theForm.case_name
}

let searchForm = reactive({
  time: null,
  search_data: ''
})

const resetSearch = () => {
  searchForm.time = null
  searchForm.search_data = ''
}

function updateTab(v) {
  curTab.value = v
}

</script>

<template>
  <Title title="2-3层协议" />
  <SearchBox :searchForm="searchForm" @filterData="filterData(searchForm)"
    @refreshData="() => { refresh(); resetSearch() }"></SearchBox>
  <ActIonBtnBar @deleteData="delData" @addData="() => { caseName(); addData(model) }" />

  <n-data-table style="padding: 20px;" max-height="calc(100vh - 410px)" :key="key" :rowKey="rowKey" :pagination="false"
    @update:checked-row-keys="updateCheckVal" :columns="columns" :data="dataSource" :bordered="false" />

  <div class="the-pag">
    <n-pagination v-model:page="pagination.page" :page-count="pagination.pageCount" :default-page-size="10"
      :pageSizes="pagination.pageSizes" :showSizePicker="true"
      @update:page="(page) => { pagination.onUpdatePage(page, searchForm) }" v-model:checkRowKeys="checkRowKeys"
      @updatePageSize="(pageSize) => pagination.onUpdatePageSize(pageSize, searchForm)" />
  </div>

  <TheModel :title="isEdit ? '编辑Layer2-3实例' : '新增Layer2-3实例'" ref="model" @after-leave="afterLeave" width="900px"
    @confirm="confirm(model, theForm, theForm.network_config, theForm.capture)">
    <n-form :model="theForm" label-placement="left" label-align="left" :style="{
    }" label-width="120px">
      <n-form-item label="实例名称">
        <n-input v-model:value="theForm.case_name" />
      </n-form-item>
    </n-form>
    <n-tabs type="line" default-value="netCfg" size="medium" animated style="margin: 0px"
      pane-style="padding: 4px; box-sizing: border-box;" class="the-tab">
      <n-tab-pane name="netCfg" tab="端口" display-directive="show">

        <n-input-group :style="{ width: '600px' }">
          <n-input-group-label>发送端口</n-input-group-label>
          <n-select v-model:value="clientConfig" @update:value="updateClient" multiple :options="userPortOptions" />
          <n-input-group-label>接收端口</n-input-group-label>
          <n-select v-model:value="serverConfig" @update:value="updateServe" multiple :options="userPortOptions" />
        </n-input-group>

      </n-tab-pane>

      <n-tab-pane name="setting" tab="配置" display-directive="show">
        <n-form :model="theForm" label-align="left" label-placement="left" :style="{
          maxWidth: '440px'
        }" label-width="120px">
          <n-form-item label="互发模式">
            <n-switch v-model:value="theForm.config.start_config.interaction_occurrence" />
          </n-form-item>
          <n-form-item label="发送时间">
            <n-input-number v-model:value="theForm.total_time" max="3600" />
          </n-form-item>
          <n-form-item label="mult">
            <n-input-number v-model:value="theForm.config.start_config.mult" />
          </n-form-item>
        </n-form>
      </n-tab-pane>
      <n-tab-pane name="capture" tab="捕获" display-directive="show">

        <n-tabs type="segment" :value="curTab" animated @update:value="updateTab" justify-content="space-evenly">
          <n-tab-pane v-for="(item, i) in theForm.capture" :name="item.port[0]" :tab="`port${item.port[0]}`">
            <n-form :model="item" label-align="left" label-placement="left" :style="{ maxWidth: '440px' }"
              label-width="140px">
              <n-form-item label="开启捕获">
                <n-switch v-model:value="item.switch" />
              </n-form-item>
              <n-form-item label="捕获名称" :validation-status="statusVal" @input="capInput" :feedback="feedBackVal"
                v-show="item.switch">
                <n-input v-model:value="item.capture_file" />
              </n-form-item>
              <n-form-item label="BPF捕获规则" v-show="item.switch">
                <n-input v-model:value="item.bpf_filter" />
              </n-form-item>
              <n-form-item label="捕获包数量(个)" v-show="item.switch">
                <n-input-number v-model:value="item.limit" />
              </n-form-item>
              <n-form-item label="捕获文件大小(MB)" v-show="item.switch">
                <n-input v-model:value="item.capture_file_size" />
              </n-form-item>
              <n-form-item label="捕获模式" path="radioGroupValue" v-show="item.switch">
                <n-radio-group v-model:value="item.mode" name="radiogroup1">
                  <n-space>
                    <n-radio value="fixed">
                      固定捕获
                    </n-radio>
                    <n-radio value="cyclic">
                      循环捕获
                    </n-radio>
                  </n-space>
                </n-radio-group>
              </n-form-item>
            </n-form>
          </n-tab-pane>
        </n-tabs>

      </n-tab-pane>

    </n-tabs>
  </TheModel>
</template>

<style lang="scss" scoped>
.attackt-set {
  margin-left: 120px;
}

:deep(.n-tabs .n-tabs-pane-wrapper) {
  margin-top: 20px;
}

.netcfg-box {
  display: flex;
  align-items: center;

  .title {
    margin-right: 20px;
  }
}
</style>