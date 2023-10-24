// 用来处理自定义验证


// 验证IP地址
export function validIP(str){
    return /^(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])$/.test(str)
}

export function validMAC(str){
    return /^\s*([0-9a-fA-F]{2,2}[-,:]){5,5}[0-9a-fA-F]{2,2}\s*$/g.test(str)
}