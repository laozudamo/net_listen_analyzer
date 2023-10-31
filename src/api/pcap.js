import request from '@/utils/request'

export function getData (params, controller) {
  return request({
    url: 'users/tshark_pcap',
    method: 'get',
    params,
    signal: controller.signal
  })
}

export function getDetail (data, controller) {
  return request({
    url: 'users/tshark_pcap',
    method: 'post',
    data,
    signal: controller.signal
  })
}

export function pacpList () {
  return request({
    url: 'users/pcap/list',
    method: 'get',
  })
}


export function filterList (data) {
  return request({
    url: 'users/pcap/display_filter',
    method: 'post',
    data
  })
}

export function expertInfo (params, controller) {
  return request({
    url: 'users/expert',
    method: 'get',
    params,
    signal: controller.signal
  })
}