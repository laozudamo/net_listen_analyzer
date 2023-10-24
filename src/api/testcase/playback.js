import request from '@/utils/request'

// 待修改
function list (params) {
  return request({
    url: `case/playback/list?case_type=1`,
    method: 'get',
    params
  })
}

function create (data) {
  return request({
    url: `case/playback/create`,
    method: 'post',
    data
  })
}


function update (data) {
  return request({
    url: `case/playback/update`,
    method: 'post',
    data
  })
}

function del (data) {
  return request({
    url: 'case/playback/delete',
    method: 'put',
    data
  })
}

function copy (data) {
  return request({
    url: 'case/playback/copy',
    method: 'post',
    data
  })
}

function details (params) {
  return request({
    url: 'case/playback/details',
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
