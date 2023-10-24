
<script setup lang="jsx">
import { h, computed, ref } from "vue";
import { NIcon } from "naive-ui";
import { RouterLink, useRouter, useRoute } from "vue-router";

import { EyeOff20Filled, Certificate20Regular, AppsAddIn20Regular, RatioOneToOne20Filled as net } from "@vicons/fluent"
import { useStore } from "vuex";
const store = useStore();
const router = useRouter();

let collapsed = ref(false)
function renderIcon (icon) {
	return () => h(NIcon, null, { default: () => h(icon) });
}
function renderLabel (text) {
	return () => h({ default: () => h(text) })
}
const menuOptions = [
	{
		key: "/resource/portCfg",
		icon: renderIcon(net),
		label: "端口配置"
	},
]

const menuKey = computed(() => store.getters.curRouteResouce)
const changeMenu = key => {
  menuKey.value = key;
	store.commit('setting/set_resource_route', key)
  router.push({
    path: key
  })
}

</script>

<template>
	<div class="the-resource">
		<n-layout has-sider>
			<n-layout-sider bordered collapse-mode="width" :collapsed-width="70" :collapsed="collapsed" show-trigger
				:width="240" @collapse="collapsed = true" @expand="collapsed = false">
				<n-menu :collapsed="collapsed" :collapsed-width="70" :collapsed-icon-size="22" class="the-menu"
					:options="menuOptions"  :value="menuKey" @update:value="changeMenu" />
			</n-layout-sider>
			<div class="right-content">
				<RouterView></RouterView>
			</div>
		</n-layout>
	</div>
</template>


<style scoped>
.the-resource {
	margin-top: 20px;
	display: flex;
}

.the-menu {
	height: calc(100vh - 82px);
}

.right-content {
	width: 100%;
	background-color: #FFF;
	border-radius: 15px;
	height: calc(100vh - 82px);
	margin: 0px 20px;
	overflow: hidden;
	overflow-y: auto;
}
</style>