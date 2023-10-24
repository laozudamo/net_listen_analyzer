<script setup lang="jsx">
import { onMounted, reactive, ref } from 'vue'
// import { DocumentCopy16Filled as Copy, Edit20Filled as Edit, DocumentText24Filled as Detail, AirplaneTakeOff16Regular as Run } from "@vicons/fluent";
import { Delete16Regular as Delete, AddCircle16Filled as Add, ArrowClockwise16Regular as Refresh, ArrowCircleDown20Filled, FilterSync24Filled, PreviewLink20Regular, ArrowSquareDown24Filled } from "@vicons/fluent";
import useCommon from '@/components/hooks/handle.js'
import { list, del, copy, reportDownload, pcapDownLoad } from '@/api/report/report.js'

import SearchBox from "@/components/SearchBox.vue"

const { dataSource, pagination, updateCheckVal, refresh, delData, getDetail, copyData, rowKey, checkRowKeys, key, filterData } = useCommon({ list, del, copy })

const downloadByFile = function (data, filename) {
	console.log("data", data)
	if (!data) return
	let url = window.URL.createObjectURL(new Blob([data], { type: "application/octet-stream" }))
	let link = document.createElement('a')
	link.style.display = 'none'
	link.href = url
	link.setAttribute('download', `${filename}`)

	document.body.appendChild(link)
	link.click()
	document.body.removeChild(link);
}

async function downloadReport (row) {
	const { id, case_name } = row
	let params = {
		id: id,
	}
	const response = await reportDownload(params)
	const temp = response.headers['content-disposition'].split(';')[1].split('=')[1];
	const data = response.data
	downloadByFile(data, temp)
}

async function downloadPcap (row) {
	const { id, case_name } = row
	let params = {
		id: id,
	}
	const response = await pcapDownLoad(params)
	const temp = response.headers['content-disposition'].split(';')[1].split('=')[1];
	const data = response.data
	downloadByFile(data, temp)
}

const columns = [
	{
		type: "selection",
	},
	{
		title: '编号',
		key: 'id'
	},
	{
		title: '报告名称',
		key: 'case_name'
	},
	{
		title: '测试用户',
		key: 'user'
	},
	{
		title: '所属任务',
		key: 'case_type'
	},
	// {
	//     title: '运行状态',
	//     key: 'run_status'
	// },
	{
		title: '测试开始时间',
		key: 'create_time'
	},
	{
		title: '测试结束时间',
		key: 'end_time'
	},
	// {
	//     title: '报告创建时间',
	//     key: 'update_time'
	// },
	// {
	//     title: '复制',
	//     render: (row) => {
	//         return (
	//             <BtnIcon type="primary" onClick={() => copyData(row)}>
	//                 <Copy />
	//             </BtnIcon>
	//         )
	//     }
	// },
	{
		title: '预览',
		render: (row) => {
			return (
				<BtnIcon color="#2969FF" type="primary" onClick={() => preview(row)}>
					<PreviewLink20Regular />
				</BtnIcon>
			)
		}
	},
	{
		title: '报告下载',
		render: (row) => {
			return (
				<BtnIcon color="#2969FF" type="info" onClick={() => downloadReport(row)}>
					<ArrowCircleDown20Filled></ArrowCircleDown20Filled>
				</BtnIcon>
			)
		}
	},
	{
		title: 'PCAP下载',
		render: (row) => {
			return (
				<BtnIcon color="#2969FF" type="info" onClick={() => downloadPcap(row)}>
					<ArrowCircleDown20Filled></ArrowCircleDown20Filled>
				</BtnIcon>
			)
		}
	},
]

const model = ref(null)
let result = ref('')
const preview = (row) => {
	model.value.show()
	result.value = row.result
}
let searchForm = reactive({
	time: null,
	case_name: ''
})

const resetSearch = () => {
	searchForm.time = null
	searchForm.case_name = ''
}
</script>

<template>
	<div class="bg">
		<Title title="报告" />
		<SearchBox :searchForm="searchForm" @filterData="filterData(searchForm)"
			@refreshData="() => { refresh(); resetSearch() }"></SearchBox>

		<ActIonBtnBar @deleteData="delData" :showAddbtn="false" />
		<n-data-table style="padding: 20px;" max-height="calc(100vh - 410px)" :key="key" :rowKey="rowKey" :pagination="false"
			@update:checked-row-keys="updateCheckVal" :columns="columns" :data="dataSource" :bordered="false" />

		<div class="the-pag">
			<n-pagination v-model:page="pagination.page" :page-count="pagination.pageCount" :default-page-size="10"
				:pageSizes="pagination.pageSizes" :showSizePicker="true"
				@update:page="(page) => { pagination.onUpdatePage(page, searchForm) }" v-model:checkRowKeys="checkRowKeys"
				@updatePageSize="(pageSize) => pagination.onUpdatePageSize(pageSize, searchForm)" />
		</div>
	</div>

	<TheModel title="预览" ref="model" :showConfirm="false" width="1000px" height="680px">
		<div v-html="result"></div>
	</TheModel>
</template>

<style lang="scss" scoped>
.bg {
	margin: 20px 20px 0 20px;
	border-radius: 15px;
	background: #FFFFFF;
	height: calc(100vh - 84px);
	overflow: hidden;
	overflow-y: auto;
}

.serch-box {
	display: flex;
	align-items: center;
	margin-right: 130px;
}

.attackt-set {
	margin-left: 120px;
}
</style>

