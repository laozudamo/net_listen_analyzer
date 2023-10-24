import request from '@/utils/request.js'

export function getPort () {
  return request({
    url: '/ports/ports',
    method: 'get'
  })
}

export function setPort (data) {
  return request({
    url: '/devices/set_nic_speed',
    method: 'post',
    data
  })
}

export function portTest (data) {
  return request({
    url: '/devices/trex_test',
    method: 'post',
    data
  })
}

// 检查运行中
export function isRun () {
  return request({
    url: 'devices/trex_test',
    method: 'get',
  })
}

export function stopTest () {
  return request({
    url: 'devices/stop_trex',
    method: 'get',
  })
}