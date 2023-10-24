import { reactive, ref, onMounted } from 'vue'
import request from './request.js'

function getRes(url, params) {
    return request({
        url,
        method: 'get',
        params
    })
}

export function usePagination(url) {
    const pagination = reactive({
        page: 1,
        page_num: 10,
        page_size: 10,
        count: null
    })
    // 网络攻击模板特有参数
    const attackId = ref(null)
    const resData = ref([])
    const changePage = (page) => {
        pagination.page = page
        getOperateData()
    }
    const changePageSize = (pageSize) => {
        pagination.page_size = pageSize
        pagination.page = 1
        getOperateData()
    }
    onMounted(() => {
        getOperateData()
    })
    const getOperateData = async (id) => {
        // 正常使用不需要传入形参，后面根据情况改写
        if (id == 'all') {
            attackId.value = null
        } else {
            attackId.value = id ? id : attackId.value
        }
        let tep
        if (id || attackId.value) {
            tep = {
                page: pagination.page,
                page_size: pagination.page_size,
                intrusion_class_id: attackId.value
            }
        } else {
            tep = {
                page: pagination.page,
                page_size: pagination.page_size,
            }
        }
        // console.log(attackId.value);
        // console.log(tep);
        const res = await getRes(url, tep)
        if (res.data.length != 0) {
            resData.value = res.data
            pagination.page = res.page
            pagination.page_num = res.page_num
            pagination.count = res.count
        }
    }
    return { changePage, changePageSize, pagination, resData, getOperateData }
}