<script setup>
import { Delete16Regular as Delete, AddCircle16Filled as Add, ArrowClockwise16Regular as Refresh, AirplaneTakeOff16Regular as Run, Search12Regular } from "@vicons/fluent";
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

const emit = defineEmits(['refreshData', 'filterData'])


const refresh = () => {
  emit("refreshData")
}

const filterData = () => {
  emit("filterData")
}

</script>

<template>
  <div class="tool-box">
    <div class="the-search-box">
      <n-form :model="searchForm" label-placement="top" inline label-width="80px">
        <n-form-item label="名称">
          <n-input clearable v-model:value="searchForm.search_data" />
        </n-form-item>
        <n-form-item label="创建时间">
          <n-date-picker value-format="yyyy-MM-dd" v-model:formatted-value="searchForm.time" type="daterange" clearable />
        </n-form-item>
      </n-form>

    </div>
    <div class="icon-box">
      <BtnIcon class="search-btn" size="medium" msg="筛选" type="info" :quaternary="false" @click="filterData(searchForm)">
        <Search12Regular />
      </BtnIcon>
      <BtnIcon class="refresh-btn" color="#2969FF" size="medium" msg="刷新" ghost type="info" :quaternary="false"
        @click="refresh">
        <Refresh />
      </BtnIcon>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.tool-box {
  padding: 20px;
  display: flex;
  justify-content: space-between;
}

.search-btn {
  background: linear-gradient(180deg, #29B2FF 0%, #2969FF 100%);
  border: none;
}

.refresh-btn {
  border-image: linear-gradient(180deg, rgba(41, 178, 255, 1), rgba(41, 105, 255, 1)) 1 1;
}

.the-search-box {
  display: flex;
  align-items: center;
  flex-wrap: wrap;

  .n-select {
    width: 260px;
  }
}

.icon-box {
  display: flex;
  margin-top: 25px;
}

.del-btn {
  margin-left: 20px !important;
}

:deep(.n-form-item .n-form-item-feedback-wrapper) {
  min-height: 0 !important;
}</style>