import request from '@/request/request';

const commentBackApi = {
    // 搜索评论列表
    searchReviewList: (searchKeyword, sortField, sortOrder, currentPage, pageSize) => {
        return request({
            url: '/api/back/comment/search',
            method: 'get',
            params:{
                searchKeyword,
                sortField,
                sortOrder,
                currentPage,
                pageSize
            }
        });
    },
    // 获取评论详情
    getReviewDetailsBack: (review_id) => {
        return request({
            url: '/api/back/comment/details',
            method: 'get',
            params: { review_id }
        });
    },
    // 删除单条评论
    deleteReview: (review_id) => {
        return request({
            url: '/api/back/comment/deleteone',
            method: 'delete',
            params: { review_id }
        });
    },
    // 删除多条评论
    deleteReviewMore: (reviewIdList) => {
        return request({
            url: '/api/back/comment/deletemore',
            method: 'delete',
            data: reviewIdList
        });
    },
    //改变状态
    changeStatus: (review_id, status) => {
        return request({
            url: '/api/back/comment/changestatus',
            method: 'put',
            data: { review_id, status }
        });
    }
};

export default commentBackApi;