<script setup>
import { h, computed, ref } from "vue";
import { NIcon } from "naive-ui";
import { RouterLink, useRouter } from "vue-router";
import {
  BookOutline as BookIcon,
  PersonOutline,
  ReaderOutline,
  TvOutline,
  DocumentTextSharp
} from "@vicons/ionicons5";
import {
  System24Filled,
  ContactCardRibbon24Regular
} from "@vicons/fluent";

import img from '@/assets/img/doc.png'


import {
  Catalog,
  ChartNetwork
} from "@vicons/carbon";
import { useStore } from "vuex";
const store = useStore();
const router = useRouter();
function renderIcon (icon) {
  return () => h(NIcon, null, { default: () => h(icon) });
}


const menuOptions = [
  {
    key: "/setting/log",
    icon: renderIcon(Catalog),
    label: "日志"
  },
  {

    key: "/setting/systeminfo",
    icon: renderIcon(TvOutline),
    label: "系统信息"
  },
  // {

  //   key: "/setting/portinfo",
  //   icon: renderIcon(ChartNetwork),
  //   label: "管理网口"
  // },
  {

    key: "/setting/useradmin",
    icon: renderIcon(PersonOutline),
    label: "用户管理"
  },
  // {

  //   key: "/setting/reportconfig",
  //   icon: renderIcon(ReaderOutline),
  //   label: "报告配置"
  // },
  // {

  //   key: "/setting/license",
  //   icon: renderIcon(ContactCardRibbon24Regular),
  //   label: "证书管理"
  // },
]

const menuKey = computed(() => store.getters.curRouteSetting)
const changeMenu = key => {
  menuKey.value = key;
  store.commit('setting/set_setting_route', key)
  router.push({
    path: key
  })
}


</script>

<template>
  <div class="the-setting">
    <n-layout has-sider>
      <n-layout-sider bordered collapse-mode="width" :collapsed-width="70" :collapsed="collapsed" :show-trigger="false"
        :width="240" @collapse="collapsed = true" @expand="collapsed = false">

        <div class="the-menu">
          <n-grid style="padding: 10px;" x-gap="12" :cols="2">
            <n-gi v-for="i in 20">
              <div class="the-ele">
                <n-image :preview-disabled="true"	  width="40" :src="img" />
                <div>
                  文件名称文件名称文件名称
                </div>
              </div>
            </n-gi>
          </n-grid>
        </div>
        <!-- 文件列表 -->
        <!-- <n-menu :collapsed="collapsed" :collapsed-width="70" :collapsed-icon-size="22" class="the-menu"
          :options="menuOptions" :value="menuKey" @update:value="changeMenu" /> -->
      </n-layout-sider>
      <div class="right-content">
        <PcapAny></PcapAny>
        <!-- <RouterView></RouterView> -->
      </div>
    </n-layout>
  </div>
</template>

<style lang="scss" scoped>
.the-setting {
  margin-top: 20px;
}

.right-content {
  width: 100%;
  margin: 0px 20px;
  height: calc(100vh - 82px);
  background-color: #fff;
  border-radius: 15px;
  overflow-y: auto;
}

.the-menu {
  height: calc(100vh - 82px);
  overflow: auto;
}

.the-ele {
  width: 100px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  cursor: pointer;
}
</style>