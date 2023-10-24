<script setup>
import { ref, computed } from 'vue'
import { Splitpanes, Pane } from 'splitpanes'
import { useElementSize } from '@vueuse/core'
import 'splitpanes/dist/splitpanes.css'

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

// let height = computed(() => {
//   return midElementSize.height.value.toFixed(0) + 10
// })


const data = Array.from({ length: 300000 }).map((_, index) => ({
  id: index,
  name: `Edward King ${index}`,
  role: 32,
  role: `London, Park Lane no. ${index}`
}));

</script>

<template>
  <splitpanes horizontal class="default-theme" :dbl-click-splitter="false">
    <pane style="background-color:#FFF" class="left-pane">
      <div style="height: 100%;background: #FFF;padding: 20px;" ref="midEl">
        <vxe-table border show-overflow height="600" :row-config="{ isHover: true }" :data="data"
          :scroll-y="{ enabled: true, gt: 40 }">
          <vxe-column field="id" title="id" sortable></vxe-column>
          <vxe-column field="name" title="Name" sortable></vxe-column>
          <vxe-column field="role" title="Role"></vxe-column>
          <vxe-column field="sex" title="Sex"></vxe-column>
        </vxe-table>
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