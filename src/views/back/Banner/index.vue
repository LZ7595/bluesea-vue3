<template>
    <div class="action-row">
        <el-button type="primary" :icon="Plus" @click="openDialog(true)">添加</el-button>
        <el-button type="danger" :icon="Delete" @click="deleteSelectedBanners">删除选中</el-button>
    </div>
    <el-table :data="tableData"
              show-overflow-tooltip
              :tooltip-formatter="tableRowFormatter"
              :max-height="tableMaxHeight"
              @sort-change="handleSortChange"
              :default-sort="{ prop: 'update_time', order: 'descending' }"
              :row-key="getRowKey"
              @select="handleSelect"
              @select-all="handleSelectAll"
    >
        <el-table-column type="selection" :width="getColWidth(50)"/>
        <el-table-column fixed prop="id" label="轮播图id" :width="getColWidth(100)" sortable="custom"/>
        <el-table-column prop="image" label="图片" :width="getColWidth(120)"/>
        <el-table-column prop="product_name" label="关联商品名称" :width="getColWidth(120)"/>
        <el-table-column prop="product_id" label="关联商品ID" :width="getColWidth(120)"/>
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
        <el-table-column prop="create_time" label="创建时间" :width="getColWidth(120)" sortable="custom"/>
        <el-table-column prop="update_time" label="修改时间" :width="getColWidth(120)" sortable="custom"/>
        <el-table-column fixed="right" label="操作" :width="getColWidth(160)">
            <template #default="scope">
                <el-button
                        size="small"
                        type="primary"
                        link
                        @click="openDialog(false, scope.row)">
                    编辑
                </el-button>
                <el-button
                        size="small"
                        type="danger"
                        link
                        @click="deleteBanner(scope.row.id)"
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
    <el-dialog v-model="dialog" title="轮播图操作" width="50%" style="padding: 15px 20px">
        <el-form :model="form" label-width="120px">
            <el-form-item label="轮播图id" v-if="!isAdd">
                <el-input v-model="form.id" :disabled="!isAdd"/>
            </el-form-item>
            <el-form-item label="图片">
                <div>
                    <el-upload
                            action="#"
                            :show-file-list="false"
                            :auto-upload="false"
                            @change="handleFileChange"
                    >
                        <template #trigger>
                            <el-button type="primary">选择图片</el-button>
                        </template>
                    </el-upload>
                    <el-image v-if="form.image" :src="getImageSrc(form.image)" alt="预览图片"
                              :preview-src-list="[getImageSrc(form.image)]"
                              style="max-width: 350px; aspect-ratio: 350 / 462.5; margin-top: 10px; display: block;"/>
                </div>
            </el-form-item>
            <el-form-item label="关联商品">
                <el-select v-model="form.product_id" placeholder="请选择关联商品">
                    <el-option
                            v-for="product in productList"
                            :key="product.product_id"
                            :label="product.product_name"
                            :value="product.product_id"
                    />
                </el-select>
            </el-form-item>
            <el-form-item label="状态">
                <el-switch v-model="form.status" active-text="展示" inactive-text="屏蔽"/>
            </el-form-item>
        </el-form>
        <div class="dialog-footer">
            <el-button @click="dialog = false">取消</el-button>
            <el-button type="primary" @click="submitForm">
                {{ isAdd ? '添加' : '保存' }}
            </el-button>
        </div>
    </el-dialog>
</template>

<script setup>
import {ref, onMounted, onUnmounted, reactive} from 'vue';
import {Delete, Plus} from "@element-plus/icons-vue";
import {ElMessage, ElMessageBox} from "element-plus";
import {debounce} from 'lodash-es';
import bannerBackApi from "@/request/back/banner.js";
import {server_URL} from "@/urlConfig.js";
import userBackRes from "@/request/back/user.js";

const search = ref('');

const tableData = ref([]);
// 当前使用的排序字段
const sortField = ref('update_time');
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
const isAdd = ref(true); // 标志变量，true 表示添加，false 表示修改
const loading = ref(false);
const foundBanner = ref({})
const productList = ref([])
const form = reactive({
    id: '',
    image: '',
    product_id: '',
    status: true
})

// 图片上传相关
let bannerUrl = ref('');
const selectedFile = ref(null);

// 定义获取行唯一标识的方法
const getRowKey = (row) => {
    return row.id;
};

// 定义选中行的回调函数
const selectedRows = ref([]);  // 用于存储选中的行数据
const handleSelect = (selection, row) => {
    selectedRows.value = selection;
};
const handleSelectAll = (selection) => {
    selectedRows.value = selection;
};

const reset = () => {
    form.id = '';
    form.image = '';
    form.product_id = '';
    form.status = true;
}
const getProductList = () => {
    bannerBackApi.getProductList().then(res => {
        productList.value = res.data;
    })
}

const openDialog = (isAddFlag, row = null) => {
    dialog.value = true;
    isAdd.value = isAddFlag;
    reset();
    if (!isAddFlag && row) {
        form.id = row.id;
        form.image = row.image;
        form.product_id = row.product_id;
        form.status = row.status;
    }
};

// 切换状态的方法
const toggleStatus = (row) => {
    const confirmMessage = row.status
        ? '确定要屏蔽该轮播图吗？'
        : '确定要展示该轮播图吗？';
    ElMessageBox.confirm(confirmMessage, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
    })
        .then(() => {
            bannerBackApi.changeStatus(row.id, !row.status).then(() => {
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
    bannerBackApi.changeStatus(row.id, originalStatus).then(() => {
        ElMessage.success('状态已成功改变');
        SearchAction();
    }).catch((error) => {
        ElMessage.error('状态改变失败：' + error.message);
        row.status = !originalStatus;
    });
};

const deleteSelectedBanners = () => {
    const selectedIds = selectedRows.value.map(row => row.id);
    console.log('选中的轮播图ID:', selectedIds);
    bannerBackApi.deleteBannerMore(selectedIds).then(() => {
        ElMessage.success('删除成功');
        SearchAction();
    }).catch((error) => {
        ElMessage.error('删除失败：' + error.message);
    });
};

const deleteBanner = async (id) => {
    ElMessageBox.confirm('确定要删除该轮播图吗？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
    }).then(async () => {
        try {
            const res = await bannerBackApi.deleteBanner(id);
            console.log(res);
            ElMessage.success('轮播图删除成功');
            SearchAction();
        } catch (error) {
            ElMessage.error('轮播图删除失败：' + error.message);
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
        const res = await bannerBackApi.getBannerList(
            sortField.value,
            sortOrder.value,
            currentPage.value,
            pageSize.value
        );
        console.log(res);
        total.value = res.data.total;
        tableData.value = res.data.banners;
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
    getProductList();
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
const handleFileChange = (file, fileList) => {
    console.log(fileList);
    console.log(file);
    if (file.status === 'ready') {
        const reader = new FileReader();
        reader.onload = (e) => {
            form.image = e.target.result;
            selectedFile.value = file.raw;
        };
        reader.readAsDataURL(file.raw);
    }
};
const submitForm = async () => {
    try {
        if (selectedFile.value) {
            console.log(selectedFile.value)
            const fileFormData = new FormData();
            fileFormData.append('file', selectedFile.value);

            // 发送文件上传请求
            const uploadResponse = await bannerBackApi.uploadFiles(fileFormData);
            console.log(uploadResponse);
            bannerUrl.value = uploadResponse.data;
        }

        if (bannerUrl.value) {
            form.image = bannerUrl.value;
        }

        if (isAdd.value) {
            await bannerBackApi.addBanner(form);
            ElMessage.success('轮播图添加成功');
        } else {
            await bannerBackApi.updateBanner(form);
            ElMessage.success('轮播图修改成功');
        }
        dialog.value = false;
        SearchAction();
    } catch (error) {
        ElMessage.error('轮播图操作失败：' + error.message);
    }
};
const getImageSrc = (url) => {
    if (url && (url.startsWith('blob:') || url.startsWith('data:'))) {
        return url;
    }
    return server_URL + url;
};

</script>

<style scoped>
.dialog-footer {
    text-align: right;
    margin-top: 15px;
}
</style>

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