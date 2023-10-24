import request from '@/utils/request.js'

export function getConfig(){
    return request({
        url:'/reports/config/details'
    })
}
export function setConfig(data){
    return request({
        url:'/reports/config/setting',
        method:"post",
        data
    })
}