<template>
    <div class="div-page">
        <div class="viewport">
            <div class="security-page">
                <div class="security-div">
                    <div class="security-div-left">
                        <el-steps direction="vertical" :active="active" finish-status="success"
                                  v-if="['changeEmail', 'changePhone'].includes(action)">
                            <el-step title="身份认证"/>
                            <el-step title="设置操作"/>
                            <el-step title="完成"/>
                        </el-steps>
                        <el-steps direction="vertical" :active="active" finish-status="success" v-else>
                            <el-step title="选择验证方式"/>
                            <el-step title="身份认证"/>
                            <el-step title="设置操作"/>
                            <el-step title="完成"/>
                        </el-steps>
                    </div>
                    <div class="security-div-right">
                        <!-- 换绑邮箱或手机 -->
                        <div v-if="['changeEmail', 'changePhone'].includes(action) && active === 0"
                             class="active-div">
                            <div class="active-div-title">
                                <h2>{{ action === 'changeEmail' ? '邮箱身份认证' : '手机身份认证' }}</h2>
                                <div>{{
                                    action === 'changeEmail' ? '请输入该账号已绑定的邮箱' : '请输入该账号已绑定的手机号'
                                    }}
                                </div>
                            </div>

                            <div class="active-div-input">
                                <p><label>{{
                                    action === 'changeEmail' ? '已绑邮箱：' : '已绑手机号：'
                                    }}</label>{{ action === 'changeEmail' ? encryptedEmail : encryptedPhone }}</p>
                                <el-input class="input" v-model="input" size="large"
                                          :placeholder="action === 'changeEmail' ? '请输入该账号已绑定的邮箱' : '请输入该账号已绑定的手机号'"/>
                                <el-input
                                        v-model="code"
                                        :placeholder="action === 'changeEmail' ? '请输入邮箱验证码' : '请输入手机验证码'"
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
                                            <span v-else>{{
                                                action === 'changeEmail' ? '发送邮箱验证码' : '发送手机验证码'
                                                }}</span></el-button>
                                    </template>
                                </el-input>
                            </div>
                            <el-button class="next-button" type="primary" @click="next" :disabled="!input ||!code">
                                下一步
                            </el-button>
                        </div>
                        <div v-if="['changeEmail', 'changePhone'].includes(action) && active === 1"
                             class="active-div">
                            <div class="active-div-title">
                                <h2>{{ action === 'changeEmail' ? '邮箱设置操作' : '手机设置操作' }}</h2>
                                <div>{{ action === 'changeEmail' ? '请输入新的邮箱' : '请输入新的手机号' }}</div>
                            </div>
                            <div class="active-div-input">
                                <el-input v-model="input1" size="large"
                                          :placeholder="action === 'changeEmail' ? '请输入新的邮箱' : '请输入新的手机号'"/>
                                <el-input
                                        v-model="code1"
                                        :placeholder="action === 'changeEmail' ? '请输入邮箱验证码' : '请输入手机验证码'"
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
                                            <span v-else>{{
                                                action === 'changeEmail' ? '发送邮箱验证码' : '发送手机验证码'
                                                }}</span></el-button>
                                    </template>
                                </el-input>
                            </div>
                            <el-button class="next-button" type="primary" @click="next" :disabled="!input1 || !code1">
                                下一步
                            </el-button>
                        </div>

                        <!-- 修改密码 -->
                        <div v-if="action === 'changePassword' && active === 0" class="active-div">
                            <div class="active-div-title">
                                <h2>密码修改方式选择</h2>
                                <div>请选择一种密码修改方式</div>
                            </div>
                            <div class="active-div-input">
                                <div class="selectedMethod">
                                    <div
                                            class="selectedMethod-item"
                                            @click="selectMethod('oldPassword')"
                                            :class="{ 'is-selected': passwordChangeMethod === 'oldPassword' }"
                                    >
                                        <span>使用旧密码修改</span>
                                        <img :src="server_URL + '/icon/password.png'" alt="使用旧密码修改" draggable="false" />
                                    </div>
                                    <div
                                            class="selectedMethod-item"
                                            @click="selectMethod('email')"
                                            :class="{ 'is-selected': passwordChangeMethod === 'email' }"
                                    >
                                        <span>使用邮箱验证修改</span>
                                        <img :src="server_URL + '/icon/email.png'" alt="使用邮箱验证修改" draggable="false" />
                                    </div>
                                    <div
                                            class="selectedMethod-item"
                                            @click="selectMethod('phone')"
                                            :class="{ 'is-selected': passwordChangeMethod === 'phone' }"
                                    >
                                        <span>使用手机验证修改</span>
                                        <img :src="server_URL + '/icon/phone.png'" alt="使用手机验证修改" draggable="false" />
                                    </div>
                                </div>
                            </div>
                            <el-button class="next-button" type="primary" @click="next"
                                       :disabled="!passwordChangeMethod">
                                下一步
                            </el-button>
                        </div>
                        <div v-if="action === 'changePassword' && active === 1" class="active-div">
                            <div class="active-div-title">
                                <h2 v-if="passwordChangeMethod === 'oldPassword'">旧密码修改密码</h2>
                                <h2 v-if="passwordChangeMethod === 'email'">邮箱验证修改密码</h2>
                                <h2 v-if="passwordChangeMethod === 'phone'">手机验证修改密码</h2>
                            </div>
                            <div class="active-div-input">
                                <p v-if="passwordChangeMethod !== 'oldPassword'"><label>{{
                                    passwordChangeMethod === 'email' ? '已绑邮箱：' : passwordChangeMethod === 'phone' ? '已绑手机号：' : null
                                    }}</label>{{
                                    passwordChangeMethod === 'email' ? encryptedEmail : passwordChangeMethod === 'phone' ? encryptedPhone : null
                                    }}</p>
                                <el-input v-if="passwordChangeMethod === 'oldPassword'" v-model="oldPassword"
                                          type="password" size="large" placeholder="请输入旧密码"/>
                                <el-input v-if="passwordChangeMethod === 'email'" v-model="input2" size="large"
                                          placeholder="请输入该账号已绑定的邮箱"/>
                                <el-input v-if="passwordChangeMethod === 'phone'" v-model="input2" size="large"
                                          placeholder="请输入该账号已绑定的手机号"/>
                                <el-input
                                        v-if="['email', 'phone'].includes(passwordChangeMethod)"
                                        v-model="code2"
                                        :placeholder="passwordChangeMethod === 'email' ? '请输入邮箱验证码' : '请输入手机验证码'"
                                        class="input-with-select input"
                                        maxlength="6"
                                        size="large"
                                >
                                    <template #append>
                                        <el-button :disabled="disabled2" @click="sendVerificationCode(input2)"
                                                   style="width: 100px">
                                            <span v-if="isSending[active]">发送中...</span>
                                            <span v-else-if="disabled2" style="font-size: 12px">{{
                                                cooldownCountdown2
                                                }}秒后可重新发送</span>
                                            <span v-else>{{
                                                passwordChangeMethod === 'email' ? '发送邮箱验证码' : '发送手机验证码'
                                                }}</span></el-button>
                                    </template>
                                </el-input>
                            </div>
                            <el-button class="next-button" type="primary" @click="next"
                                       :disabled="(passwordChangeMethod === 'oldPassword' && !oldPassword) || (['email', 'phone'].includes(passwordChangeMethod) && (!input ||!code))">
                                下一步
                            </el-button>
                        </div>
                        <div v-if="action === 'changePassword' && active === 2" class="active-div">
                            <div class="active-div-title">
                                <h2>设置新密码</h2>
                                <div>请输入新密码并确认</div>
                            </div>
                            <div class="active-div-input">
                                <el-input v-model="newPassword" type="password" size="large"
                                          placeholder="请输入新密码"/>
                                <el-input v-model="confirmPassword" type="password" size="large"
                                          placeholder="请再次输入新密码"/>
                            </div>
                            <el-button class="next-button" type="primary" @click="next"
                                       :disabled="!newPassword ||!confirmPassword || newPassword!== confirmPassword">
                                下一步
                            </el-button>
                        </div>

                        <div v-if="active === 3" class="active-div-end">
                            <h2>完成</h2>
                            <div v-if="action === 'changeEmail'">邮箱修改成功</div>
                            <div v-if="action === 'changePhone'">手机号修改成功</div>
                            <div v-if="action === 'changePassword'">密码修改成功</div>
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
import {onMounted, ref, watch, watchEffect} from 'vue';
import {useRoute, useRouter} from 'vue-router';
import userRes from "@/request/user";
import {encryptEmail, encryptPhone} from "@/utils/encrypt";
import {getCookie, parseJwt} from "@/utils/cookieJwt";
import {ElMessage} from "element-plus";
import Auth from "@/request/auth";
import Cookies from 'js-cookie';
import {server_URL} from "@/urlConfig.js";

const active = ref(0);
const passwordChangeMethod = ref('');
const oldPassword = ref('');
const newPassword = ref('');
const confirmPassword = ref('');

const input = ref('');
const code = ref('');
const input1 = ref('');
const code1 = ref('');
const input2 = ref('');
const code2 = ref('');

// 存储是否禁用按钮状态
const disabled = ref(false);
const disabled1 = ref(false);
const disabled2 = ref(false);
// 存储冷却倒计时
const cooldownCountdown = ref(0);
const cooldownCountdown1 = ref(0);
const cooldownCountdown2 = ref(0);
// 存储上次发送时间
const lastSendTime = ref(0);
const lastSendTime1 = ref(0);
const lastSendTime2 = ref(0);
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
const action = ref(route.query.action || null);

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

const selectMethod = (method) => {
    passwordChangeMethod.value = method;
};

// 封装发送验证码函数
const sendVerificationCode = async (input) => {
    if (!input) {
        if (action.value === 'changeEmail' || passwordChangeMethod.value === 'email') {
            ElMessage.error('请输入邮箱');
            return;
        } else if (action.value === 'changePhone' || passwordChangeMethod.value === 'phone') {
            ElMessage.error('请输入手机号');
            return;
        }
    }
    try {
        let currentAction = action.value;
        if (passwordChangeMethod.value === 'email') {
            currentAction = 'changePasswordByEmail';
        } else if (passwordChangeMethod.value === 'phone') {
            currentAction = 'changePasswordByPhone';
        }
        isSending[active.value] = true;
        const res = await userRes.sendCode(input, currentAction, active.value);
        console.log(res)
        if (res.status === 200) {
            ElMessage.success('验证码已发送');
            if (action.value !== 'changePassword') {
                if (active.value === 0) {
                    disabled.value = true;
                    cooldownCountdown.value = 60;
                    lastSendTime.value = Date.now();
                } else {
                    disabled1.value = true;
                    cooldownCountdown1.value = 60;
                    lastSendTime1.value = Date.now();
                }
            } else {
                disabled2.value = true;
                cooldownCountdown2.value = 60;
                lastSendTime2.value = Date.now();
            }
            const interval = setInterval(() => {
                if (action.value !== 'changePassword') {
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
                } else {
                    cooldownCountdown2.value--;
                    if (cooldownCountdown2.value === 0 && disabled2.value) {
                        clearInterval(interval);
                        disabled2.value = false;
                    }
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
        if (action.value === 'changeEmail' || action.value === 'changePhone') {
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
                    active.value = 3;
                }
            }
        } else if (action.value === 'changePassword') {
            if (active.value === 0) {
                active.value++;
            } else if (active.value === 1) {
                if (passwordChangeMethod.value === 'oldPassword') {
                    const res = await userRes.confirmChangePasswordByOldPassword(userId, oldPassword.value);
                    if (res.status === 200) {
                        ElMessage.success('旧密码验证成功');
                        active.value++;
                    } else {
                        ElMessage.error('旧密码错误');
                    }
                } else if (passwordChangeMethod.value === 'email') {
                    const res = await userRes.confirmChangePasswordByEmail(userId, input2.value, code2.value);
                    if (res.status === 200) {
                        ElMessage.success('邮箱验证成功');
                        active.value++;
                    } else {
                        ElMessage.error('邮箱或验证码错误');
                    }
                } else if (passwordChangeMethod.value === 'phone') {
                    const res = await userRes.confirmChangePasswordByPhone(userId, input2.value, code2.value);
                    if (res.status === 200) {
                        ElMessage.success('手机验证成功');
                        active.value++;
                    } else {
                        ElMessage.error('手机号或验证码错误');
                    }
                }
            } else if (active.value === 2) {
                if (newPassword.value !== confirmPassword.value) {
                    ElMessage.error('两次输入的密码不一致');
                    return;
                }
                let res;
                if (passwordChangeMethod.value === 'oldPassword') {
                    res = await userRes.changePasswordByOldPassword(userId, oldPassword.value, newPassword.value);
                } else if (passwordChangeMethod.value === 'email') {
                    res = await userRes.changePasswordByEmail(userId, input.value, code.value, newPassword.value);
                } else if (passwordChangeMethod.value === 'phone') {
                    res = await userRes.changePasswordByPhone(userId, input.value, code.value, newPassword.value);
                }
                if (res.status === 200) {
                    ElMessage.success('密码修改成功');
                    active.value++;
                } else {
                    ElMessage.error('密码修改失败');
                }
            }
        }
    } catch (e) {
        console.log(e)
        if (action.value === 'changeEmail') {
            ElMessage.error('邮箱或验证码错误');
        } else if (action.value === 'changePhone') {
            ElMessage.error('手机号或验证码错误');
        } else if (action.value === 'changePassword') {
            ElMessage.error('验证失败，请重试');
        }
    }
};

onMounted(() => {
    getSecurityInfo(userId);
    action.value = route.query.action || '';
})

// 用于更新倒计时
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
watch(lastSendTime2, () => {
    if (lastSendTime2.value > 0) {
        const elapsedTime = (Date.now() - lastSendTime2.value) / 1000;
        if (elapsedTime < 60) {
            disabled2.value = true;
            cooldownCountdown2.value = 60 - Math.floor(elapsedTime);
        } else {
            disabled2.value = false;
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
// 检查本地缓存和 cookie
// 封装获取登录信息的函数
const getLoginInfo = () => {
    const userData = localStorage.getItem('UserData');
    let localToken = localStorage.getItem('token');
    const cookieToken = Cookies.get('token');

    // 去除 localToken 两端的双引号（如果存在）
    if (localToken && localToken.startsWith('"') && localToken.endsWith('"')) {
        localToken = localToken.slice(1, -1);
    }

    return { userData, localToken, cookieToken };
};

onMounted(() => {
    // 初始检测
    const { userData, localToken, cookieToken } = getLoginInfo();
    if (!(userData && localToken && cookieToken && localToken === cookieToken)) {
        console.log(localToken);
        console.log(cookieToken);
        Auth.logout().then(() => {
            ElMessage.info('检测到登录信息异常，已退出登录');
        }).catch((err) => {
            console.error('退出登录失败:', err);
            ElMessage.error('退出登录失败，请稍后重试');
        });
    }

    // 实时检测
    watchEffect(() => {
        const { userData, localToken, cookieToken } = getLoginInfo();
        if (!(userData && localToken && cookieToken && localToken === cookieToken)) {
            console.log(localToken);
            console.log(cookieToken);
            Auth.logout().then(() => {
                ElMessage.info('检测到登录信息异常，已退出登录');
            }).catch((err) => {
                console.error('退出登录失败:', err);
                ElMessage.error('退出登录失败，请稍后重试');
            });
        }
    });
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

                    .selectedMethod {
                        display: flex;
                        flex-direction: row;
                        gap: 10px;

                        .selectedMethod-item {
                            padding: 20px 10px;
                            width: 140px;
                            height: 180px;
                            cursor: pointer;
                            border: 1px solid #ccc;
                            margin-bottom: 5px;
                            border-radius: 5px;
                            background-color: white;
                            display: flex;
                            flex-direction: column;
                            align-items: center;
                            justify-content: space-between;

                            span{
                                font-size: 12px;
                                font-weight: bold;
                                letter-spacing: 1px;
                            }
                            img{
                                width: 100px;
                                height: 100px;
                            }
                        }

                        .is-selected {
                            border: 1px solid #5a99dc;
                            background-color: rgba(90, 153, 220, 0.4);
                        }
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

                .goBack {
                    color: #409EFF;
                }

                .goBack:hover {
                    text-decoration: underline;
                }
            }
        }
    }
}
</style>