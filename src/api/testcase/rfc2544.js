import request from '@/utils/request'

// 待修改
export function getRfc (type) {

  function list (params) {
    return request({
      url: `case/RFC2544/list?case_type=10&protocol_server_type=${type}`,
      method: 'get',
      params
    })
  }

  function create (data) {
    return request({
      url: `case/RFC2544/create`,
      method: 'post',
      data
    })
  }


  function update (data) {
    return request({
      url: `case/RFC2544/update`,
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

  // TODO
  function copy (data) {
    return request({
      url: 'case/ipv4/copy',
      method: 'post',
      data
    })
  }

  function details (params) {
    return request({
      url: 'case/RFC2544/details',
      method: 'get',
      params
    })
  }

  return {
    list,
    create,
    update,
    del,
    copy,
    details,
  }

}