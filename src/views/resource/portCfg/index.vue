<script setup lang="jsx">
import { reactive, ref } from 'vue'
import { DocumentCopy16Filled as Copy, Edit20Filled as Edit, DocumentText24Filled as Detail, AirplaneTakeOff16Regular as Run } from "@vicons/fluent";
import useCommon from '@/components/hooks/handle.js'
import { list, create, del, update, details, copy } from '@/api/template/portCfg'

const model = ref(null)

const { dataSource, pagination, isEdit, updateCheckVal, afterLeave, addData, refresh, delData, confirm, getDetail, copyData, editData, rowKey, checkRowKeys, key, filterData } = useCommon({ list, create, update, del, copy, details, resetFormVal, setFormVal });

const columns = [
  {
    type: "selection",
  },
  {
    title: '编号',
    key: 'id',
    width: 70,
  },
  {
    title: '名称',
    key: 'network_name',
    width: 300
  },
  {
    title: '端口类型',
    key: 'cs_type',
    render: (row) => {
      return row.cs_type === 1 ? '服务端配置' : '客户端配置'
    }
  },
  {
    title: '配置类型',
    key: 'case_type',
    render: (row) => {
      return getLabel(row.case_type)
    }
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
    width: 200,
    render: (row) => {
      return (
        <div>
          <BtnIcon color="#2969FF" msg="编辑" type="default" onClick={() => editData(model, row.id)}>
            <Edit></Edit>
          </BtnIcon>
          <BtnIcon color="#2969FF" msg="复制" type="default" onClick={() => copyData(row)}>
            <Copy />
          </BtnIcon>
        </div>
      )
    }
  },
]

const caseTypeOption = [
  { label: "场景回放", value: 1 },
  { label: "TCP协议", value: 2 },
  { label: "UDP协议", value: 3 },
  { label: "IPv4协议", value: 4 },
  { label: "IGMP协议", value: 5 },
  { label: "ICMP协议", value: 6 },
  { label: "ARP协议", value: 7 },
  { label: "IPV6", value: 8 },
  { label: "RFC2544", value: 10 },

]

function getLabel (case_type) {
  let item = caseTypeOption.find(item => item.value === case_type)
  return item.label
}



const theForm = reactive({
  network_name: '',
  case_type: 1,
  cs_type: 0,
  network_config: {
    dst_ip_range: '',
    dst_mac_range: '',
    gateway: '',
    netmask: '',
    src_ip_range: '',
    src_mac_range: '',
    vpn_gateway: "",
    vlan_id: '',
    core_bind: '',
    port_speed_detect_mode: 'auto',
    port_speed: '',
    server_port: '',
    next_mac_flag: 'auto',
    next_mac_range: ""
  },

})


// 暂时不校验IP
const rules = reactive({
  src_ip_range: {
    required: true,
    trigger: ["blur"],
    message: "请输入源IP地址",
    // validator: (rule, value) => {
    //   const isRight = validIP(value)
    //   if (!isRight) {
    //     rule.message = "请输入正确的IP地址"
    //     return false
    //   } else {
    //     return true
    //   }
    // }
  },
  src_mac_range: {
    required: true,
    trigger: ["blur"],
    message: "请输入源MAC地址",
    validator: (rule, value) => {
      const isRight = validMAC(value)
      if (!isRight) {
        rule.message = "请输入正确的MAC地址"
        return false
      } else {
        return true
      }
    }
  },
  netmask: {
    required: true,
    trigger: ["blur"],
    message: "请输入子网掩码",
    validator: (rule, value) => {
      if (value === null) return false
      let str = value.toString(value)
      if (str.includes('.')) {
        console.log(value);
        rule.message = "子网掩码应为0-30之间且为整数"
        return false
      } else {
        return true
      }
    }
  },
  gateway: {
    required: true,
    trigger: ["blur"],
    message: "请输入网关"
  },
  dst_ip_range: {
    required: true,
    trigger: ["blur"],
    message: "请输入目的IP地址",
  },
  dst_mac_range: {
    required: true,
    trigger: ["blur"],
    message: "请输入目的MAC地址",
    validator: (rule, value) => {
      const isRight = validMAC(value)
      if (!isRight) {
        rule.message = "请输入正确的MAC地址"
        return false
      } else {
        return true
      }
    }
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

function setFormVal (data) {
  Object.keys(theForm).map(item => {
    theForm[item] = data[item]
  })
  theForm.id = data.id
}

const csOption = [
  { label: "客户端配置", value: 0 },
  { label: "服务端配置", value: 1 },
]

const macOption = [
  {
    label: "ARP自动获取",
    value: 'auto'
  },
  {
    label: "手动输入",
    value: 'manual'
  },
]

const modeOption = [
  {
    label: "手动协商",
    value: 'manual'
  },
  {
    label: "自动协商",
    value: 'auto'
  },
]

let searchForm = reactive({
  time: null,
  search_data: ''
})
const resetSearch = () => {
  searchForm.time = null
  searchForm.search_data = ''
}

function handel () {
  console.log('删除');
}
</script>

<template>
  <div class="the-portCfg">
    <Title title="端口模版" />
    <SearchBox :searchForm="searchForm" @filterData="filterData(searchForm)"
      @refreshData="() => { refresh(); resetSearch() }"></SearchBox>
    <ActIonBtnBar @deleteData="delData" @addData="() => { addData(model) }" />

    <n-data-table style="padding: 20px;" max-height="calc(100vh - 410px)" :key="key" :rowKey="rowKey" :pagination="false"
      @update:checked-row-keys="updateCheckVal" :columns="columns" :data="dataSource" :bordered="false" />

    <div class="the-pag">
      <n-pagination v-model:page="pagination.page" :page-count="pagination.pageCount" :default-page-size="10"
        :pageSizes="pagination.pageSizes" :showSizePicker="true"
        @update:page="(page) => { pagination.onUpdatePage(page, searchForm) }" v-model:checkRowKeys="checkRowKeys"
        @updatePageSize="(pageSize) => pagination.onUpdatePageSize(pageSize, searchForm)" />
    </div>

    <TheModel :title="isEdit ? '编辑端口配置' : '新增端口配置'" ref="model" @after-leave="afterLeave"
      @confirm="confirm(model, theForm)" width="500px" height="550px">
      <n-form size="medium" :model="theForm" label-placement="left" label-align="left" :style="{
        maxWidth: '440px',
      }" label-width="120px">
        <n-form-item label="配置名称">
          <n-input v-model:value="theForm.network_name" />
        </n-form-item>
        <n-form-item label="实例类型">
          <n-select v-model:value="theForm.case_type" :options="caseTypeOption" />
        </n-form-item>
        <n-form-item label="配置类型">
          <n-select v-model:value="theForm.cs_type" :options="csOption" />
        </n-form-item>
        <n-form-item label="源IP地址" path="src_ip_range">
          <n-input v-model:value="theForm.network_config.src_ip_range" />
        </n-form-item>
        <n-form-item label="子网掩码" path="netmask">
          <n-input-number :max="30" :min="0" v-model:value="theForm.network_config.netmask" />
        </n-form-item>
        <n-form-item label="子网网关" path="gateway">
          <n-input v-model:value="theForm.network_config.gateway" />
        </n-form-item>
        <n-form-item label="源MAC地址" path="src_mac_range">
          <n-input v-model:value="theForm.network_config.src_mac_range" />
        </n-form-item>
        <n-form-item label="目的IP地址" path="dst_ip_range">
          <n-input v-model:value="theForm.network_config.dst_ip_range" />
        </n-form-item>
        <n-form-item label="目的MAC地址" path="dst_mac_range">
          <n-input v-model:value="theForm.network_config.dst_mac_range" />
        </n-form-item>
        <n-form-item label="VPN网关">
          <n-input v-model:value="theForm.network_config.vpn_gateway" />
        </n-form-item>
        <n-form-item label="下一跳MAC地址获取方式">
          <n-select v-model:value="theForm.network_config.next_mac_flag" :options="macOption" />
        </n-form-item>
        <n-form-item label="下一跳MAC地址">
          <n-input :disabled="theForm.network_config.next_mac_flag === 'auto'"
            v-model:value="theForm.network_config.next_mac_range" />
        </n-form-item>
      </n-form>
    </TheModel>
  </div>
</template>

<style lang="scss" scoped>
.the-pag {
  margin-top: 10px;
}

.the-portCfg {
  // padding: 20px;
}
</style>