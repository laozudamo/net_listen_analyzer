<script setup lang="jsx">
import { onMounted, onUnmounted, reactive, ref } from 'vue'
import { deviceInfo } from '@/api/pcap.js'
import DiskCharts from './DiskCharts.vue'

import * as echarts from 'echarts';

let loading = ref(false);

let data = reactive({
  device_info: null,
  disk_list: [],
  internal_storage: null,
  devices_cpu: null,
  disk_io: []
})

async function getData () {
  try {
    let { device_info, disk_list, internal_storage, devices_cpu, disk_io } = await deviceInfo()
    data.device_info = device_info
    data.disk_list = disk_list
    data.internal_storage = internal_storage
    data.devices_cpu = devices_cpu
    data.disk_io = disk_io
  } catch (error) {
    console.error(error)
  }
}

onMounted(async () => {
  loading.value = true
  await getData()
  await handleMemoryChats()
  await handleCpuCharts()
  loading.value = false
  await getLoop()
})

let timer = ref(null)

async function getLoop () {
  if (timer.value) {
    clearTimeout(timer.value)
  }
  await getData()
  await handleMemoryChats()
  await handleCpuCharts()

  timer.value = setTimeout(() => {
    getLoop()
  }, 5000)
}

onUnmounted(() => {
  clearTimeout(timer.value)
})

const memoryCharts = ref(null)

function handleMemoryChats () {

  let use = data.internal_storage?.percent
  let empty = 100 - use
  let option = {
    // backgroundColor: '#2c343c',
    title: {
      text: '内存',
      left: 'center',
      top: 20,
      textStyle: {
        color: '#000000',
      }
    },
    legend: {
      show: true,
      bottom: "0%"
    },
    tooltip: {
      trigger: 'item'
    },
    visualMap: {
      show: false,
      min: 0,
      max: 100,
      inRange: {
        colorLightness: [0, 1]
      }
    },
    series: [
      {
        type: 'pie',
        radius: '55%',
        center: ['50%', '50%'],
        data: [
          { value: empty, name: '空闲', label: "22" },
          { value: use, name: '使用' }
        ].sort(function (a, b) {
          return a.value - b.value;
        }),
        roseType: 'radius',
        // label: {
        // color: 'rgba(255, 255, 255, 0.3)'
        // },
        // labelLine: {
        //   lineStyle: {
        //     color: 'rgba(255, 255, 255, 0.3)'
        //   },
        //   smooth: 0.2,
        //   length: 20,
        //   length2: 20
        // },
        // itemStyle: {
        //   color: '#c23531',
        //   shadowBlur: 200,
        //   shadowColor: 'rgba(0, 0, 0, 0.5)'
        // },
        animationType: 'scale',
        animationEasing: 'elasticOut',
        animationDelay: function (idx) {
          return Math.random() * 200;
        }
      }
    ]
  };

  memoryCharts.value = echarts.init(document.getElementById('memory'));
  memoryCharts.value.setOption(option)
}

const cpuCharts = ref(null)
function handleCpuCharts () {
  let use = data.devices_cpu?.cpu_percent
  let empty = 100 - use

  let option = {
    // backgroundColor: '#2c343c',
    title: {
      text: 'CPU',
      left: 'center',
      top: 20,
      textStyle: {
        color: '#000000'
      }
    },
    tooltip: {
      trigger: 'item'
    },
    legend: {
      show: true,
      bottom: "0%"
    },
    // visualMap: {
    //   show: false,
    //   min: 0,
    //   max: 100,
    //   inRange: {
    //     colorLightness: [0, 10]
    //   }
    // },
    series: [
      {
        type: 'pie',
        radius: '55%',
        center: ['50%', '50%'],
        data: [
          { value: empty, name: '空闲' },
          { value: use, name: '使用' }
        ].sort(function (a, b) {
          return a.value - b.value;
        }),
        roseType: 'radius',
        // label: {
        //   color: 'rgba(255, 255, 255, 0.3)'
        // },
        // labelLine: {
        //   lineStyle: {
        //     color: 'rgba(255, 255, 255, 0.3)'
        //   },
        //   smooth: 0.2,
        //   length: 10,
        //   length2: 20
        // },
        // itemStyle: {
        //   color: '#c23531',
        //   shadowBlur: 200,
        //   shadowColor: 'rgba(0, 0, 0, 0.5)'
        // },
        animationType: 'scale',
        animationEasing: 'elasticOut',
        animationDelay: function (idx) {
          return Math.random() * 200;
        }
      }
    ]
  };

  cpuCharts.value = echarts.init(document.getElementById('cpu'));
  cpuCharts.value.setOption(option)
}

const columns = [
  {
    title: '磁盘名',
    key: 'disk_name'

  },
  {
    title: '总量',
    key: 'total',
    render (row) {
      return <div>{row.total} G</div>
    }
  },
  {
    title: '使用',
    key: 'used',
    render (row) {
      return <div>{row.used} G</div>
    }
  },
  {
    title: '空闲',
    key: 'free',
    render (row) {
      return <div>{row.free} G</div>
    }
  },
  {
    title: '使用率',
    key: 'percent',
    render (row) {
      return <div>{row.percent} %</div>
    }
  },
]
const columnsIO = [
  {
    title: '读IO数',
    key: 'read_count'
  },
  {
    title: '写IO数',
    key: 'write_count'
  },
  {
    title: 'IO读字节',
    key: 'read_bytes'
  },
  {
    title: 'IO写字节',
    key: 'write_bytes'
  },
  {
    title: '磁盘读时间',
    key: 'read_time'
  },
  {
    title: '磁盘写时间',
    key: 'write_time'
  },
]

// const columnsIOObj = {
//   read_count: "读IO数",
//   write_count: "写IO数",
//   read_bytes: "IO读字节",
//   write_bytes: "IO写字节",
//   read_time: "磁盘读时间",
//   write_time: "磁盘写时间"
// }



</script>
<template>
  <Title title="系统信息" />
  <n-spin style="width: 100%;height: 100%;" :show="loading" :delay="1000">
    <div style="padding: 0px 20px;">
      <n-card style="margin-top: 20px;" title="网络存储测试仪 - V1.0版本">
        <n-descriptions label-placement="left" :column="4">
          <n-descriptions-item>
            <template #label>
              设备编号
            </template>
            {{ data.device_info?.devices_code }}
          </n-descriptions-item>
          <n-descriptions-item label="系统版本号">
            {{ data.device_info?.devices_version }}
          </n-descriptions-item>
          <n-descriptions-item label="操作系统">
            {{ data.device_info?.devices_platform }}
          </n-descriptions-item>
          <n-descriptions-item label="处理器">
            {{ data.device_info?.devices_machine }}
          </n-descriptions-item>
          <!-- <n-descriptions-item label="晚餐" :span="1">
          苹果
        </n-descriptions-item> -->
        </n-descriptions>
      </n-card>

      <div style="display: flex;justify-content: space-between;">
        <div id="memory" class="memory-wrap">
        </div>
        <div id="cpu" class="memory-wrap">
        </div>
      </div>

      <h3>磁盘信息</h3>
      <div class="disk-info">
        <n-data-table :columns="columns" :data="data.disk_list" :pagination="pagination" :bordered="false" />
      </div>

      <h3>磁盘IO</h3>
      <div class="disk-info">
        <n-data-table :columns="columnsIO" :data="data.disk_io" :pagination="pagination" :bordered="false" />
      </div>
    </div>
  </n-spin>
</template>

<style lang="scss" scoped>
.memory-wrap {
  width: 100%;
  height: 300px;
}

// .disk-info {
// display: flex;
// justify-content: space-between;
// }
</style>