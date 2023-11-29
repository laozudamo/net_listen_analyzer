<script setup lang="jsx">
import {
  FullScreenMinimize24Filled,
  TaskListSquareLtr24Regular,
} from "@vicons/fluent";

import { ref, computed, h, reactive, onMounted, watch, watchEffect } from "vue";
import { useRouter, useRoute } from "vue-router";
import { UserAvatar, Logout, UserMultiple, Svg } from "@vicons/carbon";
import { useStore } from "vuex";
import { api as fullscreen } from "vue-fullscreen";
import { createToaster } from "@meforma/vue-toaster";
import img from '@/assets/img/logo.png'

const toaster = createToaster({ position: "top" });

const store = useStore();

const curRouteCase = computed(() => store.getters.curRouteCase)
const curRouteResouce = computed(() => store.getters.curRouteResouce)
const curRouteSetting = computed(() => store.getters.curRouteSetting)

// const changeRoute = computed(() => [curRouteCase.value, curRouteResouce.value, curRouteSetting.value])

let isFull = ref(false);
const toggleFullScrean = () => {
  toggle();
};
async function toggle () {
  await fullscreen.toggle(document.body, {
    teleport: true,
    callback: (isFullscreen) => {
      isFull.value = isFullscreen;
    },
  });
}

const adminOption = [
  // {
  //   label: "用户管理",
  //   key: "userAdmin",
  //   icon: () => (
  //     <n-icon size="20">
  //       <UserAvatar />
  //     </n-icon>
  //   ),
  // },
  {
    label: "退出登录",
    key: "logout",
    icon: () => (
      <n-icon size="20">
        <Logout />{" "}
      </n-icon>
    ),
  },
];

const username = computed(() => store.getters.username);

const options = adminOption;
const router = useRouter();
const route = useRoute();
console.log(route.fullPath);


const select = (v) => {
  let path = "";
  v === "logout" ? (path = "/login") : (path = "/userAdmin");

  if (v === "logout") {
    localStorage.removeItem("isLogin")
    router.push({ path });
    // store.dispatch("user/LOGOUT").then(() => {
    //   router.push({ path });
    // });
  }
  router.push(path);
};

const menuKey = ref(null)

menuKey.value = route.fullPath

watchEffect(() => {
  menuKey.value = route.fullPath
});

let menuOptions = ref([])

menuOptions.value = setMenu()

let changeArr = computed(() => [curRouteCase.value, curRouteResouce.value, curRouteSetting.value])

watch(changeArr, (v) => {
  menuOptions.value = setMenu()
})

function setMenu () {
  let option = [
    // {
    //   label: "端口",
    //   key: "/serve",
    //   icon: () => <SvgIcon name="port" />,
    // },

    // {
    //   label: "实例",
    //   key: `${curRouteCase.value}`,
    //   icon: () => <SvgIcon name="case" />,
    // },
    // {
    //   label: "任务",
    //   key: "/task",
    //   icon: () => <SvgIcon name="task" />,
    // },
    // {
    //   label: "监控",
    //   key: "/monitor",
    //   icon: () => <SvgIcon name="monitor" />,

    // },
    // {
    //   label: "报告",
    //   key: "/report",
    //   icon: () => <SvgIcon name="report" />,

    // },
    // {
    //   label: "捕获",
    //   key: "/capture",
    //   icon: () => <SvgIcon name="capture" />,
    // },
    {
      label: "pcap",
      key: "/pcap",
      icon: () => <SvgIcon name="capture" />,
    },
    // {
    //   label: "回放",
    //   key: "/playBack",
    //   icon: () => <SvgIcon name="monitor" />,
    // },
    // {
    //   label: "模板",
    //   key: `${curRouteResouce.value}`,
    //   icon: () => <SvgIcon name="template" />,
    // },
    {
      label: "设置",
      key: `${curRouteSetting.value}`,
      icon: () => <SvgIcon name="setting" />,
    },
  ]
  return option
}

const changeMenu = key => {
  menuKey.value = key;
  router.push({
    path: key
  })
}


</script>

<template>
  <div class="tool-bar" id="drawer-target">
    <div class="left-tool-bar">
      <!-- <n-grid :x-gap="24" :cols="6"> -->
      <!-- <n-grid-item> -->
      <div class="the-logo">
        <n-image width="90" height="47" :src="img" preview-disabled />
        <div style="margin-left: 20px;">
          <div :style="{ fontWeight: 700, color: '#0f4b9a' }">
            网络存储分析仪
          </div>
          <div class="title-des">
            NSA-1
          </div>
        </div>
      </div>
      <!-- </n-grid-item> -->
      <!-- <n-grid-item> -->
      <n-menu :value="menuKey" @update:value="changeMenu" mode="horizontal" :options="menuOptions" />
      <!-- </n-grid-item> -->
      <!-- </n-grid> -->


    </div>
    <div class="right-tool-bar">
      <n-dropdown :options="options" @select="select">
        <base-icon font-size="40">
          <UserAvatar />
        </base-icon>
      </n-dropdown>
      <div class="user-name">
        {{ username }}
      </div>

      <n-divider vertical />

      <span @click="toggleFullScrean">
        <icon-tip :msg="isFull ? '退出全屏' : '全屏'">
          <FullScreenMinimize24Filled />
        </icon-tip>
      </span>

    </div>
  </div>
</template>

<style lang="scss" scoped>
.tool-bar {
  // margin-top: 10px;
  padding: 0px 4px;
  height: 60px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  background: #FFFFFF linear-gradient(180deg, #FFFFFF 0%, #EAEAEA 100%);
  box-shadow: 0px 1px 0px 0px #FFFFFF, inset 0px -1px 0px 0px #D7D7D7;

  .right-tool-bar {
    display: flex;
    align-items: center;
  }

  .left-tool-bar {
    display: flex;
    align-items: center;
  }

  .col-menu {
    line-height: 40px;
    margin-left: 5px;
    cursor: pointer;
  }

  .col-icon {
    cursor: pointer;
    margin-top: 10px;
  }

  .user-name {
    margin-right: 5px;
    height: 48px;
    line-height: 48px;
  }

  .n-divider.n-divider--vertical {
    background-color: rgb(29, 12, 12);
    height: 2em;
  }
}

.the-menu {
  margin-left: 100px;
}

.the-logo {
  display: flex;
  align-items: center;
  // justify-content: space-between;
  width: 400px;
  opacity: 0.7;

  .title-des {
    font-size: 10px;
    color: #a82543;
  }
}

:deep(.n-menu .n-menu-item) {
  height: 60px;
}

:deep(.n-menu.n-menu--horizontal .n-menu-item-content) {
  margin-top: 5px;
  padding: 0px;
  margin: 0px 24px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}

:deep(.n-menu-item-content__icon) {
  margin-right: 0px !important;
}
</style>