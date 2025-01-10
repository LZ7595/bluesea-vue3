<template>
    <div class="type_select_div">
       <span class="form_item">
                                <label>邮箱:</label>
                                <div class="form_item_content">
                                    <input class="form_input email_input"
                                           :value="localEmail"
                                           @input="handleEmailInput"
                                           placeholder="请输入正确的邮箱" type="email"/>
                                    <span class="form_tip">{{ emailError }}</span>
                                </div>
                            </span>
        <span class="form_item">
                                <label>密码:</label>
                                <div class="form_item_content">
                                    <input class="form_input email_input"
                                           :value="localPassword"
                                           @input="handlePasswordInput"
                                           placeholder="请输入正确的密码" type="password"/>
                                    <span class="form_tip">{{ passwordError }}</span>
                                </div>
                            </span>
<!--        <a class="form_link">忘记密码？</a>-->
    </div>
</template>

<script setup>
import {defineProps, ref, defineEmits} from 'vue';
import {validatePassword, validateEmail} from "../../../utils/validation.js";

// 定义接收的 props
const props = defineProps({
    email: {
        type: String,
        default: ''
    },
    password: {
        type: String,
        default: ''
    },
    emailError: {
        type: String,
        default: ''
    },
    passwordError: {
        type: String,
        default: ''
    }
});

// 使用 ref 来存储本地的用户名和密码，并初始化为 props 的值
const localEmail = ref(props.email);
const localPassword = ref(props.password);


// 处理邮箱输入
const handleEmailInput = (event) => {
    const value = event.target.value;
    localEmail.value = value;
    // 触发更新事件，通知父组件
    emit('update:email', value);
    // 验证用户名
    const error = validateEmail(value);
    emit('update:emailError', error);
};


// 处理密码输入
const handlePasswordInput = (event) => {
    const value = event.target.value;
    localPassword.value = value;
    // 触发更新事件，通知父组件
    emit('update:password', value);
    // 验证密码
    const error = validatePassword(value);
    emit('update:passwordError', error);
};


// 导入 emit 函数
const emit = defineEmits(['update:email', 'update:password', 'update:emailError', 'update:passwordError']);

defineOptions({ name: 'userAndPassword' });
</script>
