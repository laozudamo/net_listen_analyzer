<script setup>
import { ref, onMounted, reactive, nextTick, shallowRef, markRaw } from 'vue'
import { IoStatInfo, IoPhsInfo } from '@/api/pcap.js'
import localforage from 'localforage'

import * as echarts from 'echarts';

const myIndexedDB = localforage.createInstance({
  name: 'myIndexedDB',
})

const props = defineProps({
  query: {
    type: Object,
    required: true
  }
})

let theData = ref(null)

let loading = ref(false)

async function getStatInfo (item) {
  loading.value = true
  try {
    let params = {
      interval: 1,
      io_type: "stat",
      ...props.query
    }
    let { data } = await IoStatInfo(params)
    myIndexedDB.setItem("pcapIO", JSON.stringify(data))
    theData.value = data
    loading.value = false

  } catch (error) {
    loading.value = false
    console.log(error)
  }
}

const myCharts = ref(null)

function handleOptions () {
  let name = props.query.file_name

  let option = {

    toolbox: {
      show: true,
      feature: {
        // dataZoom: {
        //   yAxisIndex: "none"
        // },
        dataView: {
          readOnly: false
        },
        magicType: {
          type: ["line", "bar"]
        },
        restore: {},
        saveAsImage: {
          name: name
        }
      }
    },
    xAxis: {
      type: 'category',
      data: theData.value.x_list,
    },
    tooltip: {
      show: true,
    },
    dataZoom: [
      {
        start: 0,
        end: 5,
        type: "inside"
      },
      {
        start: 0,
        end: 5,
        type: "slider"
      },
      {
        show: true,
        yAxisIndex: 0,
        filterMode: 'empty',
        width: 30,
        height: '80%',
        showDataShadow: false,
        left: '93%'
      }
    ],
    legend: {
      show: true,
    },
    yAxis: {
      type: 'value',
    },

    series: [
      {
        name: "bytes",
        data: theData.value.y2_bytes_list,
        type: 'bar',
        barMaxWidth: 50,
        barMinHeight: 0,
      },
      {
        name: "frames",
        data: theData.value.y_frames_list,
        type: 'bar',
        barMaxWidth: 50,
        barMinHeight: 0,
      },
    ]
  }

  myCharts.value = markRaw(echarts.init(document.getElementById('charts')))
  myCharts.value.setOption(option)
}

onMounted(async () => {
  const value = await myIndexedDB.getItem('pcapIO');
  if (value) {
    theData.value = JSON.parse(value)
  } else {
    await getStatInfo()
  }
  // getTable()
  handleOptions()

})

// let option = {
//   color: ["#3398DB"],
//   title: {
//     text: "Beijing AQI"
//   },
//   tooltip: {
//     trigger: "axis"
//   },
//   xAxis: {
//     data: ["2014-07-14", "2014-07-15", "2014-07-16", "2014-07-17", "2014-07-18", "2014-07-19", "2014-07-20", "2014-07-21", "2014-07-22", "2014-07-23", "2014-07-24", "2014-07-25", "2014-07-26", "2014-07-27", "2014-07-28", "2014-07-29", "2014-07-30", "2014-07-31", "2014-08-01", "2014-08-02", "2014-08-03", "2014-08-05", "2014-08-06", "2014-08-07", "2014-08-08", "2014-08-09", "2014-08-10", "2014-08-11", "2014-08-12", "2014-08-13", "2014-08-14", "2014-08-15", "2014-08-16", "2014-08-17", "2014-08-18", "2014-08-19", "2014-08-20", "2014-08-21", "2014-08-22", "2014-08-23", "2014-08-24", "2014-08-25", "2014-08-26", "2014-08-27", "2014-08-28", "2014-08-29", "2014-08-30", "2014-08-31", "2014-09-01", "2014-09-03", "2014-09-04", "2014-09-05", "2014-09-06", "2014-09-07", "2014-09-08", "2014-09-09", "2014-09-10", "2014-09-11", "2014-09-12", "2014-09-13", "2014-09-14", "2014-09-15", "2014-09-16", "2014-09-17", "2014-09-18", "2014-09-19", "2014-09-20", "2014-09-21", "2014-09-22", "2014-09-23", "2014-09-24", "2014-09-25", "2014-09-26", "2014-09-27", "2014-09-28", "2014-09-29", "2014-09-30", "2014-10-01", "2014-10-02", "2014-10-03", "2014-10-04", "2014-10-05", "2014-10-06", "2014-10-07", "2014-10-08", "2014-10-09", "2014-10-10", "2014-10-11", "2014-10-14", "2014-10-15", "2014-10-16", "2014-10-17", "2014-10-18", "2014-10-19", "2014-10-20", "2014-10-21", "2014-10-22", "2014-10-23", "2014-10-24", "2014-10-25", "2014-10-26", "2014-10-27", "2014-10-28", "2014-10-29", "2014-10-30", "2014-10-31", "2014-11-01", "2014-11-03", "2014-11-04", "2014-11-05", "2014-11-07", "2014-11-08", "2014-11-09", "2014-11-10", "2014-11-11", "2014-11-13", "2014-11-14", "2014-11-15", "2014-11-16", "2014-11-17", "2014-11-18", "2014-11-19", "2014-11-23", "2014-11-24", "2014-11-25", "2014-11-26", "2014-11-27", "2014-11-28", "2014-11-29", "2014-12-01", "2014-12-02", "2014-12-03", "2014-12-05", "2014-12-06", "2014-12-07", "2014-12-08", "2014-12-09", "2014-12-10", "2014-12-11", "2014-12-13", "2014-12-14", "2014-12-15", "2014-12-17", "2014-12-19", "2014-12-22", "2014-12-23", "2014-12-25", "2014-12-26", "2014-12-27", "2014-12-28", "2014-12-29", "2014-12-30", "2015-01-01", "2015-01-02", "2015-01-03", "2015-01-04", "2015-01-05", "2015-01-06", "2015-01-07", "2015-01-08", "2015-01-09", "2015-01-10", "2015-01-11", "2015-01-12", "2015-01-13", "2015-01-14", "2015-01-15", "2015-01-16", "2015-01-17", "2015-01-18", "2015-01-19", "2015-01-20", "2015-01-22", "2015-01-23", "2015-01-24", "2015-01-25", "2015-01-26", "2015-01-28", "2015-01-29", "2015-01-31", "2015-02-01", "2015-02-02", "2015-02-03", "2015-02-05", "2015-02-06", "2015-02-09", "2015-02-10", "2015-02-11", "2015-02-12", "2015-02-13", "2015-02-14", "2015-02-15", "2015-02-16", "2015-02-18", "2015-02-19", "2015-02-20", "2015-02-21", "2015-02-22", "2015-02-23", "2015-02-24"]
//   },
//   yAxis: {
//     splitLine: {
//       show: false
//     }
//   },
//   dataZoom: [
//     {
//       start: 80,
//       type: "slider"
//     },
//   ],
//   series: {
//     name: "Beijing AQI",
//     type: "bar",
//     data: [156, 140, 133, 186, 182, 106, 119, 68, 54, 82, 90, 134, 188, 194, 159, 159, 169, 244, 199, 163, 149, 80, 67, 162, 140, 143, 125, 76, 119, 70, 104, 109, 159, 124, 135, 150, 164, 169, 83, 155, 75, 59, 78, 136, 103, 104, 176, 89, 127, 54, 100, 140, 186, 200, 61, 109, 111, 114, 97, 94, 66, 54, 87, 80, 84, 117, 168, 129, 127, 64, 60, 144, 170, 58, 87, 70, 53, 92, 78, 123, 95, 54, 68, 200, 314, 379, 346, 233, 80, 73, 76, 132, 211, 289, 250, 82, 99, 163, 267, 353, 78, 72, 88, 140, 206, 204, 65, 59, 150, 79, 63, 93, 80, 95, 59, 65, 77, 143, 98, 64, 93, 282, 155, 94, 196, 293, 83, 114, 276, 54, 65, 51, 62, 89, 65, 82, 276, 153, 52, 69, 113, 82, 99, 53, 103, 100, 73, 155, 243, 155, 125, 65, 65, 79, 200, 226, 122, 60, 85, 190, 105, 208, 59, 160, 211, 265, 386, 118, 89, 94, 77, 113, 143, 257, 117, 185, 119, 65, 87, 60, 108, 188, 143, 62, 100, 152, 166, 55, 59, 175, 293, 326, 153, 73, 267, 183, 394, 158, 86, 207]
//   }
// }

// function getTable () {
//   myCharts.value = markRaw(echarts.init(document.getElementById('charts')))
//   myCharts.value.setOption(option)
// }


</script>

<template>
  <n-spin style="width: 100%;height: 100%;" :show="loading" :delay="1000">
    <template #description>
      加载中...
    </template>
    <h3>{{ query.file_name }}</h3>
    <div id="charts" style="width: 1100px;height: 600px;margin-top: 0px;"></div>
  </n-spin>
</template>

<style lang="scss" scoped></style>