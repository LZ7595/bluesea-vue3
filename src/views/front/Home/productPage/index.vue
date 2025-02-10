<template>
    <div class="list-div">
        <!-- 排序选项组件 -->
        <SortOptions :sortOptions="sortOptions" @sort-change="handleSortChange"></SortOptions>
        <!-- 商品列表展示 -->
        <div class="goodItemList">
            <GoodItem v-for="item in AndroidGoodList" :key="item.id" :goodItem="item"></GoodItem>
        </div>
        <!-- 分页组件 -->
        <div class="pagination">
            <el-pagination
                    v-model:model-value="currentPage"
                    v-model:page-size="pageSize"
                    :disabled="disabled"
                    :background="background"
                    layout="prev, pager, next"
                    :total="total"
                    @size-change="handleSizeChange"
                    @current-change="handleCurrentChange"
            />
        </div>
    </div>
</template>

<script setup>
import {onBeforeMount, onMounted, ref, watch} from "vue";
import {ElMessage} from "element-plus"; // 引入消息提示组件
import GoodItem from "@/components/pc/product/goodItem.vue";
import SortOptions from "@/components/pc/product/SortOptions.vue";
import request from "@/request/request";
import {useRoute} from 'vue-router';

// 排序选项数组，包含排序字段和对应的显示标签
const sortOptions = [
    {field: 'create_time', label: '上架时间'},
    {field: 'sales_volume', label: '销量'},
    {field: 'price', label: '价格'}
];

const route = useRoute();
const resUrl = ref(null);
const category = ref(null);
// 存储安卓商品列表的响应式数据
const AndroidGoodList = ref([]);
// 当前使用的排序字段
const sortField = ref('create_time');
// 当前的排序顺序，默认为降序
const sortOrder = ref('DESC');
// 当前页码，初始为第一页
const currentPage = ref(1);
// 每页显示的商品数量，初始为 15 条
const pageSize = ref(15);
// 商品的总记录数，初始为 0
const total = ref(0);
// 分页组件的禁用状态，初始为 false
const disabled = ref(false);
// 分页组件是否显示背景样式，初始为 true
const background = ref(true);

// 获取安卓商品列表的异步方法
const getAndroidGoodList = async () => {
    if (resUrl.value === null) {
        return;
    }
    try {
        const res = await request({
            url: `/api/product/${resUrl.value}`,
            method: "get",
            params: {
                page: currentPage.value,
                pageSize: pageSize.value,
                sortField: sortField.value,
                sortOrder: sortOrder.value
            }
        });
        console.log(res.data);
        // 假设后端返回的数据结构包含 productResponseList 和 total 字段
        AndroidGoodList.value = res.data.productResponseList;
        total.value = res.data.total;
    } catch (err) {
        console.log(err);
        // 给用户友好的错误提示
        ElMessage.error('获取商品列表失败，请稍后重试');
    }
};

// 处理排序选项变化的方法
const handleSortChange = (sortInfo) => {
    sortField.value = sortInfo.sortField;
    sortOrder.value = sortInfo.sortOrder;
    currentPage.value = 1; // 排序后回到第一页
    getAndroidGoodList();
};

// 处理每页显示数量变化的方法
const handleSizeChange = (newSize) => {
    pageSize.value = newSize;
    console.log(pageSize.value)
    currentPage.value = 1; // 修改每页数量后回到第一页
    getAndroidGoodList();
};

// 处理当前页码变化的方法
const handleCurrentChange = (newPage) => {
    currentPage.value = newPage;
    getAndroidGoodList();
};

onBeforeMount(() => {
    console.log(route.params.category);
    category.value = route.params.category;
    switch (category.value) {
        case 'apple':
            resUrl.value = 'applePhoneList';
            break;
        case 'android':
            resUrl.value = 'orderPhoneList';
            break;
        case 'pad':
            resUrl.value = 'padList';
            break;
        case 'computer':
            resUrl.value = 'computerList';
            break;
        default:
            resUrl.value = 'lifeList';
            break;
    }
});
onMounted(() => {
    getAndroidGoodList();
});

watch(() => route.params.category, (newCategory) => {
    category.value = newCategory;
    console.log(category.value);
    switch (category.value) {
        case 'apple':
            resUrl.value = 'applePhoneList';
            break;
        case 'android':
            resUrl.value = 'orderPhoneList';
            break;
        case 'pad':
            resUrl.value = 'padList';
            break;
        case 'computer':
            resUrl.value = 'computerList';
            break;
        default:
            resUrl.value = 'lifeList';
            break;
    }
    console.log(resUrl.value);
    getAndroidGoodList();
});
</script>

<style lang="scss">
.goodItemList {
  width: 100%;
  display: grid;
  grid-template-columns: repeat(5, 1fr);
  row-gap: 10px;
  padding: 10px 0 20px;
}

.pagination {
  display: flex;
  justify-content: center;
  padding: 10px 0 20px;
}
</style>