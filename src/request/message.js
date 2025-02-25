import request from '@/request/request'

// 获取聊天记录
export const findMessageBySendUserAndReceiveUser = async (sendUserId, receiveUserId) => {
    try {
        const response = await request.get(`api/message/findMessageBySendUserAndReceiveUser`, {
            params: {
                sendUserId,
                receiveUserId
            }
        });
        return response.data;
    } catch (error) {
        console.error('获取聊天记录失败:', error);
        throw error;
    }
};

// 搜索用户聊天表单信息
export const searchUserForForm = async (userId, searchUserName) => {
    try {
        const response = await request.get(`api/message/searchUserForForm`, {
            params: {
                loginUserId:userId,
                searchUserName:searchUserName
            }
        });
        return response.data;
    } catch (error) {
        console.error('搜索用户聊天表单信息失败:', error);
        throw error;
    }
};