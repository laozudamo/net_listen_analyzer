<script setup lang="jsx">
import { computed, onMounted, reactive, ref, watch, watchEffect } from 'vue'
import { DocumentCopy16Filled as Copy, Edit20Filled as Edit, DocumentText24Filled as Detail,CheckmarkCircle12Regular as Check, AirplaneTakeOff16Regular as Run } from "@vicons/fluent";
import useCommon from '@/components/hooks/handle.js'
import { list, getNext, getProtocolTem,getVm, addStream, del, update, details } from '@/api/testcase/flow.js'
import { userPort } from '@/api/serve/port.js'
import { useRoute, useRouter } from 'vue-router'
import { createToaster } from "@meforma/vue-toaster";
const toaster = createToaster({ type: 'error', position: 'top', duration: 1000 });
const ok = createToaster({ type: 'success', position: 'top', duration: 3000 });

const model = ref(null)
const route = useRoute()
const router = useRouter()
const name = route.query.name

let binaryCode = ref("")

const json_file_name = route.query.json_file_name

const columns = [
  {
    type: "selection",
  },
  {
    title: '流名称',
    key: 'name',
    width: 300,
  },
  {
    title: '流模式',
    key: 'mode.type',
    width: 300,
    render: (row) => {
        let item = flowOption.find(item => item.value === row.mode.type)
        return item.label
    }
  },
  {
    title: 'isg',
    key: 'isg'
  },
  {
    title: 'next',
    key: 'next',
    render: (row) => {
      return row.next ? row.next : '-'
    }
  },
  {
    title: '操作',
    titleAlign: 'center',
    width: 100,
    render: (row) => {
      return (
        <div>
          <BtnIcon color="#2969FF" msg="编辑" type="default" onClick={() => editData(row)}>
            <Edit></Edit>
          </BtnIcon>
        </div>
      )
    }
  },
]


let dataSource = ref([])
let isEdit = ref(false)

const nameList = computed(() => {
  return dataSource.value.map(item => {
    return {
      label: item.name,
      value: item.name
    }
  })
})

async function getList () {
  const { data } = await list(json_file_name)
  dataSource.value = data
}

onMounted(() => {
  getList()
})


const theForm = reactive({
  name: "s2",
  next: null,
  flags: 0,
  action_count: 0,
  enabled: true,
  self_start: true,
  start_paused: false,
  isg: 1.0,
  core_id: -1,
  mode: {
    rate: {
      type: "pps",
      value: 10
    },
    type: "continuous",
    total_pkts: 1,
    
  },
  packet: {
    binary: "",
    meta: "",
    preamble_size: 8
  },
  vm: {
    instructions: []   
  },
  flow_stats: {
    enabled: false
    },
})

const copyForm = JSON.parse(JSON.stringify(theForm))

function resetFormVal () {
  for (let key in copyForm) {
    theForm[key] = copyForm[key]
  }
  if ('id' in theForm) {
    delete theForm.id
  }
}

watch(() => theForm.mode.type, (val,o) => {
  
  if(val === "multi_burst") {
    theForm.mode.pkts_per_burst = 1
    theForm.mode.ibg = 1
    theForm.mode.count = 1
  } else {
    delete theForm.mode.pkts_per_burst
    delete theForm.mode.ibg
    delete theForm.mode.count
  }
  if(val === "continuous") {
    delete theForm["next"]
    console.log(theForm)
  }else {
    theForm.next = null
  }

},{immediate: true})


let theId = ref(0)
function setFormVal (data) {
  for (let key in theForm) {
    theForm[key] = data[key]
  }
  theId.value = data.id
  binaryCode.value = data.binary_sound_code
}

const caseName = () => {
  const date = new Date()
  theForm.name = 's_' + date.getFullYear() + (date.getMonth() + 1) + date.getDate() + date.getHours() + date.getMinutes() + date.getSeconds()
}

const flowOption = [
  {
    label: '连续',
    value: 'continuous'
  },
  {
    label: '突发',
    value: 'single_burst'
  },
  {
    label: '混合',
    value: 'multi_burst'
  },
]

function getBack () {
  router.back()
}

let protocalCheck = ref("Ether")

const options = reactive([
  {
    label: "Ether",
    key: "Ether",
    depth: 0,
    isLeaf: false,
  }
])

function addData () {
  isEdit.value = false
  caseName()
  // handleLoad()
  updatePro()
  model.value.show()
}

async function handleLoad (option) {
  const { data } = await getNext(option.label)

  option.children = data.map(item => {
    return {
      label: item,
      key: option.key + '/' + item,
      depth: option.depth + 1,
      isLeaf: option.depth === 10,
    }
  })
}
let jsonPkt = ref([])

async function updatePro () {
  let pktList = protocalCheck.value.split("/").map(item => {
    return {
      id: item,
      children: []
    }
  })

  let params = {
    pkt_list: pktList,
      instructions: [],
      global_parameters: {
        cache_size: "5000"
      }
  }
  const { data,binary_sound_code_list } = await getProtocolTem(params)
  //底部编码
  binaryCode.value = binary_sound_code_list

  let tmpData = handleJsonPkt(data)
  jsonPkt.value = addVm(tmpData)
}

function handleJsonPkt (data) {
    let res = data.map((item,index) => {

      if (item.hasOwnProperty("children")) {
        return {
          index,
          id: item.id,
          children: handleJsonPkt(item.children)
        }
      } else {

        if (typeof item.value !== "string") {
          item.value = JSON.stringify(item.value)
        }
        return {
          index,
          id: item.id,
          offset: item.offset,
          value: item.value,
          length: item.length,
          edit: false,
          isEditVm: false,
          vmData: [],
          // hvalue: item.hvalue,
        }
      }
    })
    return res
}

function addVm(data) {
  return data.map(item => {
    let vm = item.id
    item.children = item.children.map(ele => {
      return {
        vm: vm,
        ...ele
      }
    })
    return item
  } )
}

function handleEditJsonPkt (data) {
    let res = data.map((item,index) => {

      if (item.hasOwnProperty("children")) {
        return {
          index,
          id: item.id,
          offset: item.offset,
          children: handleJsonPkt(item.children)
        }
      } else {

        if (typeof item.value !== "string") {
          item.value = JSON.stringify(item.value)
        }
        return {
          index,
          id: item.id,
          offset: item.offset,
          value: item.value,
          length: item.length,
          edit: false,
          isEditVm: false,
          vmData: [],
          hvalue: item.hvalue,
        }
      }
    })
    return res
}

function addEditVm(data) {
  return data.map(item => {
    let vm = item.id
    item.children = item.children.map(ele => {
      return {
        vm: vm,
        ...ele
      }
    })
    return item
  } )
}

async function confirm () {
  let pkt_List = getPktList()
  let vm_list = getVmList()
  console.log("pkt_List", pkt_List)

  let params = {
    pkt_list: pkt_List,
    global_parameters: {
        cache_size: "5000"
    },
    instructions: vm_list,
  }

  const { data, binary, field_engine, binary_sound_code_list } = await getProtocolTem(params)

  //底部编码
  binaryCode.value = binary_sound_code_list

  theForm.vm.instructions = field_engine?.instructions?.instructions
  theForm.packet.binary = binary

  if(!isEdit.value) {
    streamAdd()
  } else {
    streamUpdate()
  }
}

async function streamAdd() {
  let addNew = true
  dataSource.value.length > 0 ? addNew = false : addNew = true

  let data = {
    stream_info: theForm,
    json_file_name: json_file_name,
    add_new_profile: addNew
  }
  let {code,msg} = await addStream(data)

  if(code === 0) {
    getList()
    model.value.close()
  }
}

async function streamUpdate() {
  let data = {
    stream_info: theForm,
    json_file_name: json_file_name,
    add_new_profile: false,
    id: theId.value
  }
  let {code,msg} = await update(data)

  if(code === 0) {
    ok.show(msg)
    getList()
    model.value.close()
  }
}

function getPktList() {
  return jsonPkt.value.map(item => {
    let obj = {
      id: item.id
    }

    let tmpFields = item.children.map(ele => {
        return {
          id: ele.id,
          offset: ele.offset,
          length: ele.length,
          value: ele.value,
          hvalue: ele.hvalue
        }
      })
    obj.fields = tmpFields
    return obj
  })
}

function getVmList() {
  let tmpList = []
  jsonPkt.value.forEach(item => {
    item.children.forEach(ele => {
      if (ele.isEditVm) {
        let tmpVm = getFinalVm(ele.vmData)
        tmpList.push(...tmpVm)
      }
    })
  })
  return tmpList
}

const protoColumn = [
  {
    title: '包名',
    key: 'id',
  },
  {
    title: '偏移量',
    key: 'offset',
  },
  {
    title: '长度',
    key: 'length',
    render: (row) => {
    //  if(row.edit) {
    //   return <n-input size="small" v-model:value={row.length} />
    //  } else {
      return <div>{row.length}</div>
    //  }
    }
  },
  {
    title: '值',
    key: 'value',
    render: (row) => {
      return row.edit ? <n-input size="small" v-model:value={row.value} /> : <div>{row.value}</div>
    }
  },
  {
    title: '操作',
    render: (row) => {
      if (row.value) {
        return (
         row.edit ?   
         <BtnIcon color="#2969FF" msg="done" type="default" onClick={() => row.edit = !row.edit}>
            <Check></Check>
          </BtnIcon>
          : 
          <BtnIcon color="#2969FF" msg="edit" type="default" onClick={() => row.edit = !row.edit}>
            <Edit></Edit>
          </BtnIcon>
        )
      }
      return ""
    }
  },
  {
    title: '操作',
    render:(row) => {
      if (row.vm) {
        return (
          <BtnIcon color="#2969FF" msg="editVm" type="default" onClick={() => editVm(row)}>
            <Edit></Edit>
          </BtnIcon>
        )
      }
    }
  }
]

let vmModel = ref(null)
let vmData = ref([])

let curRow = ref({})

async function editVm (row) {
  curRow.value = row
  if(row.isEditVm) {
    vmData.value = row.vmData
  } else {
    await getVmData(row)
  }
  vmModel.value.show()
}

async function getVmData(row) {
  let params = {
    method_name: "SimpleVariable",
    vm_args: {
        "name": row.vm + "_" + row.id
    }
  }
  let { data, code} = await getVm(params)
  if(code === 0) {
    vmData.value = data.map(item => {
      return {
        id: item.id,
        name: row.vm + "_" + row.id,
        options: item.options
      }
    })
  }
}

function confirmVm() {
  jsonPkt.value.forEach(item => {
    if(item.id ===  curRow.value.vm) {
      item.children.forEach(ele => {
        if(ele.id === curRow.value.id) {
          ele.vmData = vmData.value
          ele.isEditVm = true
        }
      })
    }
  })

  vmModel.value.close()
}

function getFinalVm(vm) {
  return vm.map(item => {
    let obj = {
      id: item.id,
      parameters: {}
    }
    item?.options.forEach(ele => {
      obj.parameters[ele.key] = ele.value + ""
    })

    obj.id === "STLVmFlowVar" ? obj.parameters["name"] = item.name : obj.parameters["fv_name"] = item.name
    return obj
  })
}

function afterLeave() {
  resetFormVal()
  protocalCheck.value = "Ether"
  binaryCode.value = ""
}

let checkArr = ref([])

const updateCheckVal = (keys) => {
    checkArr.value = keys
    console.log(keys)
}

async function delData() {
  if (checkArr.value.length === 0) {
    return
  }
  let params = {
    ids: checkArr.value,
    json_file_name: json_file_name
  }
  const {code, msg} = await del(params)
  if(code === 0) {
    getList()
    checkArr.value = []
    ok.show(msg)
  }
}

async function editData (row) {
  isEdit.value = true
  model.value.show()
  setFormVal(row)

  let tmpData = handleEditJsonPkt(row.packet.pkt)

  tmpData = addEditVm(tmpData)

  jsonPkt.value = addEditVm(tmpData)
  
  let v = jsonPkt.value.map(item => item.id).join("/")

  protocalCheck.value = v

  if(row.vm.instructions.length > 0) {
    let vi = row.vm.instructions

    jsonPkt.value.forEach(item => {
      item.children.forEach(ele => {
        let name = ele.vm + "_" + ele.id
      // if(name)
      vi.forEach(v => {
        v.options.forEach(e => {
          let m = e.key == "name" && e.value === name
          let n = e.key == "fv_name" && e.value === name
          if(m || n) {

            let res = {
              id: v.id,
              name: name,
              options: v.options
            }
            ele.isEditVm = true
            ele.vmData.push(res)
          }
        })
      })
      })
    })

    console.log("jsss", jsonPkt.value)
  }
}

const select = ref(null)

</script>

<template>
  <Title :title="route.query.name" />
  <ActIonBtnBar style="margin-top: 20px;" @deleteData="delData" @addData="addData" />

  <n-data-table style="padding: 20px;" max-height="calc(100vh - 410px)" :row-key="(row) => row.id" :key="key"
    :checked-row-keys="checkArr" :pagination="false" @update:checked-row-keys="updateCheckVal" :columns="columns"
    :data="dataSource" :bordered="false" />

  <div class="the-pag">
    <n-button type="primary" @click="getBack">返回</n-button>
  </div>

  <TheModel :title="isEdit ? '编辑流' : '新增流'" ref="model" @after-leave="afterLeave" width="900px" @confirm="confirm">
    <n-form :model="theForm" label-placement="left" label-align="left" :style="{
    }" label-width="120px">
      <n-form-item label="流名称">
        <n-input v-model:value="theForm.name" />
      </n-form-item>
    </n-form>

    <n-tabs type="line" default-value="setting" size="medium" animated style="margin: 0px"
      pane-style="padding: 4px; box-sizing: border-box;" class="the-tab">

      <n-tab-pane name="setting" tab="配置" display-directive="show">
        <n-form :model="theForm" label-align="left" label-placement="left" :style="{
          width: '400px',
        }" label-width="120px">

          <n-form-item label="启用">
            <n-switch v-model:value="theForm.enabled" />
          </n-form-item>
          <n-form-item label="self_start">
            <n-switch v-model:value="theForm.self_start" />
          </n-form-item>

          <n-form-item label="流模式">
            <n-radio-group v-model:value="theForm.mode.type" name="flowtype">
              <n-space>
                <n-radio :value="ele.value" v-for="(ele) in flowOption" :key="ele.value">
                  {{ ele.label }}
                </n-radio>
              </n-space>
            </n-radio-group>
          </n-form-item>
          <n-form-item label="下一跳流" v-if="theForm.mode.type !== 'continuous'">
            <n-select v-model:value="theForm.next" :options="nameList" />
          </n-form-item>
          <n-form-item v-if="theForm.mode.type === 'single_burst'" label="total_pkts">
            <n-input-number v-model:value="theForm.mode.total_pkts" />
          </n-form-item>
          <n-form-item label="isg">
            <n-input-number v-model:value="theForm.isg" />
          </n-form-item>
          <n-form-item label="前导码">
            <n-input-number v-model:value="theForm.packet.preamble_size" />
          </n-form-item>
          <n-form-item label="flags">
            <n-input-number v-model:value="theForm.flags" />
          </n-form-item>

          <n-form-item label="pkts_per_burst" v-if="theForm.mode.type === 'multi_burst'">
            <n-input-number v-model:value="theForm.mode.pkts_per_burst" />
          </n-form-item>
          <n-form-item label="ibg" v-if="theForm.mode.type === 'multi_burst'">
            <n-input-number v-model:value="theForm.mode.ibg" />
          </n-form-item>
          <n-form-item label="count" v-if="theForm.mode.type === 'multi_burst'">
            <n-input-number v-model:value="theForm.mode.count" />
          </n-form-item>
        </n-form>
      </n-tab-pane>

      <n-tab-pane name="protocol" tab="协议" display-directive="show">
        <n-form :model="theForm" label-align="left" label-placement="left" :style="{
        }" label-width="120px">
          <n-form-item label="协议">
            <n-tree-select ref="select" v-model:value="protocalCheck" placeholder="选择协议" :options="options" remote
              :on-load="handleLoad" @update:value="updatePro" />
          </n-form-item>
        </n-form>
        <n-data-table max-height="calc(100vh - 500px)" size="small" :columns="protoColumn" :row-key="row => row.index" :data="jsonPkt" />

        <div>
          <h3>binary code</h3>
          <div v-for="code in binaryCode" :key="code">{{ code }}</div>
        </div>
      </n-tab-pane>
    </n-tabs>
  </TheModel>

  <TheModel title="编辑vm" ref="vmModel" height="430px" width="400px" @confirm="confirmVm">
    <div v-for="(item, index) in vmData" :key="item.id">
      <div style="font-size: 16px;font-weight: 500;padding:10px 0px;">{{ item.id }}</div>
      <div style="display: flex;" v-for="(option, i) in item.options" :key="i">
        <div style="width: 200px;">{{ option.label }}</div>
        <n-select v-if="option.hasOwnProperty('dict')" size="tiny" v-model:value="option.value" :options="option.dict" />
        <n-input v-else size="tiny" v-model:value="option.value" />
      </div>
    </div>
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