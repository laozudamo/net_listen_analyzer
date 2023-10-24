<script setup lang="jsx">
import { ref, onMounted, reactive, onUnmounted, onBeforeMount, computed, watch } from 'vue'
import {
  TrendingDownOutline,
  TrendingUp,
  RemoveOutline
} from "@vicons/ionicons5";

import * as echarts from 'echarts';
import { GridComponent } from 'echarts/components';
import { BarChart } from 'echarts/charts';
import { CanvasRenderer } from 'echarts/renderers';
import { TooltipComponent, LegendComponent } from 'echarts/components';
import { PieChart } from 'echarts/charts';
import { LabelLayout } from 'echarts/features';
import { GaugeChart } from 'echarts/charts';
import { Code, DotMark } from '@vicons/carbon';
import { portInfo, taskInfo, taskDetail, cpuInfo } from '@/api/monitor.js'
import logimg from '@/assets/img/log.png'
import dataimg from '@/assets/img/data.png'
import caseimg from '@/assets/img/case.png'
import captureimg from '@/assets/img/capture.png'

echarts.use([GridComponent, BarChart, TooltipComponent,
  LegendComponent,
  PieChart,
  CanvasRenderer,
  LabelLayout,
  GaugeChart
]);

const portVal = ref("0")
const optionsPort = ref([])

let isShowKey = ref(true)

let portTimer = ref(null)
const chartRes = ref(null)
let taskOption = ref([])

let taskName = ref('')

let taskDetailTimer = ref(null)
let curtask = ref(0)
let taskData = reactive({
  capture_data: [],
  case_run_stats: {},
  task_logs: [],
  cases: [],
  rfc2544_stats: [],
  rfc2544_stats_key: []
}) // 任务数据

let txData = ref([]) // 发送数据
let rxData = ref([])  // 接收数据
let timeData = ref([]) // 时间数据
let curRate = ref(0) // 当前速率
let sendType = ref("tx_bps")
let taskTimer = ref(null)

let memoryTimer = ref(null)

let cpuData = ref(0)
let memoryData = ref(0)

const chartCapture = ref(null)
let capture = reactive({
  count: [],
  port: []
})
let caseRunStatus = reactive({
  yData: [],
  xData: []
})

async function getPortInfo () {
  clearTimeout(portTimer.value)
  portTimer.value = null

  const { data, code } = await portInfo()
  handlPortInfo(data)

  setPortRateCharts()
  setPortpotion()

  if (code !== 0) return
  portTimer.value = setTimeout(() => {
    getPortInfo()
  }, 1000)
}

function handlPortInfo (data) {
  timeData.value = data.map(item => item.time)
  let portData = []

  data.forEach(item => {
    let obj = {}
    Object.keys(item).forEach(key => {
      if (key !== 'global' && key !== 'time' && key !== 'latency' && key !== 'flow_stats') {
        obj[key] = item[key]
      }
    })
    portData.push(obj)
  })

  optionsPort.value = Object.keys(portData[0]).map(item => {
    return {
      label: item !== "total" ? "PORT" + item : "总数据",
      value: item
    }
  })

  let portListData = {}
  optionsPort.value.forEach(item => {
    portListData[item.value] = portData.map(ele => {
      return ele[item.value]
    })
  })

  // console.log("portVal", portVal.value)

  txData.value = portListData[portVal.value].map(item => item.opackets)
  rxData.value = portListData[portVal.value].map(item => item.ipackets)

  let tmpPort = portListData[portVal.value].at(-1)
  curRate.value = tmpPort[sendType.value].toFixed(2)
}

onUnmounted(() => {
  clearAllTimer()
  memoryTimer.value = null
  taskTimer.value = null
  taskDetailTimer.value = null
  portTimer.value = null
  // cancelDom()
})

// onBeforeMount(() => {
//   // clearAllTimer()
//   clearTimeout(memoryTimer.value)
//   clearTimeout(taskTimer.value)
//   clearTimeout(taskDetailTimer.value)
//   clearTimeout(portTimer.value)
//   memoryTimer.value = null
//   taskTimer.value = null
//   taskDetailTimer.value = null
//   portTimer.value = null
//   // cancelDom()
// })



function setResCharts () {
  const dom = document.getElementById('resdata')
  if (!dom) return
  chartRes.value = echarts.init(dom)

  let option = {
    xAxis: {
      type: 'category',
      data: caseRunStatus.xData
    },
    yAxis: {
      type: 'value'
    },
    tooltip: {
      show: true,
    },
    grid: {
      top: "10%",
      left: '15%',
      bottom: '10%',
    },
    color: "#2FAAD5",
    series: [
      {
        data: caseRunStatus.yData,
        type: 'bar',
        showBackground: true,
        backgroundStyle: {
          color: 'rgba(180, 180, 180, 0.2)'
        }
      }
    ]
  };
  chartRes.value.setOption(option)
}

function setCaptureCharts () {
  const dom = document.getElementById('chatcapture')
  if (!dom) return
  chartCapture.value = echarts.init(dom)

  let option = {
    xAxis: {
      type: 'category',
      data: capture.port
    },
    grid: {
      top: "5%",
      bottom: '20%',
      containLabel: true
    },
    yAxis: {
      type: 'value'
    },
    color: "#0CAF60",
    series: [
      {
        data: capture.count,
        type: 'bar',
        showBackground: true,
        barMaxWidth: "20px",
        backgroundStyle: {
          color: "#F1F2F4"
        }
      }
    ]
  }
  chartCapture.value.setOption(option)
}
const portCharts = ref(null)

function setPortpotion () {
  const dom = document.getElementById('portcharts')
  if (!dom) return

  if (!portCharts.value) {
    portCharts.value = echarts.init(dom)
  }

  let option = {
    tooltip: {
      formatter: '{c}mb/s'
    },
    animation: false,
    series: [
      {
        name: '速率',
        type: 'gauge',
        progress: {
          show: true
        },
        detail: {
          valueAnimation: true,
          formatter: '{value}'
        },
        color: {
          type: 'linear',
          x: 0,
          y: 0,
          x2: 0,
          y2: 1,
          colorStops: [{
            offset: 0, color: '#2F78EE'
          }, {
            offset: 1, color: '#2DD4BF'
          }],
          global: false // 缺省为 false
        },
        axisTick: {
          length: 20,
          lineStyle: {
            color: "#d2dae4"
          }
        },
        max: 25000,
        axisLine: {
          show: true,
          lineStyle: {
            color: [
              [1, "#A0AEC0"]
            ]
          }
        },
        axisLabel: {
          show: false
        },
        pointer: {
          showAbove: true,
          length: "65%",
          itemStyle: {
            color: "#2FAAD5"
          }
        },
        anchor: {
          show: true,
          showAbove: true
        },
        splitLine: {
          show: false
        },
        title: {
          offsetCenter: [0, "30%"],
          fontSize: 18,
          color: "#111827",
          fontWeight: "bolder"
        },
        data: [
          {
            value: curRate.value,
            name: `${curRate.value}`,
            detail: {
              show: false
            }
          }
        ]
      }
    ]
  };
  portCharts.value.setOption(option)
}

const portRateCharts = ref(null)

function setPortRateCharts () {
  let portRateOptions = {
    tooltip: {
      show: true,
    },
    grid: {
      left: '16px',
      right: '4%',
      top: "8%",
      bottom: '18%',
      containLabel: true
    },
    // color: ["#0CAF60", "#FFC837"],
    // color: ["#0CAF60", "#FFC837"],
    color: ["#0CAF60"],

    xAxis: {
      type: 'category',
      boundaryGap: false,
      data: timeData.value,
    },
    yAxis: {
      type: 'value'
    },
    series: [
      // {
      //   name: '接收',
      //   type: 'line',
      //   stack: 'Total',
      //   data: rxData.value
      // },
      {
        name: '发送速率',
        type: 'line',
        stack: 'Total',
        data: txData.value
      },
    ]
  }

  const dom = document.getElementById('portratecharts')
  if (!dom) return
  if (!portRateCharts.value) {
    portRateCharts.value = echarts.init(dom)
    portRateCharts.value.setOption(portRateOptions)
  }

  if (sendType.value === 'tx_bps') {
    portRateCharts.value.setOption(
      {
        color: ["#0CAF60"],
        xAxis: {
          type: 'category',
          boundaryGap: false,
          data: timeData.value,
        },
        series: [
          {
            name: '发送',
            type: 'line',
            stack: 'Total',
            data: txData.value
          },
        ]
      }
    )
  } else {
    portRateCharts.value.setOption(
      {
        color: ["#FFC837"],
        xAxis: {
          type: 'category',
          boundaryGap: false,
          data: timeData.value,
        },
        series: [
          {
            name: '接收',
            type: 'line',
            stack: 'Total',
            data: rxData.value
          },
        ]
      })
  }
  // portRateCharts.value.setOption(
  //   {
  //     xAxis: {
  //       type: 'category',
  //       boundaryGap: false,
  //       data: timeData.value,
  //     },
  //     series: [
  //       {
  //         name: '接收',
  //         type: 'line',
  //         stack: 'Total',
  //         data: rxData.value
  //       },
  //       {
  //         name: '发送',
  //         type: 'line',
  //         stack: 'Total',
  //         data: txData.value
  //       },
  //     ]
  //   }
  // )

}

onMounted(async () => {
  clearAllTimer()
  getPortInfo()
  getTaskList()
  getCpuInfo()

})
function clearAllTimer () {
  for (let i = 0; i <= 1000; i++) {
    clearTimeout(i)
  }
}

let count = 0
let theData = ref(null)
async function getTaskList () {
  clearTimeout(taskTimer.value)
  taskTimer.value = null
  const { data, code } = await taskInfo()
  taskOption.value = data

  if (data.length !== 0 && count === 0) {
    count++
    curtask.value = data[0].value
    theData.value = data[0]

    taskName.value = data[0].label

    getTaskInfo(data[0].value)
  }

  if (code !== 0) return
  taskTimer.value = setTimeout(() => {
    getTaskList()
  }, 1000)
}

async function getCpuInfo () {
  if (memoryTimer.value) {
    clearTimeout(memoryTimer.value)
    memoryTimer.value = null
  }

  const { data, code } = await cpuInfo()
  if (code !== 0) return
  cpuData.value = Number(data.cpu_data.percent.split("%")[0])
  memoryData.value = Number(data.disk_data.percent.split("%")[0])

  memoryTimer.value = setTimeout(() => {
    getCpuInfo()
  }, 1000)
}

function handleChange (v) {
  if (!v) {
    sendType.value = "tx_bps"
  } else {
    sendType.value = "rx_bps"
  }
}

function updateTask (v, opt) {
  clearTimeout(taskDetailTimer.value)
  clearTimeout(taskTimer.value)
  taskTimer.value = null
  taskDetailTimer.value = null

  curtask.value = v
  taskName.value = opt.label
  getTaskInfo(v)
}

async function getTaskInfo (id) {
  clearTimeout(taskDetailTimer.value)
  taskDetailTimer.value = null

  let params = {
    task_id: id
  }
  const { data, code } = await taskDetail(params)

  if (code !== 0) return

  handleTaskDetail(data)

  setCaptureCharts()
  setResCharts()

  console.log("taskOption", taskOption.value)
  if (taskOption.value.length === 0) {

    clearTimeout(taskDetailTimer.value)
    taskDetailTimer.value = null

    theData.value = []
    taskName.value = ""
    return
  }

  taskDetailTimer.value = setTimeout(() => {
    getTaskInfo(id)
  }, 1000)
}

function handleTaskDetail (data) {
  const { capture_data, case_run_stats, task_logs, cases, rfc2544_stats, rfc2544_stats_key } = data
  taskData.capture_data = capture_data
  taskData.case_run_stats = case_run_stats
  taskData.task_logs = task_logs
  taskData.cases = cases
  taskData.rfc2544_stats = rfc2544_stats
  taskData.rfc2544_stats_key = rfc2544_stats_key.map(item => {
    if (item.key == "status(丢包率状态)") {
      return {
        key: "status(丢包率状态)",
        title: "status(丢包率状态)",
        render: (row) => {
          if (row['status(丢包率状态)'] === 0) {
            return (
              <n-icon size="30" color="#34A9D3">
                <RemoveOutline />
              </n-icon>
            )
          } else if (row['status(丢包率状态)'] > 0) {
            return (
              <n-icon size="30" color="#1BA05A">
                <TrendingUp />
              </n-icon>
            )
          } else {
            return (
              <n-icon size="30" color="#E3594F">
                <TrendingDownOutline />
              </n-icon>
            )
          }

          // { row.title }
        }
      }
    }
    return item
  })


  if (taskData.capture_data.length > 0) {
    capture.port = data.capture_data.map(item => item.ports[0])
    capture.count = data.capture_data.map(item => item.stats.count)
  } else {
    capture.port = []
    capture.count = []
  }

  let caseRs = data["case_run_stats"]
  caseRunStatus.xData = Object.keys(caseRs).filter(item => item !== "status")
  caseRunStatus.yData = caseRunStatus.xData.map(item => {
    return caseRs[item]
  })
}

const logdom = ref(null)

let cancelDom = watch(() => taskData.task_logs, (newVal, oldVal) => {
  if (logdom.value) {
    logdom.value.scrollTop = logdom.value.scrollHeight
  }
})

function handleChangeRes (v) {
  if (v == 0) {
    isShowKey.value = true
  } else {
    isShowKey.value = false
  }
  console.log("s", isShowKey.value)
}

</script>

<template>
  <div class="monitor">
    <div class="header-bar">
      <div style="width: 40px;font-size: 14px;font-weight: normal;">任务 :</div>
      {{ taskName }}
      <n-select @update:value="updateTask" v-if="taskOption.length > 0" size="small" style="width: 300px;"
        :value="curTask" :options="taskOption" />
      <div v-else>暂无运行任务</div>
    </div>
    <div class="head-tab">
      <div class="the-pane">
        <div class="left-pane">
          <div>
            <header class="the-title">实例列表</header>
            <div v-if="taskData.cases.length === 0" class="case-content">
              <div class="no-data">
                <div class="img-wrap">
                  <img :src="caseimg" alt="">
                  <div>暂无实例</div>
                </div>
              </div>
            </div>
            <div class="case-content" v-else>
              <div class="case-item" v-for="(theCase, i) in taskData.cases" :key="theCase.id">
                <div>
                  {{ theCase.case_name }}
                </div>
                <div v-if="theCase?.run_status" style="display: flex;align-items: center;font-weight: normal;">
                  <n-icon size="16" color="#0CAF60">
                    <DotMark />
                  </n-icon>
                  <span style="color: #111827;padding-left: 8px;">运行中</span>
                </div>
                <div v-else style="display: flex;align-items: center;font-weight: normal;">
                  <n-icon size="16" color="#FF3F3F">
                    <DotMark />
                  </n-icon>
                  <span style="color: #111827;padding-left: 8px;">等待中</span>
                </div>
              </div>
            </div>

          </div>
          <div style="margin-top: 20px;">
            <header class="the-title">捕获信息</header>
            <div class="capture-content">
              <div class="no-data" v-if="capture.port.length === 0">
                <div class="img-wrap">
                  <img :src="captureimg" alt="">
                  <div>暂无捕获信息</div>
                </div>
              </div>

              <div v-else>
                <div style="display: flex;justify-content: space-between;padding: 16px;">
                  <div>捕获状态</div>
                  <div style="display: flex;align-items: center;">
                    <n-icon size="16" color="#0CAF60" v-if="capture.port.length !== 0">
                      <DotMark />
                    </n-icon>

                    <n-icon size="16" color="#FF3F3F" v-else>
                      <DotMark />
                    </n-icon>
                    <span v-if="capture.port.length > 0" style="color: #111827;padding-left: 8px;">捕获中</span>
                    <span v-else style="color: #111827;padding-left: 8px;">未捕获</span>
                  </div>
                </div>
                <div id="chatcapture" style="height: 226px;"></div>
              </div>

            </div>
          </div>
        </div>

        <div class="center-pane">
          <header class="the-title"
            style="display: flex;justify-content: space-between;align-items: center;padding-right: 10px;">
            <div>数据统计</div>
            <n-tabs size="small" type="segment" style="width: 200px;" @update:value="handleChangeRes">
              <n-tab-pane name="0" tab="关键结果">
              </n-tab-pane>
              <n-tab-pane name="1" tab="更多结果">
              </n-tab-pane>
            </n-tabs>

            <!-- <n-switch size="large" @update:value="handleChangeRes">
              <template #unchecked>
                关键结果
              </template>
              <template #checked>
                更多结果
              </template>
            </n-switch> -->
          </header>
          <div class="the-content-center">
            <div class="no-data" v-if="Object.keys(taskData.case_run_stats).length === 0">
              <div class="img-wrap">
                <img :src="dataimg" alt="">
                <div>暂无数据信息</div>
              </div>
            </div>

            <div v-else>
              <div v-if="isShowKey" id="resdata" style="height: 400px;"></div>
              <div v-else style="height: 400px;padding: 20px;">

                <div class="no-data" v-if="taskData.rfc2544_stats_key.length === 0">
                  <div class="img-wrap">
                    <img :src="dataimg" alt="">
                    <div>暂无更多结果信息</div>
                  </div>
                </div>

                <n-data-table v-else max-height="360px" :columns="taskData.rfc2544_stats_key"
                  :data="taskData.rfc2544_stats" :pagination="pagination" :bordered="false" />
              </div>
            </div>
          </div>
        </div>
        <div class="right-pane">
          <header class="the-title">任务日志</header>
          <div ref="logdom" class="right-pane-content">

            <div class="no-data" v-if="taskData?.task_logs == 0 || taskOption.length == 0">
              <div class="img-wrap">
                <img :src="logimg" alt="">
                <div>暂无日志</div>
              </div>
            </div>
            <div v-else>
              <div class="log-item" v-for="(log, i) in taskData.task_logs" :key="i">
                {{ log }}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="port-info">
      <div class="resourse">
        <header class="the-title">系统资源</header>
        <div style="padding: 16px;background-color: #fff;">
          <div class="resourse-content">
            <div style="font-size: 16px;font-weight: bold;padding: 16px 0px 0px 16px;">CPU & 内存</div>
            <div class="the-charts">
              <n-progress color="#0CAF60" type="circle" :percentage="cpuData" :stroke-width="8">
                <div style="display: flex;flex-direction: column;justify-content: center;align-items: center;">
                  <div style="font-size: 16px;font-weight: bold;color: #050505;">{{ cpuData + "%" }}</div>
                  <div style="font-size: 12px;color: #687588;">CPU使用率</div>
                </div>
              </n-progress>

              <n-progress color="#FFC837" style="margin-left: 36px;" type="circle" :percentage="memoryData"
                :stroke-width="8">
                <div style="display: flex;flex-direction: column;justify-content: center;align-items: center;">
                  <div style="font-size: 16px;font-weight: bold;color: #050505;">{{ memoryData + "%" }}</div>
                  <div style="font-size: 12px;color: #687588;">内存占用</div>
                </div>
              </n-progress>
            </div>
            <div class="charts-des" style="margin-top: 34px;">
              <div style="display: flex; align-items: center;">
                <n-icon size="16" color="#0CAF60">
                  <DotMark />
                </n-icon>
                <span style="color: #687588;">CPU使用率</span>
              </div>
              <div style="font-size: 14px;font-weight: 500;color: #111827;">{{ cpuData + "%" }}</div>
            </div>
            <div class="charts-des" style="margin-top: 15px;">
              <div style="display: flex; align-items: center;">
                <n-icon size="16" color="#FFC837">
                  <DotMark />
                </n-icon>
                <span style="color: #687588;">内存占用率</span>
              </div>
              <div style="font-size: 14px;font-weight: 500;color: #111827;">{{ memoryData + "%" }}</div>
            </div>

          </div>
        </div>
      </div>
      <div class="port-sum">
        <header class="the-port-title" style="display: flex;align-items: center; justify-content: space-between;">
          <div>网络吞吐量</div>
          <div style="display: flex;align-items: center;">
            <div style="width: 40px;font-size: 14px;font-weight: normal;">端口</div>
            <n-select size="small" style="width: 100px;" v-model:value="portVal" :options="optionsPort" />
          </div>
        </header>
        <div class="port-content">
          <div class="port-content-left">
            <div class="port-header">
              <div style="font-size: 16px; font-weight: bold;color: #111827;">端口速率
              </div>
              <n-switch size="large" @update:value="handleChange">
                <template #checked>
                  接收
                </template>
                <template #unchecked>
                  发送
                </template>
              </n-switch>
            </div>
            <div style="display: flex; align-items: center;padding-left: 10px;">
              <n-icon size="16" color="#2EABD5">
                <DotMark />
              </n-icon>
              <span style="font-size: 10px;color: #111827;">实时速率</span>
            </div>
            <div style="width: 300px; height: 300px;" id="portcharts"></div>
          </div>

          <div class="port-content-right">
            <div style="padding-top: 16px;padding-left: 16px;font-size: 16px; font-weight: bold;color: #111827;">发包数量统计
            </div>
            <div style="display: flex; align-items: center;padding-left: 14px;margin-top: 8px;">
              <n-icon size="16" color="#0CAF60">
                <DotMark />
              </n-icon>
              <span style="font-size: 10px;color: #111827;padding-right:10px ;">发送数量</span>
              <n-icon size="16" color="#FFC837">
                <DotMark />
              </n-icon>
              <span style="font-size: 10px;color: #111827;">接收数量</span>
            </div>
            <div style="height: 300px;" id="portratecharts"></div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.header-bar {
  display: flex;
  padding-left: 20px;
  padding-top: 20px;
}

.monitor {
  height: calc(100vh - 60px);
  background-color: #DCDCDC;
  overflow-y: auto;
}

:deep(.n-tabs .n-tabs-nav-scroll-content) {
  background-color: #DCDCDC;
}

.head-tab {
  background-color: #DCDCDC;
}


.the-pane {
  display: flex;
  justify-content: space-between;
  padding: 20px;
}

.left-pane {
  width: 360px;

  .case-content {
    height: 134px;
    background-color: #fff;
    border-radius: 0px 0px 12px 12px;
    overflow-y: auto;

    .case-item {
      display: flex;
      justify-content: space-between;
      align-items: center;
      height: 36px;
      font-size: 14px;
      line-height: 36px;
      font-weight: bold;
      padding-left: 24px;
      padding-right: 10px;
      color: #111827;
      border-bottom: 1px solid rgba(0, 0, 0, 0.06);
    }
  }

  .capture-content {
    height: 243px;
    background-color: #fff;
    border-radius: 0px 0px 12px 12px;
  }
}

.right-pane {
  width: 360px;

  .right-pane-content {
    height: 436px;
    overflow-y: auto;
    border-radius: 0px 0px 12px 12px;
    background-color: #fff;
  }
}

.center-pane {
  flex: 1;
  margin: 0px 20px;

  .the-content-center {
    height: 436px;
    background-color: #fff;
    border-radius: 0px 0px 12px 12px;
  }
}

.port-info {
  padding: 0px 20px;
  background-color: #DCDCDC;
  display: flex;
  justify-content: space-between;

  .resourse {
    width: 360px;

    .resourse-content {
      background-color: #fff;
      height: 324px;
      border: 1px solid #F1F2F4;
      border-radius: 8px;
    }

    .charts-des {
      align-items: center;
      display: flex;
      justify-content: space-between;
      padding: 0px 19px;
    }
  }

  .port-sum {
    margin-left: 20px;
    flex: 1;

    .port-content {
      padding: 16px;
      display: flex;
      height: 356px;
      background-color: #fff;
      border-radius: 0px 0px 12px 12px;
    }

    .port-content-left {
      width: 317px;
      height: 324px;
      background: #FFFFFF;
      border-radius: 8px 8px 8px 8px;
      opacity: 1;
      border: 1px solid #F1F2F4;
    }

    .port-content-right {
      margin-left: 24px;
      flex: 1;
      height: 324px;
      background: #FFFFFF;
      border-radius: 8px 8px 8px 8px;
      opacity: 1;
      border: 1px solid #F1F2F4;
    }
  }
}

.the-title {
  line-height: 40px;
  height: 40px;
  border-radius: 12px 12px 0px 0px;
  background: #F0F0F0;
  font-size: 16px;
  padding-left: 16px;
  font-weight: bold;
}

.the-port-title {
  padding-right: 16px;
  height: 40px;
  border-radius: 12px 12px 0px 0px;
  background: #F0F0F0;
  font-size: 16px;
  padding-left: 16px;
  font-weight: bold;
}

.the-charts {
  margin-top: 46px;
  margin-left: 26px;
}

:deep(.n-progress-custom-content) {
  width: 80px !important;
}

.port-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 16px 16px 0px 16px;
}

.log-item {
  padding: 13px 28px;
  color: #111827;
  font-style: 12px;
  border-bottom: 1px solid rgba(0, 0, 0, 0.06);
}

:deep(.n-switch .n-switch__rail) {
  background-color: #0CAF60;
}

:deep(.n-switch.n-switch--active .n-switch__rail) {
  background-color: #FFC837;
}

.no-data {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100%;

  .img-wrap {
    position: relative;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    color: #687588;
    font-size: 12px;

    div {
      position: absolute;
      bottom: 0px;
    }
  }
}

::v-deep.n-tabs .n-tabs-rail .n-tabs-tab-wrapper .n-tabs-tab.n-tabs-tab--active {
  background-color: #11AF62;
  color: #fff;
}
</style>