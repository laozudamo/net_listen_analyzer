<template>
    <div>
        <Title title="日志" />
        <n-data-table style="padding: 20px;" :columns="operateColums" :data="resData" :bordered="false" />
        <div class="the-pag">
            <n-pagination v-model:page="pagination.page" :page-count="pagination.page_num" show-size-picker
                :page-size="pagination.page_size" :page-sizes="[5, 10, 20, 50]" @update:page="changePage"
                @update:page-size="changePageSize">
                <template #prefix>
                    共 {{ pagination.count }} 条数据
                </template>
            </n-pagination>
        </div>
    </div>
</template>

<script setup>
import { getOperateLog } from '@/api/setting/user.js'
import { usePagination } from '@/utils/utils.js'
const { changePage, changePageSize, pagination, resData } = usePagination('/users/action/list')

const operateColums = [
    
    {
        title: "用户id",
        key: "user_id"
    },
    {
        title: "用户名",
        key: "username"
    },
    {
        title: "时间",
        key: "last_login"
    },

    {
        title: "操作ip",
        key: "login_ip"
    },
    {
        title: "描述",
        key: "details"
    },

];

</script>

<style lang="scss" scoped></style>
