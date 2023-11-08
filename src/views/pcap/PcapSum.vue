<script setup>
import { ref, onMounted } from 'vue'
import { IoStatInfo, IoPhsInfo } from '@/api/pcap.js'
import localforage from 'localforage'

const myIndexedDB = localforage.createInstance({
  name: 'myIndexedDB',
})

const props = defineProps({
  query: {
    type: Object,
    required: true
  }
})

let content = ref(null)

const tabList = ref([
  {
    label: "分析包量和字节大小",
    key: '0',
    content: ""
  },
  {
    label: "层次结构及包量",
    key: '1',
    content: ""
  },
])

let loading = ref(false)

async function getAllData () {
  const value = await myIndexedDB.getItem('pcapSum');

  if (value) {
    tabList.value = JSON.parse(value)
    content.value = tabList.value[0].content
    return
  }

  loading.value = true

  // for (const item of tabList.value) {
  //   await getInfo(item, item.key)
  // }

  await handleData()
  content.value = tabList.value[0].content

  loading.value = false
  myIndexedDB.setItem("pcapSum", JSON.stringify(tabList.value))
}


async function handleData () {
  loading.value = true
  const promises = []
  tabList.value.forEach((item, i) => {
    let j = getInfo(item, item.key)
    promises.push(j)
  })
  await Promise.allSettled(promises)
  loading.value = false
}

async function getInfo (item, i) {
  if (i == 0) {
    await getStatInfo(item)
  } else {
    await getPhsInfo(item)
  }

}

async function getStatInfo (item) {
  try {
    let params = {
      io_type: "phs",
      ...props.query
    }
    let { data } = await IoStatInfo(params)
    item.content = data

  } catch (error) {
    console.log(error)
  }
}


async function getPhsInfo (item) {
  try {
    let params = {
      interval: "phs",
      ...props.query
    }
    let { data } = await IoPhsInfo(params)
    item.content = data

  } catch (error) {
    console.log(error)
  }
}

function changeTab (i) {
  content.value = tabList.value[i].content
}

onMounted(() => {
  getAllData()
})

</script>

<template>
  <n-tabs @update:value="changeTab" size="small" type="line" default-value="0">
    <n-tab-pane v-for="(tab, i) in tabList" :name="tab.key" :tab="tab.label">

      <n-spin :show="loading">
        <template #description>
          加载中···
        </template>
        <div v-if="!content || content.length === 0"
          style="height: 100vh;white-space: pre-wrap;padding: 20px;margin-left: 20px;">
          暂无数据
        </div>
        <div v-else style="height: 100vh;white-space: pre-wrap;padding: 20px;margin-left: 20px;">
          {{ content }}
        </div>
      </n-spin>

    </n-tab-pane>
  </n-tabs>
</template>

<style lang="scss" scoped></style>