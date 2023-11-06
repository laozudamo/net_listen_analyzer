<script setup lang="jsx">
import { h, computed, ref, onMounted, reactive, nextTick } from "vue";
import { NIcon } from "naive-ui";
import { RouterLink, useRouter } from "vue-router";
import { getData, pacpList, getDetail, filterList, expertInfo, sessionInfo } from '@/api/pcap.js'
import { createToaster } from "@meforma/vue-toaster";
const toaster = createToaster({ type: 'error', position: 'top', duration: 1000 });

import { Splitpanes, Pane } from 'splitpanes'
import { useElementSize } from '@vueuse/core'
import 'splitpanes/dist/splitpanes.css'
import { ArrowDownload16Filled as Down, ArrowExportUp24Filled as Up, ArrowLeft24Filled as Left, ArrowRight24Filled as Right } from "@vicons/fluent";
// import { getData, getDetail } from '@/api/pcap.js'

import {
  BookOutline as BookIcon,
  PersonOutline,
  ReaderOutline,
  TvOutline,
  DocumentTextSharp,
  Folder,
  FolderOpenOutline,
  FileTrayFullOutline,
  ArrowUpSharp,
  ArrowDownSharp,
  CaretForwardCircleOutline,
  PauseCircleOutline,
  Search,
  Reload
} from "@vicons/ionicons5";

import {
  ZoomIn,
  ZoomOut,
  ZoomReset
} from "@vicons/carbon";
import {
  System24Filled,
  ContactCardRibbon24Regular
} from "@vicons/fluent";

// import img from '@/assets/img/doc.png'

import {
  Catalog,
  ChartNetwork
} from "@vicons/carbon";

import { useStore } from "vuex";

import PcapHttp from './PcapHttp.vue'
import PcapConv from './PcapConv.vue'
import EndPoint from './EndPoint.vue'
import PcapTraffic from './PcapTraffic.vue'
import PcapSum from './PcapSum.vue'
import PcapIp from './PcapIp.vue'

const store = useStore();
const router = useRouter();

let globalDisabled = ref(true)

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

// const menuKey = computed(() => store.getters.curRouteSetting)

// const changeMenu = key => {
//   menuKey.value = key;
//   store.commit('setting/set_setting_route', key)
//   router.push({
//     path: key
//   })
// }
const controller = ref(null);

const detailController = ref(null);

let listData = ref([])

let show = ref(false)

let pcapParams = {
  page: 1,
  page_size: 10
}

async function GetpacpList () {
  try {
    let { data } = await pacpList(pcapParams)
    let tmpData = data.map(item => {
      let obj = {
        label: item.key,
        key: item.key,
        prefix: renderIcon(Folder),
        children: []
      }

      if (item.values.length > 0) {
        obj.children = item.values.map(ele => {
          return {
            label: ele,
            key: ele,
            pcap_path: item.key,
            prefix: renderIcon(FileTrayFullOutline),
          }
        })
      }
      return obj
    })
    console.log("tmpData", tmpData)
    listData.value = tmpData
    console.log("23", tmpData)
  } catch (error) {
    console.log(error)
  }
}

function updatePrefixWithExpaned (_keys, _option, meta) {
  if (!meta.node)
    return;
  switch (meta.action) {
    case "expand":
      meta.node.prefix = () => h(NIcon, null, {
        default: () => h(FolderOpenOutline)
      });
      break;
    case "collapse":
      meta.node.prefix = () => h(NIcon, null, {
        default: () => h(Folder)
      });
      break;
  }
}

const nodeProps = ({ option }) => {
  return {
    onClick () {
      if (!option.children && !option.disabled) {
        if (detailController.value !== null) {
          detailController.value.abort()
          detailController.value = null
          show.value = false
        }

        globalDisabled.value = true
        handlePcapData(option)
        // bus.emit("getNodeData", option);
      }
    }
  };
};

onMounted(() => {
  GetpacpList()
})

let options = reactive([
  [
    { code: 'TCP', name: '追踪TCP', disabled: true },
    { code: 'UDP', name: '追踪UDP', disabled: true },
    { code: 'DCCP', name: '追踪DCCP', disabled: true },
    { code: 'TLSv1.2', name: '追踪TLS', disabled: true },
    { code: 'HTTP', name: '追踪HTTP', disabled: true },
    { code: 'HTTP/2', name: '追踪HTTP/2', disabled: true },
  ]
])

const menuConfig = reactive({
  body: {
    options: options,
  },
  visibleMethod: v => {
    options[0].forEach(item => {
      item.disabled = true
      if (v.row.protocol === item.code) {
        item.disabled = false;
      }
    })
    return true
  }
})

const pagerConfig = reactive({
  enabled: true,
  pageSize: 10,
  pageSizes: [5, 10, 15, 20, 50, 100, 200, 500, 1000]
})

const midEl = ref(null)
const midElementSize = useElementSize(midEl)

const xTable = ref(null)
const toolBar = ref(null)
const filterName = ref('')
let loading = ref(false)

let sumOptions = ref([
  {
    label: "专业信息",
    key: 1
  },
  {
    label: "端点统计",
    key: 2
  },
  {
    label: "会话统计",
    key: 3
  },
])



// const icmpOption = [
//   {
//     label: "状态",
//     key: 1
//   }
// ]

let threeData = ref(null)
let codeData = ref(null)

// async function scrollBottom () {
//   const $xTable = xTable.value
//   await $xTable.scrollToRow($xTable.getData(100))
//   await $xTable.refreshScroll()
// }

// async function scrollTop () {
//   const $xTable = xTable.value

// await $xTable.scrollToRow($xTable.getData(0))
// await $xTable.refreshScroll()
// }

const list = ref([])
let total = ref(0)
let pageNum = ref(1)

let query = reactive({
  pcap_path: "",
  file_name: "",
  page: 1,
  page_size: 10000,
})

const InitQuery = {
  pcap_path: "",
  file_name: "",
  page: 1,
  page_size: 10000,
}

function handlePcapData (data) {
  query = { ...query, ...InitQuery }
  // console.log("query", query)

  query.pcap_path = data.pcap_path
  query.file_name = data.label


  codeData.value = null
  threeData.value = null
  filterName.value = ""

  loadData()
}

function loadData () {
  loading.value = true
  const $table = xTable.value
  // 如果控制器存在,说明有上个请求,就它取消并设置为空
  if (controller.value !== null) {
    controller.value.abort()
    controller.value = null
  }

  controller.value = new AbortController()

  getData(query, controller.value).then(res => {
    total.value = res.count
    pageNum.value = res.page_num
    $table.loadData(res.data)
    globalDisabled.value = false
    list.value = res.data
    loading.value = false
  })

}

async function currentChange (v) {
  show.value = true
  let params = {
    pcap_path: query.pcap_path,
    file_name: query.file_name,
    idx: v.row.idx,
  }

  if (detailController.value !== null) {
    detailController.value.abort()
    detailController.value = null
  }

  detailController.value = new AbortController()

  let { data } = await getDetail(params, detailController.value)

  threeData.value = data.protocol_tree
  codeData.value = data.protocol_binary
  show.value = false
}

const searchEvent = () => {
  if (filterName.value) {
    GetfilterData()

  } else {
    const $xTable = xTable.value
    $xTable.loadData(list.value)
    // loadData()
  }
}

async function GetfilterData () {
  loading.value = true
  try {
    let params = {
      display_filter: filterName.value,
      ...query
    }

    let { data } = await filterList(params)

    const $xTable = xTable.value
    $xTable.loadData(data)
    loading.value = false
  } catch (error) {
    loading.value = false
    console.log(error)
  }
}

function showPanel (v) {
  console.log('showPanel', v)
}

// function scroll (v) {
//   console.log('scroll', v)
// }

let expertModel = ref(null)
let expertInfos = ref(null)
let expertController = ref(null)
let expertLoading = ref(null)

const handleSelect = v => {
  if (query.value === null || loading.value === true) {
    toaster.show("等待文件加载")
    return
  }
  if (v === 1) {
    expertModel.value.show()
    getExertInfo()
  }
}

const clickExpert = () => {
  expertModel.value.show()
  getExertInfo()
}

async function getExertInfo () {
  expertLoading.value = true
  expertInfos.value = null
  try {
    if (expertController.value !== null) {
      expertController.value.abort()
      expertController.value = null
    }
    expertController.value = new AbortController()
    let params = {
      pcap_path: query.pcap_path,
      file_name: query.file_name,
    }
    let { data } = await expertInfo(params, expertController.value)
    expertInfos.value = data
    expertLoading.value = false
  } catch (error) {
    console.log(error)
    expertLoading.value = false
  }
}

function thrackPacp (v) {
  console.log(v)
}

const updatePage = v => {
  query.page = v
  loadData()
}

const updatePageSize = v => {
  query.page = 1
  query.page_size = v
  loadData()
}
const reload = () => {
  query.page = 1
  loadData()
}

const fileName = ref("")
const searchFile = () => {

}



let winSize = ref(100)

function zoomAdd () {
  // winSize.value += 0.1
  // document.body.style.zoom = winSize.value
}

nextTick(() => {
  const $table = xTable.value
  const $toolbar = toolBar.value
  if ($table && $toolbar) {
    $table.connect($toolbar)
  }
})
let showDrow = ref(false)

let showHttp = ref(false)

let showConv = ref(false)

let showEndPoint = ref(false)

let showSum = ref(false)

let showTraffic = ref(false)

let showPcapIp = ref(false)


// let disable = computed(() => {
//   if (query.pcap_path && query.pcap_name) {
//     return false
//   }
//   return true
// })

// let showEndPoint = ref(false)

</script>

<template>
  <!-- <n-watermark v-if="true" content="核心机密" cross fullscreen :font-size="16" :line-height="16" :width="384"
    :height="384" :x-offset="12" :y-offset="60" :rotate="-35" /> -->
  <div class="the-setting">
    <splitpanes class="default-theme" :dbl-click-splitter="false">
      <pane size="15" max-size="20">
        <div class="the-menu">
          <div style="display: flex;align-items: center;margin-top: 10px;margin-left: 10px;">
            <n-input v-model:value="fileName" type="text" placeholder="搜索文件" />
            <BtnIcon color="#396CFC" msg="搜索" @click="searchFile">
              <Search />
            </BtnIcon>
          </div>

          <n-tree :node-props="nodeProps" :on-update:expanded-keys="updatePrefixWithExpaned" :multiple="false" block-line
            :data="listData" />
        </div>
      </pane>

      <pane style="height: calc(100vh - 80px);">
        <splitpanes horizontal class="default-theme" :dbl-click-splitter="false">
          <pane style="background-color:#FFF">
            <div style="height: 100%;background: #FFF;padding: 10px;" ref="midEl">

              <vxe-toolbar ref="toolBar" :custom="true">
                <template #buttons>
                  <BtnIcon :disabled="globalDisabled" color="#396CFC" msg="开始" v-if="true">
                    <CaretForwardCircleOutline />
                  </BtnIcon>
                  <BtnIcon :disabled="globalDisabled" color="#C6252C" msg="结束" v-else>
                    <ReaderOutline />
                  </BtnIcon>

                  <!-- <n-divider vertical /> -->

                  <!-- <n-button size="small" tertiary circle style="margin-left: 10px;" @click="scrollTop">
                    <template #icon>
                      <n-icon>
                        <ArrowUpSharp />
                      </n-icon>
                    </template>
                  </n-button> -->
                  <!-- 
                  <n-button size="small" tertiary circle style="margin-left: 10px;margin-right: 10px;"
                    @click="scrollBottom">
                    <template #icon>
                      <n-icon>
                        <ArrowDownSharp />
                      </n-icon>
                    </template>
                  </n-button> -->

                  <!-- <n-divider vertical />
                  <n-button size="small" quaternary circle style="margin-left: 10px;" @click="zoomAdd">
                    <template #icon>
                      <n-icon>
                        <ZoomIn />
                      </n-icon>
                    </template>
                  </n-button>
                  <n-button size="small" quaternary circle style="margin-left: 5px;">
                    <template #icon>
                      <n-icon>
                        <ZoomOut />
                      </n-icon>
                    </template>
                  </n-button>
                  <n-button size="small" quaternary circle style="margin-left: 5px;">
                    <template #icon>
                      <n-icon>
                        <ZoomReset />
                      </n-icon>
                    </template>
                  </n-button> -->

                </template>

                <template #tools>
                  <div style="width: 600px; display: flex;justify-content: space-evenly;">

                    <!-- <n-button>DNS层次结构</n-button>
                    
            
                    <n-button>ICMP分析</n-button>
                   
                    <n-button>统计源和目标占比</n-button> -->

                    <n-button :disabled="globalDisabled" @click="clickExpert">错误统计</n-button>
                    <!-- <n-button @click="showTraffic = true">流量图</n-button> -->
                    <n-button :disabled="globalDisabled" @click="showPcapIp = true">IP信息</n-button>
                    <n-button :disabled="globalDisabled" @click="showSum = true">统计信息</n-button>
                    <n-button :disabled="globalDisabled" @click="showEndPoint = true">端点统计</n-button>
                    <n-button :disabled="globalDisabled" @click="showConv = true">会话统计</n-button>
                    <n-button :disabled="globalDisabled" @click="showHttp = true">HTTP分析</n-button>
                  </div>

                  <vxe-input :disabled="globalDisabled" style="width: 500px;margin-right: 5px;margin-left: 20px;"
                    v-model="filterName" type="search" placeholder="试试全表搜索"></vxe-input>
                  <n-button :disabled="globalDisabled" style="margin-left: 10px;" @click="searchEvent">搜索</n-button>

                  <n-button :disabled="globalDisabled" size="small" quaternary circle style="margin-left: 5px;"
                    @click="reload">
                    <template #icon>
                      <n-icon>
                        <Reload />
                      </n-icon>
                    </template>
                  </n-button>
                </template>
              </vxe-toolbar>

              <vxe-table id="idx" :custom-config="{ storage: true }" :pagerConfig="pagerConfig" size="mini"
                :menu-config="menuConfig" @menu-click="showPanel" @current-change="currentChange" :loading="loading"
                show-overflow keep-source ref="xTable" border height="500"
                :row-config="{ isHover: true, isCurrent: true, useKey: true }"
                :column-config="{ useKey: true, resizable: true }"
                :scroll-y="{ enabled: true, gt: 0, scrollToTopOnChange: true }" :scroll-x="{ enabled: true, gt: 20 }">
                <vxe-column field="idx" width="100" title="序号"></vxe-column>
                <vxe-column field="time" width="120" title="时间"></vxe-column>
                <vxe-column field="source" width="250" title="源"></vxe-column>
                <vxe-column field="dst" width="250" title="目标"></vxe-column>
                <vxe-column field="protocol" width="100" title="协议"></vxe-column>
                <vxe-column field="len" width="100" title="长度"></vxe-column>
                <vxe-column field="info" title="信息"></vxe-column>
              </vxe-table>

              <div style="display: flex;justify-content: flex-end;margin-top: 5px;align-items: center;">
                <!-- <n-pagination size="small" :page-sizes="[100, 200, 500, 1000, 20000]" @update:page="updatePage"
                  v-model:page="query.page" @update:page-size="updatePageSize" v-model:page-size="query.page_size"
                  :page-count="pageNum" show-size-picker /> -->
                <n-pagination size="small" @update:page="updatePage" v-model:page="query.page"
                  v-model:page-size="query.page_size" :page-count="pageNum" />
                <div style="margin-left: 10px;">{{ total }}条</div>
              </div>

            </div>
          </pane>
          <pane min-size="5" max-size="95" size="40">
            <n-spin style="width: 100%;height: 100%;" v-if="show" :show="show" :delay="1000">
              <template #description>
                加载中...
              </template>
            </n-spin>
            <splitpanes :push-other-panes="false" :dbl-click-splitter="false">
              <pane style="background-color:#FFF;overflow: auto;" min-size="5" max-size="95" size="65">
                <div style="white-space: pre-wrap;padding: 20px;min-width:870px;">
                  {{ threeData }}
                </div>
                <div v-if="threeData === null">
                  <div style="font-size: 20px;color: #999; display: flex;justify-content: center;align-items: center;">
                    暂无数据
                  </div>
                </div>
              </pane>
              <pane style="background-color:#FFF;overflow: auto;" min-size="5" max-size="95" size="35">
                <div style="white-space: pre-wrap;padding: 20px;margin-left: 20px;min-width: 530px;">
                  {{ codeData }}
                </div>
                <div v-if="codeData === null">
                  <div style="font-size: 20px;color: #999; display: flex;justify-content: center;align-items: center;">
                    暂无数据
                  </div>
                </div>
              </pane>
            </splitpanes>
          </pane>
        </splitpanes>
      </pane>
    </splitpanes>

    <TheModel title="专业信息" ref="expertModel" :showConfirm="false" width="1200px" height="680px">
      <n-spin style="width: 100%;height: 100%;" :show="expertLoading" :delay="1000">
        <template #description>
          加载中...
        </template>
        <div @click="thrackPacp(ele)" style="white-space: pre-wrap;padding: 20px;cursor: pointer;"
          v-for="(ele, i) in expertInfos" :key="i">
          {{ ele }}
        </div>
      </n-spin>
    </TheModel>

    <n-drawer :mask-closable="false" v-model:show="showDrow" width="80%" :placement="placement">
      <n-drawer-content title="会话统计" closable>
        《斯通纳》是美国作家约翰·威廉姆斯在 1965 年出版的小说。
      </n-drawer-content>
    </n-drawer>

    <n-drawer :mask-closable="false" v-model:show="showHttp" width="950" :placement="placement">
      <n-drawer-content title="HTTP分析" closable>
        <PcapHttp :query='{ pcap_path: query.pcap_path, file_name: query.file_name }'></PcapHttp>
      </n-drawer-content>
    </n-drawer>


    <n-drawer :mask-closable="false" v-model:show="showConv" width="1000" :placement="placement">
      <n-drawer-content title="会话统计" closable>
        <PcapConv :query='{ pcap_path: query.pcap_path, file_name: query.file_name }'></PcapConv>
      </n-drawer-content>
    </n-drawer>

    <n-drawer :mask-closable="false" v-model:show="showEndPoint" width="800" :placement="placement">
      <n-drawer-content title="端点统计" closable>
        <EndPoint :query='{ pcap_path: query.pcap_path, file_name: query.file_name }'></EndPoint>
      </n-drawer-content>
    </n-drawer>

    <n-drawer :mask-closable="false" v-model:show="showTraffic" width="80%" :placement="placement">
      <n-drawer-content title="流量图统计" closable>
        <PcapTraffic :query='{ pcap_path: query.pcap_path, file_name: query.file_name }'></PcapTraffic>
      </n-drawer-content>
    </n-drawer>

    <n-drawer :mask-closable="false" v-model:show="showSum" width="600" :placement="placement">
      <n-drawer-content title="统计" closable>
        <PcapSum :query='{ pcap_path: query.pcap_path, file_name: query.file_name }'></PcapSum>
      </n-drawer-content>
    </n-drawer>

    <n-drawer :mask-closable="false" v-model:show="showPcapIp" width="600" :placement="placement">
      <n-drawer-content title="IP信息" closable>
        <PcapIp :query='{ pcap_path: query.pcap_path, file_name: query.file_name }'></PcapIp>
      </n-drawer-content>
    </n-drawer>

    <!-- <n-modal v-model:show="exportModal">
      <n-card style="width: 600px" title="模态框" :bordered="false" size="huge" role="dialog" aria-modal="true">
        222
      </n-card>
    </n-modal> -->

    <!-- <n-layout has-sider>
      <n-layout-sider bordered collapse-mode="width" :collapsed-width="70" :collapsed="collapsed" :show-trigger="false"
        :width="240" @collapse="collapsed = true" @expand="collapsed = false">

        <n-grid style="padding: 10px;" x-gap="12" :cols="2">
          <n-gi v-for="i in 20">
            <div class="the-ele">
              <n-image :preview-disabled="true" width="40" :src="img" />
              <div>
                文件名称文件名称文件名称
              </div>
            </div>
          </n-gi>
        </n-grid>
        <n-menu :collapsed="collapsed" :collapsed-width="70" :collapsed-icon-size="22" class="the-menu"
          :options="menuOptions" :value="menuKey" @update:value="changeMenu" />
      </n-layout-sider>
      <div class="right-content">
        <RouterView></RouterView>
      </div>
    </n-layout> -->
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

::v-deep.splitpanes.default-theme .splitpanes__splitter {
  background-color: #E9EAEC;
}

// .scaled-element {
//   overflow: auto !important;
//   transform: scale(1);
// }
</style>