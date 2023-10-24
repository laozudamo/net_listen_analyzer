<script lang="jsx" setup>
import { ref, computed, reactive, onMounted, render } from 'vue'
import { RefreshCircle } from "@vicons/ionicons5";
import { DotMark,  SettingsAdjust,
   Save, } from '@vicons/carbon'
import {
	Concept,
	ClassifierLanguage,
	GatewayPublic,
	DataViewAlt
} from "@vicons/carbon";

import { acquicePort, releasePort, getPortInfo, adminReleasePort } from '@/api/serve/port.js'
import { createToaster } from "@meforma/vue-toaster";
import { useStore } from 'vuex'
const resData = ref([])
const store = useStore()
const toaster = createToaster({ position: "top", duration: 800 });

const role = computed(() => store.getters.role)
const isAdmin = role.value.includes(0)

const columns = reactive([
	{
		title: "端口名称",
		key: "index",
		render: (row) => {
			return 'port' + row.index
		}
	},
	{
		title: "端口状态",
		key: "link",
		render: (row) => {
			return row.link === 'UP' ?
				<div style={{ display: 'flex', alignItems: 'center' }}>
					<n-icon size="16" color="#0CAF60">
						<DotMark />
					</n-icon>
					<div>
						up
					</div>
				</div>
				:
				<div style={{ display: 'flex', alignItems: 'center' }}>
					<n-icon size="16" color="#FF5E63">
						<DotMark />
					</n-icon>
					<div>
						down
					</div>
				</div>
		}
	},
	{
		title: "网卡速率",
		key: "supp_speeds",
		render: (row) => {
			return (
				<n-tag> {row.supp_speeds.at(-1) / 1000 + 'G'} </n-tag>
			)
		}
	},
	{
		title: "占有用户",
		key: "owner",
		render: (row) => {
			return row.owner === "" ? '空闲' : row.owner
		}
	},
	{
		title: "运行状态",
		key: "run_stats",
		render: (row) => {
			return row.run_stats === 1 ?
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
		title: "操作",
		titleAlign: 'center',
		width: isAdmin ? 300 : 200,
		render: (row) => {
			return (
				<>
					<BtnIcon color="#2969FF" msg="详情" onClick={() => showDetail(row)}>
						<DataViewAlt />
					</BtnIcon>
					{
						row.owner === "-" ? (
							<BtnIcon color="#2969FF" onClick={() => acquiceOnePort(row)} msg="绑定">
								<Concept />
							</BtnIcon>
						) : (
							<BtnIcon color="#2969FF" onClick={() =>releaseOnePort(row)} msg="解绑">
								<ClassifierLanguage />
							</BtnIcon>
						)
					}
					<BtnIcon v-show={isAdmin} color="#2969FF"  onClick={() => releaseAdminPort(row)} msg="强制解绑">
						<GatewayPublic />
					</BtnIcon>
				</>
			)
		}
	},
	// {
  //     title: "CPU核配置",
  //     key: "used_cpu",
  //     width: 300,
  //     render: (row, index) => {
  //        return (
  //           <>
  //              {
  //                 row.isEdit ? (<>
  //                    <div style={{ display: "flex" }}>
  //                       <n-select size="small" v-model:value={row.used_cpu} onFocus={() => { getUsedCpu(row) }} options={cpuOption.value} multiple />
  //                       <BtnIcon type="primary" msg="保存" onClick={() => { setUsedCpu(row) }}>
  //                          <Save />
  //                       </BtnIcon>
  //                    </div>
  //                 </>)
  //                    : (<BtnIcon disabled={row.bind_user != username.value} type="primary" msg="设置" onClick={() => { editColums(row, index) }}>
	// 											<SettingsAdjust />
  //                    </BtnIcon>)
  //              }
  //           </>
  //        )
  //     }
  //  },
])

const theModel = ref(null)
let detailData = reactive({
	arp: '',
	dest: '',
	driver: '',
	hw_mac: '',
	index: '',
	mult: '',
	link: '',
	owner: '',
	numa: '',
	pci_addr: '',
	speed: '',
	status: '',
	src_mac: '',
	vlan: "",
	vlan: '',
	supp_speeds: '',
})

function showDetail (data) {
	theModel.value.show()
	console.log(data)
	for (let key in detailData) {
		detailData[key] = data[key]
	}
}

const getUsedCpu = async (row) => {
   cpuOption.value = []
   let { data } = await getCpuOption({ numa_node: row.numa_node })
   // console.log(data);
   cpuOption.value = data

}
const setUsedCpu = async (row) => {
   let tep = new FormData()
   tep.append('used_cpu', JSON.stringify(row.used_cpu))
   tep.append('port', row.port)
   let { code, msg } = await cpuCorePort(tep)
   console.log(tep);
   if (code === 0) {
      toaster.success(msg)
      row.isEdit = false
      ++key.value
   }
}

const editColums = (row, index) => {
   row.isEdit = true
  //  ++key.value
}

const acquiceOnePort = async (row) => {
	let params = {
		port: row.index
	}
	let res = await acquicePort(params)
	if (res.code == 0) {
		toaster.success('绑定成功')
		getOperateData()
	}
}
const releaseOnePort = async (row) => {
	let params = {
		port: row.index
	}
	let res = await releasePort(params)
	if (res.code == 0) {
		toaster.success('解绑成功')
		getOperateData()
	}
}

// 管理员强制解绑
const releaseAdminPort = async (row) => {
	let params = {
		port: row.index
	}
	let res = await adminReleasePort(params)
	if (res.code == 0) {
		getOperateData()
		toaster.success('解绑成功')
	}
}

const getOperateData = async () => {
	let { data, code } = await getPortInfo()
	if (code === 0) {
		resData.value = data
	}
}

onMounted(async () => {
	await getOperateData()
	// getColumn()
})

async function refesh () {
	await getOperateData()
	toaster.success('刷新成功')
}

</script>

<template>
	<div class="port-main">
		<div class="header">
			<div class="the-title">端口管理</div>
			<base-icon :size="30" @click="refesh">
				<RefreshCircle />
			</base-icon>
		</div>

		<div class="the-slot" v-for="(item, i) in resData" :key="i">
			<div class="the-title">{{ item.slot_name }}</div>
			<n-data-table size="small" :row-key="rowKeys" :columns="columns" :data="Object.values(item.ports_info)"
				:bordered="false" />
		</div>
	</div>
	<TheModel :title="'PORT ' + detailData['index']" ref="theModel" width="1000px" height="400px" :showConfirm="false">
		<n-descriptions label-placement="left" bordered :column="4">
			<n-descriptions-item v-for="(item, index) in Object.keys(detailData)" :label="item" :key="index">
				{{ detailData[item] }}
			</n-descriptions-item>
		</n-descriptions>
	</TheModel>
</template>

<style lang="scss" scoped>
.port-main {
	overflow: auto;
	margin: 20px 20px;
}

.header {
	padding: 0 20px;
	height: 56px;
	background-color: #FFFFFF;
	display: flex;
	justify-content: space-between;
	align-items: center;
	border-radius: 15px;
}

.the-slot {
	margin-top: 20px;
	background-color: #FFFFFF;
	padding: 20px;
	border-radius: 15px;
}

.slot-port {
	margin-bottom: 30px;
}

.select-box {
	width: 600px;
	display: flex;
}

.the-title {
	position: relative;
	padding-left: 12px;
	// height: 44px;
	font-weight: 500;
	font-size: 20px;

	&::before {
		position: absolute;
		content: '';
		display: inline-block;
		top: 5px;
		left: 2px;
		width: 4px;
		height: 20px;
		background-color: #2969FF;
		margin-right: 10px;
	}
}
</style>