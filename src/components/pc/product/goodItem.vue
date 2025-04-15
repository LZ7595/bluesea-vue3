<template>
    <div class="goodItem">
        <router-link class="picbox" :to="`/pc/productDetails/${product_id}`">
            <img :src="server_URL + image_url" :alt="product_name" class="goodItem-img">
        </router-link>
        <div class="title">
            <router-link :to="`/pc/productDetails/${product_id}`">{{ quality + "新 " + product_name }}</router-link>
        </div>
        <div class="price">
            <router-link :to="`/pc/productDetails/${product_id}`">￥{{ price }}</router-link>
            <!-- 如果有折扣，显示限时抢购提示 -->
            <el-tag v-if="hasDiscount" type="danger" effect="dark" size="small">限时抢购</el-tag>
        </div>
        <div class="goodItem-bottom">
            <button class="addCart" @click="addMyCart(product_id)">加入购物车</button>
            <i class="line"></i>
            <button class="buyNow" @click="buyNow(product_id)" >立即购买</button>
        </div>
    </div>
</template>

<script setup>
import {computed, defineOptions, defineProps, ref} from 'vue';
import cartRes from "@/request/shoppingCart";
import {ElMessage} from "element-plus";
import {useRouter} from "vue-router";
import {server_URL} from "@/urlConfig.js";
const router = useRouter();

const props = defineProps({
    goodItem: {
        type: Object,
        default: () => ({})
    }
})
const user_id = ref(null);
const addMyCart = async (product_id) => {
    try {
        user_id.value = JSON.parse(localStorage.getItem('UserData')).id
        const res = await cartRes.addCart(user_id.value, product_id)
        console.log(res)
    } catch (e) {
        console.log(e)
    }
}

const product_id = computed(() => props.goodItem.product.product_id);
const product_name = computed(() => props.goodItem.product.product_name);
const quality = computed(() => props.goodItem.product.quality);
const image_url = computed(() => props.goodItem.product.product_main_image);
const price = computed(() => props.goodItem.productPromotion ? props.goodItem.productPromotion.discount_price : props.goodItem.product.price);
// 计算属性判断是否有折扣
const hasDiscount = computed(() => props.goodItem.productPromotion && props.goodItem.productPromotion.discount_price);

const buyNow = async (productId) => {
    try {
        user_id.value = JSON.parse(localStorage.getItem('UserData')).id;
        const orderData = {
            userId: user_id.value,
            orderItems: [
                {
                    productId: productId,
                    quantity: 1,
                    unitPrice: price.value,
                }
            ]
        };

        // 跳转到确认订单页，并传递订单数据
        router.push({
            name: 'PlaceOrder',
            query: {
                orderData: JSON.stringify(orderData)
            }
        });
    } catch (error) {
        console.error('跳转到确认订单页失败:', error);
        ElMessage.error('操作失败，请稍后重试');
    }
};
defineOptions({
    name: 'goodItem'
})
</script>

<style scoped>
.goodItem {
    width: 235px;
    border-radius: 10px;
    border: 2px solid #fff;
    background: #fff;

    .picbox {
        display: block;
        width: 231px;
        height: 231px;
        padding: 20px;
    }

    .goodItem-img {
        width: 100%;
        height: 100%;
        display: block;
    }

    .title {
        padding: 0 10px;
        height: 36px;
        overflow: hidden;
        margin: 10px 0;
        font-size: 12px;

        a {
            line-height: 18px;
        }

        a:hover {
            color: #5a99dc;
        }
    }

    .price {
        padding: 0 10px;
        font-size: 18px;
        font-weight: 600;
        display: flex;
        align-items: center;
        justify-content: space-between;

        a {
            color: #e4393c;
        }
    }

    .goodItem-bottom {
        height: 42px;
        line-height: 42px;
        border-top: 1px solid #eee;

        button {
            width: 49%;
            height: 100%;
            display: block;
            float: left;
            text-align: center;
            background: none;
            font-size: 14px;
            color: #8c8c8c;
        }

        button:hover {
            color: #e4393c;
        }

        i {
            display: block;
            width: 1px;
            height: 20px;
            background: #eee !important;
            float: left;
            margin-top: 11px;
        }
    }
}

.goodItem:hover {
    border: 2px solid #5a99dc;
}
</style>