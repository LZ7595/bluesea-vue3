<template>
    <div className="type_select_div">
        <!-- 渲染用户密码登录方式 -->
        <span className="form_item">
            <label>用户名:</label>
            <div className="form_item_content">
                <input className="form_input email_input"
                       :value="localUsername"
                       @input="handleUsernameInput"
                       placeholder="请输入正确的用户名" type="text"/>
                <span className="form_tip">{{ usernameError }}</span>
            </div>
        </span>
        <span className="form_item">
            <label>密码:</label>
            <div className="form_item_content">
                <input className="form_input email_input"
                       :value="localPassword"
                       @input="handlePasswordInput"
                       placeholder="请输入正确的密码" type="password"/>
                <span className="form_tip">{{ passwordError }}</span>
            </div>
        </span>
<!--        <a className="form_link">忘记密码？</a>-->
    </div>
</template>

<script setup>
import {defineProps, ref, defineEmits} from 'vue';
import {validatePassword, validateUsername} from "../../../utils/validation.js";

// 定义接收的 props
const props = defineProps({
    username: {
        type: String,
        default: ''
    },
    password: {
        type: String,
        default: ''
    },
    usernameError: {
        type: String,
        default: ''
    },
    passwordError: {
        type: String,
        default: ''
    }
});

// 使用 ref 来存储本地的用户名和密码，并初始化为 props 的值
const localUsername = ref(props.username);
const localPassword = ref(props.password);


// 处理用户名输入
const handleUsernameInput = (event) => {
    const value = event.target.value;
    localUsername.value = value;
    // 触发更新事件，通知父组件
    emit('update:username', value);
    // 验证用户名
    const error = validateUsername(value);
    emit('update:usernameError', error);
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
const emit = defineEmits(['update:username', 'update:password', 'update:usernameError', 'update:passwordError']);


defineOptions({name: 'userAndPassword'});
</script>