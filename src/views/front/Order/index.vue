<template>
    <div class="order-page">
        <div class="viewport">
            <div class="order-div">
                <div class="order-content" v-if="orderDetails">
                    <div class="order-header">
                        <h2>{{ getChineseStatus(orderDetails.order_status) }}</h2>
                        <div class="address-info">
                            <el-icon size="20">
                                <Location/>
                            </el-icon>
                            <div>
                                <p class="street_address">{{ orderDetails.address.street_address }}</p>
                                <p class="address-recipient">{{ orderDetails.address.recipient_name }}
                                    {{ orderDetails.address.phone }}</p>
                            </div>
                        </div>
                        <div class="order-action">
                            <el-button type="primary" @click="pay" v-if="orderDetails.order_status == 'UNPAID'">付款</el-button>
                            <el-button type="primary" @click="cancelOrder" v-if="orderDetails.order_status == 'UNPAID'">取消订单</el-button>
                            <el-button type="primary" @click="confirmOrder" v-if="orderDetails.order_status == 'SHIPPED'">确认收货</el-button>
                        </div>
                    </div>
                    <div class="order-body">
                        <h2>订单详情</h2>
                        <div class="order-item" v-for="item in orderDetails.order_items" :key="item.product_id">
                            <div class="product-info">
                                <img :src="server_URL + item.product.product_main_image" alt="商品图片">
                                <p>{{ item.product.product_name }}</p>
                            </div>
                            <div class="product-price">
                                <p>￥{{ item.product.price }}</p>
                                <p>x{{ item.quantity }}</p>
                            </div>
                        </div>
                    </div>
                    <div class="order-footer">
                        <div class="order-total">
                            <div class="left">商品总价</div>
                            <div class="right">￥{{ orderDetails.total_amount }}</div>
                        </div>
                        <div class="order-total">
                            <div class="left">店铺优惠</div>
                            <div class="right orange">减￥{{ orderDetails.discount_amount }}</div>
                        </div>
                        <div class="order-total">
                            <div class="left">需付款</div>
                            <div class="right">￥{{ orderDetails.payment_amount }}</div>
                        </div>
                        <div class="order-row">
                            <div class="order-row-title">订单编号</div>
                            <div class="order-row-content">{{ orderDetails.order_id }}</div>
                        </div>
                        <div class="order-row">
                            <div class="order-row-title">支付宝交易号</div>
                            <div class="order-row-content">{{ orderDetails.order_no }}</div>
                        </div>
                        <div class="order-row">
                            <div class="order-row-title">订单创建时间</div>
                            <div class="order-row-content">{{ orderDetails.create_time }}</div>
                        </div>
                    </div>
                </div>
                <div v-else>
                    <p>正在加载订单详情...</p>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import {ref, onMounted} from 'vue';
import {useRoute} from 'vue-router';
import orderRes from "@/request/order";
import {Location} from "@element-plus/icons-vue";
import {ElMessage} from "element-plus";
import {server_URL} from "@/urlConfig.js";

// 获取当前路由信息
const route = useRoute();
// 定义 orderId 变量
const orderId = ref('');
// 定义订单详情变量
const orderDetails = ref(null);

const fetchOrderDetails = async () => {
    try {
        await orderRes.getOrderDetails(orderId.value).then(res => {
            orderDetails.value = res;
            console.log(res);
        })
    } catch (error) {
        console.error('获取订单详情失败:', error);
    }
}
const getChineseStatus = (status) => {
    switch (status) {
        case 'UNPAID':
            return '待支付';
        case 'PAID':
            return '已支付，待发货';
        case 'SHIPPED':
            return '已发货，待收货';
        case 'COMPLETED':
            return '已完成';
        case 'CANCELED':
            return '已取消';
        default:
            return '未知状态';
    }
}
const pay = async () => {
    try {
        // 调用支付接口
        const response = await orderRes.payOrder(orderId.value)

        // 处理支付宝返回的表单
        const div = document.createElement('div');
        div.innerHTML = response.data;
        document.body.appendChild(div);
        document.forms[0].submit();

        ElMessage.success('正在跳转支付页面...');
    } catch (error) {
        console.error('支付请求失败:', error);
        ElMessage.error(error.response?.data?.message || '支付请求失败');
    }
};
const cancelOrder = async () => {
    try {
      await orderRes.cancelOrder(orderId.value);
        ElMessage.success('订单已取消');
        fetchOrderDetails();
    } catch (error) {
        console.error('取消订单失败:', error);
        ElMessage.error(error.response?.data?.message || '取消订单失败');
    }
}
const confirmOrder = async () => {
    try {
      const res = await orderRes.confirmOrder(orderId.value);
      if (res.status === 200) {
          ElMessage.success('订单已确认');
          fetchOrderDetails();
      }
    } catch (error) {
        console.error('确认订单失败:', error);
        ElMessage.error(error.response?.data?.message || '确认订单失败');
    }
}
onMounted(async () => {
    // 获取路由中的 orderId
    orderId.value = route.params.order_id;
    fetchOrderDetails();

});
</script>

<style lang="scss" scoped>
.order-page {
  background-color: #f5f5f5;
  width: 100vw;
  min-width: 1200px;
  padding: 20px 0;

  .order-div {
    width: 100%;
    background: white;
    min-height: 600px;
    padding: 20px;

    .order-content {
      display: flex;
      flex-direction: column;
      gap: 20px;

      .order-header {
        display: flex;
        flex-direction: column;
        gap: 20px;

        h2 {
          font-size: 24px;
          font-weight: 600;
        }

        .address-info {
          display: flex;
          gap: 10px;

          .street_address {
            font-size: 16px;
            font-weight: 400;
            margin-bottom: 5px;
          }

          .address-recipient {
            font-size: 14px;
            font-weight: 400;
            color: #999;
          }
        }
      }

      .order-body {
        h2 {
          font-size: 24px;
        }

        .order-item {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 20px;

          .product-info {
            display: flex;
            align-items: center;
            gap: 10px;

            img {
              width: 100px;
              height: 100px;
            }

            p {
              font-size: 16px;
              font-weight: 400;
            }
          }

          .product-price {
            display: flex;
            gap: 10px;

            p {
              font-size: 16px;
              font-weight: 400;
            }
          }
        }
      }

      .order-footer {
        display: flex;
        flex-direction: column;
        gap: 15px;

        .order-total {
          display: flex;
          justify-content: space-between;

          .left, .right {
            font-weight: 400;
            font-size: 16px;
          }

          .left {
            color: #999;

          }

          .right {
            font-weight: 600;
          }

          .orange {
            color: #ff6700;
          }
        }

        .order-row {
          display: flex;
          gap: 20px;

          .order-row-title {
            font-size: 16px;
            width: 120px;
            font-weight: 400;
            color: #999;
          }

          .order-row-content {
            font-size: 16px;
            font-weight: 400;
          }
        }
      }
    }
  }
}
</style>