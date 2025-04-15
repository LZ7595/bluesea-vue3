<template>
    <div class="action-row">
        <el-input
                v-model="search"
                placeholder="请输入你需要搜索的内容"
                :suffix-icon="Search"
                @keyup.enter="SearchAction"
        />
    </div>
    <el-table :data="tableData"
              show-overflow-tooltip
              :tooltip-formatter="tableRowFormatter"
              :max-height="tableMaxHeight"
              @sort-change="handleSortChange"
              :default-sort="{ prop: 'order_id', order: 'descending' }"
              :row-key="getRowKey"
    >
        <el-table-column fixed prop="order_id" label="订单ID" :width="getColWidth(160)" sortable="custom"/>
        <el-table-column prop="order_no" label="支付宝交易号" :width="getColWidth(160)"/>
        <el-table-column prop="user_id" label="用户ID" :width="getColWidth(160)"/>
        <el-table-column
                prop="order_status"
                label="订单状态"
                :width="getColWidth(120)"
                :filters="[
        { text: '待付款', value: 'UNPAID' },
        { text: '已付款', value: 'PAID' },
        { text: '已发货', value: 'SHIPPED' },
        { text: '已完成', value: 'COMPLETED' },
        { text: '已取消', value: 'CANCELED' },
      ]"
                :filter-method="filterTag"
                filter-placement="bottom-end"
        >
            <template #default="scope">
                <el-tag
                        :type="getTagType(scope.row.order_status)"
                        disable-transitions
                >{{ getTagText(scope.row.order_status) }}
                </el-tag>
            </template>
        </el-table-column>
        <el-table-column prop="total_amount" label="总价" :width="getColWidth(160)"/>
        <el-table-column prop="discount_amount" label="折扣" :width="getColWidth(160)"/>
        <el-table-column prop="payment_amount" label="实付" :width="getColWidth(160)"/>
        <el-table-column prop="create_time" label="创建时间" :width="getColWidth(160)" sortable="custom"/>
        <el-table-column prop="update_time" label="更改时间" :width="getColWidth(160)" sortable="custom"/>
        <el-table-column prop="pay_time" label="支付时间" :width="getColWidth(160)" sortable="custom"/>
        <el-table-column fixed="right" label="操作" :width="getColWidth(160)">
            <template #default="scope">
                <el-button
                        size="small"
                        type="primary"
                        @click="goDetail(scope.row.order_id)"
                        link>
                    查看
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
            title="订单详情"
            :size="windowWidth >= 1025? '50%' : '80%'"
            direction="ltr"
            class="demo-drawer"
    >
        <div class="demo-drawer__content">
            <el-form :model="form">
                <el-form-item label="订单ID" :label-width="formLabelWidth">
                    <el-input v-model="form.order_id" autocomplete="off" disabled/>
                </el-form-item>
                <el-form-item label="支付宝交易号" :label-width="formLabelWidth">
                    <el-input v-model="form.order_no"/>
                </el-form-item>
                <el-form-item label="用户ID" :label-width="formLabelWidth">
                    <el-input v-model="form.user_id"/>
                </el-form-item>
                <el-form-item label="订单状态" :label-width="formLabelWidth">
                    <el-select v-model="form.order_status" placeholder="请选择订单状态" disabled>
                        <el-option label="待付款" value="UNPAID"/>
                        <el-option label="已付款" value="PAID"/>
                        <el-option label="已发货" value="SHIPPED"/>
                        <el-option label="已完成" value="COMPLETED"/>
                        <el-option label="已取消" value="CANCELED"/>
                    </el-select>
                </el-form-item>
                <el-form-item v-if="form.order_status == 'PAID' " label="发货操作" :label-width="formLabelWidth">
                    <el-input v-model="expressInput" placeholder="请输入快递单号"></el-input>
                    <el-button @click="shipOrder">发货</el-button>
                </el-form-item>
                <el-form-item v-if="form.order_status && form.order_status!== 'PAID' && form.order_status!== 'UNPAID'"
                              label="快递单号" :label-width="formLabelWidth">
                    <el-input v-model="form.express" disabled/>
                </el-form-item>
                <el-form-item label="总价" :label-width="formLabelWidth">
                    <el-input v-model="form.total_amount"/>
                </el-form-item>
                <el-form-item label="折扣" :label-width="formLabelWidth">
                    <el-input v-model="form.discount_amount"/>
                </el-form-item>
                <el-form-item label="实付" :label-width="formLabelWidth">
                    <el-input v-model="form.payment_amount"/>
                </el-form-item>
                <el-form-item label="创建时间" :label-width="formLabelWidth">
                    <el-input v-model="form.create_time"/>
                </el-form-item>
                <el-form-item label="更改时间" :label-width="formLabelWidth">
                    <el-input v-model="form.update_time"/>
                </el-form-item>
                <el-form-item label="支付时间" :label-width="formLabelWidth">
                    <el-input v-model="form.pay_time"/>
                </el-form-item>
                <el-form-item label="收货地址" :label-width="formLabelWidth">
                    <div class="address_detail">
                        <div><label>收货人：</label>
                            <span>{{ form.address.recipient_name }}</span></div>
                        <div><label>联系电话：</label>
                            <span>{{ form.address.phone }}</span></div>
                        <div><label>所在地区：</label>
                            <span>{{
                                form.address.province + '/' + form.address.city + '/' + form.address.district
                                }}</span>
                        </div>
                        <div><label>详细地址：</label>
                            <span>{{ form.address.street_address }}</span></div>
                    </div>
                </el-form-item>
                <el-form-item label="订单商品" :label-width="formLabelWidth">
                    <el-table :data="form.order_items" border>
                        <el-table-column prop="product_id" label="商品ID" width="180"/>
                        <el-table-column prop="product.product_name" label="商品名称" width="180"/>
                        <el-table-column prop="product.product_image" label="商品图片" width="180">
                            <template #default="scope">
                                <img :src="server_URL + scope.row.product.product_main_image" alt="商品图片" class="product-image"/>
                            </template>
                        </el-table-column>
                        <el-table-column prop="product.price" label="商品价格" width="180"/>
                        <el-table-column prop="quantity" label="商品数量" width="180"/>
                        <el-table-column prop="unit_price" label="商品单价" width="180"/>
                        <el-table-column prop="discount_amount" label="商品折扣" width="180"/>
                        <el-table-column prop="total_price" label="商品实付" width="180"/>
                    </el-table>
                </el-form-item>
            </el-form>
        </div>
    </el-drawer>
</template>

<script setup>
import {ref, onMounted, onUnmounted, reactive} from 'vue';
import {Search, Plus, Delete, ZoomIn} from "@element-plus/icons-vue";
import userBackRes from "@/request/back/user";
import {ElMessage, ElMessageBox} from "element-plus";
import {validateEmail, validatePhone} from "@/utils/validation";
import orderBackRes from "@/request/back/order.js";

const dialogImageUrl = ref('');
const dialogVisible = ref(false);

const handlePictureCardPreview = (event, url) => {
    event.stopPropagation(); // 阻止事件冒泡
    dialogImageUrl.value = url;
    dialogVisible.value = true;
};

const search = ref('');

const tableData = ref([]);
// 当前使用的排序字段
const sortField = ref('order_id');
// 当前的排序顺序，默认为降序
const sortOrder = ref('DESC');
// 当前页码，初始为第一页
const currentPage = ref(1);
// 每页显示的数量，初始为 15 条
const pageSize = ref(20);
// 总记录数，初始为 0
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
    "order_id": null,
    "order_no": null,
    "user_id": null,
    "express": "",
    "total_amount": "",
    "discount_amount": "",
    "payment_amount": "",
    "order_status": "",
    "create_time": "",
    "update_time": "",
    "pay_time": "",
    "address": {},
    "order_items": []
});
// 根据订单状态返回标签类型
const getTagType = (status) => {
    switch (status) {
        case 'UNPAID':
            return 'warning';
        case 'PAID':
            return 'success';
        case 'SHIPPED':
            return 'info';
        case 'COMPLETED':
            return 'success';
        case 'CANCELED':
            return 'danger';
        default:
            return 'primary';
    }
};

const expressInput = ref('');

// 发货操作方法
const shipOrder = async () => {
    // 验证快递单号是否为空
    if (!expressInput.value.trim()) {
        ElMessage.warning('请输入快递单号');
        return;
    }

    try {
        // 调用后端接口更新订单状态为已发货，并记录快递单号
        const response = await orderBackRes.shipOrder(form.order_id, expressInput.value);
        console.log(response)
        if (response) {
            SearchAction();
            dialog.value = false;
            ElMessage.success('发货成功');
            // 清空输入框
            expressInput.value = '';
        } else {
            ElMessage.error(response.data.message || '发货失败，请稍后重试');
        }
    } catch (error) {
        console.error('发货请求出错:', error);
        ElMessage.error('网络错误，请稍后重试');
    }
};
// 根据订单状态返回标签文本
const getTagText = (status) => {
    switch (status) {
        case 'UNPAID':
            return '待付款';
        case 'PAID':
            return '已付款';
        case 'SHIPPED':
            return '已发货';
        case 'COMPLETED':
            return '已完成';
        case 'CANCELED':
            return '已取消';
        default:
            return '未知状态';
    }
};
// 定义获取行唯一标识的方法
const getRowKey = (row) => {
    return row.id;
};

// 定义选中行的回调函数
const selectedRows = ref([]);  // 用于存储选中的行数据

const goDetail = async (id) => {
    try {
        await orderBackRes.getOrderDetail(id).then(res => {
            Object.assign(form, res);
            dialog.value = true;
        });
    } catch (error) {
        console.error('请求出错:', error);
    }
}

const cancelForm = () => {
    loading.value = false
    dialog.value = false
    clearTimeout(timer)
}

const tableRowFormatter = (data) => {
    return `${data.cellValue}: table formatter`
}
const filterTag = (value, row) => {
    return row.order_status === value

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
        const res = await orderBackRes.Search(
            search.value,
            sortField.value,
            sortOrder.value,
            currentPage.value,
            pageSize.value
        );
        console.log(res);
        total.value = res.total;
        tableData.value = res.orderResponseList;
        console.log(tableData.value)
    } catch (error) {
        console.error('搜索请求出错:', error);
    } finally {
        loadingSearch.value = false;
    }
};

import {debounce} from 'lodash-es';
import {server_URL} from "@/urlConfig.js";

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

.product-image {
    width: 100px;
    height: 100px;
    object-fit: cover;
}

.address_detail {
    display: flex;
    flex-direction: column;
    gap: 10px;
}
</style>

