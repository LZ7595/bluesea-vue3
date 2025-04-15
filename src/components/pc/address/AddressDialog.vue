<template>
    <el-dialog :model-value="dialogVisible" @update:model-value="handleDialogVisibleChange" width="500">
        <div class="add-address-container">
            <h2 class="title">{{ dialogTitle }}</h2>
            <el-form ref="addressFormRef" :model="addressForm" :rules="addressRules" label-width="120px">
                <el-form-item label="收货人姓名" prop="recipient_name">
                    <el-input v-model="addressForm.recipient_name" placeholder="请输入收货人姓名"></el-input>
                </el-form-item>
                <el-form-item label="联系电话" prop="phone">
                    <el-input v-model="addressForm.phone" placeholder="请输入联系电话"></el-input>
                </el-form-item>
                <el-form-item label="省市县" prop="addressCascader">
                    <el-cascader
                        v-model="addressForm.addressCascader"
                        :options="regionOptions"
                        :props="cascaderProps"
                        @change="handleCascaderChange"
                        placeholder="请选择省市县"
                    />
                </el-form-item>
                <el-form-item label="详细地址" prop="street_address">
                    <el-input v-model="addressForm.street_address" placeholder="请输入详细地址"></el-input>
                </el-form-item>
                <el-form-item label="是否默认地址">
                    <el-switch v-model="addressForm.is_default"></el-switch>
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" @click="submitForm">提交</el-button>
                    <el-button @click="resetForm">重置</el-button>
                </el-form-item>
            </el-form>
        </div>
    </el-dialog>
</template>

<script setup>
import {ref, defineProps, defineEmits, computed} from 'vue';
import { ElMessage } from 'element-plus';
import address from "@/request/address";

const props = defineProps({
    dialogVisible: {
        type: Boolean,
        default: false
    },
    isAdd: {
        type: Boolean,
        default: true
    },
    addressList: {
        type: Array,
        default: () => []
    },
    regionOptions: {
        type: Array,
        default: () => []
    },
    addressForm: {
        type: Object,
        default: () => ({
            user_id: null,
            recipient_name: '',
            phone: '',
            addressCascader: [],
            street_address: '',
            is_default: false
        })
    },
    addressRules: {
        type: Object,
        default: () => ({})
    },
    cascaderProps: {
        type: Object,
        default: () => ({})
    }
});

// 合并所有需要触发的事件
const emits = defineEmits(['update:dialogVisible', 'close', 'submit']);

const dialogTitle = computed(() => props.isAdd ? '添加收货地址' : '编辑收货地址');

// 级联选择器变化时的回调，更新表单中的省市县信息
const handleCascaderChange = (value) => {
    const selectedRegions = props.regionOptions;
    let province = '';
    let city = '';
    let district = '';

    for (const provinceItem of selectedRegions) {
        if (provinceItem.adcode === value[0]) {
            province = provinceItem.name;
            for (const cityItem of provinceItem.districts || []) {
                if (cityItem.adcode === value[1]) {
                    city = cityItem.name;
                    for (const districtItem of cityItem.districts || []) {
                        if (districtItem.adcode === value[2]) {
                            district = districtItem.name;
                            break;
                        }
                    }
                    break;
                }
            }
            break;
        }
    }

    props.addressForm.province = province;
    props.addressForm.city = city;
    props.addressForm.district = district;
};

// 提交表单
const submitForm = async () => {
    if (props.addressForm.recipient_name === '' || props.addressForm.phone === '' || props.addressForm.addressCascader.length === 0 || props.addressForm.street_address === '') {
        ElMessage.error('请填写完整的地址信息');
        return;
    }
    const formData = { ...props.addressForm };
    formData.addressCascader = formData.addressCascader.join(',');

    if (props.isAdd) {
        if (props.addressList.length >= 10) {
            ElMessage.error('地址数量已达到上限');
            return;
        }
        const response = await address.addAddress(formData);
        if (response.success) {
            ElMessage.success('地址添加成功');
            emits('submit');
        } else {
            ElMessage.error('地址添加失败');
        }
    } else {
        const response = await address.updateAddress(formData);
        if (response.success) {
            ElMessage.success('地址更新成功');
            emits('submit');
        } else {
            ElMessage.error('地址更新失败');
        }
    }
};

// 重置表单
const resetForm = () => {
    props.addressForm.recipient_name = '';
    props.addressForm.phone = '';
    props.addressForm.street_address = '';
    props.addressForm.is_default = false;
    props.addressForm.addressCascader = [];
    emits('close');
};

// 处理对话框显示状态的变化
const handleDialogVisibleChange = (newValue) => {
    emits('update:dialogVisible', newValue);
};
</script>

<style scoped>
.add-address-container {
    padding: 20px;
}

.title {
    text-align: center;
    margin-bottom: 20px;
}
</style>