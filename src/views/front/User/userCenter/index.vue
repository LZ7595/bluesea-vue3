<template>
    <div class="center">
        <el-tabs v-model="activeName" class="demo-tabs">
            <el-tab-pane label="基本信息" name="first">
                <div class="user-div">
                    <div class="user-info">
                        <div class="user-info-row">
                            <label for="name">用户名：</label>
                            <el-input v-model="name" placeholder="请输入新用户名"/>
                        </div>
                        <div class="user-info-row">
                            <label for="name">性别：</label>
                            <el-select
                                    v-model="gender"
                                    placeholder="Select"
                            >
                                <el-option
                                        v-for="item in options"
                                        :key="item.value"
                                        :label="item.label"
                                        :value="item.value"
                                />
                            </el-select>
                        </div>
                        <div class="user-info-row">

                            <label for="birthday">生日：</label>
                            <el-date-picker
                                    v-model="birthday"
                                    type="date"
                                    placeholder="请选择"
                            />
                        </div>
                        <div class="user-info-row">
                            <label for="avatar">头像：</label>

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
                            <el-image v-if="avatar" :src="getImageSrc(avatar)" alt="预览图片"
                                      :preview-src-list="[getImageSrc(avatar)]"
                                      style="width: 80px; height: 80px; border: 1px solid #ccc; border-radius: 50%; margin-left: 10px; display: block;"/>
                        </div>
                        <div class="user-info-row">
                            <el-button type="primary" @click="updateUserInfo">保存</el-button>
                        </div>
                    </div>
                    <div class="user-card">
                        <el-card shadow="always">
                            <div class="card-info">
                                <div class="card-left">
                                    <el-avatar :icon="UserFilled" :src="server_URL + userDetail.avatar" :size="70"/>
                                </div>
                                <div class="card-right">
                                    <div class="card-right-item-name">
                                        <span>用户名：{{ userDetail.username }}</span>
                                    </div>
                                    <div class="card-right-item-gender">
                                        <span>性别：{{ userDetail.gender }}</span>
                                    </div>
                                    <div class="card-right-item-birthday">
                                        <span>生日：{{ userDetail.birthday }}</span>
                                    </div>
                                    <div class="card-right-item-birthday">
                                        <span>账号类型：{{ userDetail.role }}</span>
                                    </div>
                                </div>
                            </div>
                        </el-card>
                    </div>
                </div>
            </el-tab-pane>
            <el-tab-pane label="账号安全" name="second">
                <div class="security-div">
                    <div class="security-row">
                        <span>账号：</span>
                        <span>{{ userSecurityInfo.username }}</span>
                    </div>
                    <div class="security-row">
                        <span>绑定手机：</span>
                        <span>{{ encryptedPhone || "未绑定" }}</span>
                    </div>
                    <div class="security-row">
                        <span>绑定邮箱：</span>
                        <span>{{ encryptedEmail }}</span>
                        <router-link :to="{ path: '/pc/security', query: { action: 'changeEmail' } }">换绑邮箱
                        </router-link>
                    </div>
                    <div class="security-row">
                        <span>登录密码：</span>
                        <router-link :to="{ path: '/pc/security', query: { action: 'changePassword' } }">修改密码
                        </router-link>
                    </div>
                </div>
            </el-tab-pane>
        </el-tabs>

    </div>
</template>

<script setup>
import {ref, onMounted, watch} from 'vue';
import {useRoute} from 'vue-router';
import userRes from '@/request/user';
import {getCookie, parseJwt} from "@/utils/cookieJwt";
import {ElMessage} from "element-plus";
import {UserFilled} from '@element-plus/icons-vue';
import {encryptPhone, encryptEmail} from "@/utils/encrypt";
import {server_URL} from "@/urlConfig.js";
import bannerBackApi from "@/request/back/banner.js";

// 提前获取路由对象
const route = useRoute();

// 定义当前激活的 tab 名称，使用可选链操作符
const activeName = ref(route?.query?.tab || 'first');

// 监听路由变化
watch(
    () => route.query,
    (newQuery) => {
        activeName.value = newQuery?.tab || 'first';
    },
    {immediate: true}
);
const options = [
    {
        value: '男',
        label: '男',
    },
    {
        value: '女',
        label: '女',
    },
    {
        value: '保密',
        label: '保密',
    }
]

const userDetail = ref({});
const birthday = ref(null);
const name = ref(null);
const gender = ref(null);
const avatar = ref(null);
const selectedFile = ref(null);

const userStore = ref(JSON.parse(localStorage.getItem('token')));
// 从 cookie 中获取 JWT 令牌
const jwtToken = getCookie('token');
// 解析从 cookie 中获取的 JWT 令牌
const userInfo = ref(userStore.value ? parseJwt(userStore.value) : jwtToken ? parseJwt(jwtToken) : null);
const userId = userInfo.value ? userInfo.value.id : null;
const userSecurityInfo = ref({});
const encryptedPhone = ref(null);
const encryptedEmail = ref(null);
const getUserDetail = async (id) => {
    try {
        const res = await userRes.getUserInfo(id);
        userDetail.value = res;
        birthday.value = res.birthday;
        name.value = res.username;
        gender.value = res.gender;
        avatar.value = res.avatar;
    } catch (err) {
        console.log(err)
    }
}
const handleFileChange = (file, fileList) => {
    console.log(fileList);
    console.log(file);
    if (file.status === 'ready') {
        const reader = new FileReader();
        reader.onload = (e) => {
            avatar.value = e.target.result;
            selectedFile.value = file.raw;
        };
        reader.readAsDataURL(file.raw);
    }
};
const validate = (name, gender, birthday,avatar) => {
    if (!name || !gender || !birthday ||!avatar) {
        ElMessage({
            message: '请填写完整信息',
            type: 'warning',
        })
        return false;
    }
    if (name === userDetail.value.username && gender === userDetail.value.gender && birthday === userDetail.value.birthday && avatar === userDetail.value.avatar) {
        ElMessage({
            message: '没有修改',
            type: 'warning',
        })
        return false;
    }
    return true;
}
const updateUserInfo = async () => {
    if (!validate(name.value, gender.value, birthday.value, avatar.value)) {
        return;
    }
    if (selectedFile.value) {
        console.log(selectedFile.value)
        const fileFormData = new FormData();
        fileFormData.append('file', selectedFile.value);

        // 发送文件上传请求
        const uploadResponse = await userRes.uploadFiles(fileFormData);
        console.log(uploadResponse);
        avatar.value = uploadResponse.data;
    }

    try {
        const res = await userRes.updateUserInfo(
            userId,
            name.value,
            gender.value,
            birthday.value,
            avatar.value
        );
        console.log(res)
        getUserDetail(userId);
        ElMessage({
            message: '更新成功',
            type: 'success',
        })
    } catch (err) {
        console.log(err)
        ElMessage({
            message: '更新失败',
            type: 'error',
        })
    }
}
const getSecurityInfo = async (id) => {
    try {
        const res = await userRes.getSecurityInfo(id);
        userSecurityInfo.value = res;
        if (res.phone) encryptedPhone.value = encryptPhone(res.phone);
        if (res.email) encryptedEmail.value = encryptEmail(res.email);
    } catch (err) {
        console.log(err)
    }
}
onMounted(() => {
    getUserDetail(userId);
    getSecurityInfo(userId);
});
const getImageSrc = (url) => {
    if (url && (url.startsWith('blob:') || url.startsWith('data:'))) {
        return url;
    }
    return server_URL + url;
};
</script>

<style scoped>
.center {
    width: 100%;
    padding: 0 20px;

    .user-div {
        width: 100%;
        display: flex;
        justify-content: space-between;

        .user-info {
            padding: 20px 0;
            width: 400px;
            display: flex;
            flex-direction: column;

            .user-info-row {
                display: flex;
                align-items: center;
                width: 100%;
                margin-bottom: 20px;

                label {
                    width: 60px;
                }

                .el-input, .el-select {
                    width: 220px;
                }
            }
        }

        .user-card {
            width: 300px;

            .card-info {
                width: 100%;
                display: flex;
                align-items: center;
                gap: 20px;

                .card-left {
                    width: 70px;
                    height: 70px;

                }

                .card-right {
                    height: 88px;
                    display: flex;
                    flex-direction: column;
                    justify-content: space-around;
                    font-size: 14px;
                }
            }
        }


    }

    .security-div {
        width: 100%;
        padding: 20px 0;
        display: flex;
        flex-direction: column;
        gap: 20px;

        .security-row {
            display: flex;
            align-items: center;
            gap: 20px;

            a:hover {
                color: #5a99dc;
            }
        }
    }
}
</style>