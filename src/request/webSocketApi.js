import request from '@/request/request';

// 发送信息
export function sendMessageTo (data) {
    return request({
        url: 'api/message/sendMessage',
        method: 'post',
        data: data
    });
}
// 获取在线人数
export function getOnLineUser () {
    return request({
        url: 'api/message/getOnLineUser',
        method: 'get',
        params: {}
    })
}

// 发送信息给所有人
export function sendMessageAll (message) {
    return request({
        url: 'api/message/sendMessageAll',
        method: 'get',
        params: {
            message
        }
    })
}
