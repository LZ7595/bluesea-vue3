import request from '@/request/request';

const productRes = {
    getProudctDetails: (product_id) => {
        return request({
            url: `/api/product/details`,
            method: 'get',
            params: {
                product_id: product_id
            }
        }).then(res => {
            if (res.status === 200) {
                return res.data;
            }
        }).catch(err => {
            return Promise.reject(err);
        })
    },
    Search: (selectedCategory, selectedBrand, searchKeyword, sortField, sortOrder, currentPage, pageSize) => {
        return request({
            url: `/api/product/search`,
            method: 'get',
            params: {
                selectedCategory,
                selectedBrand,
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
    fetchProductsInfo:(productIds,userId)=>{
        return request({
            url: '/api/product/batch',
            method: 'post',
            data: productIds,
            params: {
                userId: userId
            }
        }).then(res => {
            return res.data
        }).catch(err => {
            return err
        })
    }

}
export default productRes;