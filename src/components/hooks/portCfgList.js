import { list } from '@/api/template/certificate'
import { onMounted, ref } from 'vue'

function portcfgList () {
  const licenceList = ref([])
  const portOptions = ref([])

  async function getList () {
    try {
      let params = {
        page: 1,
        page_size: 1000
      }
      const { data } = await list(params)
      licenceList.value = data
      portOptions.value = data.map(item => {
        const theItem = {
          value: item.id,
          label: item.file_name,
        }
        return theItem
      })

    } catch (error) {
      console.log(error);
    }
  }


  onMounted(() => {
    getList()
  })
  return {
    licenceList,
    portOptions,
  }
}

export default portcfgList