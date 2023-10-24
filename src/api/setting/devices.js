import request from '@/utils/request.js'

const devices = {
    // 接口配置
    getPortInfo() {
        return request({
            url: '/devices/show_manage/'
        })
    },
    upDatePort(data) {
        return request({
            url: '/devices/config_manage/',
            method: 'post',
            data
        })
    },
    // 机箱上所有的板卡槽位以及板卡下的所有端口
    getCardInfo(data) {
        return request({
            url: '/devices/show_business/',
            method: 'post',
            data
        })
    },
    getAllPort() {
        return request({
            url: '/devices/get_ports',
            method: 'get',
        })
    },
    // 板卡类型、端口类型
    getCrateInfo(data) {
        return request({
            url: "/devices/show_system_info/",
            method: "post",
            data
        })
    },
    // 机箱的系统版本
    getCaseInfo() {
        return request({
            url: "/devices/show_system_version/",
        })
    },
}
export default devices