<script setup lang="jsx">
import { onMounted, ref } from 'vue'
import { getOperateLog } from '@/api/setting/user.js'
import { usePagination } from '@/utils/utils.js'
import { logInfo } from '@/api/pcap.js'

// const { changePage, changePageSize, pagination, resData } = usePagination('/users/action/list')

let loading = ref(false)
const operateColums = [

  {
    title: "时间",
    key: "time"
  },
  {
    title: "日志等级",
    key: "level"
  },
  {
    title: "信息",
    key: "message",
    render: (row) => {
      return <div>{row.message}</div>
    }
  },

];

const resData = ref([])

async function getData () {
  let params = {
    log_num: 50
  }
  try {
    let { data } = await logInfo(params)
    resData.value = data
  } catch (error) {
    console.log(error)
  }
}
onMounted(async () => {
  loading.value = true
  await getData()
  loading.value = false
})


</script>


<template>
  <div>
    <Title title="日志" />
    <n-spin style="width: 100%;height: 100%;" :show="loading" :delay="1000">
      <n-data-table style="padding: 20px;" :columns="operateColums" :data="resData" :bordered="false" />
    </n-spin>
    <!-- <div class="the-pag">
            <n-pagination v-model:page="pagination.page" :page-count="pagination.page_num" show-size-picker
                :page-size="pagination.page_size" :page-sizes="[5, 10, 20, 50]" @update:page="changePage"
                @update:page-size="changePageSize">
                <template #prefix>
                    共 {{ pagination.count }} 条数据
                </template>
            </n-pagination>
        </div> -->
  </div>
</template>


<style lang="scss" scoped>
.red {
  color: red;
}
</style>
