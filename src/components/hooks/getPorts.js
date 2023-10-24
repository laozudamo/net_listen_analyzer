import { ref, onMounted, onUnmounted, reactive } from 'vue'
import { userPort } from '@/api/serve/port.js'

export function getUserPorts () {
  const userPortOptions = ref([])

  onMounted(async () => {
    const { data } = await userPort()
    userPortOptions.value = data.map(item => {
      return {
        label: "PORT" + item,
        value: item
      }
    })
  })
  return {
    userPortOptions
  }
}
