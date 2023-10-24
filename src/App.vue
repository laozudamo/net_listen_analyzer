<script setup>
import { zhCN, dateZhCN } from 'naive-ui'
// window.$message = useMessage()
const locale = zhCN
const dateLocale = dateZhCN


const themeOverrides = {
  common: {
    primaryColor: '#2969FF',
    primaryColorHover: "#2969FF",
    errorColor: "#E03137"
  },
  Button: {
    borderRadiusMedium: '5px',
  },
  Menu: {

    itemTextColor: "#111827",
    // itemColorActive: "#000000",

    borderRadius: "10px",

    borderColorHorizontal: "#2969FF",

    // itemColorActive: "#2986FF",
    // 激活组颜色
    groupTextColor: "#3f72af"
    // groupTextColor: "#3f72af"
  },
  Carousel: {
    arrowColor: "#0A1436FF",
    dotColor: "#888",
    dotColorActive: '#0A1436FF'
  },
  DataTable: {
    thColor: "#F1F2F4",
    // fontSizeSmall: "10px",
    thTextColor: "#4C5973"
  },
  Card: {
    paddingSmall: "24px",
    titleFontSizeSmall: "20px",
    // borderRadius: "16px"
  },
  Input: {
    borderRadius: "10px",
   
  },
  Form: {
    feedbackHeightMedium: "16px"
  },
  Layout: {
    color: "#E9EAEC"
  },
  Tabs: {
    tabTextColorActiveCard: "#000000",
    tabBorderColor: "#DCDCDC",
    tabGapMediumCard: "0px",
    tabColor: "#DCDCDC",
    tabBorderRadius: "12px"
  }
}


</script>

<template>
  <n-config-provider :locale="locale" :date-locale="dateLocale" :theme-overrides="themeOverrides">
    <n-dialog-provider>
      <div id="app">
        <n-message-provider>
          <router-view></router-view>
        </n-message-provider>
      </div>
    </n-dialog-provider>
  </n-config-provider>
</template>

<style scoped>
.n-config-provider {
  height: 100%;
}

/* .n-data-table-tbody  {
  max-height: 300px;
  overflow-y: auto;
}  */
</style>