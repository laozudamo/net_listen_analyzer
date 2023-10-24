<template>
  <Title title="报告配置" />
  <div class="bg">

    <n-table :striped="false" style="margin: 20px; width: 400px;" :bordered="true" :single-line="false">
      <tbody>
        <tr>
          <td>
            <n-icon size="40">
              <SvgIcon name="html" />
            </n-icon>
          </td>
          <td>
            <n-switch size="large" v-model:value="baseData.html" @update:value="setReport" disabled>
              <template #checked>
                开启
              </template>
              <template #unchecked>
                关闭
              </template>
            </n-switch>
          </td>
        </tr>
        <tr>
          <td>
            <n-icon size="40">
              <SvgIcon name="pdf" />
            </n-icon>
          </td>

          <td>
            <n-switch size="large" v-model:value="baseData.pdf" @update:value="setReport">
              <template #checked>
                开启
              </template>
              <template #unchecked>
                关闭
              </template>
            </n-switch>
          </td>
        </tr>
        <tr>
          <td>
            <n-icon size="40">
              <SvgIcon name="word" />
            </n-icon>
          </td>
          <td>
            <n-switch size="large" v-model:value="baseData.word" @update:value="setReport">
              <template #checked>
                开启
              </template>
              <template #unchecked>
                关闭
              </template>
            </n-switch>
          </td>
        </tr>
      </tbody>
    </n-table>
  </div>
</template>

<script setup>
import { reactive, onMounted } from 'vue'
import { setConfig, getConfig } from '@/api/setting/report.js'
import { createToaster } from "@meforma/vue-toaster";
const toaster = createToaster({ position: "top" });
const baseData = reactive({
  pdf: false,
  word: false,
  html: true,
  // excel: false
})
let resetData = {
  pdf: false,
  word: false,
  html: true,
  // excel: false
}
const resetBaseData = () => {
  Object.keys(baseData).map(item => {
    baseData[item] = resetData[item]
  })
}
const setReport = async () => {
  const { code, msg } = await setConfig(baseData)
  if (code == 0) {
    console.log(msg);
    Object.keys(baseData).map(item => {
      resetData[item] = baseData[item]
    })
    toaster.success(msg)
  }
}
onMounted(async () => {
  const { data } = await getConfig()
  Object.keys(data.style).map(item => {
    baseData[item] = data.style[item]
    resetData[item] = data.style[item]
  })
})
</script>

<style lang="scss" scoped>
.bg {
  margin-top: 20px;

  div {
    // margin-top: 20px;
    padding: 20px;
  }
}

.item {
  display: flex;
  align-items: center;
  height: 60px;

  .item-label {
    display: flex;
    flex-direction: column;
    align-items: center;
  }

  .item-switch {
    display: flex;
    align-items: center;
    width: 150px;
  }
}
</style>