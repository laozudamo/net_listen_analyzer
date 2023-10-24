import { list } from '@/api/template/fuzzy'
import { onMounted, ref } from 'vue'

function getFuzzy () {
  const fuzzyList = ref([])
  const fuzzyOptions = ref([])

  async function getList () {
    try {
      let params = {
        page: 1,
        pageSize: 1000
      }
      const { data } = await list(params)
      fuzzyList.value = data
      fuzzyOptions.value = data.map(item => {
        const theItem = {
          value: item.id,
          label: item.fuzz_name,
        }
        return theItem
      })
    
    } catch (error) {
      console.log(error);
    }
  }

  onMounted(async () => {
   await getList()
  })
  return {
    fuzzyList,
    fuzzyOptions
  }
}

export default getFuzzy