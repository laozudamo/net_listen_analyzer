import { getTopologyList, getDetalis } from '@/api/configuration'
import { onMounted, ref } from 'vue'

function getTopo (id) {
  const topoList = ref([])
  const topOptions = ref([])

  async function getList () {
    try {
      let params = {
        page: 1,
        page_size: 1000
      }
      const { data } = await getTopologyList(params)
      topoList.value = data
      topOptions.value = data.map(item => {
        const theItem = {
          value: item.id,
          label: item.network_name,
        }
        return theItem
      })

    } catch (error) {
      console.log(error);
    }
  }

  function toPodetail (id) {
    return new Promise(async (resolve, reject) => {
      try {
        const params = {
          id: id
        }
        const { data, msg } = await getDetalis(params)
        const { client_config, server_config } = data
        const topoData = { client_config, server_config }
        resolve(topoData)
      } catch (error) {
        console.log(error)
        reject(error)
      }
    })
  }

  onMounted(() => {
    getList()
  })
  return {
    topoList,
    topOptions,
    toPodetail
  }
}

export default getTopo