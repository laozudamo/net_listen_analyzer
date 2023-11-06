import request from '@/utils/request'

export function getData (params, controller) {
  return request({
    url: '/pcap/list',
    method: 'get',
    params,
    signal: controller.signal
  })
}

export function getDetail (data, controller) {
  return request({
    url: '/pcap/pkt/details',
    method: 'post',
    data,
    signal: controller.signal
  })
}

export function pacpList (params) {
  return request({
    url: '/pcap/file/list',
    method: 'get',
    params
  })
}


export function filterList (params) {
  return request({
    url: '/pcap/display_filter',
    method: 'get',
    params
  })
}

export function expertInfo (params, controller) {
  return request({
    url: 'pcap/expert',
    method: 'get',
    params,
    signal: controller.signal
  })
}

export function sessionInfo (params) {
  return request({
    url: '/pcap/statistical_sonversations',
    method: 'get',
    params,
  })
}


export function endPointInfo (params) {
  return request({
    url: '/pcap/statistical_endpoints',
    method: 'get',
    params,
  })
}

export function httpInfo (params) {
  return request({
    url: '/pcap/statistical/http_tree',
    method: 'get',
    params,
  })
}


//统计分析包量和字节大小（io,stat）接口
export function IoStatInfo (params) {
  return request({
    url: '/pcap/statistical/protocol_hierarchies',
    method: 'get',
    params,
  })
}


//统计协议层次结构及包量（io,phs）接口
export function IoPhsInfo (params) {
  return request({
    url: '/pcap/statistical/protocol_hierarchies',
    method: 'get',
    params,
  })
}


// 统计IP 地址占比 

/* 
  必传， 参数说明： 统计IP地址占比 ip_hosts  / 统计源地址和目标地址占比 ip_srcdst ；如果是IPv6地址，则使用 ip6_srcdst
*/
export function ipInfo (params) {
  return request({
    url: '/pcap/statistical/protocol_hierarchies',
    method: 'get',
    params,
  })
}

export function getIO (params) {
  return request({
    url: '/pcap/flow_graph',
    method: 'get',
    params,
  })
}