<script setup>
import { onBeforeMount, onBeforeUnmount, onMounted, reactive, ref, watch } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useStore } from 'vuex'
import { debounce } from '@/utils/tool.js';

const router = useRouter()
const store = useStore()

const form = reactive({
  username: 'admin',
  password: 'admin123456',
})

const rules = reactive({
  username: [{
    message: '请正确输入账号名',
    trigger: ['blur', 'change'],
    required: true
  }],
  password: [{ message: '请输入密码', trigger: 'blur', required: true }],
})

const ruleFormRef = ref(null)
const redirect = ref(undefined)
const route = useRoute()
const unWatch = watch(() => route, () => {
  const query = route.query
  if (query) {
    redirect.value = query.redirect
  }
}, { immediate: true })

const submitForm = debounce(() => {
  console.log('submit')
  router.push({ path: '/pcap' })
  // ruleFormRef.value?.validate((errors) => {
  //   if (!errors) {
  //     store.dispatch('user/LOGIN', form).then(() => {
  //       router.push({ path: redirect.value || '/' })
  //     })
  //   } else {
  //     console.log(errors);
  //   }
  // })
}, 400)

function handleKeyup (e) {
  e.code === 'Enter' && submitForm()
}

function addClickEventListener () {
  window.document.addEventListener('keyup', handleKeyup)
}
function removeClickEventListener () {
  window.document.removeEventListener('keyup', handleKeyup)
}

onMounted(() => {
  addClickEventListener()
})

onBeforeUnmount(() => {
  removeClickEventListener()
  unWatch()
})


</script>

<template>
  <div class="main">
    <n-grid :x-gap="12" :cols="4">
      <n-grid-item :offset="3">
        <n-form class="the-form" :rules="rules" label-position="left" label-width="80px" ref="ruleFormRef" :model="form"
          :show-require-mark="false" style="width: 350px; height: 320px;">
          <h3 class="login-title">
            <div></div>
            <div>
              网络监听分析仪
            </div>
          </h3>
          <n-form-item label="账号:" path="username">
            <n-input v-model:value="form.username" />
          </n-form-item>
          <n-form-item label="密码:" path="password">
            <n-input v-model:value="form.password" type="password" />
          </n-form-item>
          <n-form-item class="btn-wrap">
            <n-button type="primary" @click="submitForm">登 录</n-button>
          </n-form-item>
        </n-form>
      </n-grid-item>
    </n-grid>

  </div>
</template>

<style lang="scss" scoped>
.main {
  background: #143259 url(../../assets/img/bg1.png) no-repeat center center;
  display: flex;
  justify-content: flex-end;
  align-items: center;
  background-size: 100% 100%;
}

.the-form {
  background-color: #fff;
  padding: 32px;
  border-radius: 10px;
}

.login-title {
  display: flex;
  justify-content: center;
}

.the-footer {
  position: absolute;
  left: 50%;
  bottom: 2px;
  transform: translateX(-50%);
  color: #fff;
  font-size: 16px;

}

.n-button {
  width: 100%;
}
</style>