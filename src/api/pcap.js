import request from '@/utils/request'

export function getData () {
  return request({
      url: 'users/tshark_pcap',
      method: 'get'
  })
}

export function getDetail (data) {
  return request({
      url: 'users/tshark_pcap',
      method: 'post',
      data
  })
}