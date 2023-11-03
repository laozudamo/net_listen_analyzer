import request from '@/utils/request'

export function getData (params, controller) {
  return request({
    url: '/pcap/list',
    method: 'get',
    params,
    signal: controller.signal
  })
}

export function getDetail (data, controller) {
  return request({
    url: '/pcap/pkt/details',
    method: 'post',
    data,
    signal: controller.signal
  })
}

export function pacpList (params) {
  return request({
    url: '/pcap/file/list',
    method: 'get',
    params
  })
}


export function filterList (params) {
  return request({
    url: '/pcap/display_filter',
    method: 'get',
    params
  })
}

export function expertInfo (params, controller) {
  return request({
    url: 'pcap/expert',
    method: 'get',
    params,
    signal: controller.signal
  })
}

export function sessionInfo (params) {
  return request({
    url: '/pcap/statistical_sonversations',
    method: 'get',
    params,
  })
}


export function endPointInfo (params) {
  return request({
    url: '/pcap/statistical_endpoints',
    method: 'get',
    params,
  })
}