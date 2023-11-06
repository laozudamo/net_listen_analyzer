<script setup>
import { ref } from 'vue'
import { start, stop, getInfo } from '@/api/playBack.js'

import {
  BookOutline as BookIcon,
  ReaderOutline,
  CaretForwardCircleOutline,
  PauseCircleOutline,
} from "@vicons/ionicons5";

const IsPlay = ref(false)

function startPlayBack () {
  let params = {
    "file_name": "sss.pcap"
  }
  start(params).then(res => {
    console.log(res)
    IsPlay.value = true
  }).catch(err => {
    console.log(err)
    IsPlay.value = false
  })

}
function stopPlayBack () {
  let params = {
    "file_name": "sss.pcap"
  }
  stop(params).then(res => {
    console.log(res)
    IsPlay.value = false
  }).catch(err => {
    console.log(err)
    IsPlay.value = false
  })

}


</script>

<template>
  <div class="bg">
    <header>
      <BtnIcon color="#396CFC" @click="startPlayBack"  msg="开始" v-if="!IsPlay">
        <CaretForwardCircleOutline />
      </BtnIcon>
      <BtnIcon color="#C6252C" msg="结束" @click="stopPlayBack"   v-else>
        <PauseCircleOutline />
      </BtnIcon>
    </header>
    <div class="the-status">
      状态
    </div>
  </div>
</template>

<style lang="scss" scoped>
.bg {
  margin: 20px 20px 0 20px;
  padding: 10px;
  border-radius: 15px;
  background: #FFFFFF;
  height: calc(100vh - 84px);
  overflow: hidden;
  overflow-y: auto;
}

.the-status {
  margin-top: 10px;
}
</style>