import request from '@/utils/request'

// 待修改
function list (params) {
  return request({
    url: `case/arp/list?case_type=7`,
    method: 'get',
    params
  })
}

function create (data) {
  return request({
    url: `case/arp/create`,
    method: 'post',
    data
  })
}


function update (data) {
  return request({
    url: `case/arp/update`,
    method: 'put',
    data
  })
}

function del (data) {
  return request({
    url: 'case/arp/delete',
    method: 'put',
    data
  })
}

function copy (data) {
  return request({
    url: 'case/arp/copy',
    method: 'post',
    data
  })
}

function details (params) {
  return request({
    url: 'case/arp/details',
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
