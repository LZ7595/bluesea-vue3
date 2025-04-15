import request from "@/request/request";

const orderBackRes = {
    Search: (searchKeyword, sortField, sortOrder, currentPage, pageSize) => {
        return request({
            url: `/api/back/order/search`,
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
    getOrderDetail: (order_id) => {
        return request({
            url: `/api/back/order/details`,
            method: 'get',
            params: {
                order_id: order_id
            }
        }).then(res => {
            if (res.status === 200) {
                return res.data;
            }
        }).catch(err => {
            return Promise.reject(err);
        })
    },
    shipOrder: (order_id,express) => {
        return request({
                url: `/api/back/order/ship`,
                method: 'post',
                params: {
                    order_id,
                    express
                }
            }).then(res => {
                console.log(res.status)
                if(res.status === 200) {
                    return res.data;
                }
            })
    }
}

export default orderBackRes;