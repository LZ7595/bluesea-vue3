<template>
    <button :class="['sendEmailCode',{'disabled': isSending || isInCooldown }]" @click.prevent="sendCode()" :disabled="isSending || isInCooldown">
        <span v-if="isSending">发送中...</span>
        <span v-else-if="isInCooldown">{{ cooldownCountdown }}s后可重新发送</span>
        <span v-else>发送验证码</span>
    </button>
</template>

<script setup>
//用于存储上次发送验证码的时间戳
import {ref, watch} from "vue";
import {ElMessage} from "element-plus";
import Auth from "@/request/auth.js";

const props = defineProps({
    email: {
        type: String,
        default: ''
    },
    type: {
        type: Number,
        default: 0
    }
})

const lastSendTime = ref(0);
//用于标记是否正在发送验证码
const isSending = ref(false);
//用于标记是否处于冷却时间
const isInCooldown = ref(false);
//冷却时间倒计时
const cooldownCountdown = ref(0);


const sendCode = async () => {
    const currentTime = Date.now();
    if (isSending.value) {
        ElMessage.warning('正在发送验证码，请稍候');
        return;
    }
    if (isInCooldown.value) {
        ElMessage.warning(`请等待 ${cooldownCountdown.value}s 后再发送`);
        return;
    }
    try {
        isSending.value = true;
        const res = await Auth.getAuthCode({
            email: props.email,
            type: props.type // 假设 type 为 0 表示注册
        });
        console.log(res);
        ElMessage.success('验证码发送成功');
        // 发送成功后，更新上次发送时间戳
        lastSendTime.value = currentTime;
        isInCooldown.value = true;
        cooldownCountdown.value = 60;
        const interval = setInterval(() => {
            cooldownCountdown.value--;
            if (cooldownCountdown.value === 0) {
                clearInterval(interval);
                isInCooldown.value = false;
            }
        }, 1000);
    } catch (error) {
        console.error('发送验证码失败', error);
        ElMessage.error('发送验证码失败，请稍后重试');
    } finally {
        isSending.value = false;
    }
};

// 新增：用于更新倒计时
watch(cooldownCountdown, () => {
    if (cooldownCountdown.value === 0) {
        isInCooldown.value = false;
    }
});


// 新增：用于检查是否处于冷却时间
watch(lastSendTime, () => {
    if (lastSendTime.value > 0) {
        const elapsedTime = (Date.now() - lastSendTime.value) / 1000;
        if (elapsedTime < 60) {
            isInCooldown.value = true;
            cooldownCountdown.value = 60 - Math.floor(elapsedTime);
        } else {
            isInCooldown.value = false;
        }
    }
});

defineOptions({
    name: 'sendCodeBtn'
})
</script>

<style>
.sendEmailCode {
    width: 80px;
    height: 40px;
    margin-left: 10px;
    border-radius: 5px;
    background: #5a99dc;
    color: #fff;
    font-size: 12px;
    font-weight: bold;
    box-shadow: 8px 8px 16px #d1d9e6, -8px -8px 16px #f9f9f9;
}

.sendEmailCode:hover {
    opacity: 0.7;
}
.sendEmailCode.disabled{
    opacity: 0.7;
    cursor: not-allowed;
}
</style>