<template>
    <div class="action-row">
        <el-input
                v-model="search"
                placeholder="请输入你需要搜索的内容"
                :suffix-icon="Search"
                @keyup.enter="SearchAction"
        />
        <el-button type="primary" :icon="Plus" @click="addProduct">添加</el-button>
        <el-button type="danger" :icon="Delete" @click="deleteSelectedPromotions">删除选中</el-button>
    </div>
    <el-table :data="tableData"
              show-overflow-tooltip
              :tooltip-formatter="tableRowFormatter"
              :max-height="tableMaxHeight"
              @sort-change="handleSortChange"
              :default-sort="{ prop: 'create_time', order: 'descending' }"
              :row-key="getRowKey"
              @select="handleSelect"
              @select-all="handleSelectAll"
    >
        <el-table-column type="selection" :width="getColWidth(50)"/>
        <el-table-column fixed prop="promotion_id" label="优惠ID" :width="getColWidth(120)" sortable="custom"/>
        <el-table-column prop="product_id" label="商品ID" :width="getColWidth(120)" sortable="custom"/>
        <el-table-column prop="product_name" label="商品名称" :width="getColWidth(200)"/>
        <el-table-column
                prop="promotion_type"
                label="优惠类型"
                :filters="[
    {text: '折扣促销', value: 'DISCOUNT'},
    {text: '买一送一', value: 'BUY_ONE_GET_ONE'},
    {text: '包邮免运费', value: 'FREE_SHIPPING'},
    {text: '满减优惠', value: 'REDUCE_AMOUNT'}
        ]" :filter-method="filterTag" filter-placement="bottom-end" :formatter="formatPromotionType"
                :width="getColWidth(160)"/>
        <el-table-column prop="discount_rate" label="优惠折扣(小数)" :width="getColWidth(120)"/>
        <el-table-column prop="reduce_amount" label="优惠满减" :width="getColWidth(120)"/>
        <el-table-column prop="price" label="原价" :width="getColWidth(120)"/>
        <el-table-column prop="discount_price" label="折后价" :width="getColWidth(120)"/>
        <el-table-column prop="start_time" label="开始时间" :width="getColWidth(160)" sortable="custom"/>
        <el-table-column prop="end_time" label="结束时间" :width="getColWidth(160)" sortable="custom"/>
        <el-table-column fixed="right" label="操作" :width="getColWidth(160)">
            <template #default="scope">
                <el-button
                        size="small"
                        type="primary"
                        @click="goDetail(scope.row.promotion_id)"
                        link>
                    查看修改
                </el-button>
                <el-button
                        size="small"
                        type="danger"
                        link
                        @click="deletePromotion(scope.row.promotion_id)"
                >
                    删除
                </el-button>
            </template>
        </el-table-column>
    </el-table>
    <div class="pagination">
        <el-pagination
                v-model:model-value="currentPage"
                v-model:page-size="pageSize"
                :disabled="disabled"
                :background="background"
                layout="total, sizes, prev, pager, next, jumper"
                :total="total"
                @size-change="handleSizeChange"
                @current-change="handleCurrentChange"
        />
    </div>
    <el-drawer
            v-model="dialog"
            title="优惠详情"
            :size="windowWidth >= 1025? '50%' : '80%'"
            :before-close="handleClose"
            direction="ltr"
            class="demo-drawer"
    >
        <div class="demo-drawer__content">
            <el-form :model="form">
                <el-form-item label="优惠ID" :label-width="formLabelWidth" v-if="!isAdd">
                    <el-input v-model="form.promotion_id" autocomplete="off" :disabled="!isAdd"/>
                </el-form-item>
                <el-form-item label="商品ID" :label-width="formLabelWidth">
                    <div class="flex-content">
                        <el-input v-model="form.product_id" autocomplete="off" :disabled="!isAdd"/>
                        <el-button @click="SearchProduct">搜索</el-button>
                    </div>
                </el-form-item>
                <div v-if="isSearch">
                    <el-form-item label="商品名称" :label-width="formLabelWidth">
                        <el-input v-model="form.product_name" disabled/>
                    </el-form-item>
                    <el-form-item label="商品主图" :label-width="formLabelWidth">
                        <img :src="form.product_main_image" alt="商品主图" class="form-productMainImage"/>
                    </el-form-item>
                    <el-form-item label="优惠类型" :label-width="formLabelWidth">
                        <el-select
                                v-model="form.promotion_type"
                                placeholder="请选择优惠类型"
                        >
                            <el-option
                                    v-for="p in pomotionTypes"
                                    :key="p.value"
                                    :label="p.label"
                                    :value="p.value"
                            />
                        </el-select>
                    </el-form-item>
                    <el-form-item v-if="form.promotion_type === 'REDUCE_AMOUNT'" label="优惠金额"
                                  :label-width="formLabelWidth">
                        <el-input-number v-model="form.reduce_amount" :min="1" :max="form.price-1" :step="1"
                                         :precision="2"/>
                    </el-form-item>
                    <el-form-item v-if="form.promotion_type === 'DISCOUNT'" label="优惠折扣"
                                  :label-width="formLabelWidth">
                        <el-input-number v-model="form.discount_rate" :min="0.01" :max="0.99" :step="0.01"
                                         :precision="2"/>
                    </el-form-item>
                    <el-form-item label="原价" :label-width="formLabelWidth">
                        <el-input v-model="form.price" autocomplete="off" disabled/>
                    </el-form-item>
                    <el-form-item label="折后价" :label-width="formLabelWidth">
                        <el-input v-model="form.discount_price" autocomplete="off" disabled/>
                    </el-form-item>
                    <el-form-item label="开始时间" :label-width="formLabelWidth">
                        <el-date-picker
                                v-model="form.start_time"
                                type="datetime"
                                placeholder="选择开始时间"
                                format="YYYY-MM-DD HH:mm:ss"
                        />
                    </el-form-item>
                    <el-form-item label="结束时间" :label-width="formLabelWidth">
                        <el-date-picker
                                v-model="form.end_time"
                                type="datetime"
                                placeholder="选择结束时间"
                                format="YYYY-MM-DD HH:mm:ss"
                        />
                    </el-form-item>
                </div>
            </el-form>
            <div class="demo-drawer__footer">
                <el-button @click="cancelForm">取消</el-button>
                <el-button type="primary" :loading="loading" @click="onClick">
                    {{ loading ? '提交中 ...' : (isAdd ? '提交添加' : '提交保存') }}
                </el-button>
            </div>
        </div>
    </el-drawer>
</template>

<script setup>
import {ref, onMounted, onUnmounted, reactive, watch} from 'vue';
import {Search, Plus, Delete} from "@element-plus/icons-vue";
import promotionBackRes from "@/request/back/promotion";
import {ElMessage, ElMessageBox} from "element-plus";
import {calculateDiscountPrice} from "@/utils/calculateDiscountPrice";

const isAdd = ref(false); // 添加标志变量
const isSearch = ref(false); // 搜索标志变量
const search = ref('');

const tableData = ref([]);
// 当前使用的排序字段
const sortField = ref('create_time');
// 当前的排序顺序，默认为降序
const sortOrder = ref('DESC');
// 当前页码，初始为第一页
const currentPage = ref(1);
// 每页显示的优惠数量，初始为 15 条
const pageSize = ref(20);
// 优惠的总记录数，初始为 0
const total = ref(0);
// 分页组件的禁用状态，初始为 false
const disabled = ref(false);
// 分页组件是否显示背景样式，初始为 true
const background = ref(true);

const dialog = ref(false);
const loading = ref(false);
const formLabelWidth = '80px';
let timer;
const form = reactive({
    "promotion_id": "",
    "product_id": "",
    "promotion_type": "",
    "product_name": "",
    "product_main_image": "",
    "start_time": "",
    "end_time": "",
    "discount_rate": "",
    "reduce_amount": "",
    "price": "",
    "discount_price": "",
});
let avatarUrl = ref('');

const addProduct = () => {
    isAdd.value = true;
    // 重置表单数据为默认值
    form.promotion_id = '';
    form.product_id = '';
    form.promotion_type = '';
    form.product_name = '';
    form.product_main_image = '';
    form.start_time = '';
    form.end_time = '';
    form.discount_rate = '';
    form.reduce_amount = '';
    form.price = '';
    form.discount_price = '';
    dialog.value = true;
}

// 定义获取行唯一标识的方法
const getRowKey = (row) => {
    return row.promotion_id;
};


// 定义选中行的回调函数
const selectedRows = ref([]);  // 用于存储选中的行数据
const handleSelect = (selection, row) => {
    selectedRows.value = selection;
};
const handleSelectAll = (selection) => {
    selectedRows.value = selection;
};

// 删除选中优惠的方法
const deleteSelectedPromotions = () => {
    const selectedIds = selectedRows.value.map(row => row.promotion_id);
    console.log('选中的优惠ID:', selectedIds);
    promotionBackRes.deletePromotionMore(selectedIds).then(() => {
        ElMessage.success('删除成功');
        SearchAction();
    }).catch((error) => {
        ElMessage.error('删除失败：' + error.message);
    });
};

const goDetail = async (id) => {
    isAdd.value = false;
    isSearch.value = true;
    try {
        await promotionBackRes.getPromotionDetail(id).then(res => {
            Object.assign(form, res);
            form.discount_price = calculateDiscountPrice(res);
            dialog.value = true;
        });
    } catch (error) {
        console.error('请求出错:', error);
    }
}
const deletePromotion = async (id) => {
    console.log(id);
    ElMessageBox.confirm('确定要删除该优惠吗？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
    }).then(async () => {
        try {
            const res = await promotionBackRes.deletePromotion(id);
            console.log(res);
            ElMessage.success('优惠删除成功');
            SearchAction();
        } catch (error) {
            ElMessage.error('优惠删除失败：' + error.message);
        }
    })
}


const pomotionTypes = ref([
    {label: '折扣促销', value: 'DISCOUNT'},
    {label: '买一送一', value: 'BUY_ONE_GET_ONE'},
    {label: '包邮免运费', value: 'FREE_SHIPPING'},
    {label: '满减优惠', value: 'REDUCE_AMOUNT'},
])

const SearchProduct = async () => {
    if (!isAdd.value) {
        return;
    }
    try {
        const res = await promotionBackRes.getProductDetail(form.product_id);
        form.product_name = res.product_name;
        form.price = res.price;
        form.product_main_image = res.product_main_image;
        isSearch.value = true
    } catch (error) {
        ElMessage.error('商品查询失败：' + error.message);
    }
}

const onClick = async () => {
    loading.value = true;
    try {
        console.log(form)
        let isValid = Object.entries(form).every(([key, value]) => {
            console.log(key, value)
            if (key === 'promotion_id' || key === 'discount_price') {
                return true; // promotion_id 可以为空
            }

            if (['BUY_ONE_GET_ONE', 'FREE_SHIPPING'].includes(form.promotion_type)) {
                if (['reduce_amount', 'discount_rate'].includes(key)) {
                    form.reduce_amount = null;
                    form.discount_rate = null;
                    return true; // 在这两种类型下，reduce_amount 和 discount_rate 可以为空
                }
            }

            // 定义促销类型和对应必填字段的映射
            const requiredFields = {
                DISCOUNT: 'discount_rate',
                REDUCE_AMOUNT: 'reduce_amount'
            };

            const requiredField = requiredFields[form.promotion_type];

            if (requiredField) {
                if (key === requiredField) {
                    // 如果是对应促销类型的必填字段，确保其不为空
                    if (key === 'discount_rate') {
                        form.reduce_amount = null;
                    } else if (key === 'reduce_amount') {
                        form.discount_rate = null;
                    }
                    return value !== '';
                } else if (['discount_rate', 'reduce_amount'].includes(key)) {
                    // 如果是非对应促销类型的相关字段，置为 null 并允许为空
                    if (key === 'discount_rate') {
                        form.discount_rate = null;
                    } else if (key === 'reduce_amount') {
                        form.reduce_amount = null;
                    }
                    return true;
                }
            }
            return value !== '';
        });

        if (isValid) {
            console.log('促销信息有效');
        } else {
            console.log('促销信息无效');
            return;

        }

        if (isAdd.value) {
            // 调用添加优惠的接口
            await promotionBackRes.addPromotion(form);
        } else {
            // 调用修改优惠的接口
            await promotionBackRes.updatePromotion(form);
        }

        // 提示操作成功
        ElMessage.success(isAdd.value ? '优惠添加成功' : '优惠信息修改成功');
        // 关闭抽屉
        dialog.value = false;
        await SearchAction();
    } catch (error) {
        // 提示操作失败
        ElMessage.error(isAdd.value ? '优惠添加失败：' + error.message : '优惠信息修改失败：' + error.message);
        console.log(error);
    } finally {
        loading.value = false;
    }
};
const handleClose = (done) => {
    if (loading.value) {
        return
    }
    ElMessageBox.confirm('需要提交保存吗', {
        confirmButtonText: '提交',
        cancelButtonText: '不提交',
    })
        .then(async () => {
            loading.value = true
            const isSubmitSuccess = await onClick();
            if (isSubmitSuccess) {
                done(); // 提交成功后关闭抽屉
                loading.value = false
                isSearch.value = false
            }
        })
        .catch(() => {
                done()
                isSearch.value = false
            }
        )
}

const cancelForm = () => {
    loading.value = false
    dialog.value = false
    clearTimeout(timer)
}

const tableRowFormatter = (data) => {
    return `${data.cellValue}: table formatter`
}

const filterTag = (value, row, column) => {
    // 过滤方法的具体实现
    return row[column.property] === value;
}

const handleSortChange = ({prop, order}) => {
    // 将排序顺序转换为后端需要的格式
    sortOrder.value = order === 'ascending' ? 'ASC' : 'DESC';
    // 发送请求到后端获取排序后的数据
    sortField.value = prop;
    currentPage.value = 1; // 排序后回到第一页
    SearchAction();
}

const loadingSearch = ref(false);
const SearchAction = async () => {
    loadingSearch.value = true;
    try {
        const res = await promotionBackRes.Search(
            search.value,
            sortField.value,
            sortOrder.value,
            currentPage.value,
            pageSize.value
        );
        console.log(res);
        total.value = res.total;
        tableData.value = res.promotionResponseList;
        console.log(tableData.value)
    } catch (error) {
        console.error('搜索请求出错:', error);
    } finally {
        loadingSearch.value = false;
    }
};

const formatPromotionType = (row, column, cellValue) => {
    const filters = [
        {text: '折扣促销', value: 'DISCOUNT'},
        {text: '买一送一', value: 'BUY_ONE_GET_ONE'},
        {text: '包邮免运费', value: 'FREE_SHIPPING'},
        {text: '满减优惠', value: 'REDUCE_AMOUNT'}
    ];
    const filter = filters.find(f => f.value === cellValue);
    return filter ? filter.text : cellValue;
}

import {debounce} from 'lodash-es';

const debouncedSearch = debounce(SearchAction, 300);
const handleSizeChange = (newSize) => {
    pageSize.value = newSize;
    currentPage.value = 1; // 修改每页数量后回到第一页
    SearchAction();
};

// 处理当前页码变化的方法
const handleCurrentChange = (newPage) => {
    currentPage.value = newPage;
    SearchAction();
};

// 存储视口宽度
const windowWidth = ref(window.innerWidth);
const tableMaxHeight = ref(window.innerHeight - 180);

// 监听窗口大小变化
const handleResize = () => {
    windowWidth.value = window.innerWidth;
    tableMaxHeight.value = window.innerHeight - 180;
};

// 挂载时添加事件监听器
onMounted(() => {
    window.addEventListener('resize', handleResize);
    SearchAction();
});

// 卸载时移除事件监听器
onUnmounted(() => {
    window.removeEventListener('resize', handleResize);
});

// 计算列宽的函数
// 计算列宽的函数，添加 flexed 参数，默认值为 false
const getColWidth = (pxWidth) => {
    if (windowWidth.value >= 1025) {
        // 视口宽度大于等于 1025px 时的计算
        return (pxWidth / 100) * ((windowWidth.value - 40 - 150) / 10);
    } else {
        return (pxWidth / 100) * ((windowWidth.value - 40) / 10);
    }
};
watch(
    () => [form.promotion_type, form.reduce_amount, form.discount_rate, form.price],
    () => {
        form.discount_price = calculateDiscountPrice(form);
        console.log(form)
    },
    {immediate: true}
);
</script>

<style>
.action-row {
    width: 100%;
    display: flex;
    gap: 1vw;

    .el-button + .el-button {
        margin-left: 0;
    }
}

.el-table {
    .cell {
        padding: 0 1.5vw;
        line-height: normal;

        .caret-wrapper {
            width: 0;
        }
    }

    .el-table__row {
        .el-table__cell:last-child .cell {
            display: flex;
            justify-content: space-around;

            .el-button + .el-button {
                margin-left: 0;
            }
        }
    }
}

.pagination {
    width: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
}

.demo-drawer {
    .demo-drawer__content {
        .flex-content {
            width: 100%;
            display: flex;
            justify-content: space-between;
        }

        .form-productMainImage {
            width: 20vw;
            height: 20vw;
            min-width: 200px;
            min-height: 200px;
            object-fit: contain;
            border: #5a99dc 1px dashed;
        }
    }
}

@media (min-width: 1025px) {
    .el-table, .action-row, .pagination {
        width: calc(100vw - 40px - 150px);
    }

    .action-row {
        .el-input {
            width: 25vw;
        }
    }
}

@media (min-width: 768px) and (max-width: 1024px) {
    .el-table, .action-row, .pagination {
        width: calc(100vw - 40px);
        font-size: 1.4vw; /* 可以根据需要调整字体大小 */

        .el-table__cell {
            padding: 0.8vw 0;
        }

        .cell {
            .el-checkbox__inner {
                width: 1.5vw;
                height: 1.5vw;
            }

            .el-checkbox__inner::after {
                width: 0.321vw;
                height: 0.75vw;
                top: 7.1%;
                left: 28.6%;
            }

            .el-checkbox__inner:before {
                top: 48%;
            }
        }

    }

    .el-table {
        .el-button, .el-tag {
            font-size: 1.4vw; /* 可以根据需要调整按钮字体大小 */
        }

        .el-tag {
            padding: 0.2vw 1vw;
            height: 2.1vw;
        }
    }

    .action-row {
        .el-input {
            width: 40vw;
            font-size: 1.4vw;
            line-height: normal;

            .el-input__inner {
                height: 3vw;
                line-height: normal;
            }
        }

        .el-button, .el-tag {
            font-size: 1.4vw;
            padding: 0.2vw 1vw;
            height: 4vw;
        }
    }
}

@media (max-width: 768px) {
    .el-table, .action-row, .pagination {
        width: calc(100vw - 40px);
        font-size: 2vw; /* 可以根据需要调整字体大小 */

        .el-table__cell {
            padding: 0.8vw 0;
        }

        .cell {
            .el-checkbox__inner {
                width: 2vw;
                height: 2vw;
            }

            .el-checkbox__inner::after {
                width: 0.428vw;
                height: 1vw;
                top: 7.1%;
                left: 28.6%;
            }

            .el-checkbox__inner:before {
                top: 33.3%;
            }
        }

    }

    .el-table {
        .el-button, .el-tag {
            font-size: 1.6vw; /* 可以根据需要调整按钮字体大小 */
        }

        .el-tag {
            padding: 0.2vw 0.5vw;
            height: 3vw;
        }
    }

    .action-row {
        .el-input {
            width: 40vw;
            font-size: 2vw;
            line-height: normal;

            .el-input__inner {
                height: 3vw;
                line-height: normal;
            }
        }

        .el-button {
            font-size: 2vw;
            padding: 0.2vw 1vw;
            height: 6vw;
        }
    }
}

@media (min-width: 1200px) {
    .pagination .el-pagination {
        transform: scale(1)
    }
}

@media (min-width: 768px) and (max-width: 1199px) {
    .pagination .el-pagination {
        transform: scale(0.8)
    }
}

@media (max-width: 767px) {
    .pagination .el-pagination {
        transform: scale(0.7)
    }

    .el-table {
        .caret-wrapper {
            height: 2vw;
            transform: scale(0.8);
        }
    }
}

@media (max-width: 576px) {
    .pagination .el-pagination {
        transform: scale(0.6)
    }

    .el-table {
        .caret-wrapper {
            height: 12px;
            transform: scale(0.6);
        }
    }
}
</style>