<template>
    <div class="action-row">
        <el-input
                v-model="search"
                placeholder="请输入你需要搜索的内容"
                :suffix-icon="Search"
                @keyup.enter="SearchAction"
        />
        <el-button type="primary" :icon="Plus" @click="addProduct">添加</el-button>
        <el-button type="danger" :icon="Delete" @click="deleteSelectedUsers">删除选中</el-button>
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
        <el-table-column fixed prop="id" label="用户ID" :width="getColWidth(160)" sortable="custom"/>
        <el-table-column prop="username" label="用户名" :width="getColWidth(240)"/>
        <el-table-column
                prop="status"
                label="状态"
                :width="getColWidth(120)"
                :filters="[
        { text: '正常', value: true },
        { text: '冻结', value: false },
      ]"
                :filter-method="filterTag"
                filter-placement="bottom-end"
        >
            <template #default="scope">
                <el-tag
                        :type="scope.row.status? 'success' : 'primary'"
                        disable-transitions
                >{{ scope.row.status ? '正常' : '冻结' }}
                </el-tag
                >
            </template>
        </el-table-column>
        <el-table-column prop="birthday" label="生日" :width="getColWidth(160)"/>
        <el-table-column
                prop="gender"
                label="性别"
                :filters="[
        { text: '男', value: '男' },
        { text: '女', value: '女' },
        { text: '保密', value: '保密' },
        ]" :filter-method="filterText" filter-placement="bottom-end" :width="getColWidth(120)"/>
        <el-table-column prop="email" label="邮箱" :width="getColWidth(250)"/>
        <el-table-column prop="phone" label="电话" :width="getColWidth(250)"/>
        <el-table-column prop="role" label="用户角色" :filters="[
        { text: 'Director', value: 'Director' },
        { text: 'Admin', value: 'Admin' },
        { text: 'User', value: 'User' },
        ]" :filter-method="filterText" filter-placement="bottom-end" :width="getColWidth(120)"/>
        <el-table-column prop="last_login_type" label="上次登录方式" :width="getColWidth(120)"/>
        <el-table-column prop="last_login_time" label="上次登录时间" :width="getColWidth(160)" sortable="custom"/>
        <el-table-column prop="register_time" label="注册时间" :width="getColWidth(160)" sortable="custom"/>
        <el-table-column fixed="right" label="操作" :width="getColWidth(160)">
            <template #default="scope">
                <el-button
                        size="small"
                        type="primary"
                        @click="goDetail(scope.row.id)"
                        link>
                    查看修改
                </el-button>
                <el-button
                        size="small"
                        type="danger"
                        link
                        @click="deleteUser(scope.row.id)"
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
            title="用户详情"
            :size="windowWidth >= 1025? '50%' : '80%'"
            :before-close="handleClose"
            direction="ltr"
            class="demo-drawer"
    >
        <div class="demo-drawer__content">
            <el-form :model="form">
                <el-form-item label="用户ID" :label-width="formLabelWidth" v-if="!isAdd">
                    <el-input v-model="form.id" autocomplete="off" :disabled="!isAdd"/>
                </el-form-item>
                <el-form-item label="用户名" :label-width="formLabelWidth">
                    <el-input v-model="form.username" autocomplete="off"/>
                </el-form-item>
                <el-form-item label="用户角色" :label-width="formLabelWidth">
                    <el-select
                            v-model="form.role"
                            placeholder="请选择用户角色"
                    >
                        <el-option
                                v-for="roleType in roleTypes"
                                :key="roleType"
                                :label="roleType"
                                :value="roleType"
                        />
                    </el-select>
                </el-form-item>
                <el-form-item label="用户状态" :label-width="formLabelWidth">
                    <el-switch
                            v-model="form.status"
                            class="ml-2"
                            inline-prompt
                            style="--el-switch-on-color: #13ce66; --el-switch-off-color: #ff4949"
                            active-text="正常"
                            inactive-text="冻结"
                    />
                </el-form-item>
                <el-form-item label="性别" :label-width="formLabelWidth">
                    <el-select
                            v-model="form.gender"
                            placeholder="请选择性别"
                    >
                        <el-option
                                v-for="genderType in genderTypes"
                                :key="genderType"
                                :label="genderType"
                                :value="genderType"
                        />
                    </el-select>
                </el-form-item>
                <el-form-item label="电话" :label-width="formLabelWidth">
                    <el-input v-model="form.phone"/>
                </el-form-item>
                <el-form-item label="邮箱" :label-width="formLabelWidth">
                    <el-input v-model="form.email"/>
                </el-form-item>
                <el-form-item label="生日" :label-width="formLabelWidth">
                    <el-date-picker
                            v-model="form.birthday"
                            type="date"
                            placeholder="选择日期"
                    />
                </el-form-item>
                <el-form-item label="头像" :label-width="formLabelWidth">
                    <el-upload

                            class="avatar-uploader"
                            action="#"
                            :show-file-list="false"
                            :auto-upload="false"
                            @change="handleFileChange"
                    >
                        <img
                                v-if="form.avatar"
                                :src="getImageSrc(form.avatar)"
                                class="avatar"
                                @click="handlePictureCardPreview($event, form.avatar)"/>
                        <el-icon v-else class="avatar-uploader-icon">
                            <Plus/>
                        </el-icon>
                    </el-upload>
                    <el-dialog v-model="dialogVisible">
                        <img style="width: 100%" :src="dialogImageUrl" alt="Preview Image"/>
                    </el-dialog>
                    <el-button v-if="form.avatar" @click="handleRemove">删除</el-button>
                </el-form-item>
                <el-form-item label="密码" :label-width="formLabelWidth">
                    <el-input type="password" v-model="form.password" show-password/>
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
import {ref, onMounted, onUnmounted, reactive} from 'vue';
import {Search, Plus, Delete, ZoomIn} from "@element-plus/icons-vue";
import userBackRes from "@/request/back/user";
import {ElMessage, ElMessageBox} from "element-plus";
import {validateEmail,validatePhone} from "@/utils/validation";

const dialogImageUrl = ref('');
const dialogVisible = ref(false);
const isAdd = ref(false); // 添加标志变量
const fileToUpload = ref(null);

const handlePictureCardPreview = (event,url) => {
    event.stopPropagation();
    if (url && (url.startsWith('blob:') || url.startsWith('data:'))) {
        dialogImageUrl.value = url;
    } else {
        dialogImageUrl.value = server_URL + url;
    }
    dialogVisible.value = true;
};

// 根据 file.url 判断是否为 blob 或 data 格式，返回正确的图片 src
const getImageSrc = (url) => {
    if (url && (url.startsWith('blob:') || url.startsWith('data:'))) {
        return url;
    }
    return server_URL + url;
};

const search = ref('');

const tableData = ref([]);
// 当前使用的排序字段
const sortField = ref('id');
// 当前的排序顺序，默认为降序
const sortOrder = ref('DESC');
// 当前页码，初始为第一页
const currentPage = ref(1);
// 每页显示的用户数量，初始为 15 条
const pageSize = ref(20);
// 用户的总记录数，初始为 0
const total = ref(0);
// 分页组件的禁用状态，初始为 false
const disabled = ref(false);
// 分页组件是否显示背景样式，初始为 true
const background = ref(true);

const dialog = ref(false);
const loading = ref(false);

const roleTypes = ref(["Director", "Admin", "User"]);
const genderTypes = ref(["男", "女", "保密"]);
const formLabelWidth = '80px';
let timer;
const form = reactive({
    "id": null,
    "username": "",
    "password": "",
    "email": "",
    "phone": "",
    "role": "User",
    "status": true,
    "birthday": "",
    "gender": "保密",
    "avatar": "",
    "register_time": null,
    "last_login_type": "",
    "last_login_time": null,
});
let avatarUrl = ref('');

const addProduct = () => {
    isAdd.value = true;
    // 重置表单数据为默认值
    form.id = null;
    form.username = "";
    form.password = "";
    form.status = true;
    form.email = "";
    form.phone = "";
    form.role = "User";
    form.birthday = "";
    form.gender = "保密";
    form.avatar = "";
    form.register_time = null;
    form.last_login_type = "";
    form.last_login_time = null;
    fileToUpload.value = null;
    dialog.value = true;
}

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

// 删除选中用户的方法
const deleteSelectedUsers = () => {
    const selectedIds = selectedRows.value.map(row => row.id);
    console.log('选中的用户ID:', selectedIds);
    userBackRes.deleteUserMore(selectedIds).then(() => {
        ElMessage.success('删除成功');
        SearchAction();
    }).catch((error) => {
        ElMessage.error('删除失败：' + error.message);
    });
};

// 待上传的文件
const handleFileChange = (file, fileList) => {
    console.log(fileList);
    console.log(file);
    if (file.status === 'ready') {
        const reader = new FileReader();
        reader.onload = (e) => {
            form.avatar = e.target.result;
            fileToUpload.value = file.raw;
        };
        reader.readAsDataURL(file.raw);
    }
};

const goDetail = async (id) => {
    isAdd.value = false;
    try {
        await userBackRes.getUserDetail(id).then(res => {
            Object.assign(form, res);
            dialog.value = true;
        });
    } catch (error) {
        console.error('请求出错:', error);
    }
}
const handleRemove = () => {
    // 确认是否删除
    ElMessageBox.confirm('确定要删除该图片吗？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
    }).then(() => {
        form.avatar = '';
        fileToUpload.value = null;
    }).catch(() => {
        ElMessage.info('已取消删除操作');
    });
};

const deleteUser = async (id) => {
    ElMessageBox.confirm('确定要删除该用户吗？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
    }).then(async () => {
        try {
            const res = await userBackRes.deleteUser(id);
            console.log(res);
            ElMessage.success('用户删除成功');
            SearchAction();
        } catch (error) {
            ElMessage.error('用户删除失败：' + error.message);
        }
    })
}

const onClick = async () => {
    loading.value = true;
    if (!form.username || !form.password){
        ElMessage.error('用户名或密码不能为空');
        loading.value = false;
        return
    }

    if(form.email && validateEmail(form.email)) {
        ElMessage.error(validateEmail(form.email))
        loading.value = false;
        return;
    }
    if(form.phone && validatePhone(form.phone)) {
        ElMessage.error(validatePhone(form.phone));
        loading.value = false;
        return;
    }
    if(form.password && form.password.length < 8) {
        ElMessage.error('密码要大于8位');
        loading.value = false;
        return;
    }

    try {
        if (fileToUpload.value) {
            console.log(fileToUpload.value)
            // 处理文件上传
            const fileFormData = new FormData();

            fileFormData.append('file', fileToUpload.value);

            // 发送文件上传请求
            const uploadResponse = await userBackRes.uploadFiles(fileFormData);
            console.log(uploadResponse);
            avatarUrl.value = uploadResponse;
        }
        if (avatarUrl.value) {
            form.avatar = avatarUrl.value;
        }
        if (isAdd.value) {
            // 调用添加用户的接口
            await userBackRes.addUser(form);
        } else {
            // 调用修改用户的接口
            await userBackRes.updateUser(form);
        }

        // 提示操作成功
        ElMessage.success(isAdd.value ? '用户添加成功' : '用户信息修改成功');
        fileToUpload.value = null;
        avatarUrl.value = '';
        // 关闭抽屉
        dialog.value = false;
        SearchAction();
    } catch (error) {
        // 提示操作失败
        ElMessage.error(isAdd.value ? '用户添加失败：' + error.message : '用户信息修改失败：' + error.message);
        fileToUpload.value = null;
        avatarUrl.value = '';
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
        .catch(() => {
                done()
                fileToUpload.value = null;
                avatarUrl.value = '';
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
const filterTag = (value, row) => {
    return row.status === value
}
const filterText = (value, row, column) => {
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
        const res = await userBackRes.Search(
            search.value,
            sortField.value,
            sortOrder.value,
            currentPage.value,
            pageSize.value
        );
        console.log(res);
        total.value = res.total;
        tableData.value = res.userResponseList;
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
</style>
<style scoped>
.avatar-uploader .avatar {
    width: 178px;
    height: 178px;
    display: block;
}
</style>

<style>
.avatar-uploader .el-upload {
    border: 1px dashed var(--el-border-color);
    border-radius: 6px;
    cursor: pointer;
    position: relative;
    overflow: hidden;
    transition: var(--el-transition-duration-fast);
}

.avatar-uploader .el-upload:hover {
    border-color: var(--el-color-primary);
}

.el-icon.avatar-uploader-icon {
    font-size: 28px;
    color: #8c939d;
    width: 178px;
    height: 178px;
    text-align: center;
}
</style>