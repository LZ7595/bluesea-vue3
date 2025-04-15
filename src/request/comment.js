import request from '@/request/request'

const commentApi = {
    uploadFiles: (fileFormData) => {
        try {
            return request({
                url: `/api/review/upload`,
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
    addComment: (data) => {
        try {
            return request({
                url: `/api/review/add`,
                method: 'post',
                data
            });
        } catch (error) {
            throw new Error(error.response?.data?.message || '请求出错');
        }
    },
    updateComment: (data) => {
        try {
            return request({
                url: `/api/review/update`,
                method: 'put',
                data
            });
        } catch (error) {
            throw new Error(error.response?.data?.message || '请求出错');
        }
    },
    getCommentByOrderId: (orderId) => {
        try {
            return request({
                url: `/api/review/order/${orderId}`,
                method: 'get',
            });
        } catch (error) {
            throw new Error(error.response?.data?.message || '请求出错');
        }
    },
    getCommentByProductId: (productId,currentPage = 1,pageSize = 1) => {
        try {
            return request({
                url: `/api/review/product/${productId}`,
                method: 'get',
                params: {
                    currentPage,
                    pageSize
                }
            });
        } catch (error) {
            throw new Error(error.response?.data?.message || '请求出错');
        }
    },
}

export default commentApi;