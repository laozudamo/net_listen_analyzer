<script setup lang="jsx">


import { onMounted, reactive, ref } from 'vue'
// import { DocumentCopy16Filled as Copy, Edit20Filled as Edit, DocumentText24Filled as Detail, AirplaneTakeOff16Regular as Run } from "@vicons/fluent";
import { Delete16Regular as Delete, AddCircle16Filled as Add, ArrowClockwise16Regular as Refresh, ArrowCircleDown20Filled, FilterSync24Filled, PreviewLink20Regular, ArrowSquareDown24Filled } from "@vicons/fluent";
import useCommon from '@/components/hooks/handle.js'
import { list, del, copy, generate, reportDownload, pacpDownload } from '@/api/report/report.js'

const { dataSource, pagination, updateCheckVal, refresh, delData, getDetail, copyData, rowKey, checkRowKeys, key, filterData } = useCommon({ list, del, copy, })

async function generatePort (id) {
	try {
		await generate(id)
	} catch (error) {
		console.log(error)
	}
}

const downloadByFile = function (data, filename, type) {
	if (!data) return
	let url = window.URL.createObjectURL(new Blob([data], { type: "application/octet-stream" }))
	let link = document.createElement('a')
	link.style.display = 'none'
	link.href = url
	link.setAttribute('download', `${filename}${type}`)

	document.body.appendChild(link)
	link.click()
	document.body.removeChild(link);
}

async function downloadReport (row) {
	const { id, use_case_name } = row
	// await generatePort(id)

	let params = {
		id: id,
	}
	const data = await reportDownload(params)
	// const date = Date.now()

	downloadByFile(data, use_case_name, ".zip")
}

async function downloadPcap (row) {
	const { id, use_case_name } = row

	const data = await pacpDownload(id)
	// const date = Date.now()
	let name = use_case_name + '_pacp'
	await downloadByFile(data, name, '.zip')
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
		key: 'use_case_name'
	},
	{
		title: '测试用户',
		key: 'test_user'
	},
	{
		title: '所属任务',
		key: 'the_task'
	},
	// {
	//     title: '运行状态',
	//     key: 'run_status'
	// },
	{
		title: '测试开始时间',
		key: 'begin_time'
	},
	{
		title: '测试结束时间',
		key: 'create_time'
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
				<BtnIcon type="primary" onClick={() => preview(row)}>
					<PreviewLink20Regular />
				</BtnIcon>
			)
		}
	},
	{
		title: '报告下载',
		render: (row) => {
			return (
				<BtnIcon type="info" onClick={() => downloadReport(row)}>
					<ArrowCircleDown20Filled></ArrowCircleDown20Filled>
				</BtnIcon>
			)
		}
	},
	{
		title: 'PCAP下载',
		render: (row) => {
			return (
				<BtnIcon disabled={!row.is_pcap} type="info" onClick={() => downloadPcap(row)}>
					<ArrowSquareDown24Filled></ArrowSquareDown24Filled>
				</BtnIcon>
			)
		}
	},
]

const theForm = reactive({
	case_name: '',
	time: null
})

const model = ref(null)
let result = ref('')
const preview = (row) => {
	model.value.show()
	result.value = row.result
}
const resetSearch = () => {
	theForm.time = null
	theForm.case_name = ''
}

</script>

<template>
	<div class="main">
		<header class="the-header">
			<div>
				<BtnIcon msg="删除" type="error" :quaternary="false" @click="delData" class="del-btn">
					<Delete />
				</BtnIcon>
			</div>
			<div class="right-box">
				<div class="serch-box">
					<n-form :model="theForm" label-placement="left" inline :style="{
						maxWidth: '640px'
					}" label-width="100px">
						<n-form-item label="报告名称">
							<n-input size="small" clearable v-model:value="theForm.case_name" />
						</n-form-item>

						<n-form-item label="测试开始时间">
							<n-date-picker value-format="yyyy-MM-dd" size="small" v-model:formatted-value="theForm.time"
								type="datetimerange" clearable />
						</n-form-item>
					</n-form>
					<BtnIcon msg="筛选" type="info" :quaternary="false" @click="filterData(theForm)">
						<FilterSync24Filled />
					</BtnIcon>
				</div>

				<BtnIcon msg="显示全部" type="success" :quaternary="false" @click="() => { refresh(); resetSearch() }">
					<Refresh />
				</BtnIcon>

			</div>

		</header>
		<n-data-table :key="key" :rowKey="rowKey" :pagination="false" @update:checked-row-keys="updateCheckVal"
			:columns="columns" :data="dataSource" :bordered="false" />

		<div class="the-pag">
			<n-pagination v-model:page="pagination.page" :page-count="pagination.pageCount" :default-page-size="10"
				:pageSizes="pagination.pageSizes" :showSizePicker="true"
				@update:page="(page) => { pagination.onUpdatePage(page, theForm) }" v-model:checkRowKeys="checkRowKeys"
				@updatePageSize="(pageSize) => pagination.onUpdatePageSize(pageSize, theForm)" />
		</div>

	</div>
	<TheModel title="预览" ref="model" :showConfirm="false" width="900px" height="680px">
		<div v-html="result"></div>
	</TheModel>
</template>

<style lang="scss" scoped>
.the-header {
	display: flex;
	justify-content: space-between;
	margin-bottom: 10px;
}

.serch-box {
	display: flex;
	align-items: center;
	margin-right: 130px;
}

.right-box {
	display: flex;
	align-items: center;
}

:deep(.n-form-item-feedback-wrapper) {
	display: none !important;
}

.attackt-set {
	margin-left: 120px;
}
</style>

