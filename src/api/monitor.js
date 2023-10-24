import request from '@/utils/request'

export function portInfo () {
  return request({
      url: 'real_data/ports_stats',
      method: 'get'
  })
}

export function taskInfo () {
  return request({
      url: 'real_data/task_stats',
      method: 'get'
  })
}

export function taskDetail (params) {
  return request({
      url: 'real_data/cases_stats',
      method: 'get',
      params
  })
}

export function cpuInfo() {
  return request({
      url: 'devices/show_system_info',
      method: 'get'
  })
}
