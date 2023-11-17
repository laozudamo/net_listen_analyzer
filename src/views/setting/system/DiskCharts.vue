<script setup>
import { onMounted, reactive, ref } from 'vue'
import * as echarts from 'echarts';

onMounted(() => {
  handleCharts()
})

const chartsDom = ref(null)
const charts = ref(null)

function handleCharts () {
  let option = {
    backgroundColor: '#2c343c',
    xAxis: {
      type: 'category',
      data: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
    },
    yAxis: {
      type: 'value'
    },
    series: [
      {
        data: [820, 932, 901, 934, 1290, 1330, 1320],
        type: 'line',
        smooth: true
      },
      {
        data: [820, 820, 820, 820, 1290, 1330, 820],
        type: 'line',
        smooth: true
      }
    ]
  };

  charts.value = echarts.init(chartsDom.value);
  charts.value.setOption(option)
}


</script>

<template>
  <div ref="chartsDom" class="disk-charts"></div>
</template>

<style lang="scss" scoped>
.disk-charts {
  width: 100%;
  height: 400px;
}
</style>