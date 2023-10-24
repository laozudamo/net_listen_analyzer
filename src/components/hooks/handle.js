
import { ref, onMounted, onUnmounted, reactive } from 'vue'

import { runTask } from '@/api/task.js'
import { useRouter } from 'vue-router'
import { debounce } from '@/utils/tool.js'
import { createToaster } from "@meforma/vue-toaster";
const toaster = createToaster({ type: 'error', position: 'top', duration: 1000 });
const ok = createToaster({ type: 'success', position: 'top', duration: 3000 });

function useCommon ({ list, create, update, del, copy, details, resetFormVal, setFormVal, isHandForm = false, handForm }) {
  const router = useRouter()
  let dataSource = ref([])
  let checkArr = ref([])
  let isEdit = ref(false)
  let key = ref(0)

  const pagination = reactive({
    pageSize: 10,
    page: 1,
    pageCount: 0,
    pageSizes: [5, 10, 20, 50],
    onUpdatePage: (page, filterForm) => {
      console.log(page,filterForm);
      pagination.page = page
      if (filterForm?.attack_classes) {
        if (filterForm.case_name === '' && !filterForm.time && !filterForm?.attack_classes) {
          getList()
        } else {
          filterData(filterForm, page)
        }
      } else {
        if (filterForm.case_name === '' && !filterForm.time) {
          getList()
        } else {
          filterData(filterForm, page)
        }
        
      }
    },

    onUpdatePageSize: (pageSize, filterForm) => {
      console.log(filterForm);
      pagination.pageSize = pageSize;
      pagination.page = 1;
      // if (filterForm.case_name === '' && !filterForm.time) {
      //   getList()
      // } else {
      //   filterData(filterForm)
      // }
      if (filterForm?.attack_classes) {
        if (filterForm.case_name === '' && !filterForm.time && !filterForm?.attack_classes) {
          getList()
        } else {
          filterData(filterForm, pagination.page)
        }
      } else {
        if (filterForm.case_name === '' && !filterForm.time) {
          getList()
        } else {
          filterData(filterForm, pagination.page)
        }
      }
    }
  })

  const afterLeave = () => {
    resetFormVal()
    isEdit.value = false
  }

  const addData = (model) => {
    model.show()
  }

  const confirm = async (model, theForm, netCfgData, capture) => {
    if (isEdit.value) {
      try {
        if (!isHandForm) {
          const { code, msg } = await update(theForm)
          if (code === 0) {
            model.close()
            ok.show(msg)
            getList()
          }
        } else {
          const { code, msg } = await update(handForm(theForm, netCfgData, capture))
          if (code === 0) {
            model.close()
            ok.show(msg)
            getList()
          }
        }
      } catch (error) {
        console.log(error);
      }
    } else {
      // 新增
      if (isHandForm) {
        try {
          const { code, msg } = await create(handForm(theForm, netCfgData, capture))
          if (code === 0) {
            model.close()
            ok.show(msg)
            getList()
          }
        } catch (error) {
          console.log(error);
        }
      } else {
        try {
          const { code, msg } = await create(theForm)
          if (code === 0) {
            model.close()
            ok.show(msg)
            getList()
          }
        } catch (error) {
          console.log(error);
        }
      }
    }
  }



  const getList = async () => {

    let params = {
      page_size: pagination.pageSize,
      page: pagination.page
    }
    try {
      const { data, count, page_num } = await list(params)
      dataSource.value = data
      pagination.pageCount = page_num
    } catch (error) {
      console.log(error);
    }
  }

  const refresh = debounce((show) => {
    getList()
    // 刷新界面取消勾选
    checkArr.value = []
    // 出现多消息的限制，主要体现在任务界面
    if (!show) {
      ok.show('刷新成功')
    }
  })

  const filterData = async (form, index = 1) => {
    console.log(form, 'filterData')

    pagination.page = index
    let params = {
      page_size: pagination.pageSize,
      page: pagination.page,
      search_data: form.search_data,
      time: JSON.stringify(form.time)
    }

    try {
      const { data, count, page_num } = await list(params)
      dataSource.value = data
      pagination.pageCount = page_num
    } catch (error) {
      console.log(error);
    }
  }

  const delData = debounce(async () => {
    if (checkArr.value.length === 0) {
      toaster.show('请选择删除的数据')
      return
    }

    try {
      let data = {
        ids: checkArr.value
      }
      const { msg, code } = await del(data)
      if (code === 0) {
        ok.show(msg)
        await getList()
      }
      key.value++

    } catch (error) {
      console.log(error);
    }
  })

  const getDetail = async (model, id) => {
    console.log('详情')
  }

  const copyData = debounce(async (row) => {
    try {
      let params = {
        id: row.id
      }
      const { msg, code } = await copy(params)
      if (code === 0) {
        ok.show(msg)
        getList()
      }
    } catch (error) {
      console.log(error);
    }
  })

  const editData = async (model, id) => {
    isEdit.value = true
    model.value.show()
    try {
      let params = {
        id: id,
      }
      const { data, code } = await details(params)
      if (code !== 0) return

      setFormVal(data)
    } catch (error) {
      console.log(error);
    }
  }

  const updateCheckVal = (keys) => {
    checkArr.value = keys
  }

  const rowKey = (row) => row.id

  onMounted(() => {
    getList()
  })

  function runCase (id) {
    let params = {
      case_ids: [id]
    }
    runTask(params).then(res => {
      if (res.code === 0) {
        router.push({
          path: "/monitor"
        })
      }
    }).catch(error => {
      console.log(error)
    })
  }

  return {
    dataSource,
    pagination,
    isEdit,
    key,
    refresh,
    delData,
    copyData,
    checkArr,
    confirm,
    getDetail,
    afterLeave,
    addData,
    editData,
    rowKey,
    updateCheckVal,
    filterData,
    runCase
  }
}

export default useCommon


