import request from "@/request/request";

const promotionBackRes = {
    Search: (searchKeyword, sortField, sortOrder, currentPage, pageSize) => {
        return request({
            url: `/api/back/promotion/search`,
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
    getPromotionDetail: (id) => {
        return request({
            url: `/api/back/promotion/details`,
            method: 'get',
            params: {
                promotion_id: id
            }
        }).then(res => {
            if (res.status === 200) {
                return res.data;
            }
        }).catch(err => {
            return Promise.reject(err);
        })
    },
    updatePromotion: async (data) => {
        try {
            return request({
                url: `/api/back/promotion/update`,
                method: 'put',
                data
            });
        } catch (error) {
            throw new Error(error.response?.data?.message || '请求出错');
        }
    },
    addPromotion: (data) => {
        try {
            return request({
                url: `/api/back/promotion/add`,
                method: 'post',
                data
            });
        } catch (error) {
            throw new Error(error.response?.data?.message || '请求出错');
        }
    },
    deletePromotion: (id) => {
        try {
            return request({
                url: `/api/back/promotion/deleteone`,
                method: 'delete',
                params: {
                    promotion_id:id
                }
            });
        } catch (error) {
            throw new Error(error.response?.data?.message || '请求出错');
        }
    },
    deletePromotionMore: (promotionIdList) => {
        try {
            return request({
                url: `/api/back/promotion/deletemore`,
                method: 'delete',
                data: promotionIdList
            });
        } catch (error) {
            throw new Error(error.response?.data?.message || '请求出错');
        }
    },
    getProductDetail: (id) => {
        return request({
            url: `/api/back/promotion/productdetail`,
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
    }
}

export default promotionBackRes;