<template>
    <div class="div-page">
        <div class="viewport">
            <div class="security-page">
                <div class="security-div">
                    <div class="security-div-left">
                        <el-steps direction="vertical" :active="active" finish-status="success">
                            <el-step title="身份认证"/>
                            <el-step title="设置操作"/>
                            <el-step title="完成"/>
                        </el-steps>
                    </div>
                    <div class="security-div-right">
                        <div v-if="active === 0" class="active-div">
                            <div class="active-div-title">
                                <h2>身份认证</h2>
                                <div>请输入该账号已绑定的邮箱</div>
                            </div>

                            <div class="active-div-input">
                                <p><label>已绑邮箱：</label>{{ encryptedEmail }}</p>
                                <el-input class="input" v-model="input" size="large"
                                          placeholder="请输入该账号已绑定的邮箱"/>
                                <el-input
                                        v-model="code"
                                        placeholder="请输入验证码"
                                        class="input-with-select input"
                                        maxlength="6"
                                        size="large"
                                >
                                    <template #append>
                                        <el-button :disabled="disabled" @click="sendVerificationCode(input)"
                                                   style="width: 100px">
                                            <span v-if="isSending[active]">发送中...</span>
                                            <span v-else-if="disabled" style="font-size: 12px">{{
                                                cooldownCountdown
                                                }}秒后可重新发送</span>
                                            <span v-else>发送验证码</span></el-button>
                                    </template>
                                </el-input>
                            </div>
                            <el-button class="next-button" type="primary" @click="next" :disabled="!input ||!code">
                                下一步
                            </el-button>
                        </div>
                        <div v-if="active === 1" class="active-div">
                            <div class="active-div-title">
                                <h2>设置操作</h2>
                                <div>请输入新的邮箱</div>
                            </div>
                            <div class="active-div-input">
                                <el-input v-model="input1" size="large" placeholder="请输入新的邮箱"/>
                                <el-input
                                        v-model="code1"
                                        placeholder="请输入验证码"
                                        class="input-with-select input"
                                        maxlength="6"
                                        size="large"
                                >
                                    <template #append>
                                        <el-button :disabled="disabled1" @click="sendVerificationCode(input1)"
                                                   style="width: 100px">
                                            <span v-if="isSending[active]">发送中...</span>
                                            <span v-else-if="disabled1" style="font-size: 12px">{{
                                                cooldownCountdown1
                                                }}秒后可重新发送</span>
                                            <span v-else>发送验证码</span></el-button>
                                    </template>
                                </el-input>
                            </div>
                            <el-button class="next-button" type="primary" @click="next" :disabled="!input1 || !code1">
                                下一步
                            </el-button>
                        </div>
                        <div v-if="active === 3" class="active-div-end">
                            <h2>完成</h2>
                            <div>修改成功</div>
                            <p>
                                <a href="#" class="goBack" @click.prevent="goBack">返回上一页</a>
                                <span v-if="countdown > 0">,{{ countdown }}秒后自动返回</span>
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import {onMounted, ref, watch} from 'vue';
import {useRoute, useRouter} from 'vue-router';
import userRes from "@/request/user";
import {encryptEmail, encryptPhone} from "@/utils/encrypt";
import {getCookie, parseJwt} from "@/utils/cookieJwt";
import {ElMessage} from "element-plus";

const active = ref(0);
const action = ref('');

const input = ref('');
const code = ref('');
const input1 = ref('');
const code1 = ref('');

// 存储是否禁用按钮状态
const disabled = ref(false);
const disabled1 = ref(false);
// 存储冷却倒计时
const cooldownCountdown = ref(0);
const cooldownCountdown1 = ref(0);
// 存储上次发送时间
const lastSendTime = ref(0);
const lastSendTime1 = ref(0);
// 存储是否正在发送状态
const isSending = ref([false, false]);

const route = useRoute();
const router = useRouter();
const userSecurityInfo = ref({})
const userStore = ref(JSON.parse(localStorage.getItem('token')));

const encryptedPhone = ref('');
const encryptedEmail = ref('');
const jwtToken = getCookie('token');
const userInfo = ref(userStore.value ? parseJwt(userStore.value) : jwtToken ? parseJwt(jwtToken) : null);
const userId = userInfo.value ? userInfo.value.id : null;
const type = ref(route.query.action || null);
console.log(type.value)

const countdown = ref(5);
const goBack = () => {
    router.go(-1); // 返回上一页
};

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

// 封装发送验证码函数
const sendVerificationCode = async (input) => {
    if (!input) {
        if (action.value === 'changeEmail') {
            ElMessage.error('请输入邮箱');
            return;
        } else if (action.value === 'changePhone') {
            ElMessage.error('请输入手机号');
            return;
        }
    }
    try {
        if (action.value === 'changeEmail') {
            if (active.value === 0) {
                if (input != userSecurityInfo.value.email) {
                    ElMessage.error('邮箱错误');
                    return;
                }
            } else if (active.value === 1) {
                if (input === userSecurityInfo.value.email) {
                    ElMessage.error('新邮箱与旧邮箱相同');
                    return;
                }
            }
        } else if (action.value === 'changePhone') {
            if (active.value === 0) {
                if (input != userSecurityInfo.value.phone) {
                    ElMessage.error('手机号错误');
                    return;
                }
            } else if (active.value === 1) {
                if (input === userSecurityInfo.value.phone) {
                    ElMessage.error('新手机号与旧手机号相同');
                    return;
                }
            }
        }
        isSending[active.value] = true;
        const res = await userRes.sendCode(input, action.value, active.value);
        console.log(res)
        if (res.status === 200) {
            ElMessage.success('验证码已发送');
            if (active.value === 0) {
                disabled.value = true;
                cooldownCountdown.value = 60;
                lastSendTime.value = Date.now();
            } else {
                disabled1.value = true;
                cooldownCountdown1.value = 60;
                lastSendTime1.value = Date.now();
            }
            const interval = setInterval(() => {
                if (active.value === 0) {
                    cooldownCountdown.value--;
                } else {
                    cooldownCountdown1.value--;
                }
                if (cooldownCountdown.value === 0 && disabled.value) {
                    clearInterval(interval);
                    disabled.value = false;
                } else if (cooldownCountdown1.value === 0 && disabled1.value) {
                    clearInterval(interval);
                    disabled1.value = false;
                }
            }, 1000);
        } else {
            ElMessage.error('验证码发送失败');
        }
    } catch (err) {
        console.log(err)
        ElMessage.error('验证码发送失败');
    } finally {
        isSending[active.value] = false;
    }
}

const next = async () => {
    try {
        if (active.value === 0) {
            const res = await userRes.confirmChange(userId, input.value, code.value, action.value, active.value);
            if (res.status === 200) {
                ElMessage.success('验证成功');
                active.value++;
            }
        } else if (active.value === 1) {
            const res = await userRes.confirmChange(userId, input1.value, code1.value, action.value, active.value);
            if (res.status === 200) {
                ElMessage.success('验证成功');
                active.value += 2;
            }
        }
    } catch (e) {
        console.log(e)
        if (action.value === 'changeEmail') {
            ElMessage.error('邮箱或验证码错误');
            return;
        } else if (action.value === 'changePhone') {
            ElMessage.error('手机号或验证码错误');
            return;
        }
    }
};

onMounted(() => {
    getSecurityInfo(userId);
    action.value = route.query.action || '';
})

// 新增：用于更新倒计时
watch(cooldownCountdown, () => {
    if (cooldownCountdown.value === 0) {
        disabled.value = false;
    }
});
watch(cooldownCountdown1, () => {
    if (cooldownCountdown1.value === 0) {
        disabled1.value = false;
    }
});


// 新增：用于检查是否处于冷却时间
watch(lastSendTime, () => {
    if (lastSendTime.value > 0) {
        const elapsedTime = (Date.now() - lastSendTime.value) / 1000;
        if (elapsedTime < 60) {
            disabled.value = true;
            cooldownCountdown.value = 60 - Math.floor(elapsedTime);
        } else {
            disabled.value = false;
        }
    }
});
watch(lastSendTime1, () => {
    if (lastSendTime1.value > 0) {
        const elapsedTime = (Date.now() - lastSendTime1.value) / 1000;
        if (elapsedTime < 60) {
            disabled1.value = true;
            cooldownCountdown1.value = 60 - Math.floor(elapsedTime);
        } else {
            disabled1.value = false;
        }
    }
});
watch(active, () => {
    if (active.value === 3) {
        const interval = setInterval(() => {
            countdown.value--;
            if (countdown.value === 0) {
                clearInterval(interval);
                goBack();
            }
        }, 1000);
    }
});
</script>

<style scoped>
.security-page {
    width: 100%;
    height: 100%;
    padding: 20px;

    .security-div {
        width: 100%;
        height: 430px;
        background-color: #fff;
        display: flex;
        justify-content: center;

        .security-div-left {
            width: 200px;
            height: 100%;
            padding: 30px;
        }

        .security-div-right {
            width: 500px;
            height: 100%;
            padding: 30px;
            display: flex;
            align-items: center;
            justify-content: center;

            .active-div {
                display: flex;
                flex-direction: column;
                align-items: center;
                justify-content: space-between;
                gap: 20px;
                height: 100%;

                .active-div-title {
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    justify-content: center;
                    gap: 10px;

                    h2 {
                        font-size: 30px;
                        letter-spacing: 2px;
                    }
                }

                .active-div-input {
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    justify-content: center;
                    gap: 15px;

                    p {
                        width: 300px;
                    }

                    .input-with-select {
                        .el-button {
                            padding: 0;
                        }
                    }

                    .input {
                        width: 300px;
                    }
                }

                .next-button {
                    width: 300px;
                    height: 45px;
                }
            }

            .active-div-end {
                display: flex;
                flex-direction: column;
                align-items: center;

                h2 {
                    font-size: 30px;
                    letter-spacing: 2px;
                }
                .goBack{
                    color: #409EFF;
                }
                .goBack:hover{
                    text-decoration: underline;
               }
            }
        }
    }
}
</style>