<script setup>
import { ref, onMounted } from 'vue'
import { httpInfo } from '@/api/pcap.js'
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
    label: "状态",
    value: "http",
    type: 'stat',
    key: "0",
    content: ""
  },
  {
    label: "树状态",
    value: "http",
    type: 'tree',
    key: "1",
    content: ""
  },
  {
    label: "URI请求路径",
    value: "http_req",
    type: 'tree',
    key: "2",
    content: ""
  },
  {
    label: "请求URL",
    value: "http_seq",
    type: 'tree',
    key: "3",
    content: ""
  },
  {
    label: "请求和响应",
    value: "http_srv",
    type: "tree",
    key: "4",
    content: ""
  },
])

let loading = ref(false)

async function getInfo (item) {
  try {
    let params = {
      protocol: item.value,
      statistical_type: item.type,
      ...props.query
    }
    let { data } = await httpInfo(params)
    item.content = data

  } catch (error) {
    loading.value = false
    console.log(error)
  }
}

async function getAllData () {
  const value = await myIndexedDB.getItem('pcapHttp');

  if (value) {
    tabList.value = JSON.parse(value)
    content.value = tabList.value[0].content
    return
  }

  // for (const item of tabList.value) {
  //   await getInfo(item, item.key)
  // }

  await handleData()

  content.value = tabList.value[0].content

  loading.value = false
  myIndexedDB.setItem("pcapHttp", JSON.stringify(tabList.value))
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