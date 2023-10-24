import request from '@/utils/request.js'

export function getInfo () {
  return request({
    url: 'devices/show_system_network_info',
    method: 'get'
  })
}