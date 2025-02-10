import request from '@/request/request';
import {ElMessage} from "element-plus";

const cartRes = {
    getCartList: (user_id) => {
        return request({
            url: `/api/shoppingCart/list/${user_id}`,
            method: 'get',
        }).then(res => {
            if (res.status === 200) {
                return res.data;
            }
        }).catch(err => {
            return Promise.reject(err);
        })
    },
    deleteCart: (cart_id) => {
        return request({
            url: `/api/shoppingCart/delete/${cart_id}`,
            method: 'delete',
        }).then(res => {
            console.log(res)
            if (res.status === 200) {
                return res.data;
            }
        }).catch(err => {
            return Promise.reject(err);
        })
    },
    addCart: (user_id, product_id, quantity = 1, is_selected = 1) => {
        return request({
            url: `/api/shoppingCart/add`,
            method: 'post',
            data: {
                user_id: user_id,
                product_id: product_id,
                quantity: quantity,
                is_selected: is_selected
            }
        }).then(res => {
            if (res.status === 200) {
                ElMessage.success('添加成功');
                return res.data;
            }
        }).catch(err => {
            if (err.response && err.response.status === 409) {
                // 处理409 Conflict错误
                ElMessage.error(err.response.data?.errormsg)
                return Promise.reject(err);
            } else {
                // 处理其他错误
                ElMessage.error(err.response.data?.errormsg)
                return Promise.reject(err);
            }
        })
    },
    updateQuantity: (cart_id, quantity) => {
        return request({
            url: `/api/shoppingCart/updateQuantity`,
            method: 'put',
            params: {
                cartId: cart_id,
                quantity: quantity
            }
        }).then(res => {
            if (res.status === 200) {
                return res;
            }
        }).catch(err => {
            return Promise.reject(err);
        })
    },
    updateSelectedStatus: (cart_id, is_selected) => {
        return request({
            url: `/api/shoppingCart/updateSelectedStatus`,
            method: 'put',
            params: {
                cartId: cart_id,
                isSelected: is_selected
            }
        }).then(res => {
            if (res.status === 200) {
                return res;
            }
        }).catch(err => {
            return Promise.reject(err);
        })
    },
    updateAllSelectedStatus: (SelectedList) => {
        console.log(SelectedList)
        return request({
            url: `/api/shoppingCart/updateSelectedListStatus`,
            method: 'put',
            data: SelectedList
        }).then(res => {
            if (res.status === 200) {
                return res;
            }
        }).catch(err => {
            return Promise.reject(err);
        })
    }
}
export default cartRes;