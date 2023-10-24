<script setup>
import { reactive, onMounted } from 'vue'
import { setConfig, getConfig } from '@/api/setting/report.js'
import { createToaster } from "@meforma/vue-toaster";
import { Add12Filled } from '@vicons/fluent'

const toaster = createToaster({ position: "top" });
</script>


<template>
  <Title title="证书管理" />
  <n-table striped="true"	 style="margin: 20px; width: 700px;" :bordered="true" :single-line="false">
    <thead>
      <tr>
        <th>授权信息许可名称</th>
        <th>许可授权内容</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td>产品许可状态</td>
        <td>可用</td>
      </tr>
      <tr>
        <td>系统许可类型</td>
        <td>正式</td>
      </tr>
      <tr>
        <td>系统许可创建日期</td>
        <td>2023-05-08 12:30:51</td>
      </tr>
      <tr>
        <td>系统许可有效天数</td>
        <td>永久</td>
      </tr>
      <tr>
        <td>许可授杈模块</td>
        <td>全部</td>
      </tr>
    </tbody>
  </n-table>

  <div style="padding-left: 20px;">
      <BtnIcon size="medium" type="primary" msg="导入证书" :quaternary="false" @click="addNewUser">
        <Add12Filled />
      </BtnIcon>
    </div>
</template>

<style lang="scss" scoped>

</style>