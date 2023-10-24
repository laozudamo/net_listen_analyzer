import request from '@/utils/request'

// 待修改
function list (params) {
  return request({
    url: `case/ipv6/list?case_type=6`,
    method: 'get',
    params
  })
}

function create (data) {
  return request({
    url: `case/icmp/create`,
    method: 'post',
    data
  })
}


function update (data) {
  return request({
    url: `case/icmp/update`,
    method: 'put',
    data
  })
}

function del (data) {
  return request({
    url: 'case/icmp/delete',
    method: 'put',
    data
  })
}

function copy (data) {
  return request({
    url: 'case/icmp/copy',
    method: 'post',
    data
  })
}

function details (params) {
  return request({
    url: 'case/icmp/details',
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
