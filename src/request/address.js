import request from '@/request/request';

const address = {
    addAddress: function (data) {
        return request({
            url: '/api/address/addAddress',
            method: 'post',
            data
        }).then(res => {
            if (res.status === 200) {
                return res.data;
            }
        }).catch(err => {
            return err;
        })
    },
    getAddress: function (userId) {
        return request({
            url: `/api/address/getAddress/${userId}`,
            method: 'get',
        }).then(res => {
            if (res.status === 200) {
                return res.data;
            }
        }).catch(err => {
            return err;
        })
    },
    setDefaultAddress: function (data) {
        return request({
            url: `/api/address/setDefaultAddress`,
            method: 'put',
            data
        }).then(res => {
            if (res.status === 200) {
                return res.data;
            }
        }).catch(err => {
            return err;
        })
    },
    deleteAddress: function (addressId) {
        return request({
            url: `/api/address/deleteAddress/${addressId}`,
            method: 'delete',
        }).then(res => {
            if (res.status === 200) {
                return res.data;
            }
        }).catch(err => {
            return err;
        })
    },
    updateAddress: function (data) {
        return request({
            url: `/api/address/updateAddress`,
            method: 'put',
            data
        }).then(res => {
            if (res.status === 200) {
                return res.data;
            }
        }).catch(err => {
            return err;
        })
    },
    getAddressDetail: function (addressId) {
        return request({
            url: `/api/address/getAddressDetail/${addressId}`,
            method: 'get',
        }).then(res => {
            if (res.status === 200) {
                return res.data;
            }
        }).catch(err => {
            return err;
        })
    }
}
export default address;