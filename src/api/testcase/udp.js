import request from '@/utils/request'

function list (params) {
  return request({
    url: `case/udp/list?case_type=3`,
    method: 'get',
    params
  })
}

function create (data) {
  return request({
    url: `case/udp/create`,
    method: 'post',
    data
  })
}


function update (data) {
  return request({
    url: `case/udp/update`,
    method: 'put',
    data
  })
}

function del (data) {
  return request({
    url: 'case/udp/delete',
    method: 'put',
    data
  })
}

function copy (data) {
  return request({
    url: 'case/udp/copy',
    method: 'post',
    data
  })
}

function details (params) {
  return request({
    url: 'case/udp/details',
    method: 'get',
    params
  })
}



export {
  list,
  create,
  update,
  del,
  copy,
  details,
}
