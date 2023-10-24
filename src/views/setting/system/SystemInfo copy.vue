<template>
  <div class="mid">
    <n-card title="机箱系统版本" hoverable>
      {{ systemInfo.system_version }}
    </n-card>
  </div>
  <div class="top">
    <div class="top-card">
      <n-card title="CPU" hoverable>
        <n-data-table :columns="cpuColumns" :data="webSocketInfo.cpuInfo" :bordered="false" />
      </n-card>
    </div>
    <div class="top-card">
      <n-card title="内存" hoverable>
        <n-data-table :columns="ramColumns" :data="webSocketInfo.ramInfo" :bordered="false" />
      </n-card>
    </div>
  </div>
  <div class="mid">
    <n-card title="服务器信息" hoverable>
      <n-data-table :columns="serverColumns" :data="webSocketInfo.serverInfo" :bordered="false" />
    </n-card>
  </div>

  <div class="slot">
    <div class="solt-card">
      <n-card title="网卡信息" hoverable>
        <n-data-table :columns="portColumns" :data="systemInfo.portInfo" :bordered="false" />
      </n-card>
    </div>
  </div>
</template>
  
<script setup>
import { onMounted, reactive, onBeforeUnmount, computed, h } from 'vue'
import { useStore } from 'vuex'
import devices from '@/api/setting/devices.js'
import { createToaster } from "@meforma/vue-toaster";
const toaster = createToaster({ position: "top" });

const cpuColumns = [
  {
    title: "cpu核心数",
    key: "cpu_count"
  },
  {
    title: "cpu使用率",
    key: "current_cpu_use"
  },
  {
    title: "空闲率",
    key: "free_cpu_use"
  },
  {
    title: "系统使用率",
    key: "system_cpu_use"
  },
];
const webSocketInfo = reactive({
  cpuInfo: [],
  ramInfo: [],
  serverInfo: []
})
const ramColumns = [
  {
    title: "总内存",
    key: "memtotal"
  },
  {
    title: "剩余内存",
    key: "memfree"
  },
  {
    title: "使用内存百分比",
    key: "mempercent"
  },
  {
    title: "已使用内存",
    key: "memused"
  },
];
const serverColumns = [
  {
    title: "磁盘路径",
    key: "disk_path"
  },
  {
    title: "文件系统",
    key: "disk_file_system"
  },
  {
    title: "盘符类型",
    key: "disk_type"
  },
  {
    title: "磁盘已用大小",
    key: "disk_use"
  },
  {
    title: "磁盘可用大小",
    key: "disk_free"
  },
  {
    title: "磁盘总大小",
    key: "disk_total"
  },
  {
    title: "磁盘已用百分比",
    key: "disk_percent"
  },
];

// 板卡管理
const portColumns = [
  {
    title: "网卡名称",
    key: "name"
  },
  {
    title: "MAC地址",
    key: "mac_addr"
  },
  {
    title: "PCI地址",
    key: "pci_addr"
  },
  {
    title: "网卡速率",
    key: "support_speed"
  },
  {
    title: "numa节点",
    key: "numa_node"
  },
  {
    title: "描述",
    key: "desc"
  },
];
const systemInfo = reactive({
  portInfo: [],
  system_version: null
})
const getSystemVer = async () => {
  let res = await devices.getCaseInfo()
  if (res.code == 0) {
    systemInfo.system_version = res.data[0].system_version
  }
}
const getInfo = async () => {
  let cardRes = await devices.getCardInfo()
  // console.log(cardRes);
  if (cardRes.code == 0) {
    systemInfo.portInfo = [...cardRes.data]
  }
}
// 心跳检测
let ws = null
let token = window.localStorage.getItem('token') || null
const getWebInfo = (msg) => {
  let { data } = msg
  data = JSON.parse(data)
  switch (data.type) {
    case "system_info":
      webSocketInfo.cpuInfo = [data.data.cpu_info]
      webSocketInfo.ramInfo = [data.data.memory_info]
      webSocketInfo.serverInfo = [data.data.disk_status]
      break;
  }
}
onMounted(() => {
  // 防止刷新报错
  // setTimeout(() => {
  console.log();
  ws = new WebSocket(`ws://${import.meta.env.VITE_BASE_API}/realtime/realtime`);
  ws.onopen = () => {
    ws.send(token)
    ws.send(JSON.stringify({ system_info: 'system_info_on' }))
  }
  ws.onmessage = getWebInfo
  // }, 0);
})
onMounted(() => {
  getInfo()
  getSystemVer()
})
onBeforeUnmount(() => {
  ws.close()
  ws.onclose = function (event) {
    console.log(event);
  };
  ws = null
})
</script>
  
<style lang="scss"  scoped>
.top {
  margin-top: 20px;
  display: flex;
  justify-content: space-around;

  .top-card {
    width: 47%;
  }

}

.slot {
  margin-top: 20px;

  .solt-card {
    margin: 19px;
  }
}

.mid {
  margin: 0 auto;
  margin-top: 20px;
  width: 97%;
  overflow: auto;
}
</style>
  