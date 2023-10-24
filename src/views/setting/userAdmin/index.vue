<script setup lang="jsx">
import { reactive, onMounted, ref, computed } from 'vue';
import { Delete20Regular, Add12Filled, Edit16Filled, Checkmark12Filled } from '@vicons/fluent'
import { DotMark } from '@vicons/carbon'
import { getAllUsers, addUser, deleteUser, editUser, deableUser } from '@/api/setting/userAdmin'
import { useMessage } from 'naive-ui'
import { useStore } from 'vuex';
const store = useStore();
const message = useMessage()
const theDom = ref(null)
const data = reactive({
  tableData: [],
  columns: []
})

let role = computed(() => store.getters.role)
onMounted(
  () => getlist()
)

const getlist = async () => {
  let res = await getAllUsers()
  let { trex_obj_flag } = res
  getColumns()
  handleColumns(trex_obj_flag)
  data.tableData = res.data
}

const columnsAdmin = [
  {
    title: '用户账号',
    key: 'username'
  },
  {
    title: '用户ID',
    key: 'id'
  },
  {
    title: '用户角色',
    key: 'role',
    render: (row) => {
      return row.role.includes('0') ? '管理员' : '普通用户'
    }
  },
  {
    title: '上次登录',
    key: 'last_login_time',
    width: "200px"
  },
  {
    title: '登录状态',
    key: 'on_line',
    render: (row) => {
      return row.on_line ? 
      <div style={{display:'flex', alignItems: 'center'}}>
        <n-icon size="16" color="#0CAF60">
          <DotMark />
        </n-icon>
        <div>
          在线
        </div>
      </div>
      : 
      <div style={{display:'flex', alignItems: 'center'}}>
        <n-icon size="16" color="#FF5E63">
          <DotMark />
        </n-icon>
        <div>
          离线
        </div>
      </div>
    }
  },
  {
    title: '是否禁用',
    key: 'is_delete',
    render: (row) => {
      return <n-switch size="large" v-model:value={row.is_delete} onUpdate:value={(v) => handleChange(row, v)} >
        {{
          "checked-icon": () =>  <n-icon> <Checkmark12Filled /></n-icon>
        }}
      </n-switch>
    }
  },
  {
    title: '修改密码',
    render: (row, index) => <div>
      <n-button size="small" class="action-btn" quaternary={true} onClick={() => editData(row)}>
        修改密码
      </n-button>
      
    </div>
  },
  {
    title: '操作',
    render: (row, index) => <div >
      <n-button size="medium" quaternary type="error">
        <n-icon size="20" onClick={() => deleteData(row, index)} >
          <Delete20Regular />
        </n-icon>
      </n-button>
    </div>
  },
]

const columnsUser = [
  {
    title: '账号',
    key: 'username'
  },
  {
    title: 'ID',
    key: 'id'
  },

  {
    title: '上次登录',
    key: 'last_login_time'
  },
  {
    title: '登录状态',
    key: 'on_line',
    render: (row) => {
      return row.on_line ? 
      <div style={{display:'flex', alignItems: 'center'}}>
        <n-icon size="16" color="#0CAF60">
          <DotMark />
        </n-icon>
        <div>
          在线
        </div>
      </div>
      : 
      <div style={{display:'flex', alignItems: 'center'}}>
        <n-icon size="16" color="#FF5E63">
          <DotMark />
        </n-icon>
        <div>
          离线
        </div>
      </div>
    }
  },
]

const getColumns = () => {
  if (role.value.includes('0')) {
    data.columns = columnsAdmin
  } else {
    data.columns = columnsUser
  }
}

const handleColumns = (trex_obj_flag) => {
  if (trex_obj_flag) {
    data.columns.splice(5, 1, {
      title: '端口占用',
      key: 'occupy_ports',
    })
  }
}

const form = reactive({
  username: '',
  password: '',
  checkPwd: '',
  description: '',
  role: '1'
})

function handTip (res) {
  if (res.code === 0) {
    message.success(res.msg)
  }
  getlist()
}

let isAddUser = ref(true)

const editData = (row) => {
  isAddUser.value = false
  Object.assign(form, row)
  form.role = row.role.toString()
  theDom.value.show()
}
const deleteData = (row, index) => {
  let params = {
    user_id: row.id
  }
  deleteUser(params).then((res) => {
    handTip(res)
  })
}

const addNewUser = () => {
  theDom.value.show()
}

const rules = reactive({
  username: [{
    message: '请输入账号名',
    trigger: ['blur', 'change'],
    required: true
  }],

  password: [
    { message: '请输入密码', trigger: 'blur', required: true },
    { message: '最少输入6位密码', trigger: 'blur', min: 6 },
    { message: '最多输入20位密码', trigger: 'blur', max: 20 },
    {
      message: '密码只能包含数字、字母、_及-',
      trigger: 'blur',
      validator: (rule, value, callback) => {
        if (/^[a-zA-Z0-9_-]{5,20}$/.test(value)) {
          callback()
        } else {
          callback(new Error('密码只能包含数字、字母、_及-'))
        }
      }
    }

  ],
  checkPwd: [{
    message: '请确认密码',
    trigger: ['blur', 'change'],
    required: true
  },
  {
    message: '两次密码不一致',
    trigger: 'blur',
    validator: (rule, value, callback) => {
      if (value === form.password) {
        callback()
      } else {
        callback(new Error('两次密码不一致'))
      }
    }
  }
  ],
})

const ruleFormRef = ref(null)

const rolesOption = [

  {
    label: '普通用户',
    value: '1'
  },
  {
    label: '管理员',
    value: '0'
  }
]

const reset = () => {
  for (let [key, v] of Object.entries(form)) {
    form[key] = ''
    if (key === "role") {
      form["role"] = '1'
    }
  }
  isAddUser.value = true
}
const afterLeave = () => {
  // 表单重置
  reset()
}

const submit = () => {
  ruleFormRef.value?.validate((errors) => {
    if (!errors) {
      // 提交表单
      if (isAddUser.value) {
        form.role = [form.role]
        addUser(form).then((res) => {
          handTip(res)
        })
      } else {
        let data = {
          user_id: form.id,
          password: form.password,
          role: [form.role],
        }
        editUser(data).then((res) => {
          handTip(res)
        })
      }
      theDom.value.close()
    } else {
      console.log('验证失败')
    }
  })
}

const handleChange = (row, v) => {
  let data = {
    user_id: row.id,
    is_delete: v
  }
  deableUser(data).then((res) => {
    handTip(res)
  })
}

</script>

<template>
  <Title title="用户管理" />
  <div style="padding-top: 20px; padding-left: 20px;">
    <BtnIcon v-permission='role' size="medium" type="primary" msg="新增用户" :quaternary="false" @click="addNewUser">
      <Add12Filled />
    </BtnIcon>
  </div>
  <n-data-table style="padding: 20px;" :key="(row) => row.id" max-height="calc(100vh - 300px)" :columns="data.columns"
    :data="data.tableData" :border="false" :single-line="true" />
  <TheModel ref="theDom" :title="isAddUser ? '新增用户' : '修改密码'" width="400px" height="280px" @afterLeave="afterLeave"
    :showConfirm="false">
    <n-form :rules="rules" label-align="left" label-placement="left" label-width="80px" ref="ruleFormRef" :model="form"
      :show-require-mark="false" style="width: 100%;">
      <n-form-item label="账号:" path="username">
        <n-input v-model:value="form.username" :disabled="!isAddUser" />
      </n-form-item>
      <n-form-item label="密码:" path="password">
        <n-input v-model:value="form.password" type="password" />
      </n-form-item>
      <n-form-item label="确认密码:" path="checkPwd">
        <n-input v-model:value="form.checkPwd" type="password" />
      </n-form-item>
      <!-- <n-form-item label="用户角色:">
        <n-select v-model:value="form.role" :options="rolesOption" :disabled="false" />
      </n-form-item> -->
      <!-- <n-form-item label="用户描述:">
        <n-input v-model:value="form.description" type="textarea" :maxlength="50" :show-count="true" :rows="2"
          :disabled="!isAddUser" />
      </n-form-item> -->
      <div class="footer-btn-wrap">
        <n-button type="primary" @click="submit('ruleFormRef')">
          提 交
        </n-button>
      </div>
    </n-form>
  </TheModel>
</template>

<style lang="scss" scoped>
.footer-btn-wrap {
  display: flex;
  justify-content: flex-end;
}

.n-data-table .n-data-table-table {
  border: 1px solid #888 !important;
}

:deep(.action-btn) {
  color: #2969FF;
  font-size: 12px;
}
</style>