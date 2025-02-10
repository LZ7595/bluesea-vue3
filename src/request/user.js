import request from '@/request/request';

const userRes = {
    getUserInfo: (user_id) => {
        return request({
            url: `/api/users/${user_id}`,
            method: 'get',
        }).then(res => {
            if (res.status === 200) {
                return res.data;
            }
        }).catch(err => {
            return Promise.reject(err);
        })
    },
    updateUserInfo: (id, name, gender, birthday) => {
        return request({
            url: `/api/users/${id}`,
            method: 'put',
            params: {
                name,
                gender,
                birthday
            }
        }).then(res => {
            if (res.status === 200) {
                return res.data;
            }
        }).catch(err => {
            return Promise.reject(err);
        })
    },
    getSecurityInfo: (user_id) => {
        return request({
            url: `/api/users/security/${user_id}`,
            method: 'get',
        }).then(res => {
            if (res.status === 200) {
                return res.data;
            }
        }).catch(err => {
            return Promise.reject(err);
        })
    },
    sendCode: (input, type, num) => {
        return request({
            url: `/api/users/sendCode`,
            method: 'post',
            params: {
                info: input,
                type,
                num
            }
        }).then(res => {
            if (res.status === 200) {
                return res;
            }
        }).catch(err => {
            return Promise.reject(err);
        })
    },
    confirmChange: (userId, info, code, type, num) => {
        return request({
            url: `/api/users/ConfirmChange`,
            method: 'post',
            params: {
                userId,
                info,
                code,
                type,
                num
            }
        }).then(res => {
            if (res.status === 200) {
                return res;
            }
        }).catch(err => {
            return Promise.reject(err);
        })
    }
}
export default userRes;