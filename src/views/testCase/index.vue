<script setup lang="jsx">
import { NetworkCheck24Filled as layer23, AlignSpaceAroundVertical20Regular as line47, ShieldTask48Regular as safe, InkStroke24Filled as viewIcon, BranchFork24Regular as rfcIcon, SidebarSearchRtl20Filled as protocolIcon, Stream20Regular as ddosIcon, Bug20Regular as virusIcon, TextPositionSquare20Regular as fuzzIcon, MyLocation20Regular as webAttckIcon } from '@vicons/fluent'
import { h, ref, computed } from 'vue'
import { useRouter, useRoute } from "vue-router";
import { NIcon } from "naive-ui";
import { useStore } from "vuex";
const store = useStore();
const router = useRouter();

function renderIcon (name) {
	return () => <SvgIcon name={name}></SvgIcon>
}

const menuOptions = [
	{
		key: '/testcase/layer23',
		icon: renderIcon(23),
		label: "2-3层协议"
	},
	{
		key: '/testcase/tcp',
		icon: renderIcon("tcp"),
		label: "TCP协议"
	},
	{
		key: '/testcase/udp',
		icon: renderIcon("udp"),
		label: "UDP协议"
	},
	{
		key: '/testcase/ipv4',
		icon: renderIcon("ipv4"),
		label: "IPV4协议"
	},
	{
		key: '/testcase/ipv6',
		icon: renderIcon("ipv6"),
		label: "IPV6协议"
	},
	{
		key: '/testcase/icmp',
		icon: renderIcon("icmp"),
		label: "ICMP协议"
	},
	{
		key: '/testcase/arp',
		icon: renderIcon('arp'),
		label: "ARP协议"
	},
	{
		key: 'IGMP协议族',
		icon: renderIcon("igmp"),
		label: 'IGMP族',
		children: [
			{
				key: '/testcase/igmpv1',
				label: "IGMP/V1"
			},
			{
				key: '/testcase/igmpv2',
				label: "IGMP/V2"
			},
			{
				key: '/testcase/igmpv3',
				label: "IGMP/V3"
			},
		]
	},
	{
		key: '2544',
		icon: renderIcon("rfc2544"),
		label: 'RFC2544',
		children: [
			{
				key: '/testcase/rfcCreat',
				label: "帧丢失"
			},
			{
				key: '/testcase/rfcThroughput',
				label: "吞吐量"
			},
			{
				key: '/testcase/rfcDelay',
				label: "时延"
			},
			{
				key: '/testcase/rfcBack',
				label: "背靠背"
			},

		]
	},
	{
		key: '/testcase/playBack',
		icon: renderIcon("playback"),
		label: "流量回放"
	},
	{
		key: '/testcase/rdma',
		icon: renderIcon("rdma"),
		label: "RDMA测试"
	},
]

const menuKey = computed(() => store.getters.curRouteCase)

const changeMenu = key => {
	menuKey.value = key;
	store.commit('setting/set_case_route', key)
	router.push({
		path: key
	})
}

</script>

<template>
	<div class="the-case">
		<n-layout has-sider>
			<n-layout-sider bordered collapse-mode="width" :collapsed-width="70" :collapsed="collapsed" show-trigger
				:width="240" @collapse="collapsed = true" @expand="collapsed = false">
				<n-menu :collapsed="collapsed" :collapsed-width="70" :collapsed-icon-size="20" class="the-menu"
					:options="menuOptions" :value="menuKey" @update:value="changeMenu" />
			</n-layout-sider>
			<div class="right-content">
				<RouterView></RouterView>
			</div>
		</n-layout>
	</div>
</template>

<style lang="scss" scoped>
.the-case {
	margin-top: 20px;
}

.the-menu {
	height: calc(100vh - 82px);
	border-radius: 0px 15px 15px 0px;
	overflow: auto;
}

.right-content {
	width: 100%;
	margin: 0px 20px;
	height: calc(100vh - 82px);
	background-color: #fff;
	border-radius: 15px;
	overflow-y: auto;
}
</style>