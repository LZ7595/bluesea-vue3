<template>
    <div class="search-page div-page">
        <div class="viewport">
            <div class="search-category">
                <div class="search-category-row selected-row">
                    <label class="title">已选择</label>
                    <div class="selected-content">
                        <!-- 显示已选择的分类 -->
                        <el-tag closable effect="plain" v-for="(item, index) in selectedCategory"
                                @close="handleTagClose(index)" :key="index">{{ item }}
                        </el-tag>
                    </div>
                </div>
                <div class="search-category-row category-row">
                    <label class="title">分类</label>
                    <div class="category-content">
                        <!-- 根据 isSubCategory 状态显示不同内容 -->
                        <span
                            class="category-item"
                            v-for="(item, index) in isSubCategory? brandsByCategory[selectedCategory[0]] : Object.keys(brandsByCategory)"
                            :key="index"
                            @click="handleClick(item)"
                        >
                            {{ item }}
                        </span>
                    </div>
                </div>
                <SortOptions :sortOptions="sortOptions" @sort-change="handleSortChange"></SortOptions>
            </div>
            <div class="goodItemList">
                <GoodItem v-for="item in goodItemList" :goodItem="item" :key="item.id"/>
            </div>
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
    </div>
</template>

<script setup>
import brandsByCategory from '../../../../public/json/brandsByCategory.json';
import { ref, onMounted, watch } from "vue";
import SortOptions from "@/components/pc/product/SortOptions.vue";
import productRes from "@/request/product";
import GoodItem from "@/components/pc/product/goodItem.vue";
import { useRoute } from 'vue-router';

// 存储所有分类
const CategoryList = ref(Object.keys(brandsByCategory));
// 存储已选择的分类
const selectedCategory = ref([]);
// 标记是否显示子分类
const isSubCategory = ref(false);
const sortOptions = [
    { field: 'create_time', label: '上架时间' },
    { field: 'sales_volume', label: '销量' },
    { field: 'price', label: '价格' }
];
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
// 搜索关键词，初始为空
const searchKeyword = ref('');
const goodItemList = ref([]);
const route = useRoute();

const Search = async () => {
    try {
        let selectedCategoryStr = '';
        let selectedBrandStr = '';
        if (selectedCategory.value.length > 0) {
            selectedCategoryStr = selectedCategory.value[0];
            if (selectedCategory.value.length > 1) {
                selectedBrandStr = selectedCategory.value[1];
            }
        }
        const res = await productRes.Search(
            selectedCategoryStr,
            selectedBrandStr,
            searchKeyword.value,
            sortField.value,
            sortOrder.value,
            currentPage.value,
            pageSize.value
        );
        console.log(res);
        total.value = res.total;
        goodItemList.value = res.productResponseList;
    } catch (error) {
        console.error('搜索请求出错:', error);
    }
};

// 处理点击事件
const handleClick = (item) => {
    if (isSubCategory.value) {
        if (selectedCategory.value.length > 1) {
            // 如果已经有主分类和子分类选择，替换子分类
            selectedCategory.value[1] = item;
        } else {
            // 如果只有主分类选择，添加子分类
            selectedCategory.value.push(item);
        }
    } else {
        // 如果当前显示的是主分类，点击后显示该分类下的子分类
        selectedCategory.value = [item];
        isSubCategory.value = true;
    }
    Search();
};

// 处理标签关闭事件
const handleTagClose = (index) => {
    if (index === 0) {
        // 关闭主分类标签，重置状态
        selectedCategory.value = [];
        isSubCategory.value = false;
    } else {
        // 关闭子分类标签，移除子分类
        selectedCategory.value.splice(index, 1);
        if (selectedCategory.value.length === 1) {
            // 如果只剩下主分类，继续显示子分类列表
            isSubCategory.value = true;
        }
    }
    Search();
};

const handleSortChange = (sortInfo) => {
    sortField.value = sortInfo.sortField;
    sortOrder.value = sortInfo.sortOrder;
    currentPage.value = 1; // 排序后回到第一页
    Search();
};

// 处理每页显示数量变化的方法
const handleSizeChange = (newSize) => {
    pageSize.value = newSize;
    currentPage.value = 1; // 修改每页数量后回到第一页
    Search();
};

// 处理当前页码变化的方法
const handleCurrentChange = (newPage) => {
    currentPage.value = newPage;
    Search();
};

onMounted(() => {
    if (route.query.searchVal) {
        searchKeyword.value = route.query.searchVal;
        Search();
    } else {
        // 如果没有传递搜索关键词，也进行一次默认搜索
        Search();
    }
});

// 监听路由变化
watch(() => route.query.searchVal, (newVal) => {
    if (newVal) {
        searchKeyword.value = newVal;
        currentPage.value = 1; // 重置页码为第一页
        Search();
    }
});

</script>

<style scoped>
.search-page {
    padding: 20px 0;
    .search-category-row {
        width: 100%;
        font-size: 16px;
        font-weight: 400;
        background: #fff;

        .title {
            width: 120px;
            height: 40px;
            display: flex;
            align-items: center;
            justify-content: center;
            border-right: var(--el-border-color) 1px solid;
        }
    }

    .selected-row {
        display: flex;
        align-items: center;
        border: var(--el-border-color) 1px solid;

        .selected-content {
            width: 1080px;
            padding: 0 20px;
            display: flex;
            gap: 10px;
        }
    }

    .category-row {
        height: 160px;
        display: flex;
        align-items: flex-start;

        .title {
            height: 100%;
        }

        .category-content {
            width: 1080px;
            height: 100%;
            padding: 15px 10px;

            span.category-item {
                display: inline-block;
                padding: 5px 15px;
                cursor: pointer;
            }

            span.category-item:hover {
                color: #5a99dc;
            }
        }
    }

    .goodItemList {
        width: 100%;
        display: grid;
        grid-template-columns: repeat(5, 1fr);
        row-gap: 10px;
        padding: 20px 0;
    }

    .pagination {
        display: flex;
        justify-content: center;
        padding: 10px 0 20px;
    }
}
</style>