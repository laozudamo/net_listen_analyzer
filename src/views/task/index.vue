
<script lang="jsx" setup>
import {
	Edit,
	DotMark
} from "@vicons/carbon";

import {
	AirplaneTakeOff16Regular as Run,
	DocumentCopy16Filled as Copy,
	RecordStop28Regular as Stop
} from "@vicons/fluent";

import { ref, reactive, onMounted, h } from 'vue'
import { NButton, NTree, useDialog } from 'naive-ui'
import { useRouter } from 'vue-router'

import { list, create, details, update, copy, del, runTask, stopTask, caseList } from '@/api/task.js'
import { createToaster } from "@meforma/vue-toaster";
import { debounce } from '@/utils/tool.js';
import useCommon from '@/components/hooks/handle.js'
const { dataSource, pagination, isEdit, checkArr, updateCheckVal, afterLeave, addData, refresh, delData, confirm, getDetail, copyData, editData, rowKey, checkRowKeys, key, filterData } = useCommon({ list, create, update, del, copy, details, resetFormVal, setFormVal, handForm });
const model = ref(null)
const dialog = useDialog()

const router = useRouter()
const loading = ref(false)
const toaster = createToaster({ type: 'success', position: "top" });

const columns = [
	{
		type: "selection",
	},
	{
		title: '编号',
		key: 'id'
	},
	{
		title: '任务名称',
		key: 'name',
		width: 200,
	},
	{
		title: '实例',
		key: 'cases',
		width: 200,
		render: (row) => {
			return (
				<div>
					{JSON.parse(row.cases).map((item, index) => {
						return <n-tag key={index} style={{ marginLeft: "5px" }}>{item}</n-tag>
					})}
				</div>
			)
		}
	},
	{
		title: "运行状态",
		key: "run_status",
		render: (row) => {
			return row.run_status ?
				<div style={{ display: 'flex', alignItems: 'center' }}>
					<n-icon size="16" color="#0CAF60">
						<DotMark />
					</n-icon>
					<div>
						运行中
					</div>
				</div>
				:
				<div style={{ display: 'flex', alignItems: 'center' }}>
					<n-icon size="16" color="#FF5E63">
						<DotMark />
					</n-icon>
					<div>
						未运行
					</div>
				</div>
		}
	},
	{
		title: '创建时间',
		key: 'create_time'
	},
	{
		title: '更新时间',
		key: 'update_time'
	},
	{
		title: '操作',
		titleAlign: 'center',
		width: 200,
		render: (row) => {
			return (
				<div>
					<BtnIcon disabled={row.run_status} color="#2969FF" msg="编辑" type="default" onClick={() => editData(model, row.id)}>
						<Edit></Edit>
					</BtnIcon>
					{
						row.run_status ?
							<BtnIcon color="#2969FF" loading={loading.value} msg="停止" type="default" onClick={() => overOneTask(row)}>
								<Stop></Stop>
							</BtnIcon>
							:
							<BtnIcon color="#2969FF" msg="运行" type="default" onClick={() => runCase(row.id)}>
								<Run></Run>
							</BtnIcon>
					}

				</div>
			)
		}
	},
]



const runCase = debounce(async (id) => {
	let params = {
		task_ids: [id]
	}
	const { data, code } = await runTask(params)
	if (code == 0) {
		refresh(true)
		handleSuccess()
	}
}, 800)

const formData = reactive({
	name: "",
	cases: [],
})

const caseOption = ref([])
async function getCaseList () {
	const { data } = await caseList()
	caseOption.value = data
}

onMounted(() => {
	getCaseList()
})

// 结束任务
const overOneTask = async (row) => {
	loading.value = true
	let { code, msg } = await stopTask({ id: row.id })
	if (code == 0) {
		loading.value = false
		toaster.show(msg)
		refresh(true)
	}
}

// 穿梭框
const renderSourceList = function ({
	onCheck,
	pattern
}) {
	return (
		<>
			<NTree check-strategy={'child'} checkbox-placement="left" key={key} data={caseOption.value} default-expand-all={true} defaultCheckedKeys={formData.cases} keyField="value" selectable={false}
				checkOnClick={true} checkedKeys={formData.cases} onUpdateCheckedKeys={(checkedKeys) => {
					onCheck(checkedKeys)
				}} checkable={true} pattern={pattern} multiple></NTree>
		</>
	)
};
function flattenTree (list) {
	const result = [];
	function flatten (_list = []) {
		_list.forEach((item) => {
			result.push(item);
			flatten(item.children);
		});
	}
	flatten(list);
	return result;
}

function handForm () {
	return formData
}

const copyForm = JSON.parse(JSON.stringify(formData))
function resetFormVal () {
	Object.keys(formData).map(key => {
		formData[key] = copyForm[key]
	})

	if ('id' in formData) {
		delete formData.id
	}
}

function setFormVal (data) {
	formData.name = data.name
	formData.cases = data.cases.map(item => item.id)
	formData.id = data.id
}

//dilong
const handleSuccess = () => {
	dialog.success({
		title: "提示",
		content: "任务执行成功，是否跳转至监控界面",
		negativeText: "取消",
		positiveText: "确认",
		onPositiveClick: () => {
			router.push({
				path: "/monitor"
			})
		}
	})
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
		<Title title="任务" />
		
		<SearchBox :searchForm="searchForm" @filterData="filterData(searchForm)"
			@refreshData="() => { refresh(); resetSearch() }"></SearchBox>
		<ActIonBtnBar @deleteData="delData" @addData="() => { addData(model) }" />
		<n-data-table style="padding: 20px;" max-height="calc(100vh - 410px)" :key="key" :rowKey="rowKey" :pagination="false"
			@update:checked-row-keys="updateCheckVal" :columns="columns" :data="dataSource" :bordered="false" />

		<div class="the-pag">
			<n-pagination v-model:page="pagination.page" :page-count="pagination.pageCount" :default-page-size="10"
				:pageSizes="pagination.pageSizes" :showSizePicker="true"
				@update:page="(page) => { pagination.onUpdatePage(page, searchForm) }" v-model:checkRowKeys="checkRowKeys"
				@updatePageSize="(pageSize) => pagination.onUpdatePageSize(pageSize, searchForm)" />
		</div>
	</div>
	<!-- 增加模板的模态框 -->
	<TheModel ref="model" width="800px" height="500px" @afterLeave="afterLeave" @confirm="confirm(model, handForm())"
		class="the-model" :title="isEdit ? '编辑任务' : '新增任务'">
		<div class="center-main">
			<n-form ref="formRef" :model="formData" label-placement="left" label-width="auto" size="small" :style="{
				maxWidth: '640px'
			}">
				<n-form-item label="任务名称：">
					<n-input size="medium" v-model:value="formData.name" />
				</n-form-item>
				<n-form-item label="实例列表：">
					<n-transfer size="large" ref="transfer" v-model:value="formData.cases" :options="flattenTree(caseOption)"
						:render-source-list="renderSourceList" :source-filterable="true" />
				</n-form-item>
			</n-form>
		</div>
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

:deep(.n-transfer .n-transfer-list) {
	min-width: 300px;
	height: 400px;
}

.center-main {
	.n-input-number {
		width: 70%;
	}
}

:deep(.n-transfer) {
	height: 330px;
}
</style>