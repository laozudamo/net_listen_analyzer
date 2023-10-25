<script setup>

</script>

<template>
  <div style="padding: 30px;">
    <video width="200" height="240" controls v-for="(item, i) in 30" :key="i">
      <source src="http://www.w3school.com.cn/example/html5/mov_bbb.mp4" type="video/mp4">
      您的浏览器不支持Video标签。
    </video>
  </div>
</template>

<style lang="scss" scoped></style>
