import request from "@/request/request.js";

const bannerBackApi = {
    // 获取轮播图列表
    getBannerList: (sortField, sortOrder, currentPage, pageSize) => {
        return request({
            url: '/api/back/banner/list',
            method: 'get',
            params: {
                sortField,
                sortOrder,
                currentPage,
                pageSize
            }
        });
    },
    getProductList: () => {
        return request({
            url: '/api/back/product/selectList',
            method: 'get'
        })
    },
    // 删除单条评论
    deleteBanner: (id) => {
        return request({
            url: '/api/back/banner/delete',
            method: 'delete',
            params: {id}
        });
    },
    // 删除多条评论
    deleteBannerMore: (ids) => {
        return request({
            url: '/api/back/banner/deletemore',
            method: 'delete',
            data: ids
        });
    },
    //改变状态
    changeStatus: (id, status) => {
        return request({
            url: '/api/back/banner/changestatus',
            method: 'put',
            data: {id, status}
        });
    },
    updateBanner: (banner) => {
        return request({
            url: '/api/back/banner/update',
            method: 'put',
            data: banner
        })
    },
    uploadFiles: (fileFormData) => {
        try {
            return request({
                url: `/api/back/banner/upload`,
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
    addBanner: (banner) => {
        return request({
            url: '/api/back/banner/add',
            method: 'post',
            data: banner
        })
    }
};

export default bannerBackApi;