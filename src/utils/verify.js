export function verifyIP(str){
    return /^(1\d{2}|2[0-4]\d|25[0-5]|[1-9]\d|[1-9])\.(1\d{2}|2[0-4]\d|25[0-5]|[1-9]\d|\d)\.(1\d{2}|2[0-4]\d|25[0-5]|[1-9]\d|\d)\.(1\d{2}|2[0-4]\d|25[0-5]|[1-9]\d|\d)$/.test(str)
}

export function verifyMAC(str){
    return /^\s*([0-9a-fA-F]{2,2}[-,:]){5,5}[0-9a-fA-F]{2,2}\s*$/.test(str)
}