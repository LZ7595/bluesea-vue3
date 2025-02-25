import request from '@/request/request';

const userBackRes = {
    Search: (searchKeyword, sortField, sortOrder, currentPage, pageSize) => {
        return request({
            url: `/api/back/user/search`,
            method: 'get',
            params: {
                searchKeyword,
                sortField,
                sortOrder,
                currentPage,
                pageSize
            }
        }).then(res => {
            if (res.status === 200) {
                return res.data;
            }
        }).catch(err => {
            return Promise.reject(err);
        })
    },
    getUserDetail: (id) => {
        return request({
            url: `/api/back/user/details`,
            method: 'get',
            params: {
                id
            }
        }).then(res => {
            if (res.status === 200) {
                return res.data;
            }
        }).catch(err => {
            return Promise.reject(err);
        })
    },
    updateUser: async (data) => {
        try {
            return request({
                url: `/api/back/user/update`,
                method: 'put',
                data
            });
        } catch (error) {
            throw new Error(error.response?.data?.message || '请求出错');
        }
    },
    uploadFiles: (fileFormData) => {
        try {
            return request({
                url: `/api/back/user/upload`,
                method: 'post',
                data: fileFormData,
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            }).then(res => {
                if (res.status === 200) {
                    return res.data;
                }
            })
        } catch (error) {
            throw new Error(error.response?.data?.message || '请求出错');
        }
    },
    addUser: (data) => {
        try {
            return request({
                url: `/api/back/user/add`,
                method: 'post',
                data
            });
        } catch (error) {
            throw new Error(error.response?.data?.message || '请求出错');
        }
    },
    deleteUser: (id) => {
        try {
            return request({
                url: `/api/back/user/deleteone`,
                method: 'delete',
                params: {
                    id
                }
            });
        } catch (error) {
            throw new Error(error.response?.data?.message || '请求出错');
        }
    },
    deleteUserMore: (userIdList) => {
        try {
            return request({
                url: `/api/back/user/deletemore`,
                method: 'delete',
                data: userIdList
            });
        } catch (error) {
            throw new Error(error.response?.data?.message || '请求出错');
        }
    }
}
export default userBackRes;