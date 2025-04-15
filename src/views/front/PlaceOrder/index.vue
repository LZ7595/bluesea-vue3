<template>
    <div class="div-page">
        <div class="viewport">
            <div class="placeOrder-div">
                <div class="confirmAddress-div">
                    <div class="confirmAddress-header">
                        <h1>选择地址</h1>
                        <div class="confirmAddress-header-right">
                            <el-button link type="primary" @click="dialogFormVisible = true; isAdd = true">添加新地址
                            </el-button>
                            <el-button link type="primary" @click="goAddressPage">管理地址</el-button>
                        </div>
                    </div>
                    <div v-if="addressList">
                        <ul class="addressList-div" :class="{ expanded: isAddressListExpanded }">
                            <li class="address-card" v-for="item in addressList" :key="item.address_id"
                                @click="selectAddress(item)"
                                :class="{ active: selectedAddress && selectedAddress.address_id === item.address_id }">
                                <div class="address-content">
                                    <el-icon size="20" color="#5a99dc"
                                             v-if="selectedAddress && selectedAddress.address_id === item.address_id ">
                                        <LocationFilled/>
                                    </el-icon>
                                    <el-icon size="20" v-else>
                                        <Location/>
                                    </el-icon>
                                    <div class="address-info">
                                        <div class="address-city">{{ item.province }} / {{ item.city }} / {{
                                            item.district
                                            }}
                                        </div>
                                        <div class="address-detail">{{ item.street_address }}</div>
                                        <div class="address-header">
                                            <div class="address-name">{{ item.recipient_name }}</div>
                                            <div class="address-phone">{{ item.phone }}</div>
                                            <el-tag size="small" v-if="item.is_default">默认</el-tag>
                                        </div>
                                    </div>
                                    <button class="edit-button" @click.stop="openEditAddressDialog(item.address_id)">编辑
                                    </button>
                                </div>
                            </li>
                        </ul>
                        <!-- 添加显示/收起按钮 -->
                        <button class="toggleAddressList" v-if="addressList.length > 4" @click="toggleAddressList">
                            {{ isAddressListExpanded ? '收起' : '显示更多' }}
                        </button>
                    </div>
                </div>

                <div class="confirmOrder-div">
                    <h1>确认订单</h1>
                    <table v-if="orderData">
                        <thead>
                        <tr>
                            <th class="product">商品</th>
                            <th>商品单价</th>
                            <th>购买数量</th>
                            <th>优惠金额</th>
                            <th>实付</th>
                        </tr>
                        </thead>
                        <tr v-for="(item,index) in orderData.orderItems" :key="item.productId">
                            <td class="product"><img
                                    :src="server_URL + products[index]?.product_main_image">{{ products[index]?.product_name }}
                            </td>
                            <td>{{ products[index]?.price }}</td>
                            <td>{{ item.quantity }}</td>
                            <td>{{ item.discountAmount }}</td>
                            <td>{{
                                calculateActualPayment(products[index]?.price, item.discountAmount, item.quantity)
                                }}
                            </td>
                        </tr>
                    </table>
                    <!-- 显示总计金额和优惠总金额 -->
                    <div class="total-info">
                        <p>总计金额：<span class="total-price">{{ totalAmount }}</span> 元</p>
                        <p>优惠总金额：<span class="total-price">{{ totalDiscountAmount }}</span> 元</p>
                        <p>实付金额：<span class="total-price">{{ totalActualPayment }}</span> 元</p>
                    </div>
                    <!-- 只有选中地址才能确认下单 -->
                    <div class="confirmOrder-btn-div">
                        <button class="confirmOrder-btn" @click="confirmOrder" :disabled="!selectedAddress">确认下单
                        </button>
                    </div>
                </div>
            </div>
        </div>
    </div>
    <AddressDialog
            v-model:dialogVisible="dialogFormVisible"
            :isAdd="isAdd"
            :addressList="addressList"
            :regionOptions="regionOptions"
            :addressForm="addressForm"
            :addressRules="addressRules"
            :cascaderProps="cascaderProps"
            @close="dialogFormVisible = false"
            @submit="onSubmit"
    />
</template>

<script setup>
import {ref, onMounted, computed} from 'vue';
import {useRoute, useRouter} from 'vue-router';
import orderRes from "@/request/order";
import address from "@/request/address";
import {ElMessage} from 'element-plus';
import axios from "axios";
import AddressDialog from '@/components/pc/address/AddressDialog.vue';
import {LocationFilled, Location} from '@element-plus/icons-vue';
import productRes from "@/request/product.js";
import {server_URL} from "@/urlConfig.js";

const route = useRoute();
const router = useRouter();
const orderData = ref(null);

const dialogFormVisible = ref(false);
const isAdd = ref(true);

// 请替换为你自己的高德地图API Key
const API_KEY = '3bfd32a107b18cfdc2c513f2071ecd1f';
const API_URL = 'https://restapi.amap.com/v3/config/district';
const userId = JSON.parse(localStorage.getItem('UserData')).id;
const addressList = ref([]);

const products = ref([]);

const fetchProductsInfo = async () => {
    // 从订单项数据中提取 productId 数组
    const productIds = orderData.value.orderItems.map(item => item.productId);
    try {
        products.value = await productRes.fetchProductsInfo(productIds, userId);
        // 为每个 orderItem 添加 promotion_id 和 totalDiscount
        orderData.value.orderItems.forEach((orderItem, index) => {
            const product = products.value[index];
            const bestPromotion = findBestPromotion(product?.promotions, product?.price);
            orderItem.promotionId = bestPromotion ? bestPromotion.promotion_id : null;
            orderItem.discountAmount = calculateDiscountAmount(product?.promotions, orderItem.quantity, product?.price);
        });
        console.log(orderData.value.orderItems);
    } catch (error) {
        console.error('获取商品信息失败:', error);
    }
};

// 新增状态变量记录地址列表展开状态
const isAddressListExpanded = ref(false);
// 新增状态变量记录当前选中的地址
const selectedAddress = ref(null);

const selectAddress = (item) => {
    selectedAddress.value = item;
};
// 切换地址列表展开状态的方法
const toggleAddressList = () => {
    isAddressListExpanded.value = !isAddressListExpanded.value;
};

const goAddressPage = () => {
    router.push('/pc/user/address');
};
// 表单数据
const addressForm = ref({
    user_id: userId,
    recipient_name: '',
    phone: '',
    addressCascader: [],
    street_address: '',
    is_default: false
});

// 表单校验规则
const addressRules = {
    user_id: [
        {required: true, message: '用户ID不能为空', trigger: 'blur'},
        {type: 'number', message: '用户ID必须为数字', trigger: 'blur'}
    ],
    recipient_name: [
        {required: true, message: '收货人姓名不能为空', trigger: 'blur'}
    ],
    phone: [
        {required: true, message: '联系电话不能为空', trigger: 'blur'},
        {pattern: /^1[3-9]\d{9}$/, message: '请输入正确的手机号码', trigger: 'blur'}
    ],
    addressCascader: [
        {required: true, message: '请选择省市县', trigger: 'change'}
    ],
    street_address: [
        {required: true, message: '详细地址不能为空', trigger: 'blur'}
    ]
};

// 级联选择器的选项数据
const regionOptions = ref([]);
// 级联选择器的配置
const cascaderProps = {
    value: 'adcode',
    label: 'name',
    children: 'districts'
};

// 获取省市县数据
const fetchRegionData = async () => {
    try {
        const response = await axios.get(API_URL, {
            params: {
                key: API_KEY,
                subdistrict: 3, // 返回下三级行政区（省、市、区县）
                extensions: 'base'
            }
        });

        if (response.data.status === '1') {
            // 过滤掉国家层级，只保留省/直辖市数据作为第一级
            const provinces = response.data.districts[0].districts.filter(item => item.level === 'province');
            regionOptions.value = provinces;
        } else {
            ElMessage.error(`数据获取失败：${response.data.info}`);
        }
    } catch (error) {
        ElMessage.error('网络请求出错，请稍后重试');
        console.error(error);
    }
};

const getAddress = async () => {
    await address.getAddress(userId).then(res => {
        addressList.value = res;
        // 页面加载时自动选中默认地址
        const defaultAddress = res.find(item => item.is_default);
        if (defaultAddress) {
            selectedAddress.value = defaultAddress;
        }
        console.log(res);
    }).catch(err => {
        console.log(err);
    });
};

const openEditAddressDialog = async (addressId) => {
    await address.getAddressDetail(addressId).then(res => {
        addressForm.value.recipient_name = res.recipient_name;
        addressForm.value.phone = res.phone;
        addressForm.value.street_address = res.street_address;
        addressForm.value.is_default = res.is_default;
        addressForm.value.addressCascader = res.addressCascader.split(',');
        addressForm.value.address_id = addressId;
        isAdd.value = false;
        dialogFormVisible.value = true;
    }).catch(err => {
        console.log(err);
    });
};
const onSubmit = () => {
    dialogFormVisible.value = false;
    getAddress();
};

const confirmOrder = async () => {
    if (!selectedAddress.value) {
        ElMessage.error('请选择收货地址');
        return;
    }
    try {
        console.log(orderData.value);

        const response = await orderRes.createOrder({
            ...orderData.value,
            addressId: selectedAddress.value.address_id
        });
        console.log('订单创建成功，订单 ID:', response.data);
        const orderId = response.data;
        if (!orderId) {
            return;
        }
        router.push(`/pc/order/${orderId}`);
        ElMessage.success('订单创建成功');
    } catch (error) {
        console.error('订单创建失败:', error);
        ElMessage.error('订单创建失败，请稍后重试');
    }
};

const calculateDiscountAmount = (promotions, quantity, price) => {
    if (!promotions || promotions.length === 0) {
        return 0;
    }
    let totalDiscount = 0;
    for (const promotion of promotions) {
        const availableQuantity = Math.min(promotion.per_user_limit, quantity);
        if (promotion.promotion_type === 'REDUCE_AMOUNT') {
            totalDiscount += promotion.reduce_amount * availableQuantity;
        } else if (promotion.promotion_type === 'DISCOUNT') {
            totalDiscount += price * (1 - promotion.discount_rate) * availableQuantity;
        }
    }
    return totalDiscount;
};

// 计算实付金额的方法
const calculateActualPayment = (price, discountAmount,quantity) => {
    if (!price) {
        return 0;
    }
    return price * quantity - discountAmount;
};

// 找出最优惠的促销活动
const findBestPromotion = (promotions, price) => {
    if (!promotions || promotions.length === 0) {
        return null;
    }
    let bestPromotion = promotions[0];
    let bestDiscount = calculateDiscountAmount([bestPromotion], 1, price);
    for (let i = 1; i < promotions.length; i++) {
        const currentPromotion = promotions[i];
        const currentDiscount = calculateDiscountAmount([currentPromotion], 1, price);
        if (currentDiscount > bestDiscount) {
            bestPromotion = currentPromotion;
            bestDiscount = currentDiscount;
        }
    }
    return bestPromotion;
};

// 计算总计金额
const totalAmount = computed(() => {
    if (!orderData.value || !orderData.value.orderItems) return 0;
    return orderData.value.orderItems.reduce((total, item, index) => {
        const price = products.value[index]?.price || 0;
        return total + price * item.quantity;
    }, 0);
});

// 计算优惠总金额
const totalDiscountAmount = computed(() => {
    if (!orderData.value || !orderData.value.orderItems) return 0;
    return orderData.value.orderItems.reduce((total, item) => {
        return total + item.discountAmount;
    }, 0);
});
const totalActualPayment = computed(() => {
    return totalAmount.value - totalDiscountAmount.value;
})

onMounted(() => {
    const queryOrderData = route.query.orderData;
    if (queryOrderData) {
        orderData.value = JSON.parse(queryOrderData);
        console.log(orderData.value);
    }
    fetchRegionData();
    getAddress();
    selectedAddress.value = addressList.value.find(item => item.is_default);
    fetchProductsInfo();
});
</script>

<style lang="scss" scoped>
// 样式部分保持不变
.placeOrder-div {
  padding: 20px 0;

  .confirmAddress-div, .confirmOrder-div {
    background: white;
    padding: 20px;
    border-radius: 10px;

    h1 {
      font-size: 20px;
    }
  }

  .confirmAddress-div {

    .confirmAddress-header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      margin-bottom: 10px;
    }

    .addressList-div {
      display: grid;
      grid-template-columns: repeat(4, 1fr);
      grid-gap: 20px;
      // 初始状态下，只显示第一行
      &:not(.expanded) {
        max-height: 100px; // 根据实际情况调整高度
        overflow: hidden;
      }

      // 展开状态下，显示所有行
      &.expanded {
        max-height: none;
      }

      .address-card {
        padding: 10px 15px;
        border: 1px solid #ccc;
        border-radius: 10px;
        height: 100px;
        cursor: pointer;
        display: flex;
        align-items: center;
        position: relative;

        &:hover, &.active {
          border: 1px solid #5a99dc;
        }

        &:hover .address-content .edit-button {
          display: block; // 鼠标悬停时显示编辑按钮
        }

        .address-content {
          display: flex;

          .address-info {
            display: flex;
            flex-direction: column;
            gap: 5px;

            .address-header {
              display: flex;
              align-items: center;
              gap: 10px;
            }

            .address-detail {
              font-weight: 600;
              font-size: 14px;
            }

            .address-name,
            .address-phone,
            .address-city,
            .address-detail {
              white-space: nowrap;
              overflow: hidden;
              text-overflow: ellipsis;
              max-width: 100%;
            }
          }

          .edit-button {
            display: none; // 初始状态下隐藏编辑按钮
            position: absolute;
            bottom: 0;
            right: 0;
            background-color: #f0f0f0;
            border-radius: 10px 0 10px 0;
            font-size: 12px;
            padding: 3px 6px;
            cursor: pointer;
            transition: color 0.3s ease;

            &:hover {
              color: #5a99dc;
            }
          }
        }
      }
    }

    .toggleAddressList {
      margin-top: 10px;
    }
  }

  .confirmOrder-div {
    margin-top: 20px;

    h1 {
      margin-bottom: 10px;
    }

    table {
      th {
        width: 215px;
      }

      th.product {
        width: 300px;
      }

      td {
        text-align: center;
      }

      td.product {
        display: flex;
        align-items: center;
        overflow: hidden;
        width: 300px;
        height: 60px;
      }

      img {
        width: 60px;
        height: 60px;
        margin-right: 10px;
      }
    }

    .total-info {
      display: flex;
      justify-content: flex-end;
      align-items: center;
      margin-top: 20px;
      font-size: 14px;
      font-weight: 600;
      gap: 10px;

      .total-price {
        font-size: 16px;
        color: #ff4500;
      }
    }

    .confirmOrder-btn-div {
      display: flex;
      justify-content: flex-end;
      margin-top: 20px;

      .confirmOrder-btn {
        padding: 10px 20px;
        background-color: #5a99dc;
        color: white;
        border: none;
      }
    }
  }
}
</style>