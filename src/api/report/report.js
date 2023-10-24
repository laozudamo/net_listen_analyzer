import request from '@/utils/request.js'
import downLoadReq from '@/utils/downLoadReq.js'

export function list (params) {
  return request({
    url: 'reports/list',
    method: 'get',
    params
  })
}

export function copy (data) {
  return request({
    url: 'reports/list_copy',
    method: 'post',
    data
  })
}

export function del (data) {
  return request({
    url: 'reports/delete',
    method: 'delete',
    data
  })
}

export function reportDownload(data) {
  return downLoadReq({
    url: `/reports/download`,
    method: 'post',
    responseType: 'arraybuffer',
    data
  })
}

export function pcapDownLoad(data) {
  return downLoadReq({
    url: `reports/pcap/download`,
    method: 'post',
    responseType: 'arraybuffer',
    data
  })
}
