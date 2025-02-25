<template>
    <div class="action-row">
        <el-input
                v-model="search"
                placeholder="请输入你需要搜索的内容"
                :suffix-icon="Search"
                @keyup.enter="SearchAction"
        />
        <el-button type="primary" :icon="Plus" @click="addProduct">添加</el-button>
        <el-button type="danger" :icon="Delete" @click="deleteSelectedProducts">删除选中</el-button>
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
        <el-table-column fixed prop="product_id" label="商品ID" :width="getColWidth(160)" sortable="custom"/>
        <el-table-column prop="product_name" label="商品名称" :width="getColWidth(240)"/>
        <el-table-column
                prop="status"
                label="状态"
                width="120"
                :filters="[
        { text: '已上架', value: true },
        { text: '已下架', value: false },
      ]"
                :filter-method="filterTag"
                filter-placement="bottom-end"
        >
            <template #default="scope">
                <el-tag
                        :type="scope.row.status? 'success' : 'primary'"
                        disable-transitions
                >{{ scope.row.status ? '已上架' : '已下架' }}
                </el-tag
                >
            </template>
        </el-table-column>
        <el-table-column prop="category_name" label="类别" :width="getColWidth(120)"/>
        <el-table-column prop="brand_name" label="品牌" :width="getColWidth(160)"/>
        <el-table-column prop="product_description" label="描述" :width="getColWidth(500)"/>
        <el-table-column prop="price" label="价格" :width="getColWidth(120)" sortable="custom"/>
        <el-table-column prop="stock" label="库存" :width="getColWidth(120)" sortable="custom"/>
        <el-table-column prop="quality" label="成色" :width="getColWidth(120)"/>
        <el-table-column prop="sales_volume" label="销量" :width="getColWidth(120)" sortable="custom"/>
        <el-table-column prop="create_time" label="上架时间" :width="getColWidth(160)" sortable="custom"/>
        <el-table-column prop="update_time" label="修改时间" :width="getColWidth(160)" sortable="custom"/>
        <el-table-column fixed="right" label="操作" :width="getColWidth(160)">
            <template #default="scope">
                <el-button
                        size="small"
                        type="primary"
                        @click="goDetail(scope.row.product_id)"
                        link>
                    查看修改
                </el-button>
                <el-button
                        size="small"
                        type="danger"
                        link
                        @click="deleteProduct(scope.row.product_id)"
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
            title="商品详情"
            :size="windowWidth >= 1025? '50%' : '80%'"
            :before-close="handleClose"
            direction="ltr"
            class="demo-drawer"
    >
        <div class="demo-drawer__content">
            <el-form :model="form">
                <el-form-item label="商品ID" :label-width="formLabelWidth" v-if="!isAdd">
                    <el-input v-model="form.product_id" autocomplete="off" :disabled="!isAdd"/>
                </el-form-item>
                <el-form-item label="商品名称" :label-width="formLabelWidth">
                    <el-input v-model="form.product_name" autocomplete="off"/>
                </el-form-item>
                <el-form-item label="商品类别" :label-width="formLabelWidth">
                    <el-select
                            v-model="form.category_name"
                            placeholder="请选择商品类别"
                            @change="onCategoryChange()"
                    >
                        <el-option
                                v-for="category in Object.keys(categoryBrandData)"
                                :key="category"
                                :label="category"
                                :value="category"
                        />
                    </el-select>
                </el-form-item>
                <el-form-item label="商品品牌" :label-width="formLabelWidth">
                    <el-select
                            v-model="form.brand_name"
                            placeholder="请选择商品品牌"
                    >
                        <el-option
                                v-for="brand in currentBrands"
                                :key="brand"
                                :label="brand"
                                :value="brand"
                        />
                    </el-select>
                </el-form-item>
                <el-form-item label="展示状态" :label-width="formLabelWidth">
                    <el-switch
                            v-model="form.status"
                            class="ml-2"
                            inline-prompt
                            style="--el-switch-on-color: #13ce66; --el-switch-off-color: #ff4949"
                            active-text="已上架"
                            inactive-text="已下架"
                    />
                </el-form-item>
                <el-form-item label="是否推荐" :label-width="formLabelWidth">
                    <el-switch
                            v-model="form.recommended"
                            class="ml-2"
                            inline-prompt
                            style="--el-switch-on-color: #13ce66; --el-switch-off-color: #ff4949"
                            active-text="已推荐"
                            inactive-text="未推荐"
                    />
                </el-form-item>
                <el-form-item label="商品描述" :label-width="formLabelWidth">
                    <el-input v-model="form.product_description" type="textarea"/>
                </el-form-item>
                <el-form-item label="商品成色" :label-width="formLabelWidth">
                    <el-input v-model="form.quality"/>
                </el-form-item>
                <el-form-item label="商品价格" :label-width="formLabelWidth">
                    <el-input-number v-model="form.price" :min="0" :max="100000" :step="1" :precision="2"/>
                </el-form-item>
                <el-form-item label="商品库存" :label-width="formLabelWidth">
                    <el-input-number v-model="form.stock" :min="0" :max="100000" :step="1" :precision="0"/>
                </el-form-item>
                <el-form-item label="商品图片" :label-width="formLabelWidth">
                    <el-upload action="#" list-type="picture-card" :auto-upload="false" :file-list="existingFiles"
                               @change="handleFileChange">
                        <el-icon>
                            <Plus/>
                        </el-icon>

                        <template #file="{ file }">
                            <div>
                                <img class="el-upload-list__item-thumbnail" :src="file.url" alt=""/>
                                <span class="el-upload-list__item-actions">
          <span
                  class="el-upload-list__item-preview"
                  @click="handlePictureCardPreview(file)"
          >
            <el-icon><zoom-in/></el-icon>
          </span>
          <span
                  v-if="!disableds"
                  class="el-upload-list__item-delete"
                  @click="handleDownload(file)"
          >
            <el-icon><Download/></el-icon>
          </span>
          <span
                  v-if="!disabled"
                  class="el-upload-list__item-delete"
                  @click="handleRemove(file)"
          >
            <el-icon><Delete/></el-icon>
          </span>
        </span>
                            </div>
                        </template>
                    </el-upload>

                    <el-dialog v-model="dialogVisible">
                        <img style="width: 100%" :src="dialogImageUrl" alt="Preview Image"/>
                    </el-dialog>
                </el-form-item>
                <el-tag type="danger">注意：第一张图默认为主图，暂不能直接更改</el-tag>
                <el-form-item label="促销优惠" :label-width="formLabelWidth">
                    <div>
                        <div v-if="form.promotions.length === 0" class="text-gray-400">暂无优惠</div>
                        <div v-else class="promotion-form">
                            <div v-for="(item,index) in form.promotions" class="promotion-form-item">
                                <el-form-item label="优惠id" :label-width="formLabelWidth">
                                    <el-input v-model="item.promotion_id" disabled/>
                                </el-form-item>
                                <el-form-item label="优惠类型" :label-width="formLabelWidth">
                                    <el-select
                                            v-model="item.promotion_type"
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
                                <el-form-item v-if="item.promotion_type === 'REDUCE_AMOUNT'" label="优惠金额"
                                              :label-width="formLabelWidth">
                                    <el-input-number v-model="item.reduce_amount" :min="1" :max="item.price-1" :step="1"
                                                     :precision="2"/>
                                </el-form-item>
                                <el-form-item v-if="item.promotion_type === 'DISCOUNT'" label="优惠折扣"
                                              :label-width="formLabelWidth">
                                    <el-input-number v-model="item.discount_rate" :min="0.01" :max="0.99" :step="0.01"
                                                     :precision="2"/>
                                </el-form-item>
                                <el-form-item label="开始时间" :label-width="formLabelWidth">
                                    <el-date-picker
                                            v-model="item.start_time"
                                            type="datetime"
                                            placeholder="选择开始时间"
                                            format="YYYY-MM-DD HH:mm:ss"
                                    />
                                </el-form-item>
                                <el-form-item label="结束时间" :label-width="formLabelWidth">
                                    <el-date-picker
                                            v-model="item.end_time"
                                            type="datetime"
                                            placeholder="选择结束时间"
                                            format="YYYY-MM-DD HH:mm:ss"
                                    />
                                </el-form-item>
                            </div>
                        </div>
                        <el-button type="primary" @click="addPromotionItem">添加优惠</el-button>
                    </div>
                </el-form-item>
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
import {ref, onMounted, onUnmounted, reactive, watch, computed} from 'vue';
import {Search, Plus, Delete, Download, ZoomIn} from "@element-plus/icons-vue";
import productBackRes from "@/request/back/product";
import {ElMessage, ElMessageBox} from "element-plus";
import brandsByCategory from "../../../../public/json/brandsByCategory.json";

const dialogImageUrl = ref('');
const dialogVisible = ref(false);
const disableds = ref(false);
const isAdd = ref(false); // 添加标志变量

const handlePictureCardPreview = (file) => {
    dialogImageUrl.value = file.url;
    dialogVisible.value = true;
    console.log(file);
}

const handleDownload = (file) => {
    console.log(file);
}

const search = ref('');

const tableData = ref([]);
// 当前使用的排序字段
const sortField = ref('create_time');
// 当前的排序顺序，默认为降序
const sortOrder = ref('DESC');
// 当前页码，初始为第一页
const currentPage = ref(1);
// 每页显示的商品数量，初始为 15 条
const pageSize = ref(20);
// 商品的总记录数，初始为 0
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
    "product_id": null,
    "product_name": "",
    "status": true,
    "category_name": "",
    "brand_name": "",
    "product_description": "",
    "price": 0,
    "quality": "",
    "stock": 0,
    "recommended": false,
    "sales_volume": 0,
    "create_time": null,
    "update_time": null,
    "imageUrls": []
});

const addProduct = () => {
    isAdd.value = true;
    // 重置表单数据为默认值
    form.product_id = null;
    form.product_name = "";
    form.status = true;
    form.category_name = "";
    form.brand_name = "";
    form.product_description = "";
    form.price = 0;
    form.quality = "";
    form.stock = 0;
    form.recommended = false;
    form.sales_volume = 0;
    form.create_time = null;
    form.update_time = null;
    form.imageUrls = [];
    form.promotions = [];
    existingFiles.value = [];
    dialog.value = true;
}

// 定义获取行唯一标识的方法
const getRowKey = (row) => {
    return row.product_id;
};

// 定义选中行的回调函数
const selectedRows = ref([]);  // 用于存储选中的行数据
const handleSelect = (selection, row) => {
    selectedRows.value = selection;
};
const handleSelectAll = (selection) => {
    selectedRows.value = selection;
};

// 删除选中商品的方法
const deleteSelectedProducts = () => {
    const selectedIds = selectedRows.value.map(row => row.product_id);
    console.log('选中的商品ID:', selectedIds);
    productBackRes.deleteProductMore(selectedIds).then(() => {
        ElMessage.success('删除成功');
        SearchAction();
    }).catch((error) => {
        ElMessage.error('删除失败：' + error.message);
    });
};

const unUploadedFiles = ref([]);
const suUploadedFiles = ref([]);
const handleFileChange = (file, fileList) => {
    unUploadedFiles.value = fileList.filter((f) => f.status === 'ready');
    suUploadedFiles.value = fileList.filter((f) => f.status === 'success');
    existingFiles.value = [ ...suUploadedFiles.value,...unUploadedFiles.value];
    console.log('未上传的文件列表:', unUploadedFiles.value);
    console.log('已上传的文件列表:', suUploadedFiles.value);
    console.log('现有文件列表:', existingFiles.value);
};

const goDetail = async (id) => {
    isAdd.value = false;
    try {
        await productBackRes.getProductDetail(id).then(res => {
            Object.assign(form, res);
            // 将 imageUrls 转换为 existingFiles 格式
            existingFiles.value = form.imageUrls.map((url, index) => ({
                name: `image${index + 1}`,
                url: url
            }));
            dialog.value = true;
        });
    } catch (error) {
        console.error('请求出错:', error);
    }
}

const categoryBrandData = ref(brandsByCategory);
const currentBrands = ref([]);
// 处理商品类别选择变化
const onCategoryChange = () => {
    currentBrands.value = categoryBrandData.value[form.category_name] || [];
    if (!currentBrands.value.includes(form.brand_name)) {
        form.brand_name = '';
    }
};
const pomotionTypes = ref([
    {label: '折扣促销', value: 'DISCOUNT'},
    {label: '买一送一', value: 'BUY_ONE_GET_ONE'},
    {label: '包邮免运费', value: 'FREE_SHIPPING'},
    {label: '满减优惠', value: 'REDUCE_AMOUNT'},
])

// 将 imageUrls 数组转换为 el-upload 所需的 file-list 格式
const existingFiles = ref([]);

const handleRemove = (file) => {
    // 存储要删除的图片 URL
    const imagesToDelete = [];
    // 确认是否删除
    ElMessageBox.confirm('确定要删除该图片吗？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
    }).then(() => {
        console.log(file);
        if (file.status === 'success') {
            // 将图片 URL 添加到要删除的列表中
            imagesToDelete.push(file.url);
            // 从 existingFiles 中移除该图片
            const index = existingFiles.value.findIndex(f => f.url === file.url);
            if (index !== -1) {
                existingFiles.value.splice(index, 1);
            }
            // 从 form.imageUrls 中移除该图片
            const urlIndex = form.imageUrls.indexOf(file.url);
            if (urlIndex !== -1) {
                form.imageUrls.splice(urlIndex, 1);
            }
            console.log(form.imageUrls);
            ElMessage.success('图片已标记为待删除');
        } else if (file.status === 'ready') {
            unUploadedFiles.value = unUploadedFiles.value.filter(f => f.url !== file.url);
            // 从 existingFiles 中移除该图片
            const index = existingFiles.value.findIndex(f => f.url === file.url);
            if (index !== -1) {
                existingFiles.value.splice(index, 1);
            }
        }
    }).catch(() => {
        ElMessage.info('已取消删除操作');
    });
};

const deleteProduct = async (id) => {
    ElMessageBox.confirm('确定要删除该商品吗？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
    }).then(async () => {
        try {
            const res = await productBackRes.deleteProduct(id);
            console.log(res);
            ElMessage.success('商品删除成功');
            SearchAction();
        } catch (error) {
            ElMessage.error('商品删除失败：' + error.message);
        }
    })
}

const addPromotionItem = () => {
    form.promotions.push({
        promotion_id: '',
        product_id: form.product_id,
        promotion_type: '',
        reduce_amount: '',
        discount_rate: '',
        start_time: '',
        end_time: ''
    });
};

const onClick = async () => {
    loading.value = true;
    try {
        let imageUrls = existingFiles.value.map(file => file.url);
        // 检查是否有需要上传的新文件
        const hasNewFiles = unUploadedFiles.value.length > 0;

        if (hasNewFiles) {
            // 处理文件上传
            const files = unUploadedFiles.value.map(file => file.raw);
            console.log(files);
            const fileFormData = new FormData();

            files.forEach((file) => {
                fileFormData.append('files', file);
            });

            // 发送文件上传请求
            const uploadResponse = await productBackRes.uploadFiles(fileFormData);
            console.log(uploadResponse);

            if (typeof uploadResponse.data === 'string') {
                imageUrls = uploadResponse.data.split(',');
            }
        }

        // 将 suUploadedFiles 中的 url 添加到 imageUrls 数组
        suUploadedFiles.value.forEach(item => {
            if (item && typeof item.url === 'string') {
                imageUrls.push(item.url);
            }
        });

        if(form.product_name && form.price && form.stock && imageUrls.length === 0) {
            ElMessage.warning('商品名称、商品价格、商品库存、商品图片都需要填写');
            return;
        }

        const validPromotions = [];
        const invalidPromotions = [];

        form.promotions.forEach(promotion => {
            let isValid = Object.entries(promotion).every(([key, value]) => {
                if (key === 'promotion_id') {
                    return true; // promotion_id 可以为空
                }

                if (['BUY_ONE_GET_ONE', 'FREE_SHIPPING'].includes(promotion.promotion_type)) {
                    if (['reduce_amount', 'discount_rate'].includes(key)) {
                        promotion.reduce_amount = null;
                        promotion.discount_rate = null;
                        return true; // 在这两种类型下，reduce_amount 和 discount_rate 可以为空
                    }
                }

                // 定义促销类型和对应必填字段的映射
                const requiredFields = {
                    DISCOUNT: 'discount_rate',
                    REDUCE_AMOUNT: 'reduce_amount'
                };

                const requiredField = requiredFields[promotion.promotion_type];

                if (requiredField) {
                    if (key === requiredField) {
                        // 如果是对应促销类型的必填字段，确保其不为空
                        if (key === 'discount_rate') {
                            promotion.reduce_amount = null;
                        } else if (key === 'reduce_amount') {
                            promotion.discount_rate = null;
                        }
                        return value !== '';
                    } else if (['discount_rate', 'reduce_amount'].includes(key)) {
                        // 如果是非对应促销类型的相关字段，置为 null 并允许为空
                        if (key === 'discount_rate') {
                            promotion.discount_rate = null;
                        } else if (key === 'reduce_amount') {
                            promotion.reduce_amount = null;
                        }
                        return true;
                    }
                }
                return value !== '';
            });

            if (isValid) {
                validPromotions.push(promotion);
            } else {
                invalidPromotions.push(promotion);
            }
        });

        console.log('有效的促销活动:', validPromotions);
        console.log('被筛掉的促销活动:', invalidPromotions);

        let response;
            if (isAdd.value) {
            // 调用添加商品的接口
            response = await productBackRes.addProduct({
                ...form,
                imageUrls: imageUrls,
                promotions: validPromotions
            });
        } else {
            // 调用修改商品的接口
            response = await productBackRes.updateProduct({
                ...form,
                imageUrls: imageUrls,
                promotions: validPromotions
            });
        }

        // 提示操作成功
        ElMessage.success(isAdd.value ? '商品添加成功' : '商品信息修改成功');
        unUploadedFiles.value = [];
        suUploadedFiles.value = [];
        // 关闭抽屉
        dialog.value = false;
        SearchAction();
    } catch (error) {
        // 提示操作失败
        ElMessage.error(isAdd.value ? '商品添加失败：' + error.message : '商品信息修改失败：' + error.message);
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
            }
        })
        .catch(() =>
            done())
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
        const res = await productBackRes.Search(
            search.value,
            sortField.value,
            sortOrder.value,
            currentPage.value,
            pageSize.value
        );
        console.log(res);
        total.value = res.total;
        tableData.value = res.productResponseList;
        console.log(tableData.value)
    } catch (error) {
        console.error('搜索请求出错:', error);
    } finally {
        loadingSearch.value = false;
    }
};

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
watch(() => form.imageUrls, (urls) => {
    existingFiles.value = urls.map((url, index) => ({
        name: `image${index}`,
        url
    }));
});
watch(() => dialog.value == true, () => {
    onCategoryChange()
})
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
    .promotion-form {
        padding: 1vw 0;
        display: flex;
        flex-direction: column;
        gap: 2vw;

        .promotion-form-item {
            .el-form-item {
                padding: 1vw 0;
            }
        }
    }

    .demo-drawer__footer {
        padding-top: 10px;
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