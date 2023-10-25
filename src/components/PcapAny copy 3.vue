<script setup>
import { ref, computed } from 'vue'
import { Splitpanes, Pane } from 'splitpanes'
import { useElementSize } from '@vueuse/core'
import 'splitpanes/dist/splitpanes.css'
import { ArrowDownload16Filled as Down, ArrowExportUp24Filled as Up, ArrowLeft24Filled as Left, ArrowRight24Filled as Right } from "@vicons/fluent";

const columns = [
  {
    title: "Name",
    key: "name",
  },
  {
    title: "Age",
    key: "age",
  },
]

const midEl = ref(null)
const midElementSize = useElementSize(midEl)

// const xTable = ref(null)

// async function clickLeft () {
//   console.log(xTable.value)
//   let res = xTable.value.getData(400)
//   // console.log(res)
//   xTable.value.setActiveRow(res)
// }

// let height = computed(() => {
//   return midElementSize.height.value.toFixed(0) + 10
// })

// '    1   0.000000   16.0.0.152 → 48.0.0.152   IPv4 512 IPv6 hop-by-hop options[Malformed Packet]'


const data = Array.from({ length: 100000 }).map((_, index) => ({
  id: index,
  // des: '    1   0.000000   16.0.0.152 → 48.0.0.152   IPv4 512 IPv6 hop-by-hop options[Malformed Packet]'  // name: `Edward King ${index}`,
  role: 32,
  name: "jack",
  des: `London, Park Lane no. ${index}`
}));

</script>

<template>
  <splitpanes horizontal class="default-theme" :dbl-click-splitter="false">
    <pane style="background-color:#FFF" class="left-pane">

      <div style="height: 100%;background: #FFF;padding: 20px;" ref="midEl">
        <div style="margin-bottom: 20px;">
          <BtnIcon @click="clickLeft" color="#000000" :quaternary="false">
            <Left />
          </BtnIcon>
          <BtnIcon color="#000000" :quaternary="false">
            <Right />
          </BtnIcon>
          <BtnIcon color="#000000" :quaternary="false">
            <Down />
          </BtnIcon>
          <BtnIcon color="#000000" :quaternary="false" @click="$refs.xTable.scrollToRow($refs.xTable.getData(400))">
            <Up />
          </BtnIcon>
        </div>
        <vxe-table ref="xTable" border show-overflow height="600" :row-config="{ isHover: true }" :data="data"
          :scroll-y="{ enabled: true, gt: 40 }">
          <vxe-column field="id" title="id" sortable></vxe-column>
          <vxe-column field="name" title="Name" sortable></vxe-column>
          <vxe-column field="role" title="Role"></vxe-column>
        </vxe-table>

        <!-- <vxe-list height="240" class="my-list" :loading="loading" :data="list" :scroll-y="{ enabled: true }">
          <template #default="{ items }">
            <table>
              <tbody>
                <tr class="my-tr" v-for="item in data" :key="item.id">
                  <td>{{ item.role }} - 列1</td>
                  <td>{{ item.des }} - 列2</td>
                  <td>{{ item.id }} - 列3</td>
                </tr>
              </tbody>
            </table>
          </template>
        </vxe-list> -->

      </div>
    </pane>
    <pane min-size="5" max-size="95" size="35" class="left-pane">
      <splitpanes :push-other-panes="false" :dbl-click-splitter="false">
        <pane style="background-color:#FFF" min-size="5" max-size="95" size="50">
          2
        </pane>
        <pane style="background-color:#FFF" min-size="5" max-size="95" size="50">
          3
        </pane>
      </splitpanes>
    </pane>
  </splitpanes>
</template>

<style lang="scss" scoped>
::v-deep.splitpanes.default-theme .splitpanes__splitter {
  background-color: #E9EAEC;
}
</style>