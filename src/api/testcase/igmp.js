import request from '@/utils/request'

function listv1 (params) {
  return request({
    url: `case/igmp/list?case_type=5&protocol_server_type=igmp_v1`,
    method: 'get',
    params
  })
}
function listv2 (params) {
  return request({
    url: `case/igmp/list?case_type=5&protocol_server_type=igmp_v2`,
    method: 'get',
    params
  })
}
function listv3 (params) {
  return request({
    url: `case/igmp/list?case_type=5&protocol_server_type=igmp_v3`,
    method: 'get',
    params
  })
}

function create (data) {
  return request({
    url: `case/igmp/create`,
    method: 'post',
    data
  })
}


function update (data) {
  return request({
    url: `case/igmp/update`,
    method: 'put',
    data
  })
}

function del (data) {
  return request({
    url: 'case/igmp/delete',
    method: 'put',
    data
  })
}

function copy (data) {
  return request({
    url: 'case/igmp/copy',
    method: 'post',
    data
  })
}

function details (params) {
  return request({
    url: 'case/igmp/details',
    method: 'get',
    params
  })
}



export {
  // list,
  create,
  update,
  del,
  copy,
  details,
  listv1,
  listv2,
  listv3
}
