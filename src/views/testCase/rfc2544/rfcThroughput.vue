<script setup lang="jsx">
import { reactive, ref } from 'vue'
import { DocumentCopy16Filled as Copy, Edit20Filled as Edit, DocumentText24Filled as Detail, AirplaneTakeOff16Regular as Run } from "@vicons/fluent";
import useCommon from '@/components/hooks/handle.js'
import { getRfc } from '@/api/testcase/rfc2544.js'
const { list,
  create,
  update,
  del,
  copy,
  details } = getRfc("Throughput")

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
          <BtnIcon color="#2969FF" msg="复制" type="default" onClick={() => copyData(row)}>
            <Copy />
          </BtnIcon>
          <BtnIcon color="#2969FF" msg="运行" type="default" onClick={() => runCase(row.id)}>
            <Run></Run>
          </BtnIcon>
        </div>
      )
    }
  },
]

const theForm = reactive({
  case_name: '',
  protocol_server_type: "Throughput", // one_stream more_stream, multi_stream
  total_time: 10,
  case_type: 10,
  config: {
    pkt_config: {
      pad_data: "x",
      op: "inc", // inc, dec, random
    },
    stream_config: [
      {
        size_list: [64],
        pps: 30,
        isg: 0
      },
      // pps: 10,
    ],
    start_config: {
      mult: 10,
      interaction_occurrence: false
    },
  },
  capture: []
})

const copyForm = JSON.parse(JSON.stringify(theForm))
function resetFormVal () {
  for (let key in copyForm) {
    theForm[key] = copyForm[key]
  }
  if ('id' in theForm) {
    delete theForm.id
  }
  topoData.value = {}
}

let captureKey = 0
let topoData = ref({})

function setFormVal (data) {
  ++captureKey
  for (let key in theForm) {
    theForm[key] = data[key]
  }
  theForm.id = data.id
  topoData.value = data.network_config
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
  theForm.case_name = 'RFC' + date.getFullYear() + (date.getMonth() + 1) + date.getDate() + date.getHours() + date.getMinutes() + date.getSeconds()
  capName.value = theForm.case_name
}

const netCfg = ref(null)
const captureCfg = ref(null)


let searchForm = reactive({
  time: null,
  search_data: ''
})
const resetSearch = () => {
  searchForm.time = null
  searchForm.search_data = ''
}


const ipModeOption = [
  {
    label: '递增',
    value: 'inc'
  },
  {
    label: '递减',
    value: 'dec'
  },
  {
    label: '随机',
    value: 'radom'
  },
]

const flowOption = [
  {
    label: '单流',
    value: 'one_stream'
  },
  {
    label: '多播',
    value: 'more_stream'
  },
  {
    label: '混合',
    value: 'multi_stream'
  },
]

function onCreate () {
  return {
    size_list: [64],
    pps: 0,
    isg: 0,
  }
}

const options = [
  {
    label: '64',
    value: 64
  },
  {
    label: '128',
    value: 128
  },
  {
    label: '256',
    value: 256
  },
  {
    label: '512',
    value: 512
  },
  {
    label: '1024',
    value: 1024
  },
  {
    label: '1280',
    value: 1280
  },
  {
    label: '1518',
    value: 1518
  },
]


</script>

<template>
  <Title title="RFC吞吐量" showTip="true" des="吞吐量测试是RFC 2544测试中的一部分，通常用于评估网络设备在各种负载条件下的吞吐量性能。
吞吐量测试包括了测试设备在不同数据传输速率下的性能，以确定设备能够处理多少数据流量而不降低性能或丢失数据包。
吞吐量测试通常会记录各种不同传输速率下的性能数据，包括丢包率、抖动和延迟。这可以提供更全面的性能评估，而不仅仅是确定最大吞吐量。" />

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

  <TheModel :title="isEdit ? '编辑RFC吞吐率实例' : '新增RFC吞吐率实例'" ref="model" @after-leave="afterLeave" width="900px"
    @confirm="confirm(model, theForm, netCfg.data, captureCfg.capture)">
    <n-form :model="theForm" label-placement="left" label-align="left" :style="{
    }" label-width="120px">
      <n-form-item label="实例名称">
        <n-input v-model:value="theForm.case_name" />
      </n-form-item>
    </n-form>
    <n-tabs type="line" default-value="netCfg" size="medium" animated style="margin: 0px"
      pane-style="padding: 4px; box-sizing: border-box;" class="the-tab">
      <n-tab-pane name="netCfg" tab="网络拓扑" display-directive="show">
        <NetCfg :caseType="10" ref="netCfg" :topoData="topoData"></NetCfg>
      </n-tab-pane>

      <n-tab-pane name="setting" tab="配置" display-directive="show">
        <n-form :model="theForm" label-align="left" label-placement="left" :style="{
          maxWidth: '440px'
        }" label-width="120px">
          <n-form-item label="互发模式">
            <n-switch v-model:value="theForm.config.start_config.interaction_occurrence" />
          </n-form-item>
          <n-form-item label="发流速率">
            <n-slider v-model:value="theForm.config.start_config.mult" :step="1" />
          </n-form-item>
          <n-form-item label="IP规律">
            <n-radio-group v-model:value="theForm.config.pkt_config.op" name="ipMode">
              <n-space>
                <n-radio :value="ele.value" v-for="(ele) in ipModeOption" :key="ele.value">
                  {{ ele.label }}
                </n-radio>
              </n-space>
            </n-radio-group>
          </n-form-item>
          <n-form-item label="测试时间(秒)">
            <n-input-number v-model:value="theForm.total_time" max="3600" />
          </n-form-item>
          <n-form-item label="载荷">
            <n-input v-model:value="theForm.config.pkt_config.pad_data" />
          </n-form-item>

          <!-- <n-form-item label="流配置">
            <n-radio-group v-model:value="theForm.protocol_server_type" name="flowCfg">
              <n-space>
                <n-radio :value="ele.value" v-for="(ele) in flowOption" :key="ele.value">
                  {{ ele.label }}
                </n-radio>
              </n-space>
            </n-radio-group>
          </n-form-item> -->

          <!-- <n-dynamic-input v-model:value="theForm.config.stream_config" :min="1" :max="1"
            item-style="margin-bottom: 10px;" :on-create="onCreate" #default="{ index, value }">
            <n-input-group :style="{ width: '700px' }">
              <n-input-group-label>包大小(size_list)</n-input-group-label>
              <n-select v-model:value="theForm.config.stream_config[index].size_list" multiple :options="options" />
              <n-input-group-label>单包速率(pps)</n-input-group-label>
              <n-input-number :show-button="false" :min="0" v-model:value="theForm.config.stream_config[index].pps"
                :style="{ width: '200px' }" />
              <n-input-group-label>包间隔(isg)</n-input-group-label>
              <n-input-number :show-button="false" :min="0" v-model:value="theForm.config.stream_config[index].isg"
                :style="{ width: '200px' }" />
            </n-input-group>
          </n-dynamic-input> -->

          <n-form-item label="包大小(size_list)">
            <n-select v-model:value="theForm.config.stream_config[0].size_list" multiple :options="options" />
          </n-form-item>

          <n-form-item label="单包速率(pps)">
            <n-input-number v-model:value="theForm.config.stream_config[0].pps" multiple :options="options" />
          </n-form-item>

          <n-form-item label="包间隔(isg)">
            <n-input-number v-model:value="theForm.config.stream_config[0].isg" multiple :options="options" />
          </n-form-item>

          <!-- <n-form-item label="total_pkts">
            <n-input-number v-model:value="theForm.config.stream_config[0].total_pkts" multiple :options="options" />
          </n-form-item> -->

        </n-form>
      </n-tab-pane>
      <n-tab-pane name="capture" tab="捕获" display-directive="show">
        <Capture :capType="capName" ref="captureCfg" :capture="theForm.capture"></Capture>
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