import request from '@/request/request';

const productBackRes = {
    // 获取商品列表
    Search: (searchKeyword, sortField, sortOrder, currentPage, pageSize) => {
        return request({
            url: `/api/back/product/search`,
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
    getProductDetail: (id) => {
        return request({
            url: `/api/back/product/details`,
            method: 'get',
            params: {
                product_id: id
            }
        }).then(res => {
            if (res.status === 200) {
                return res.data;
            }
        }).catch(err => {
            return Promise.reject(err);
        })
    },
    updateProduct: async (data) => {
        try {
            return request({
                url: `/api/back/product/update`,
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
                url: `/api/back/product/upload`,
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
    addProduct: (data) => {
        try {
            return request({
                url: `/api/back/product/add`,
                method: 'post',
                data
            });
        } catch (error) {
            throw new Error(error.response?.data?.message || '请求出错');
        }
    },
    deleteProduct: (id) => {
        try {
            return request({
                url: `/api/back/product/deleteone`,
                method: 'delete',
                params: {
                    product_id: id
                }
            });
        }catch (error) {
            throw new Error(error.response?.data?.message || '请求出错');
        }
    },
    deleteProductMore: (productIdList) => {
        try {
            return request({
                url: `/api/back/product/deletemore`,
                method: 'delete',
                data: productIdList
            });
        }catch (error) {
            throw new Error(error.response?.data?.message || '请求出错');
        }
    }
}

export default productBackRes;