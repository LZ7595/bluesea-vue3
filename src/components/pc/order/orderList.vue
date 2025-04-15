<template>
    <div class="order-list">
        <el-card v-for="order in orderList" :key="order.order_id">
            <template #header>
                <div class="order-header">
                    <span>订单 ID: {{ order.order_id }}</span>
                    <span>订单状态: {{ getChineseStatus(order.order_status) }}</span>
                </div>
            </template>
            <template #footer>
                <div class="order-footer">
                    <span>
                        <el-button link @click="goOrderDetail(order.order_id)">查看详情</el-button>
                        <el-button v-if="getChineseStatus(order.order_status) === '已完成'" link
                                   @click="openCommentDialog(order)">评论</el-button>
                    </span>
                    <span>支付金额: <span class="money">￥{{ order.payment_amount }}</span></span>
                </div>
            </template>
            <div class="order-centent">
                <div class="order-item-image">
                    <img v-for="image in order.order_images" :key="image" :src="server_URL + image" alt="订单图片"
                         style="width: 100px; height: auto; margin-right: 10px;">
                    <div class="order-item-image-item"></div>
                </div>
                <div>总金额: <span class="money">￥{{ order.total_amount }}</span></div>
            </div>
        </el-card>
    </div>
    <el-dialog v-model="dialogFormVisible" title="评论订单" width="500">
        <el-form :model="form" :rules="rules" ref="formRef" label-width="100px">
            <el-form-item label="选择商品" prop="selectedProductId">
                <el-select v-model="form.product_id" placeholder="请选择" @change="filterComments">
                    <el-option v-for="(item, index) in commentOptions" :key="index" :label="item.product_name"
                               :value="item.product_id"></el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="评分" prop="rating">
                <el-rate v-model="form.rating" allow-half></el-rate>
            </el-form-item>
            <el-form-item label="上传图片" prop="imageUrls">
                <el-upload action="#" list-type="picture-card" :auto-upload="false" :file-list="existingFiles"
                           @change="handleFileChange">
                    <el-icon>
                        <Plus/>
                    </el-icon>

                    <template #file="{ file }">
                        <div>
                            <img class="el-upload-list__item-thumbnail" :src="server_URL + file.url" alt=""/>
                            <span class="el-upload-list__item-actions">
                                <span
                                    class="el-upload-list__item-preview"
                                    @click="handlePictureCardPreview(file)"
                                >
                                    <el-icon><ZoomIn/></el-icon>
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
            </el-form-item>
            <el-form-item label="评论内容" prop="commentText">
                <el-input type="textarea" v-model="form.review_content" placeholder="请输入评论内容"></el-input>
            </el-form-item>
        </el-form>
        <template #footer>
            <span class="dialog-footer">
                <el-button @click="resetForm">取消</el-button>
                <el-button type="primary" @click="submitComment">提交</el-button>
            </span>
        </template>
    </el-dialog>
    <el-dialog v-model="dialogVisible">
        <img style="width: 100%" :src="server_URL + dialogImageUrl" alt="Preview Image"/>
    </el-dialog>
</template>

<script setup>
import {reactive, ref, watch} from 'vue';
import { useRouter } from "vue-router";
import { defineProps } from 'vue';
import { Delete, Plus, ZoomIn } from "@element-plus/icons-vue";
import { ElMessage, ElMessageBox } from "element-plus";
import commentApi from "@/request/comment.js";
import { server_URL } from "@/urlConfig";


const router = useRouter();

const props = defineProps({
    orderList: {
        type: Array,
        default: () => []
    }
});

const dialogFormVisible = ref(false);
const dialogImageUrl = ref('');
const dialogVisible = ref(false);
const disabled = ref(false);
const formRef = ref(null);
const commentByOrder = ref(null);

const form = reactive({
    order_id: '',
    product_id: '',
    user_id: JSON.parse(localStorage.getItem('UserData')).id,
    rating: 0,
    image_urls: [],
    review_content: ''
});

const rules = ref({
    product_id: [
        { required: true, message: '请选择商品', trigger: 'change' }
    ],
    rating: [
        { required: true, message: '请进行评分', trigger: 'change' }
    ],
    review_content: [
        { required: true, message: '请输入评论内容', trigger: 'blur' }
    ]
});

const commentOptions = ref([]);
const existingFiles = ref([]);
const unUploadedFiles = ref([]);
const suUploadedFiles = ref([]);

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

const filteredComments = ref([]);

const filterComments = () => {
    if (commentByOrder.value) {
        filteredComments.value = commentByOrder.value.filter(comment => {
            return comment.product_id === form.product_id;
        });
        if (filteredComments.value.length > 0) {
            const comment = filteredComments.value[0];
            form.rating = comment.rating;
            form.review_content = comment.review_content;
            if (comment.image_urls) {
                const imageUrlsArray = comment.image_urls.split(',');
                existingFiles.value = imageUrlsArray.map(url => ({ url }));
            }
        } else {
            form.rating = 0;
            form.review_content = '';
            existingFiles.value = [];
        }
    }
};

const goOrderDetail = (orderId) => {
    router.push(`/pc/order/${orderId}`)
}
const getCommentsByOrderId = async (orderId) => {
    await commentApi.getCommentByOrderId(orderId).then(response => {
        commentByOrder.value = response.data;
        filterComments();
    }).catch(error => {
        console.error('获取评论失败:', error);
    })
}

const openCommentDialog = async (order) => {
    form.order_id = order.order_id;
    if (order && order.order_items) {
        commentOptions.value = order.order_items
            .map(item => item.product)
            .filter(product => product);
        if (commentOptions.value.length > 0) {
            form.product_id = commentOptions.value[0].product_id;
            await getCommentsByOrderId(order.order_id);
        }
    } else {
        console.log('未找到相关订单或订单项目')
        commentOptions.value = [];
    }
    dialogFormVisible.value = true;
}

const handleFileChange = (file, fileList) => {
    unUploadedFiles.value = fileList.filter((f) => f.status === 'ready');
    suUploadedFiles.value = fileList.filter((f) => f.status === 'success');
    existingFiles.value = [...suUploadedFiles.value, ...unUploadedFiles.value];
    console.log('未上传的文件列表:', unUploadedFiles.value);
    console.log('已上传的文件列表:', suUploadedFiles.value);
    console.log('现有文件列表:', existingFiles.value);
};

const handleRemove = (file) => {
    const imagesToDelete = [];
    ElMessageBox.confirm('确定要删除该图片吗？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
    }).then(() => {
        console.log(file);
        if (file.status === 'success') {
            imagesToDelete.push(file.url);
            const index = existingFiles.value.findIndex(f => f.url === file.url);
            if (index !== -1) {
                existingFiles.value.splice(index, 1);
            }
            const urlIndex = form.image_urls.indexOf(file.url);
            if (urlIndex !== -1) {
                form.image_urls.splice(urlIndex, 1);
            }
            console.log(form.image_urls);
            ElMessage.success('图片已标记为待删除');
        } else if (file.status === 'ready') {
            unUploadedFiles.value = unUploadedFiles.value.filter(f => f.url !== file.url);
            const index = existingFiles.value.findIndex(f => f.url === file.url);
            if (index !== -1) {
                existingFiles.value.splice(index, 1);
            }
        }
    }).catch(() => {
        ElMessage.info('已取消删除操作');
    });
};

const handlePictureCardPreview = (file) => {
    dialogImageUrl.value = file.url;
    dialogVisible.value = true;
    console.log(file);
}

const resetForm = () => {
    formRef.value.resetFields();
    dialogFormVisible.value = false;
}

const submitComment = async () => {
    try {
        let imageUrls = existingFiles.value.map(file => file.url);
        const hasNewFiles = unUploadedFiles.value.length > 0;

        if (hasNewFiles) {
            const files = unUploadedFiles.value.map(file => file.raw);
            console.log(files);
            const fileFormData = new FormData();

            files.forEach((file) => {
                fileFormData.append('files', file);
            });

            const uploadResponse = await commentApi.uploadFiles(fileFormData);
            console.log(uploadResponse);

            if (typeof uploadResponse.data === 'string') {
                imageUrls = uploadResponse.data.split(',');
            }
        }

        suUploadedFiles.value.forEach(item => {
            if (item && typeof item.url === 'string') {
                imageUrls.push(item.url);
            }
        });

        if (!(form.product_id && form.rating && form.review_content)) {
            ElMessage.warning('评分和评论都需要填写');
            return;
        }

        formRef.value.validate((valid) => {
            if (valid) {
                form.image_urls = imageUrls.toString();
                if (filteredComments.value.length > 0) {
                    // 存在已有评论，发送修改请求
                    const commentId = filteredComments.value[0].review_id;
                    form.review_id = commentId; // 假设评论对象中有 review_id 字段用于标识评论
                    commentApi.updateComment(form).then((res) => {
                        getCommentsByOrderId(form.order_id);
                        resetForm()
                        ElMessage.success('评论修改成功');
                    }).catch((error) => {
                        console.error('评论修改失败:', error);
                        resetForm()
                        ElMessage.error('评论修改失败');
                    });
                } else {
                    // 不存在已有评论，发送添加请求
                    commentApi.addComment(form).then((res) => {
                        getCommentsByOrderId(form.order_id)
                        resetForm()
                        ElMessage.success('评论添加成功');
                    }).catch((error) => {
                        console.error('评论添加失败:', error);
                        resetForm()
                        ElMessage.error('评论添加失败');
                    });
                }
            } else {
                ElMessage.error('请完成必填项');
                return false;
            }
        });
    } catch (error) {
        console.error('评论提交失败:', error);
    }
}
watch(() => props.orderList, (newOrderList) => {
    // 在这里可以添加一些逻辑，比如重置组件内部的状态等
    console.log('orderList 变化了:', newOrderList);
}, { deep: true });
</script>

<style scoped>
.order-list {
    display: flex;
    flex-direction: column;
    gap: 20px;

    .el-button.is-link{
        color: #409eff;
    }
    .el-card {
        .order-header {
            display: flex;
            justify-content: space-between;
        }

        .order-centent {
            justify-content: space-between;
            display: flex;
            align-items: center;

            .order-item-image {
                width: 400px;
                height: 100px;
                display: flex;
                overflow: hidden;
                position: relative;

                .order-item-image-item {
                    right: 0;
                    position: absolute;
                    width: 110px;
                    height: 100px;
                    background-image: linear-gradient(to left, white, rgba(255, 255, 255, 0.7), rgba(255, 255, 255, 0));
                }

                img {
                    background: transparent;
                }
            }
        }

        .order-footer {
            display: flex;
            justify-content: space-between;
        }

        .money {
            color: #ff6700;
            font-weight: 600;
            font-size: 16px;
        }
    }
}
</style>