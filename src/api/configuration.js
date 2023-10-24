import request from '@/utils/request'

export function getTemplates(params) {
    return request({
        url: '/configuration/templates',
        method: 'get',
        params
    })
}
export function getTopologyList(params) {
    return request({
        url: '/configuration/list',
        method: 'get',
        params
    })
}

export function getDetalis(params){
    return request({
        url:'configuration/detalis',
        params
    })
}

export function createTempleate(data){
    return request({
        url:'configuration/create',
        method:"post",
        data
    })
}

export function delTempleate(data){
    return request({
        url:'configuration/delete',
        method:'delete',
        data
    })
}
export function updateTempleate(data){
    return request({
        url:'configuration/update',
        method:'put',
        data
    })
}
export function copyTempleate(data){
    return request({
        url:'configuration/copy',
        method:'post',
        data
    })
}
export function getAllTem(){
    return request({
        url:'configuration/all',
        method:'get',
    })
}