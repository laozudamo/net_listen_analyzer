import request from '@/utils/request.js'

export function list(params) {
  return request({
      url: '/network_config/list',
      method: 'get',
      params
  })
}

export function details(params){
  return request({
      url:'network_config/details',
      method:"get",
      params
  })
}

export function create(data){
  return request({
      url:'network_config/create',
      method:"post",
      data
  })
}

export function del(data){
  return request({
      url:'network_config/delete',
      method:'put',
      data
  })
}

export function update(data){
  return request({
      url:'network_config/update',
      method:'put',
      data
  })
}

export function copy(data){
  return request({
      url:'network_config/copy',
      method:'post',
      data
  })
}

export function search(params){
  return request({
      url:'network_config/search',
      method:'get',
      params
  })
}