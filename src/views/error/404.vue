<script setup>
import { useRouter } from 'vue-router'

const router = useRouter()

function getback() {
  router.back()
}
</script>

<template>
  <main>
    <p>没有找到页面</p>
    <h1>404</h1>
    <button @click="getback">返回</button>
  </main>
</template>

<style lang="scss" scoped>
main {
  display: block;
  position: absolute;
  top: 200px;
  left: 0;
  right: 0;
  margin: auto;
  text-align: center;
  color: rgb(23, 67, 125);
}

main button {
  display: block;
  margin: auto;
  margin-top: 40px;
  outline: none;
  padding: 10px 25px;
  border: none;
  border-radius: 5px;
  background-color: rgba(80, 77, 77, 0.5);
  color: currentColor;
  text-transform: uppercase;
  font-weight: 600;
}

main h1 {
  display: block;
  position: relative;
  font-size: 200px;
  line-height: 1;
  margin: 0;
  font-family: "Bungee Shade", cursive;
}

h1 {
  display: block;
  font-size: 2em;
  margin-block-start: 0.67em;
  margin-block-end: 0.67em;
  margin-inline-start: 0px;
  margin-inline-end: 0px;
  font-weight: bold;
}
</style>