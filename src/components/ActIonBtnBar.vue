<script setup>
import { onMounted, ref } from 'vue'
import { Add12Filled as Add, Delete16Filled as Delete, DocumentText24Filled as Detail, AirplaneTakeOff16Regular as Run } from "@vicons/fluent";

const props = defineProps({
  showAddbtn: {
    type: Boolean,
    default: true,
  },
})
const emit = defineEmits(['addData', 'DelData'])

function addData () {
  emit('addData')
}
function DelData () {
  emit('deleteData')
}

</script>

<template>
  <div class="action-btntool">
    <BtnIcon v-show="showAddbtn" class="add-btn" @click="addData" :quaternary="false" type="info" msg="增加" size="medium">
      <Add />
    </BtnIcon>
    <BtnIcon class="del-btn" @click="DelData" :quaternary="false" type="info" msg="删除" size="medium">
      <Delete />
    </BtnIcon>
  </div>
</template>

<style lang="scss" scoped>
.action-btntool {
  margin-left: 20px;
  display: flex;
}

.add-btn {
  background: linear-gradient(180deg, #29B2FF 0%, #2969FF 100%);
  border: none;
}

.del-btn {
  border: 1px solid #E9EAEC;
  background: linear-gradient(180deg, #29B2FF 0%, #2969FF 100%);
  border: none;
}
</style>