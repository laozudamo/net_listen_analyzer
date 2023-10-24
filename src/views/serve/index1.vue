<script setup>
import { Ethernet } from "@vicons/fa";
import { RefreshCircle } from "@vicons/ionicons5";
import { getPortInfo, acquicePort, releasePort as release } from '@/api/serve/port.js';
import { onMounted, ref } from "vue";

const options = [
   {
      label: "详情",
      key: "detail",
   }
]

const select = (key) => {
   console.log(key)
}

let cards = ref(null)
onMounted(() => {
   getPortInfo().then(res => {
      cards.value = res.data
   })
})

async function clickPort (item) {
   if(item.link == 'UP') {
      await releasePort(item.port)
   } else {
      await bindPort(item.port)
   }
}

async function bindPort (port) {
   let params = [port]
   const { data, code } = await acquicePort(params)
   console.log(data, code)
}

async function releasePort (port) {
   let params = [port]
   const { data, code } = await release(params)
}

</script>
<template>
   <div class="main">
      <div class="f-e">
         <base-icon :size="30">
            <RefreshCircle />
         </base-icon>
      </div>

      <n-card :title="card.slot_name" v-for="card in cards" :key="card.slot_name">
         <n-grid x-gap="12" :cols="10">
            <n-gi v-for="(item, index) in Object.values(card.ports_info)">
               <n-dropdown trigger="hover" :options="options" @select="select(index)">
                  <n-icon :color="item.owner === '' ? '#888' : '#0e7a0d'" size="45" @click="() => clickPort(item)">
                     <Ethernet />
                  </n-icon>
               </n-dropdown>
               <div>
                  PORT {{ index }}
               </div>
            </n-gi>
         </n-grid>
      </n-card>

   </div>
</template>

<style lang="scss" scoped></style>