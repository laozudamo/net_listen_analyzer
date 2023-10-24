<script setup>
import { ref, reactive, onMounted } from 'vue'
import { getUserPorts } from '@/components/hooks/allPort.js'
import { getPort, setPort, portTest, isRun, stopTest } from '@/api/setting/netCard.js'
import { createToaster } from "@meforma/vue-toaster";
const toaster = createToaster({ position: "top" });
const { userPortOptions } = getUserPorts()

async function getPortInfo () {
  let { data } = await getPort()
  return data
}

let portInfoList = ref([])

let timer = ref(null);
let ws = ref(null);
const token = localStorage.getItem("token");

const connect = () => {
  if (ws.value && timer.value) {
    clearTimeout(timer);
    timer.value = null;
    reconnect();
    return;
  }
  connecting();
};

function connecting () {
  ws.value = new WebSocket(`ws://${import.meta.env.VITE_BASE_API}/realtime/realtime`);
  ws.value.onopen = function () {
    ws.value.send(token);
    ws.value.send(
      JSON.stringify({
        "task_switch": "task_on"
      })
    );
  };

  ws.value.onmessage = function (e) {
    const data = e.data;
    dealWebSocketData(JSON.parse(data));
  };
}

function reconnect () {
  timer.value = setTimeout(() => {
    // 没连接上会一直重连，设置延迟避免请求过多
    console.log("重连" + new Date());
    connecting();
  }, 3000);
}

function unConnect () {
  if (ws.value !== null) {
    ws.value.send(
      JSON.stringify({
        "task_switch": "task_off"
      })
    );
    // timer.value = setTimeout(() => {
    ws.value.close();
    ws.value.onclose = function (event) {
      console.log(event);
      ws.value = null;
    };
    // }, 3000);
  }
}

function dealWebSocketData (value) {
  const { data } = value
}

// onMounted(() => {
//   connect()
// })
// onBeforeMount(() => {
//   unConnect()
// })



async function handleInfo () {
  let info = await getPortInfo()
  let list = info.map(item => {
    return item.ports_info.map(element => {
      return {
        label: "port" + element.port,
        value: element?.current_speed
      }
    })
  })
  portInfoList.value = list.flat(1)
}

onMounted(() => {
  handleInfo()
  checkRun()
})



const typeList = [
  {
    label: '10G',
    value: "10"
  },
  {
    label: '25G',
    value: "25"
  },
  {
    label: '40G',
    value: "40"
  },
  {
    label: '50G',
    value: "50"
  },
  {
    label: '100G',
    value: "100"
  }
]

let form = reactive({
  speed: '10G',
  ports: [],
})
const rateOptions = [
  {
    label: '最大发送速率',
    value: '100%'
  },
  {
    label: '最小发送速率',
    value: '5pps'
  },
]

const ruleFormRef = ref(null)
const rules = {
  portRule: [
    {
      required: true,
      message: "请选择端口,进行设置"
    }
  ],
  minRateRule: [
    {
      required: true,
      message: "请输入最小发送速率"
    }
  ],
  timeRule: [
    {
      required: true,
      message: "请输入测试时间"
    }
  ]
}
function submitForm () {

  setPort(form).then(res => {
    let { code, msg } = res
    if (code === 0) {
      toaster.success(msg)
      handleInfo()
    }
  }).catch(error => console.log(error))
}
let testForm = reactive({
  port: '',
  total_time: 20,
  rate: '5pps'
})

const testRate = async () => {
  const { msg, code } = await portTest(testForm)
  if (code === 0) {
    toaster.success(msg)
    checkRun()
  }
}

let isTest = ref(false)

async function checkRun () {
  try {
    let { data: { is_run } } = await isRun()
    if (is_run) {
      isTest.value = true

      setTimeout(() => {
        checkRun()
      }, 1000)
    } else {
      isTest.value = false
      return
    }
  } catch (error) {
    console.log(error)
  }
}

async function stopRun () {
  try {
    const { msg, code } = await stopTest()
    isTest.value = false
    if (code === 0) {
      toaster.success(msg)
    }

  } catch (error) {
    console.log(error)
  }
}

</script>

<template>
  <n-card title="业务网卡配置">
    <div class="the-card">
      <n-card class="setting-card" title="设置">
        <n-descriptions label-placement="top" :column="6">
          <n-descriptions-item v-for="item in portInfoList" :label="item.label" :key="item.label">
            {{ item.value }}
          </n-descriptions-item>
        </n-descriptions>

        <n-form class="the-form" :rules="rules" label-position="left" label-placement="left" label-width="80px"
          ref="ruleFormRef" :model="form" :show-require-mark="false">
          <n-form-item label="端口配置:">
            <div v-if="userPortOptions.length === 0" style="color: red;">请绑定端口</div>
            <n-checkbox-group v-model:value="form.ports">
              <n-space item-style="display: flex;">
                <n-checkbox :value="port.value" :label="port.label" v-for="port in userPortOptions" :key="port" />
              </n-space>
            </n-checkbox-group>
          </n-form-item>
          <n-form-item label="速率:">
            <n-radio-group v-model:value="form.speed" name="radiogroup">
              <n-space>
                <n-radio v-for="item in typeList" :key="item.value" :value="item.value">
                  {{ item.label }}
                </n-radio>
              </n-space>
            </n-radio-group>
          </n-form-item>
          <!-- <n-form-item label="最小发送速率(fps):">
            <n-input-number style="width:200px" v-model:value="form.min_rate" />
          </n-form-item> -->
          <!-- <n-form-item label="最大发送速率(fps):">
            <n-input v-model:value="form.max_rate" />
          </n-form-item> -->
          <!-- <n-form-item label="测试时间">
            <n-input-number style="width:200px" v-model:value="form.time" />
          </n-form-item> -->
          <n-form-item class="btn-wrap">
            <n-button type="primary" @click="submitForm">设置</n-button>
          </n-form-item>
        </n-form>
      </n-card>

      <n-card title='测试'>
        <div class="right-box">
          <div class="test-wrap">
            <n-input-group>
              <n-input-group-label> 端口</n-input-group-label>
              <n-select style="width: 150px" v-model:value="testForm.port" :options="userPortOptions" />
              <n-input-group-label> 速率</n-input-group-label>
              <n-select style="width: 150px" v-model:value="testForm.rate" :options="rateOptions" />
              <n-input-group-label> 测试时间:</n-input-group-label>
              <n-input-number style="width:100px" v-model:value="testForm.total_time" />
              <n-button type="primary" ghost @click="testRate" v-if="!isTest">
                测试
              </n-button>
              <n-button type="primary" ghost @click="stopRun" v-else>
                停止测试
              </n-button>
            </n-input-group>
          </div>
          <!-- <div>
            暂无端口信息
          </div> -->

          <!-- <div style="display: flex;padding-top: 30px;">
            <div>
              <n-statistic label="最小fps">
                1,234
              </n-statistic>
            </div>
            <RateEcharts class="the-chart" theType="速率" :value="30"> </RateEcharts>
          </div> -->
        </div>
      </n-card>
    </div>
  </n-card>
</template>

<style scoped lang="scss">
.the-form {
  margin-top: 20px;
}

.the-card {
  display: flex;

}

.test-wrap {
  display: flex;
  align-items: center;

  .port-des {
    width: 100px;
  }
}

.the-chart {
  margin-left: 60px;
}

.btn-wrap {
  display: flex;
  justify-content: flex-end;
}

.setting-card {
  width: 100%;
}
</style>
