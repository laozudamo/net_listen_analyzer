<template>
  <div class="the-card-wrap" :style="{ width: width + 'px'}">
    <div class="the-title">{{title}}</div>
    <slot></slot>
  </div>
</template>

<script>
export default {
  props: {
    title: {
      required: true,
      type: String
    },
    width: {
      type: Number
    }
  }

}
</script>

<style lang="scss" scoped>
  .the-card-wrap {
    margin: 10px;
    position: relative;
    padding: 15px;
    border: 1px solid rgb(156, 154, 154);
  }
  .the-title {
    padding: 0px 8px;
    background-color: #fff;
    position: absolute;
    top: -10px;
    left: 10px;
  }
</style>