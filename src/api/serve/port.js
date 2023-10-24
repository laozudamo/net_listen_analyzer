import request from '@/utils/request'

// 获取端口
export function getPortInfo () {
    return request({
        url: '/ports/get_all_ports',
        method: 'get',
    })
}

// 绑定端口
export function acquicePort (data) {
    return request({
        url: '/ports/acquired',
        method: 'post',
        data
    })
}
// 解绑端口
export function releasePort (data) {
    return request({
        url: '/ports/release',
        method: 'post',
        data
    })
}

// 管理员强制解绑端口
export function adminReleasePort (data) {
    return request({
        url: "/ports/reset",
        method: "post",
        data
    })
}


export function userPort () {
    return request({
        url: '/ports/get_owner_ports',
        method: 'get',
    })
}