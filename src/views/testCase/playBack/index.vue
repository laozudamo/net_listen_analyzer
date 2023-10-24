<script setup lang="jsx">
import { reactive, ref } from 'vue'
import { DocumentCopy16Filled as Copy, Edit20Filled as Edit, DocumentText24Filled as Detail, AirplaneTakeOff16Regular as Run } from "@vicons/fluent";
import useCommon from '@/components/hooks/handle.js'
import { list, create, del, update, copy, details } from '@/api/testcase/playback.js'

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
  protocol_server_type: "more_stream", // one_stream more_stream, multi_stream
  total_time: 10,
  case_type: 1,
  config: {
    pkt_config: {
      pad_data: "x",
      op: "inc", // inc, dec, random
    },
    stream_config: [
      {
        size: 60,
        pps: 30,
        isg: 0
      }
    ],
    start_config: {
      mult: 10,
      interaction_occurrence: false
    },
  },
  file: "",
  pcap_playback_file_name: "",
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
  captureKey++
  for (let key in theForm) {
    theForm[key] = data[key]
  }
  theForm.id = data.id
  topoData.value = data.network_config
}

function handForm (theForm, netCfgData, capture) {
  const formData = new FormData()
  if (theForm.id) formData.append('id', theForm.id)
  formData.append('case_name', theForm.case_name)
  formData.append('total_time', theForm.total_time)
  if (theForm.file !== undefined) {
    formData.append('file', theForm.file)
  }
  if (theForm.pcap_playback_file_name !== "") {
    formData.append('pcap_playback_file_name', theForm.pcap_playback_file_name)
  }
  formData.append('capture', JSON.stringify(capture))
  formData.append('network_config', JSON.stringify(netCfgData))
  formData.append('config', JSON.stringify(theForm.config))
  return formData
}

const capName = ref('')
const caseName = () => {
  const date = new Date()
  theForm.case_name = 'PLAYBACK' + date.getFullYear() + (date.getMonth() + 1) + date.getDate() + date.getHours() + date.getMinutes() + date.getSeconds()
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
    size: 60,
    pps: 0,
    isg: 0,
  }
}

const beforeUpload = (UploadFileInfo, fileList) => {
  theForm.file = UploadFileInfo?.file?.file
}

const remove = () => {
  theForm.file = ""
}


</script>

<template>
  <Title title="场景回放" />
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

  <TheModel :title="isEdit ? '编辑PLAYBACK实例' : '新增PLAYBACK实例'" ref="model" @after-leave="afterLeave" width="900px"
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
        <NetCfg :caseType="1" ref="netCfg" :topoData="topoData"></NetCfg>
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
          <n-form-item label="上传文件">
            <n-upload @before-upload="beforeUpload" :multiple="false" :max="1" accept=".pcap" @remove="remove">
              <n-button>上传PCAP文件</n-button> {{ theForm.pcap_playback_file_name }}
            </n-upload>
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

          <n-dynamic-input v-model:value="theForm.config.stream_config" item-style="margin-bottom: 10px;"
            :on-create="onCreate" #default="{ index, value }">
            <n-input-group :style="{ width: '600px' }">
              <n-input-group-label>包大小(size)</n-input-group-label>
              <n-input-number :show-button="false" :min="0" v-model:value="theForm.config.stream_config[index].size"
                :style="{ width: '80px' }" />
              <n-input-group-label>单包速率(pps)</n-input-group-label>
              <n-input-number :show-button="false" :min="0" v-model:value="theForm.config.stream_config[index].pps"
                :style="{ width: '80px' }" />
              <n-input-group-label>包间隔(isg)</n-input-group-label>
              <n-input-number :show-button="false" :min="0" v-model:value="theForm.config.stream_config[index].isg"
                :style="{ width: '80px' }" />
            </n-input-group>
          </n-dynamic-input>

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