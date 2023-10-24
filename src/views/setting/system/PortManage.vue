<script setup>
import { onMounted, ref } from 'vue';
import { getInfo } from '@/api/setting/portMange.js'

let info = ref({})

async function getPortInfo () {
  let { data } = await getInfo()
  info.value = data
}

onMounted(() => {
  getPortInfo()
});

function checkNull (type) {
  let v = Object.prototype.toString.call(type)
  if (v === `[object Null]`) {
    return true
  } else {
    return false
  }
}

</script>

<template>
  <Title title="管理网口" />
  <div class="the-content">
    <div v-for="(item, index) in Object.keys(info)" :key="item">
      <h3>网口: {{ item }}</h3>
      <div class="the-item" v-for="ele in info[item]">
        <div class="label">
          {{ ele[0] }}
        </div>
        <div class="the-value">
          <div v-for="(v, i) in ele">
            <n-tag class="tag" v-if="i > 0 && !checkNull(v)">{{ v }}</n-tag>
          </div>
        </div>
      </div>

    </div>
  </div>
</template>

<style lang="scss" scoped>
.the-content {
  padding: 0px 20px;
}

.the-item {
  display: flex;

  .label {
    padding-left: 10px;
    width: 200px;
    height: 60px;
    line-height: 60px;
    border: 1px solid #F1F2F4;
  }

  .the-value {
    width: 500px;
    height: 60px;
    display: flex;
    line-height: 60px;
    border: 1px solid #F1F2F4;
    overflow-y: auto;
    overflow: hidden;

    .tag {
      margin-left: 10px;
    }
  }
}
</style>