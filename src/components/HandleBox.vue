<script setup>
import { Delete16Regular as Delete, AddCircle16Filled as Add, ArrowClockwise16Regular as Refresh, AirplaneTakeOff16Regular as Run, FilterSync24Filled } from "@vicons/fluent";
// import { getUserPorts } from './hooks/allPort.js'
import { useRoute } from 'vue-router'
import { computed } from 'vue'
import { useStore } from 'vuex'
import { createToaster } from "@meforma/vue-toaster";
const toaster = createToaster({ type: 'error', position: 'top', duration: 1000 });

const props = defineProps({
  searchForm: {
    type: Object,
    required: true,
  }
  ,
  isTask: {
    type: Boolean,
    default: false
  },
  modeOption: {
    type: Array,
    default: []
  },
})

const emit = defineEmits(['addData', 'deleteData', 'refreshData', 'runData'])

const route = useRoute()
let path = computed(() => route.fullPath)

// const { userPortOptions } = getUserPorts()

const addData = () => {
  // console.log("新增", userPortOptions.value.length)
  // let flag = path.value.match(/testcase/gi)
  // let bindPort = userPortOptions.value.length === 0
  // if (Boolean(flag) && bindPort) {
  //   toaster.show('请绑定端口,然后进行实例添加')
  //   return
  // }
  emit("addData")
}

// const hasAttackClassesProperty = props.searchForm.hasOwnProperty('attack_classes')
// console.log('hasAttackClassesProperty', hasAttackClassesProperty)
const deleteData = () => {
  emit("deleteData")
}
const runData = () => {
  emit("runData")
}

const refresh = () => {
  emit("refreshData")
}

const filterData = () => {
  emit("filterData")
}

</script>

<template>
  <div class="tool-box">
    <div class="icon-box">
      <BtnIcon msg="增加" type="primary" :quaternary="false" @click="addData">
        <Add />
      </BtnIcon>
      <BtnIcon msg="删除" type="error" :quaternary="false" @click="deleteData" class="del-btn">
        <Delete />
      </BtnIcon>
      <BtnIcon msg="运行" type="info" v-if="isTask" :quaternary="false" @click="runData" class="del-btn">
        <Run />
      </BtnIcon>
    </div>
    <div class="the-search-box">
      <n-form :model="searchForm" label-placement="left" inline :style="{ maxWidth: '680px' }" label-width="80px">
        <n-form-item label="名称">
          <n-input size="small" clearable v-model:value="searchForm.case_name" />
        </n-form-item>
        <!-- <n-form-item label="类型" v-if="hasAttackClassesProperty">
          <n-select size="small" v-model:value="searchForm.attack_classes" :options="modeOption" />
        </n-form-item> -->
        <n-form-item label="创建时间">
          <n-date-picker value-format="yyyy-MM-dd" size="small" v-model:formatted-value="searchForm.time" type="daterange"
            clearable />
        </n-form-item>
      </n-form>
      <BtnIcon msg="筛选" type="info" :quaternary="false" @click="filterData(searchForm)">
        <FilterSync24Filled />
      </BtnIcon>
    </div>
    <div class="icon-box">
      <BtnIcon msg="刷新" type="success" :quaternary="false" @click="refresh">
        <Refresh />
      </BtnIcon>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.tool-box {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.the-search-box {
  display: flex;
  align-items: center;

  .n-select {
    width: 260px;
  }
}

.icon-box {
  display: flex;
}

:deep(.n-form-item-feedback-wrapper) {
  display: none !important;
}

.del-btn {
  margin-left: 20px !important;
}
</style>