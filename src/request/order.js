import request from '@/request/request';

const orderRes = {
    createOrder: (params) => {
        return request({
            url: '/api/order/create',
            method: 'post',
            data: params
        }).then(res => {
            return res
        }).catch(err => {
            return err
        })
    },
    getOrderDetails: (orderId) => {
        return request({
            url: `/api/order/details/${orderId}`,
            method: 'get',
        }).then(res => {
            return res.data
        }).catch(err => {
            return err
        })
    },
    payOrder: (orderId) => {
        return request({
            url: `/api/order/pay/${orderId}`,
            method: 'get',
        }).then(res => {
            return res
        }).catch(err => {
            return err
        })
    },
    cancelOrder: (orderId) => {
        return request({
            url: `/api/order/cancel/${orderId}`,
            method: 'get',
        }).then(res => {
            return res
        }).catch(err => {
            return err
        })
    },
    getOrders: (userId, status, currentPage = 1, pageSize = 10) => {
        let url = `/api/order/user/${userId}`;
        const queryParams = [];

        if (status) {
            queryParams.push(`status=${status}`);
        }
        queryParams.push(`currentPage=${currentPage}`);
        queryParams.push(`pageSize=${pageSize}`);

        if (queryParams.length > 0) {
            url += `?${queryParams.join('&')}`;
        }

        return request({
            url: url,
            method: 'get',
        }).then(res => {
            return res.data;
        }).catch(err => {
            console.log(err);
            return err;
        });
    },
    confirmOrder: (orderId) => {
        return request({
            url: `/api/order/confirm/${orderId}`,
            method: 'get',
        }).then(res => {
            return res
        }).catch(err => {
            return err
        })
    }
}

export default orderRes;