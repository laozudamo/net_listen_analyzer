import request from '@/utils/request'


// http://10.0.0.119:9002/pcap_playback/start
export function start (data) {
  return request({
    url: 'pcap_playback/start',
    method: 'post',
    data,
    // signal: controller.signal
  })
}

export function stop (data) {
  return request({
    url: 'pcap_playback/stop',
    method: 'post',
    data,
  })
}

export function getInfo (data) {
  return request({
    url: 'pcap_playback/real_data',
    method: 'post',
    data,
  })
}

