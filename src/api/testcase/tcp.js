import request from '@/utils/request'

function list (params) {
  return request({
    url: `case/tcp/list?case_type=2`,
    method: 'get',
    params
  })
}

function create (data) {
  return request({
    url: `case/tcp/create`,
    method: 'post',
    data
  })
}


function update (data) {
  return request({
    url: `case/tcp/update`,
    method: 'put',
    data
  })
}

function del (data) {
  return request({
    url: 'case/tcp/delete',
    method: 'put',
    data
  })
}

function copy (data) {
  return request({
    url: 'case/tcp/copy',
    method: 'post',
    data
  })
}

function details (params) {
  return request({
    url: 'case/tcp/details',
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
