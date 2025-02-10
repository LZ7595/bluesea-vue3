<template>
    <div class="shop-car-list-container">
        <ul class="shop-car-list">
            <!-- 标题 -->
            <li class="shop-car-item">
                <div class="shop-car-select">
                    全选
                    <input type="checkbox" :checked="allSelected" @change="toggleSelectAll"/>
                </div>
                <div class="shop-car-img">商品图片</div>
                <div class="shop-car-name">商品名称</div>
                <div class="shop-car-price-tips">商品价格</div>
                <div class="shop-car-comment">操作</div>
                <div class="shop-car-sub-total">小计</div>
                <div class="shop-car-del">删除</div>
            </li>

            <Empty v-if="Array.isArray(shopCarList) && shopCarList.length === 0"/>

            <li v-for="(item, index) in shopCarList" :key="index" class="shop-car-item">
                <div class="shop-car-select">
                    <input type="checkbox" :checked="item.is_selected || false"
                           @change="() => toggleSelectItem(item.cart_id)"/>
                </div>
                <div class="shop-car-img">
                    <img :src="item.product_main_image"/>
                </div>
                <div class="shop-car-name" :title="item.product_name">
                    {{ item.product_name }}
                </div>
                <div class="shop-car-price-tips">
                    ￥<span>{{ item.price }}</span>
                </div>
                <div class="shop-car-comment">
                    <button @click="minusCount(item.cart_id)">-</button>
                    <input v-model="item.quantity" @change="(e) => handleCountChange(e, item.cart_id)"/>
                    <button @click="addCount(item.cart_id)">+</button>
                </div>
                <div class="shop-car-sub-total">
                    ￥<span>{{ (item.price * item.quantity).toFixed(2) }}</span>
                </div>
                <div class="shop-car-del">
                    <a @click="removeShopCarAction(item.cart_id)">删除</a>
                </div>
            </li>
        </ul>
        <div class="total-panel">
            <div class="total">
                <span>总计：</span>
                <span>￥</span>
                <span>{{ saleTotal || 0 }}</span>
            </div>
            <div class="submit">
                <button>结算</button>
            </div>
        </div>
    </div>
    <el-dialog
            v-model="dialogVisible"
            title="删除购物车"
            width="500"
    >
        <span>这么好的商品，您确定要删除它吗？</span>
        <template #footer>
            <div class="dialog-footer">
                <el-button @click="dialogVisible = false">取消</el-button>
                <el-button type="primary" @click="confirmDeleteAction(cartId)">
                    确定
                </el-button>
            </div>
        </template>
    </el-dialog>
</template>

<script setup>
import {ref, computed, onMounted} from 'vue';
import Empty from '@/components/pc/common/empty.vue';
import cartRes from "@/request/shoppingCart";
import {ElMessage} from "element-plus";

const dialogVisible = ref(false)
const currentCartId = ref(null);
const userData = ref(JSON.parse(localStorage.getItem('UserData')))
const userId = ref(userData.value.id)
// 模拟购物车列表数据
const shopCarList = ref([]);
const isSelected = ref(null)

const updateSelectedStatus = async (cartId,is_selected) => {
    try {
        const res = await cartRes.updateSelectedStatus(cartId,is_selected);
        if (res.status === 200) {
            ElMessage.success('更新成功');
        }
    }catch (e){
        ElMessage.error('更新失败');
        console.log(e)
    }
}

const updateAllSelectedStatus = async (selectedList) => {
    try {
        const res = await cartRes.updateAllSelectedStatus(selectedList);
        if (res.status === 200) {
            ElMessage.success('更新成功');
        }
    }catch (e){
        ElMessage.error('更新失败');
        console.log(e)
    }
}

// 全选状态
const allSelected = computed(() => {
    return Array.isArray(shopCarList.value) && shopCarList.value.every(item => item.is_selected);
});

// 全选/反选
const toggleSelectAll = () => {
    const isAllChecked = allSelected.value;
    const selectedList = [];
    shopCarList.value.forEach(item => {
        item.is_selected = !isAllChecked;
        selectedList.push({cartId: item.cart_id, isSelected: item.is_selected ? 1 : 0});
    });
    updateAllSelectedStatus(selectedList)
};

// 单选商品
const toggleSelectItem = (cartId) => {
    const item = shopCarList.value.find(item => item.cart_id === cartId);
    if (item) {
        item.is_selected = !item.is_selected;
        isSelected.value = item.is_selected ? 1 : 0;
        updateSelectedStatus(cartId,isSelected.value)
    }
};

const updateQuantity = async (cartId, quantity) => {
    try {
        const res = await cartRes.updateQuantity(cartId, quantity);
        if (res.status === 200) {
            ElMessage.success('更新成功');
        }
    } catch (e) {
        ElMessage.error('更新失败');
        console.error(e);
    }
};


// 减少商品数量
const minusCount = (cartId) => {
    const item = shopCarList.value.find(item => item.cart_id === cartId);
    if (item && item.quantity > 1) {
        item.quantity--;
        updateQuantity(cartId, item.quantity);
    } else {
        ElMessage.error('数量不能小于1')
    }
};

// 增加商品数量
const addCount = (cartId) => {
    const item = shopCarList.value.find(item => item.cart_id === cartId);
    if (item.quantity < item.stock) {
        item.quantity++;
        updateQuantity(cartId, item.quantity);
    } else {
        ElMessage.error('库存不足')
    }
};

// 处理商品数量输入框变化
const handleCountChange = (e, cartId) => {
    const newCount = parseInt(e.target.value);
    const item = shopCarList.value.find(item => item.cart_id === cartId);
    if (item && !isNaN(newCount) && newCount > 0 && newCount <= item.stock) {
        item.quantity = newCount;
        updateQuantity(cartId, item.quantity);
    }else {
        item.quantity = 1
        ElMessage.error('数量不能小于1')
    }
};

// 删除商品
const removeShopCarAction = (cartId) => {
    currentCartId.value = cartId;
    dialogVisible.value = true;
};

const confirmDeleteAction = async () => {
    try {
        const res = await cartRes.deleteCart(currentCartId.value);
        shopCarList.value = shopCarList.value.filter(item => item.cart_id !== currentCartId.value);
        ElMessage.success('删除成功');
        dialogVisible.value = false;
    } catch (e) {
        ElMessage.error('删除失败');
        console.error(e);
        dialogVisible.value = false;
    }
};

// 计算总计
const saleTotal = computed(() => {
    return Array.isArray(shopCarList.value)
        ? shopCarList.value.reduce((total, item) => {
            if (item.is_selected) {
                return total + (item.price || 0) * (item.quantity || 0);
            }
            return total;
        }, 0)
        : 0;
});


const getCartList = async () => {
    try {
        const res = await cartRes.getCartList(userId.value)
        shopCarList.value = res;
        console.log(res)
    } catch (error) {
        console.error(error);
    }
};

onMounted(() => {
    getCartList();
})
</script>

<style scoped>
.shop-car-list-container {
    width: 1200px;
    margin: 0 auto;

    .shop-car-list {
        .shop-car-item {
            display: flex;
            align-items: center;
            width: 1200px;
            padding: 10px;
            box-sizing: border-box;
            border-bottom: 1px solid #e0dede;
            justify-content: space-between;
            font-size: 16px;

            .shop-car-select {
                width: 50px;
                display: flex;
                justify-content: center;
                align-items: center;
            }

            .shop-car-img {
                width: 80px;
                height: 80px;
                display: flex;
                text-align: center;
                align-items: center;
                justify-content: center;

                img {
                    width: 100%;
                    height: 100%;
                }
            }

            .shop-car-name {
                width: 400px;
                margin-left: 20px;
                overflow: hidden;
                text-overflow: ellipsis;
                display: -webkit-box;
                -webkit-line-clamp: 2;
                -webkit-box-orient: vertical;
                font-weight: bold;
                word-break: break-all;
            }

            .shop-car-price-tips {
                width: 150px;
                font-size: 20px;
                margin-left: 20px;
                color: red;
                line-height: 40px;
                display: flex;
                justify-content: center;
            }

            .shop-car-comment {
                display: flex;
                justify-content: center;
                align-items: center;
                width: 140px;

                button {
                    width: 30px;
                    height: 30px;
                    background-color: rgb(145, 144, 144);
                    color: #fff;
                    border: none;
                    margin: 20px auto;
                    display: block;
                    cursor: pointer;
                    flex-grow: 0;
                    transition: all .5s;
                }

                button:hover {
                    background-color: red;
                }

                input {
                    flex-grow: 0;
                    width: 80px;
                    height: 30px;
                    box-sizing: border-box;
                    outline: none;
                    border-left: none;
                    border-right: none;
                    border-width: 1px;
                    text-align: center;
                }

                input[type="number"]::-webkit-inner-spin-button,
                input[type="number"]::-webkit-outer-spin-button {
                    -webkit-appearance: none;
                    margin: 0;
                }
            }

            .shop-car-sub-total {
                width: 150px;
                text-align: center;
            }

            .shop-car-del {
                width: 80px;
                text-align: center;

                a {
                    color: #999;
                    text-decoration: none;
                    margin: 20px auto;
                    display: block;
                    cursor: pointer;
                    flex-grow: 0;
                    transition: all .5s;
                }

                a:hover {
                    color: red;
                    text-decoration: underline;
                }
            }
        }
    }

    .total-panel {
        position: sticky;
        bottom: 0;
        height: 60px;
        background-color: #eee;
        display: flex;
        justify-content: flex-end;
        align-items: center;
        padding: 0 20px;
        box-sizing: border-box;
        z-index: 10;

        .total {
            font-size: 18px;
            color: red;
        }

        .submit {
            margin-left: 20px;

            button {
                width: 120px;
                height: 40px;
                background-color: red;
                color: #FFF;
                cursor: pointer;
                font-size: 16px;
                border: none;
            }
        }
    }
}
</style>