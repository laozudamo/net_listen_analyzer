<script setup>
import { Add12Filled as Add, Delete16Filled as Delete, DocumentText24Filled as Detail, AirplaneTakeOff16Regular as Run } from "@vicons/fluent";
import { onMounted, ref } from 'vue'

const emit = defineEmits(['addData', 'DelData'])

const props = defineProps({
  title: {
    type: String,
    default: "默认Title",
  },
  des: {
    type: String,
    default: "",
  },
});


function addData () {
  emit('addData')
}
function DelData () {
  emit('deleteData')
}

</script>

<template>
  <div class="the-header">
    <div>
      <div class="the-title">{{ title }}</div>
      <div class="des">{{ des }}</div>
    </div>

    <div>
      <BtnIcon class="add-btn" color="#2969FF" @click="addData" :quaternary="false" type="tertiary" msg="增加"
        size="medium">
        <Add />
      </BtnIcon>
      <BtnIcon class="del-btn" color="#2969FF" @click="DelData" :quaternary="false" type="tertiary" msg="删除"
        size="medium">
        <Delete />
      </BtnIcon>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.the-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;

  .des {
    margin-top: 8px;
    color: #687588;
  }
}

.add-btn {
  border: 1px solid #E9EAEC;
  color: #2969FF;
}

.del-btn {
  border: 1px solid #E9EAEC;
  color: #2969FF;
}

.the-title {
  position: relative;
  padding-left: 12px;
  // height: 44px;
  font-weight: 500;
  font-size: 20px;

  &::before {
    position: absolute;
    content: '';
    display: inline-block;
    top: 5px;
    left: 2px;
    width: 4px;
    height: 20px;
    background-color: #2969FF;
    margin-right: 10px;
  }
}
</style>