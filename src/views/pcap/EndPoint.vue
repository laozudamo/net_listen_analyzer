<script setup>

const tabList = [
  {
    label: "状态",
    key: 1
  },
  {
    label: "树结构",
    key: 2
  },
  {
    label: "URI路径",
    key: 3
  },
  {
    label: "请求URL",
    key: 4
  },
  {
    label: "请求和响应",
    key: 5
  },
]

</script>

<template>
  <n-tabs size="small" type="line" :default-value="1">

    <n-tab-pane v-for="(tab,i) in tabList" :name="tab.key" :tab="tab.label">
      {{ tab.label }}
    </n-tab-pane>
<!-- 
    <n-tab-pane name="1" tab="状态">
      状态
    </n-tab-pane>
  
    <n-tab-pane name="2" tab="树结构">
      树结构
    </n-tab-pane>
  
    <n-tab-pane name="3" tab="URI路径">
      URI路径
    </n-tab-pane>

    <n-tab-pane name="4" tab="请求URL">
      请求URL
    </n-tab-pane>
  
    <n-tab-pane name="5" tab="请求和响应">
      请求和响应
    </n-tab-pane> -->
  
  </n-tabs>
</template>

<style lang="scss" scoped></style>