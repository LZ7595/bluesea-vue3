<template>
    <div class="center">
        <el-tabs v-model="activeName">
            <el-tab-pane
                v-for="(tab, index) in tabList"
                :key="index"
                :label="tab.label"
                :name="tab.name"
            >
                <div v-if="activeName === tab.name">
                    <!-- 根据标志位判断渲染逻辑 -->
                    <template v-if="tab.showComponents">
                        <Empty v-if="orderList.length === 0" />
                        <OrderList :orderList="orderList"  v-else />
                        <el-pagination
                            v-if="tab.showComponents && total > 0"
                            @current-change="handleCurrentChange"
                            :current-page="currentPage"
                            :page-size="pageSize"
                            layout="prev, pager, next"
                            :total="total"
                            class="pagination"
                        >
                        </el-pagination>
                    </template>
                    <template v-else>
                        {{ tab.content }}
                    </template>
                </div>
            </el-tab-pane>
        </el-tabs>
    </div>
</template>

<script setup>
import { ref, watch, computed } from 'vue'
import { useRoute } from "vue-router";
import orderRes from "@/request/order";
import { getCookie, parseJwt } from "@/utils/cookieJwt";
import OrderList from "@/components/pc/order/orderList.vue";
import Empty from "@/components/pc/common/empty.vue";

// 提前获取路由对象
const route = useRoute();

// 定义当前激活的 tab 名称，使用可选链操作符
const activeName = ref(route?.query?.tab || 'first');

watch(
    () => route.query,
    (newQuery) => {
        activeName.value = newQuery?.tab || 'first';
    },
    { immediate: true }
);

const userStore = ref(JSON.parse(localStorage.getItem('token')));
// 从 cookie 中获取 JWT 令牌
const jwtToken = getCookie('token');
// 解析从 cookie 中获取的 JWT 令牌
const userInfo = ref(userStore.value ? parseJwt(userStore.value) : jwtToken ? parseJwt(jwtToken) : null);
const userId = userInfo.value ? userInfo.value.id : null;

// 定义订单列表
const orderList = ref([]);
const total = ref(0);

// 定义分页相关数据
const currentPage = ref(1);
const pageSize = ref(10);

// 定义 tab 名称到订单状态的映射
const tabStatusMap = {
    first: null,
    second: 'UNPAID',
    third: 'PAID',
    fourth: 'SHIPPED',
    fifth: 'COMPLETED',
    sixth: 'CANCELED'
};

// 定义 tab 列表，添加 showComponents 标志位和 content 字段
const tabList = [
    { label: '全部订单', name: 'first', showComponents: true },
    { label: '待付款', name: 'second', showComponents: true },
    { label: '待发货', name: 'third', showComponents: true },
    { label: '待收货', name: 'fourth', showComponents: true },
    { label: '已完成', name: 'fifth', showComponents: true },
    { label: '退款/售后', name: 'sixth', showComponents: false, content: '退款/售后服务请联系客服' }
];

// 根据不同的 tab 名称获取订单列表
const getOrders = async (tab) => {
    const status = tabStatusMap[tab];
    try {
        const res = await orderRes.getOrders(userId, status, currentPage.value, pageSize.value);
        orderList.value = res.orders;
        total.value = res.total;
        console.log('获取订单列表成功:', res)
    } catch (error) {
        console.error('获取订单列表失败:', error);
    }
};

// 监听当前激活的 tab 变化
watch(
    () => activeName.value,
    (newTab) => {
        if (newTab !== 'sixth') {
            currentPage.value = 1; // 切换 tab 时重置页码
            getOrders(newTab);
        }
    },
    { immediate: true }
);

// 处理当前页码变化
const handleCurrentChange = (newPage) => {
    currentPage.value = newPage;
    getOrders(activeName.value);
};
</script>

<style scoped>
.center {
    width: 100%;
    padding: 0 20px;

    .pagination{
        padding: 15px 0 10px;
    }
}
</style>