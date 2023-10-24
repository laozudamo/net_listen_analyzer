<script setup>
import { ref, onMounted, watch, toRefs,computed } from 'vue'
// import * as echarts from 'echarts';

import * as echarts from 'echarts/core';
import { TooltipComponent } from 'echarts/components';
import { GaugeChart } from 'echarts/charts';
import { CanvasRenderer } from 'echarts/renderers';

echarts.use([TooltipComponent, GaugeChart, CanvasRenderer]);

// import { computed } from '@vue/reactivity';

const props = defineProps({
  value: {
    type: [Number, String],
    default: 0
  },
  theType: {
    type: String,
    default: '发送'
  }
})

const myCharts = ref(null)

const theDate = computed(() => props.value)

watch(theDate, (o,n) => {

  let v = Number(theDate.value) || 0

  myCharts.value.setOption({
    tooltip: {
      formatter: '{a} <br/>{b} : {c}%'
    },
    series: [
      {
        name: props.theType + '速率',
        type: 'gauge',
        progress: {
          show: true
        },
        detail: {
          valueAnimation: true,
          formatter: '{value}',
          fontSize: 25
        },
        data: [
          {
            value: v,
            name: props.theType
          }
        ]
      }
    ]
  })
})

const option = {
  tooltip: {
    formatter: '{a} <br/>{b} : {c}%'
  },
  series: [
    {
      name: props.theType + '速率',
      type: 'gauge',
      progress: {
        show: true
      },
      detail: {
        valueAnimation: true,
        formatter: '{value}',
        fontSize: 25
      },
      data: [
        {
          value: 0,
          name: props.theType
        }
      ]
    }
  ]
}

const receiveCharts = ref(null)

onMounted(() => {
  myCharts.value = echarts.init(receiveCharts.value);
  myCharts.value.setOption(option)
})


</script>

<template>
  <div ref="receiveCharts" class="receive_charts"></div>
</template>

<style lang="scss" scoped>
.receive_charts {
  width: 300px;
  height: 300px;
}
</style>