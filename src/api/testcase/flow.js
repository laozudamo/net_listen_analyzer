import request from '@/utils/request'

// 待修改
function list (json_file_name) {
  return request({
    url: `streams/details?json_file_name=${json_file_name}`,
    method: 'get',
  })
}

function create (data) {
  return request({
    url: `streams/add_stream`,
    method: 'post',
    data
  })
}


function update (data) {
  return request({
    url: `streams/update_stream`,
    method: 'put',
    data
  })
}

function del (data) {
  return request({
    url: 'streams/delete_stream',
    method: 'put',
    data
  })
}

function copy (data) {
  return request({
    url: 'streams/stream_copy',
    method: 'post',
    data
  })
}

function details (data) {
  return request({
    url: 'streams/query_streams',
    method: 'post',
    data
  })
}

function getNext (name) {
  return request({
    url: 'streams/get_payload_classes',
    method: 'post',
    data: {
      protocol_name: name
    }
  })
}

function getProtocolTem (data) {
  return request({
    url: 'streams/build_pkt_ex',
    method: 'post',
    data
  })
}

function getVm(data) {
  return request({
    url: 'streams/get_vm',
    method: 'post',
    data
  })
}

function addStream(data) {
  return request({
    url: 'streams/add_stream',
    method: 'post',
    data
  })
}

export {
  list,
  create,
  update,
  del,
  copy,
  details,
  getNext,
  getProtocolTem,
  getVm,
  addStream
}
