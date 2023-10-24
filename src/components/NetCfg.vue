<script setup>
import { onMounted, reactive, ref, watch, onBeforeUnmount, computed } from 'vue'
import { search } from '@/api/template/portCfg.js'
import { userPort } from '@/api/serve/port.js'
import bus from 'vue3-eventbus'

const props = defineProps({
  topoData: {
    type: Array,
    default: []
  },
  // 条件区分
  caseType: {
    type: Number,
    default: 0
  }
})

function compare (p) {
  return function (m, n) {
    var a = m[p]
    var b = n[p]
    return a - b
  }
}

let userPortOptions = ref([])

async function getBindPorts () {
  const { data } = await userPort()
  userPortOptions.value = data
}

onMounted(async () => {
  getBindPorts()
  await searchServePort()
  await searchClientPort()
})



const clientTabValue = ref(null)
const serverTabValue = ref(null)
const data = reactive({
  client_config: [],
  server_config: []
})
const clientCheck = ref([])
const serveCheck = ref([])
const clientOptions = ref([])
const serverOptions = ref([])

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

const updateClientCheck = v => {
  bus.emit('selectClientPort', v)

  let tmpCfgData = v.map((item, i) => {
    // 赋予原来的值
    // console.log(data.client_config);
    let hasPort = data.client_config.some((v, i) => v.port === item)
    let j = -1
    data.client_config.forEach((v, i) => {
      if (v.port === item) {
        j = i
      }
    })
    if (hasPort && j >= 0) {
      return data.client_config[j]
    }

    return {
      port: item,
      client_template: '',
      src_ip_range: '',
      netmask: '24',
      gateway: '',
      vpn_gateway: "",
      vlan_id: '',
      src_mac_range: '',
      core_bind: '',
      port_speed_detect_mode: 'auto',
      port_speed: '',
      server_port: '',
      dst_ip_range: '',
      dst_mac_range: '',
      next_mac_flag: 'auto',
      next_mac_range: ""
    }
  })

  tmpCfgData.sort(compare("port"))
  data.client_config = tmpCfgData

  clientCheck.value = v.sort((a, b) => {
    return a - b
  })
  clientTabValue.value = clientCheck.value[0]
}

const updateSeverCheck = v => {
  bus.emit('selectServerPort', v)
  let tmpCfgSever = v.map((item, i) => {
    let hasPort = data.server_config.some((v, i) => v.port === item)
    let j = -1
    data.server_config.forEach((v, i) => {
      if (v.port === item) {
        j = i
      }
    })

    if (hasPort && j >= 0) {
      return data.server_config[j]
    }

    return {
      port: item,
      server_template: '',
      src_ip_range: '',
      netmask: '24',
      gateway: '',
      vpn_gateway: "",
      vlan_id: '',
      src_mac_range: '',
      core_bind: '',
      port_speed_detect_mode: 'auto',
      port_speed: '',
      dst_ip_range: '',
      dst_mac_range: '',
      next_mac_flag: 'auto',
      next_mac_range: ""
    }
  })

  tmpCfgSever.sort(compare("port"))
  data.server_config = tmpCfgSever

  console.log("server_config", data.server_config);

  serveCheck.value = v.sort((a, b) => {
    return a - b
  })
  serverTabValue.value = serveCheck.value[0]
}

const updateClientTab = (val) => {
  clientTabValue.value = val
}
const updateServerTab = (val) => {
  serverTabValue.value = val
}

function allServerOption () {
  return serveCheck.value.map(item => {
    return {
      label: "PORT" + item,
      value: item
    }
  })
}

function allClientOption () {
  return clientCheck.value.map(item => {
    return {
      label: "PORT" + item,
      value: item
    }
  })
}

defineExpose({
  data
})

// 有数据时初始化数据
const setData = () => {
  if (props.topoData?.client_config != undefined) {
    try {
      data.client_config = props.topoData.client_config
      clientCheck.value = props.topoData.client_config.map(item => item.port)
      data.server_config = props.topoData.server_config
      serveCheck.value = props.topoData.server_config.map(item => item.port)
      clientTabValue.value = clientCheck.value[0]
      serverTabValue.value = serveCheck.value[0]

      bus.emit('checkClient', clientCheck.value)
      bus.emit('checkServer', serveCheck.value)
    } catch (error) {
    }
  }

}

watch(() => props.topoData, () => {
  setData()
}, { immediate: true })


async function searchClientPort () {
  try {
    let params = {
      page: 1,
      page_size: 1000,
      case_type: props.caseType,
      cs_type: 0, // 0 客户端 1服务端
      search_data: '',
    }
    let { code, data } = await search(params)
    clientOptions.value = handleOption(data)
  } catch (error) {
    console.log(error)
  }
}

async function searchServePort () {
  try {
    let params = {
      page: 1,
      page_size: 1000,
      case_type: props.caseType,
      cs_type: 1, // 0 客户端 1服务端
      search_data: '',
    }
    let { code, data } = await search(params)
    serverOptions.value = handleOption(data)
  } catch (error) {
    console.log(error)
  }
}

function handleOption (data) {
  let options = data.map(item => {
    return {
      label: item.network_name,
      value: item.id,
      network_config: item.network_config
    }
  })
  return options
}


const updateClientPortCfg = (n, v, options) => {
  let temObj = options.network_config
  for (let key in temObj) {
    data.client_config[n][key] = temObj[key]
  }
}

const updateServePortCfg = (n, v, options) => {
  let temObj = options.network_config
  for (let key in temObj) {
    data.server_config[n][key] = temObj[key]
  }
}

</script>
<template>
  <div class="center-main">
    <div class="configura">
      <div style="font-size: 16px;">客户端配置</div>
      <n-space item-style="display: flex;">
        <n-checkbox-group :value="clientCheck" @update:value="updateClientCheck">
          <n-checkbox v-for="(item, index) in userPortOptions" :key="item" :value="item" :label="'PORT-' + item" />
        </n-checkbox-group>
      </n-space>
      <n-tabs type="segment" size="small" animated :value="clientTabValue" @update:value="updateClientTab">
        <n-tab-pane :name="item.port" :tab="'PORT-' + item.port" display-directive="show:lazy"
          v-for="(item, i) in data.client_config" :key="i">
          <n-form size="medium" :model="item" label-placement="left" label-align="left" :style="{
            maxWidth: '440px',
          }" label-width="120px">
            <n-form-item label="端口配置模板">
              <n-select @update:value="(id, options) => updateClientPortCfg(i, id, options)" remote
                @search="updateClientPortCfg" v-model:value="item.client_template" :options="clientOptions" />
            </n-form-item>
            <n-form-item label="服务端口">
              <n-select v-model:value="item.server_port" :options="allServerOption()" />
            </n-form-item>

            <n-form-item label="源IP地址" path="src_ip_range">
              <n-input v-model:value="item.src_ip_range" />
            </n-form-item>
            <n-form-item label="子网掩码" path="netmask">
              <n-input-number :max="30" :min="0" v-model:value="item.netmask" />
            </n-form-item>
            <n-form-item label="子网网关" path="gateway">
              <n-input v-model:value="item.gateway" />
            </n-form-item>
            <n-form-item label="源MAC地址" path="src_mac_range">
              <n-input v-model:value="item.src_mac_range" />
            </n-form-item>
            <n-form-item label="目的IP地址" path="dst_ip_range">
              <n-input v-model:value="item.dst_ip_range" />
            </n-form-item>
            <n-form-item label="目的MAC地址" path="dst_mac_range">
              <n-input v-model:value="item.dst_mac_range" />
            </n-form-item>
            <n-form-item label="VPN网关">
              <n-input v-model:value="item.vpn_gateway" />
            </n-form-item>
            <n-form-item label="下一跳MAC地址获取方式">
              <n-select v-model:value="item.next_mac_flag" :options="macOption" />
            </n-form-item>
            <n-form-item label="下一跳MAC地址">
              <n-input size="small" :disabled="item.next_mac_flag == 'auto'" v-model:value="item.next_mac_range" />
            </n-form-item>
          </n-form>
        </n-tab-pane>
      </n-tabs>

    </div>

    <div class="configura">
      <div style="font-size: 16px;">服务端配置</div>
      <n-space item-style="display: flex;">
        <n-checkbox-group :value="serveCheck" @update:value="updateSeverCheck">
          <n-checkbox v-for="(item, index) in userPortOptions" :key="item" :value="item" :label="'PORT-' + item" />
        </n-checkbox-group>
      </n-space>
      <n-tabs type="segment" size="small" :value="serverTabValue" @update:value="updateServerTab" animated>
        <n-tab-pane :name="item.port" :tab="'PORT-' + item.port" display-directive="show:lazy"
          v-for="(item, i) in data.server_config" :key="item.port">
          <n-form size="medium" :model="item" label-placement="left" label-align="left" :style="{
            maxWidth: '440px',
          }" label-width="120px">
            <n-form-item label="端口配置模板">
              <n-select @update:value="(id, options) => updateServePortCfg(i, id, options)"
                v-model:value="item.server_template" :options="serverOptions" />
            </n-form-item>
            <n-form-item label="客户端口">
              <n-select v-model:value="item.server_port" :options="allClientOption()" />
            </n-form-item>
            <n-form-item label="源IP地址" path="src_ip_range">
              <n-input v-model:value="item.src_ip_range" />
            </n-form-item>
            <n-form-item label="子网掩码" path="netmask">
              <n-input-number :max="30" :min="0" v-model:value="item.netmask" />
            </n-form-item>
            <n-form-item label="子网网关" path="gateway">
              <n-input v-model:value="item.gateway" />
            </n-form-item>
            <n-form-item label="源MAC地址" path="src_mac_range">
              <n-input v-model:value="item.src_mac_range" />
            </n-form-item>
            <n-form-item label="目的IP地址" path="dst_ip_range">
              <n-input v-model:value="item.dst_ip_range" />
            </n-form-item>
            <n-form-item label="目的MAC地址" path="dst_mac_range">
              <n-input v-model:value="item.dst_mac_range" />
            </n-form-item>
            <n-form-item label="VPN网关">
              <n-input v-model:value="item.vpn_gateway" />
            </n-form-item>
            <n-form-item label="下一跳MAC地址获取方式">
              <n-select v-model:value="item.next_mac_flag" :options="macOption" />
            </n-form-item>
            <n-form-item label="下一跳MAC地址">
              <n-input size="small" :disabled="item.next_mac_flag == 'auto'" v-model:value="item.next_mac_range" />
            </n-form-item>
          </n-form>
        </n-tab-pane>
      </n-tabs>
    </div>
  </div>
</template>


<style lang="scss" scoped>
.center-main {
  display: flex;
  justify-content: space-between;

  .configura {
    width: 45%;

    .n-input-number {
      width: 100%;
    }
  }
}
</style>
