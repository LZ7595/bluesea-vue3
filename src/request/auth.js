import request from '@/request/request';

const Auth = {
    //验证码
     getAuthCode: (params) => {
        return request({
            url: '/api/auth/sendCode',
            method: 'post',
            params: params
        })
            .then({
                data: res => {
                    if (res.code === 200) {
                        return res.data;
                    } else {
                        return Promise.reject(res);
                    }
                }
            })
            .catch(err => {
                return Promise.reject(err);
            })
    },
    //注册
    register: (params) => {
        return request({
            url: '/api/auth/register',
            method: 'post',
            data: params
        })
            .then({
                data: res => {
                    if (res.code === 200) {
                        return res.data;
                    } else {
                        return Promise.reject(res);
                    }
                }
            })
            .catch(err => {
                return Promise.reject(err);
            })
    },
    //登录
    login: (user,type) => {
        return request({
            url: '/api/auth/login',
            method: 'post',
            data: {...user},
            params: {
                type: type
            }
        })
            .then({
                data: res => {
                    if (res.code === 200) {
                        return res.data;
                    } else {
                        return Promise.reject(res);
                    }
                }
            })
            .catch(err => {
                return Promise.reject(err);
            })
    }
    //退出
}
export default Auth;