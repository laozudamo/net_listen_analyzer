import request from '@/utils/request'

// 待修改
function list (params) {
  return request({
    url: `streams/list?case_type=9`,
    method: 'get',
    params
  })
}

function create (data) {
  return request({
    url: `streams/create`,
    method: 'post',
    data
  })
}


function update (data) {
  return request({
    url: `streams/update`,
    method: 'put',
    data
  })
}

function del (data) {
  return request({
    url: 'streams/delete',
    method: 'put',
    data
  })
}

function copy (data) {
  return request({
    url: 'case/ipv4/copy',
    method: 'post',
    data
  })
}

function details (params) {
  return request({
    url: 'case/ipv4/details',
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
