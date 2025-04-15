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
        });
    },
    updateUserInfo: (id, name, gender, birthday,avatar) => {
        return request({
            url: `/api/users/${id}`,
            method: 'put',
            params: {
                name,
                gender,
                birthday,
                avatar
            }
        }).then(res => {
            if (res.status === 200) {
                return res.data;
            }
        }).catch(err => {
            return Promise.reject(err);
        });
    },
    uploadFiles: (fileFormData) => {
        try {
            return request({
                url: `/api/avatar/upload`,
                method: 'post',
                data: fileFormData,
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });
        } catch (error) {
            throw new Error(error.response?.data?.message || '请求出错');
        }
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
        });
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
        });
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
        });
    },
    confirmChangePasswordByOldPassword: (userId, oldPassword) => {
        return request({
            url: `/api/users/confirmChangePasswordByOldPassword`,
            method: 'post',
            params: {
                userId,
                oldPassword
            }
        }).then(res => {
            if (res.status === 200) {
                return res;
            }
        }).catch(err => {
            return Promise.reject(err);
        });
    },
    confirmChangePasswordByEmail: (userId, email, code) => {
        return request({
            url: `/api/users/confirmChangePasswordByEmail`,
            method: 'post',
            params: {
                userId,
                email,
                code
            }
        }).then(res => {
            if (res.status === 200) {
                return res;
            }
        }).catch(err => {
            return Promise.reject(err);
        });
    },
    confirmChangePasswordByPhone: (userId, phone, code) => {
        return request({
            url: `/api/users/confirmChangePasswordByPhone`,
            method: 'post',
            params: {
                userId,
                phone,
                code
            }
        }).then(res => {
            if (res.status === 200) {
                return res;
            }
        }).catch(err => {
            return Promise.reject(err);
        });
    },
    changePasswordByOldPassword: (userId, oldPassword, newPassword) => {
        return request({
            url: `/api/users/changePasswordByOldPassword`,
            method: 'post',
            params: {
                userId,
                oldPassword,
                newPassword
            }
        }).then(res => {
            if (res.status === 200) {
                return res;
            }
        }).catch(err => {
            return Promise.reject(err);
        });
    },
    changePasswordByEmail: (userId, email, code, newPassword) => {
        return request({
            url: `/api/users/changePasswordByEmail`,
            method: 'post',
            params: {
                userId,
                email,
                code,
                newPassword
            }
        }).then(res => {
            if (res.status === 200) {
                return res;
            }
        }).catch(err => {
            return Promise.reject(err);
        });
    },
    changePasswordByPhone: (userId, phone, code, newPassword) => {
        return request({
            url: `/api/users/changePasswordByPhone`,
            method: 'post',
            params: {
                userId,
                phone,
                code,
                newPassword
            }
        }).then(res => {
            if (res.status === 200) {
                return res;
            }
        }).catch(err => {
            return Promise.reject(err);
        });
    },
    searchUserByUserId: (userId) => {
        return request({
            url: `/api/users/searchUserByUserId`,
            method: 'get',
            params: {
                userId
            }
        })
    }
};

export default userRes;