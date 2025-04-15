<template>
    <div class="address-container">
        <div class="add-div">
            <el-button type="primary" @click="dialogFormVisible = true; isAdd = true">
                新增收货地址
            </el-button>
            <p>您已创建 <span class="count"> {{ addressList.length }} </span> 个收货地址，最多可创建 <span class="count">10</span> 个</p>
        </div>
        <div class="addressList" v-if="addressList.length > 0">
            <el-card v-for="(item, index) in addressList" :key="index">
                <div class="address-card">
                    <div class="address-info">
                        <div class="address-header">
                            <div class="address-name">收件人：{{ item.recipient_name }}</div>
                            <el-tag v-if="item.is_default">默认地址</el-tag>
                        </div>
                        <div class="address-phone">手机：{{ item.phone }}</div>
                        <div class="address-city">所在地区：{{ item.province }} / {{ item.city }} / {{
                                item.district
                            }}
                        </div>
                        <div class="address-detail">详细地址：{{ item.street_address }}</div>
                    </div>
                    <div class="address-actions">
                        <el-button type="text" @click="setDefaultAddress(item)" v-if="!item.is_default">
                            设为默认
                        </el-button>
                        <el-button type="text" @click="openEditAddressDialog(item.address_id)">编辑</el-button>
                        <el-button type="text" @click="confirmDeleteAddress(item.address_id)">删除</el-button>
                    </div>
                </div>
            </el-card>
        </div>
        <AddressDialog
            v-model:dialogVisible="dialogFormVisible"
            :isAdd="isAdd"
            :addressList="addressList"
            :regionOptions="regionOptions"
            :addressForm="addressForm"
            :addressRules="addressRules"
            :cascaderProps="cascaderProps"
            @close="dialogFormVisible = false"
            @submit="onSubmit"
        />
    </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { ElMessage, ElMessageBox } from 'element-plus';
import address from "@/request/address";
import axios from 'axios';
import AddressDialog from '@/components/pc/address/AddressDialog.vue';

const dialogFormVisible = ref(false);
const isAdd = ref(true);

// 请替换为你自己的高德地图API Key
const API_KEY = '3bfd32a107b18cfdc2c513f2071ecd1f';
const API_URL = 'https://restapi.amap.com/v3/config/district';
const userId = JSON.parse(localStorage.getItem('UserData')).id;
const addressList = ref([]);
// 表单数据
const addressForm = ref({
    user_id: userId,
    recipient_name: '',
    phone: '',
    addressCascader: [],
    street_address: '',
    is_default: false
});

// 表单校验规则
const addressRules = {
    user_id: [
        { required: true, message: '用户ID不能为空', trigger: 'blur' },
        { type: 'number', message: '用户ID必须为数字', trigger: 'blur' }
    ],
    recipient_name: [
        { required: true, message: '收货人姓名不能为空', trigger: 'blur' }
    ],
    phone: [
        { required: true, message: '联系电话不能为空', trigger: 'blur' },
        { pattern: /^1[3-9]\d{9}$/, message: '请输入正确的手机号码', trigger: 'blur' }
    ],
    addressCascader: [
        { required: true, message: '请选择省市县', trigger: 'change' }
    ],
    street_address: [
        { required: true, message: '详细地址不能为空', trigger: 'blur' }
    ]
};

// 级联选择器的选项数据
const regionOptions = ref([]);
// 级联选择器的配置
const cascaderProps = {
    value: 'adcode',
    label: 'name',
    children: 'districts'
};

// 获取省市县数据
const fetchRegionData = async () => {
    try {
        const response = await axios.get(API_URL, {
            params: {
                key: API_KEY,
                subdistrict: 3, // 返回下三级行政区（省、市、区县）
                extensions: 'base'
            }
        });

        if (response.data.status === '1') {
            // 过滤掉国家层级，只保留省/直辖市数据作为第一级
            const provinces = response.data.districts[0].districts.filter(item => item.level === 'province');
            regionOptions.value = provinces;
        } else {
            ElMessage.error(`数据获取失败：${response.data.info}`);
        }
    } catch (error) {
        ElMessage.error('网络请求出错，请稍后重试');
        console.error(error);
    }
};

const getAddress = async () => {
    await address.getAddress(userId).then(res => {
        addressList.value = res;
        console.log(res);
    }).catch(err => {
        console.log(err);
    });
};

const openEditAddressDialog = async (addressId) => {
    await address.getAddressDetail(addressId).then(res => {
        addressForm.value.recipient_name = res.recipient_name;
        addressForm.value.phone = res.phone;
        addressForm.value.street_address = res.street_address;
        addressForm.value.is_default = res.is_default;
        addressForm.value.addressCascader = res.addressCascader.split(',');
        addressForm.value.address_id = addressId;
        isAdd.value = false;
        dialogFormVisible.value = true;
    }).catch(err => {
        console.log(err);
    });
};

const deleteAddress = async (addressId) => {
    const res = await address.deleteAddress(addressId);
    if (res.success) {
        ElMessage.success('地址删除成功');
        getAddress();
    } else {
        ElMessage.error('地址删除失败');
    }
};

const confirmDeleteAddress = async (addressId) => {
    try {
        await ElMessageBox.confirm(
            '确定要删除该收货地址吗？',
            '提示',
            {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }
        );
        // 用户点击了确定，执行删除操作
        await deleteAddress(addressId);
    } catch (e) {
        // 用户点击了取消，不做任何操作
    }
};

const setDefaultAddress = async (data) => {
    const res = await address.setDefaultAddress(data);
    if (res.success) {
        ElMessage.success('设置默认地址成功');
        getAddress();
    } else {
        ElMessage.error('设置默认地址失败');
    }
};

const onSubmit = () => {
    dialogFormVisible.value = false;
    getAddress();
};

onMounted(() => {
    fetchRegionData();
    getAddress();
});
</script>

<style scoped>
.address-container {
    padding: 20px;

    .add-div {
        margin: 0 10px;
        display: flex;
        align-items: center;
        gap: 10px;

        .count {
            color: #ff4500;
        }
    }

    .addressList {
        padding: 20px 10px;
        display: flex;
        flex-direction: column;
        gap: 15px;

        .address-card {
            display: flex;
            justify-content: space-between;

            .address-info {
                display: flex;
                flex-direction: column;
                gap: 10px;

                .address-header {
                    display: flex;
                    align-items: center;
                    gap: 10px;
                }
            }

            .address-actions {
                width: 58px;
                display: flex;
                flex-direction: column;
                justify-content: center;

                .el-button + .el-button {
                    margin-left: 0;
                }
            }
        }
    }
}
</style>