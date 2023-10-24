<script lang="jsx" setup>
import { ref, onMounted, watch, } from 'vue'
import * as echarts from 'echarts/core';
import {
  TitleComponent,
  TooltipComponent,
  GridComponent,
  LegendComponent
} from 'echarts/components';
import { LineChart } from 'echarts/charts';
import { UniversalTransition } from 'echarts/features';
import { CanvasRenderer } from 'echarts/renderers';

echarts.use([
  TitleComponent,
  TooltipComponent,
  GridComponent,
  LineChart,
  CanvasRenderer,
  UniversalTransition,
  LegendComponent
]);

const props = defineProps({
  units: {
    type: String,

  },
  dataX: {
    type: Array,
  },
  dataY: {
    type: Object
  },
  chartTitle: {
    type: String
  },
})


watch(() => props.dataX, () => {
  console.log(props.dataY);
  // console.log(props.dataX);
  myCharts.value.setOption({
    title: {
      text: props.chartTitle,
      textAlign: 'center',
      left: 50,
      z: 100,
      zlevel: 200,
      textStyle: {
        fontSize: 14,
        // width: 50,
        // overflow: "breakAll",
      }
    },
    legend: {
      data: ['发送数量', '接收数量']
    },
    tooltip: {
      trigger: 'axis',
      formatter: '{c}',
      // formatter: function (params) {
      //   let html = params[0].name
      //   params.forEach((item, index) => {
      //     html += (`<br/>${item.marker + item.seriesName}: ${item.value === 0.1 ? 0 : item.value}`)
      //   })
      //   return html
      // }
    },
    xAxis: {
      type: 'category',
      name: 't/s',
      data: props.dataX
    },
    yAxis: {
      type: 'value',
      name: props.units,
    },
    series: [
      {
        name: "发送数量",
        type: 'line',
        stack: 'Total1',
        data: props.dataY.tx
      },
      {
        name: "接收数量",
        type: 'line',
        stack: 'Total2',
        data: props.dataY.rx
      },
    ]
  });
})
const myCharts = ref(null)

const receiveCharts = ref(null)

onMounted(() => {
  myCharts.value = echarts.init(receiveCharts.value);
  // myCharts.value.setOption(option)
})


</script>

<template>
  <div ref="receiveCharts" class="receive_charts"></div>
</template>

<style lang="scss" scoped>
.receive_charts {
  width: 450px;
  height: 300px;
}
</style>