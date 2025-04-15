<template>
    <div class="action-row">
        <el-input
                v-model="search"
                placeholder="请输入你需要搜索的内容"
                :suffix-icon="Search"
                @keyup.enter="SearchAction"
        />
        <el-button type="danger" :icon="Delete" @click="deleteSelectedReviews">删除选中</el-button>
    </div>
    <el-table :data="tableData"
              show-overflow-tooltip
              :tooltip-formatter="tableRowFormatter"
              :max-height="tableMaxHeight"
              @sort-change="handleSortChange"
              :default-sort="{ prop: 'review_time', order: 'descending' }"
              :row-key="getRowKey"
              @select="handleSelect"
              @select-all="handleSelectAll"
    >
        <el-table-column type="selection" :width="getColWidth(50)"/>
        <el-table-column fixed prop="review_id" label="评论ID" :width="getColWidth(100)" sortable="custom"/>
        <el-table-column prop="username" label="评论用户名" :width="getColWidth(120)"/>
        <el-table-column prop="rating" label="评分" :width="getColWidth(120)" sortable="custom"/>
        <el-table-column
                prop="status"
                label="状态"
                width="120"
                :filters="[
        { text: '展示', value: true },
        { text: '屏蔽', value: false },
      ]"
                :filter-method="filterTag"
                filter-placement="bottom-end"
        >
            <template #default="scope">
                <el-tag
                        :type="scope.row.status? 'success' : 'primary'"
                        disable-transitions
                        @click="toggleStatus(scope.row)"
                        style="cursor: pointer"
                >{{ scope.row.status ? '展示' : '屏蔽' }}
                </el-tag
                >
            </template>
        </el-table-column>
        <el-table-column prop="user_id" label="评论用户ID" :width="getColWidth(120)"/>
        <el-table-column prop="review_content" label="评论" :width="getColWidth(160)"/>
        <el-table-column prop="product_name" label="评论商品" :width="getColWidth(160)"/>
        <el-table-column prop="product_id" label="评论商品ID" :width="getColWidth(120)"/>
        <el-table-column prop="review_time" label="评论时间" :width="getColWidth(120)" sortable="custom"/>
        <el-table-column fixed="right" label="操作" :width="getColWidth(160)">
            <template #default="scope">
                <el-button
                        size="small"
                        type="primary"
                        @click="goDetail(scope.row.review_id)"
                        link>
                    查看
                </el-button>
                <el-button
                        size="small"
                        type="danger"
                        link
                        @click="deleteReview(scope.row.review_id)"
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
    <el-dialog v-model="dialog" title="评论详情" width="50%" style="padding: 15px 20px">
        <ReviewCard :review="foundReview"/>
        <template #footer>
            <el-switch v-model="foundReview.status" @change="handleSwitchChange(foundReview)" inline-prompt
                       active-text="展示"
                       inactive-text="屏蔽" />
        </template>
    </el-dialog>
</template>

<script setup>
import {ref, onMounted, onUnmounted} from 'vue';
import {Search, Delete} from "@element-plus/icons-vue";
import {ElMessage, ElMessageBox} from "element-plus";
import {debounce} from 'lodash-es';
import commentBackApi from "@/request/back/comment.js";
import ReviewCard from "@/components/pc/review/reviewCard.vue";

const search = ref('');

const tableData = ref([]);
// 当前使用的排序字段
const sortField = ref('review_time');
// 当前的排序顺序，默认为降序
const sortOrder = ref('DESC');
// 当前页码，初始为第一页
const currentPage = ref(1);
// 每页显示的商品数量，初始为 20 条
const pageSize = ref(20);
// 商品的总记录数，初始为 0
const total = ref(0);
// 分页组件的禁用状态，初始为 false
const disabled = ref(false);
// 分页组件是否显示背景样式，初始为 true
const background = ref(true);

const dialog = ref(false);
const loading = ref(false);
const foundReview = ref({})

// 定义获取行唯一标识的方法
const getRowKey = (row) => {
    return row.review_id;
};

// 定义选中行的回调函数
const selectedRows = ref([]);  // 用于存储选中的行数据
const handleSelect = (selection, row) => {
    selectedRows.value = selection;
};
const handleSelectAll = (selection) => {
    selectedRows.value = selection;
};

// 切换状态的方法
const toggleStatus = (row) => {
    const confirmMessage = row.status
        ? '确定要屏蔽该评论吗？'
        : '确定要展示该评论吗？';
    ElMessageBox.confirm(confirmMessage, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
    })
        .then(() => {
            commentBackApi.changeStatus(row.review_id, !row.status).then(() => {
                ElMessage.success('状态已成功改变');
                SearchAction();
            }).catch((error) => {
                ElMessage.error('状态改变失败：' + error.message);
            });
        })
        .catch(() => {
            ElMessage.info('操作已取消');
        });
};

const handleSwitchChange = (row) => {
    const originalStatus = row.status;
    commentBackApi.changeStatus(row.review_id, originalStatus).then(() => {
        ElMessage.success('状态已成功改变');
        SearchAction();
    }).catch((error) => {
        ElMessage.error('状态改变失败：' + error.message);
        row.status = !originalStatus;
    });

};

// 删除选中商品的方法
const deleteSelectedReviews = () => {
    const selectedIds = selectedRows.value.map(row => row.review_id);
    console.log('选中的商品ID:', selectedIds);
    commentBackApi.deleteReviewMore(selectedIds).then(() => {
        ElMessage.success('删除成功');
        SearchAction();
    }).catch((error) => {
        ElMessage.error('删除失败：' + error.message);
    });
};

const goDetail = async (id) => {
    foundReview.value = tableData.value.find(item => item.review_id === id);
    if (foundReview.value) {
        dialog.value = true;
    }
}

const deleteReview = async (id) => {
    ElMessageBox.confirm('确定要删除该商品吗？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
    }).then(async () => {
        try {
            const res = await commentBackApi.deleteReview(id);
            console.log(res);
            ElMessage.success('商品删除成功');
            SearchAction();
        } catch (error) {
            ElMessage.error('商品删除失败：' + error.message);
        }
    })
}

const tableRowFormatter = (data) => {
    return `${data.cellValue}: table formatter`
}
const filterTag = (value, row) => {
    return row.status === value
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
        const res = await commentBackApi.searchReviewList(
            search.value,
            sortField.value,
            sortOrder.value,
            currentPage.value,
            pageSize.value
        );
        console.log(res);
        total.value = res.data.total;
        tableData.value = res.data.reviews;
        console.log(tableData.value)
    } catch (error) {
        console.error('搜索请求出错:', error);
    } finally {
        loadingSearch.value = false;
    }
};


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
</style>