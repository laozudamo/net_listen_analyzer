import request from '@/utils/request'

export function caseList () {
    return request({
        url: '/case/type_list',
        method: 'get'
    })
}

export function del (data) {
    return request({
        url: '/tasks/delete',
        method: 'put',
        data
    })
}

export function search (params) {
    return request({
        url: "/cases/case_list",
        method: 'get',
        params
    })
}

export function list (params) {
    return request({
        url: "/tasks/list",
        params
    })
}
export function create (data) {
    return request({
        url: "/tasks/create",
        method: "post",
        data
    })
}
export function details (params) {
    return request({
        url: "/tasks/details",
        method: "get",
        params
    })
}
export function update (data) {
    return request({
        url: "/tasks/update",
        method: "put",
        data
    })
}
export function copy (params) {
    return request({
        url: "/tasks/copy",
        method: "get",
        params
    })
}
export function runTask (data) {
    return request({
        url: "tasks/run",
        method: "post",
        data
    })
}
export function stopTask (data) {
    return request({
        url: "tasks/stop",
        method: "post",
        data
    })
}
