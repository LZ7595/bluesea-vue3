<template>
    <div class="type_select_div">
<span class="form_item">
                                <label>邮箱:</label>
                                <div class="form_item_content">
                                    <input class="form_input email_input" :value="localEmail"
                                           @input="handleEmailInput" placeholder="请输入正确的邮箱" type="email"/>
                                    <span class="form_tip">{{ emailError }}</span>
                                </div>
                            </span>
        <span class="form_item">
                                <label>验证码:</label>
                                <div class="form_item_content">
                                    <span class="form_inputSpan">
                                        <input class="form_input code_input"
                                               :value="localCode"
                                               @input="handleCodeInput"
                                               placeholder="请输入验证码" type="text"/>
                                        <SendCodeBtn :email="localEmail" :type="1" />
                                    </span>
                                    <span class="form_tip">{{codeError}}</span>
                                </div>
                            </span>
    </div>
</template>

<script setup>
import {defineOptions, defineProps, ref} from 'vue';
import {validateCode, validateEmail} from "../../../utils/validation.js";
import SendCodeBtn from "@/components/pc/login/sendCodeBtn.vue";

defineOptions({name: 'emailAndCode'});
const props = defineProps({
    email: {
        type: String,
        default: ''
    },
    code: {
        type: String,
        default: ''
    },
    emailError: {
        type: String,
        default: ''
    },
    codeError: {
        type: String,
        default: ''
    }
});

// 使用 ref 来存储本地的用户名和密码，并初始化为 props 的值
const localEmail = ref(props.email);
const localCode = ref(props.code);


// 处理用户名输入
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
const handleCodeInput = (event) => {
    const value = event.target.value;
    localCode.value = value;
    // 触发更新事件，通知父组件
    emit('update:code', value);
    // 验证密码
    const error = validateCode(value);
    emit('update:codeError', error);
};


// 导入 emit 函数
const emit = defineEmits(['update:email', 'update:code', 'update:emailError', 'update:codeError']);


</script>

<style scoped>
</style>