vue
<template>
    <div class="LoginAndRegister">
        <div class="shell">
            <div id="a-container" :class="['container', 'a-container', { 'is-txl': isTxl }]">
                <form id="a-form" action="" class="form" method="">
                    <h2 class="form_title title">创建账号</h2>
                    <span class="form_item">
                        <label>用户名:</label>
                        <div class="form_item_content">
                            <input v-model="username" @input="validateUsername" class="form_input" maxlength="16"
                                   placeholder="支持数字，大小写字母，汉字，最大字符长度为16位" type="text"/>
                            <span class="form_tip">{{ usernameError }}</span>
                        </div>
                    </span>
                    <span class="form_item">
                        <label>邮箱:</label>
                        <div class="form_item_content">
                            <input v-model="email" @input="validateEmail" class="form_input email_input"
                                   placeholder="请输入正确的邮箱" type="email"/>
                            <span class="form_tip">{{ emailError }}</span>
                        </div>
                    </span>
                    <span class="form_item">
                        <label>验证码:</label>
                        <div class="form_item_content">
                            <span class="form_inputSpan">
                                <input v-model="code" @input="validateCode" class="form_input code_input"
                                       placeholder="请输入验证码" type="password"/>
                                <SendCodeBtn :email="email" />
                            </span>
                            <span class="form_tip">{{ codeError }}</span>
                        </div>
                    </span>
                    <span class="form_item">
                        <label>密码:</label>
                        <div class="form_item_content">
                            <input v-model="password" @input="validatePassword" class="form_input" placeholder="密码"
                                   type="password"/>
                            <span class="form_tip">{{ passwordError }}</span>
                        </div>
                    </span>
                    <button class="form_button button submit" @click.prevent="onRegister">
                        注 册
                    </button>
                </form>
            </div>

            <div id="b-container" :class="[
                'container',
                'b-container',
                { 'is-txl': isTxl },
                { 'is-z': isZ },
            ]">
                <form id="b-form" action="" class="form" method="">
                    <h2 class="form_title title">登入账号</h2>
                    <div class="type_select">
                        <span v-for="(item, index) in items" :key="index" :class="{ active: currentIndex === index }"
                              @click="selectItem(index)">
                            {{ item }}
                        </span>
                    </div>

                    <transition mode="out-in" name="zoom">
                        <component :is="getComponentName"
                                   :username="username0"
                                   :password="password0"
                                   :email="email0"
                                   :code="code0"
                                   :usernameError="usernameError0"
                                   :passwordError="passwordError0"
                                   :emailError="emailError0"
                                   :codeError="codeError0"
                                   @update:username="username0 = $event"
                                   @update:password="password0 = $event"
                                   @update:email="email0 = $event"
                                   @update:code="code0 = $event"
                                   @update:usernameError="usernameError0 = $event"
                                   @update:passwordError="passwordError0 = $event"
                                   @update:emailError="emailError0 = $event"
                                   @update:codeError="codeError0 = $event"
                        />
                    </transition>
                    <button class="form_button button submit" @click.prevent="onLogin">
                        登 录
                    </button>
                </form>
            </div>

            <div id="switch-cnt" :class="['switch', { 'is-txr': isTxr }, { 'is-gx': isGx }]">
                <div :class="['switch_circle', { 'is-txr': isTxr }]"></div>
                <div :class="['switch_circle', 'switch_circle-t', { 'is-txr': isTxr }]"></div>
                <div id="switch-c1" :class="['switch_container', { 'is-hidden': isHidden }]">
                    <h2 class="switch_title title" style="letter-spacing: 0">
                        Welcome Back！
                    </h2>
                    <p class="switch_description description">
                        已经有账号了嘛，去登入账号来进入奇妙世界吧！！！
                    </p>
                    <button class="switch_button button switch-btn" @click="changeForm">
                        SIGN IN
                    </button>
                </div>

                <div id="switch-c2" :class="['switch_container', { 'is-hidden':!isHidden }]">
                    <h2 class="switch_title title" style="letter-spacing: 0">
                        Hello Friend！
                    </h2>
                    <p class="switch_description description">
                        去注册一个账号，成为尊贵的粉丝会员，让我们踏入奇妙的旅途！
                    </p>
                    <button class="switch_button button switch-btn" @click="changeForm">
                        SIGN UP
                    </button>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import EmailAndPassword from "@/components/pc/login/emailAndPassword.vue";
import UserAndPassword from "@/components/pc/login/userAndPassword.vue";
import EmailAndCode from "@/components/pc/login/emailAndCode.vue";

export default {
    components: {
        EmailAndPassword,
        UserAndPassword,
        EmailAndCode
    }
}
</script>

<script setup>
import {computed, watch, ref} from "vue";
import Auth from "@/request/auth";
import {ElMessage} from "element-plus";
import {validateEmail, validateUsername, validatePassword, validateCode} from "@/utils/validation";
import SendCodeBtn from "@/components/pc/login/sendCodeBtn.vue";
import { useRoute } from 'vue-router';
import router from "@/router/index";
import { useUserStore } from "@/store/user";

// 获取路由对象
const route = useRoute();
// 接收 route.params.action
const action = route.params.action;

const isTxr = ref(false);
const isGx = ref(false);
const isHidden = ref(false);
const isTxl = ref(false);
const isZ = ref(false);
const currentComponent = ref('UserAndPassword');


// 注册
const username = ref('555');
const email = ref('1097260541@qq.com');
const code = ref('');
const password = ref('12345678');
const usernameError = ref('');
const emailError = ref('');
const codeError = ref('');
const passwordError = ref('');


// 登录1
const username0 = ref('');
const password0 = ref('');
const email0 = ref('');
const code0 = ref('');
const usernameError0 = ref('');
const passwordError0 = ref('');
const emailError0 = ref('');
const codeError0 = ref('');

if (action === 'Login') {
    isTxr.value =!isTxr.value;
    isHidden.value =!isHidden.value;
    isTxl.value =!isTxl.value;
    isZ.value =!isZ.value;
}else if (action === 'Register') {}else {
    router.push('/');
}
const changeForm = () => {
    isTxr.value =!isTxr.value;
    isHidden.value =!isHidden.value;
    isTxl.value =!isTxl.value;
    isZ.value =!isZ.value;
};


const items = ref(['用户密码', '邮箱验证', '邮箱密码']);
const currentIndex = ref(0);


const selectItem = (index) => {
    currentIndex.value = index;
    switch (index) {
        case 0:
            currentComponent.value = 'UserAndPassword';
            break;
        case 1:
            currentComponent.value = 'EmailAndCode';
            break;
        case 2:
            currentComponent.value = 'EmailAndPassword';
            break;
    }
};


const getComponentName = computed(() => {
    return currentComponent.value;
});

const userStore = useUserStore();
const onLogin = async () => {
    switch (currentIndex.value) {
        case 0: {
            // 用户名密码登录逻辑
            const usernameErr = validateUsername(username0.value);
            const passwordErr = validatePassword(password0.value);
            if (usernameErr || passwordErr) {
                usernameError0.value = usernameErr;
                passwordError0.value = passwordErr;
                return;
            }
            try {
                const res = await Auth.login({
                    username: username0.value,
                    password: password0.value
                }, 'USER_PASSWORD');
                console.log(res);
                const data1 = res.data.data;
                console.log(data1)
                userStore.setUserData(data1);
                ElMessage.success('登录成功');
            } catch (error) {
                console.error('用户名密码登录失败', error);
            }
        }
            break;

        case 1: {
            // 邮箱验证码登录逻辑
            const emailErr = validateEmail(email0.value);
            const codeErr = validateCode(code0.value);
            if (emailErr || codeErr) {
                emailError0.value = emailErr;
                codeError0.value = codeErr;
                return;
            }
            try {
                const res = await Auth.login({
                    email: email0.value,
                    code: code0.value
                }, 'EMAIL_VERIFICATION');
                console.log(res);
                const data1 = res.data.data;
                console.log(data1)
                userStore.setUserData(data1);
                ElMessage.success('登录成功');
            } catch (error) {
                console.error('邮箱验证码登录失败', error);
            }
        }
            break;

        case 2: {
            // 邮箱密码登录逻辑
            const emailErr = validateEmail(email0.value);
            const passwordErr = validatePassword(password0.value);
            if (emailErr || passwordErr) {
                emailError0.value = emailErr;
                passwordError0.value = passwordErr;
                return;
            }
            try {
                const res = await Auth.login({
                    email: email0.value,
                    password: password0.value
                }, 'EMAIL_PASSWORD');
                console.log(res);
                const data1 = res.data.data;
                console.log(data1)
                userStore.setUserData(data1);
                ElMessage.success('登录成功');
            } catch (error) {
                console.error('邮箱密码登录失败', error);
            }
        }
            break;

        default:
            // 处理其他情况
            console.warn('未知的登录方式');
            break;
    }
};


const onRegister = async () => {
    const usernameErr = validateUsername(username.value);
    const emailErr = validateEmail(email.value);
    const codeErr = validateCode(code.value);
    const passwordErr = validatePassword(password.value);
    if (usernameErr || emailErr || codeErr || passwordErr) {
        usernameError.value = usernameErr;
        emailError.value = emailErr;
        codeError.value = codeErr;
        passwordError.value = passwordErr;
        return;
    }
    try {
        const res = await Auth.register({
            username: username.value,
            email: email.value,
            code: code.value,
            password: password.value
        });
        console.log(res);
    } catch (error) {
        console.error('注册失败', error);
        if (error.response) {
            // 服务器返回了响应
            const errorData = error.response.data;
            switch (errorData.errorcode) {
                case 1001:
                    // 用户名已存在
                    usernameError.value = errorData.errormsg;
                    break;
                case 1002:
                    // 邮箱已存在
                    emailError.value = errorData.errormsg;
                    break;
                case 1023:
                    // 验证码错误
                    codeError.value = errorData.errormsg;
                    break;
            }
            ElMessage.error(errorData.errormsg || '注册失败');
        } else {
            // 请求未完成，例如网络错误
            ElMessage.error('网络错误，请稍后重试');
        }
    }
};


watch(username, () => {
    usernameError.value = validateUsername(username.value);
});
watch(email, () => {
    emailError.value = validateEmail(email.value);
});
watch(code, () => {
    codeError.value = validateCode(code.value);
});
watch(password, () => {
    passwordError.value = validatePassword(password.value);
});


watch(username0, () => {
    usernameError0.value = validateUsername(username0.value);
});
watch(password0, () => {
    passwordError0.value = validatePassword(password0.value);
});
</script>

<style>
* {
    /* 字体无法选中 */
    user-select: none;
}

.LoginAndRegister {
    width: 100%;
    height: 100vh;
    display: flex;
    justify-content: center;
    align-items: center;
    font-size: 12px;
    background-color: #ecf0f3;
    color: #a0a5a8;

    .shell {
        position: relative;
        width: 1000px;
        min-width: 1000px;
        min-height: 600px;
        height: 600px;
        padding: 25px;
        background-color: #ecf0f3;
        box-shadow: 10px 10px 10px #d1d9e6, -10px -10px 10px #f9f9f9;
        border-radius: 12px;
        overflow: hidden;
    }

    /* 设置响应式 */
    @media (max-width: 1200px) {
        .shell {
            transform: scale(0.7);
        }
    }

    @media (max-width: 1000px) {
        .shell {
            transform: scale(0.6);
        }
    }

    @media (max-width: 800px) {
        .shell {
            transform: scale(0.5);
        }
    }

    @media (max-width: 600px) {
        .shell {
            transform: scale(0.4);
        }
    }

    .container {
        display: flex;
        justify-content: center;
        align-items: center;
        position: absolute;
        top: 0;
        width: 600px;
        height: 100%;
        padding: 25px;
        background-color: #ecf0f3;
        transition: 1.25s;
    }

    .form {
        display: flex;
        justify-content: center;
        align-items: center;
        flex-direction: column;
        width: 100%;
        height: 100%;

        label {
            display: inline-block;
            font-size: 14px;
            font-weight: 500;
            width: 60px;
            text-align: left;
        }

        .form_item_content {
            display: inline-flex;
            flex-direction: column;

            .form_inputSpan {
                display: flex;
                align-items: center;
            }

            .form_tip {
                width: 100%;
                height: 20px;
                color: red;
            }
        }

        .type_select_div {
            display: flex;
            align-items: center;
            justify-content: center;
            flex-direction: column;
            width: 100%;
        }

        .submit {
            margin-top: 20px;
        }
    }

    .zoom-enter-active,
    .zoom-leave-active {
        transition: all 0.4s ease;
    }

    .zoom-enter,
    .zoom-leave-to {
        opacity: 0;
        transform: translateX(150px)
    }

    .form_input {
        width: 280px;
        height: 40px;
        margin: 4px 0;
        padding-left: 25px;
        font-size: 13px;
        letter-spacing: 0.15px;
        border: none;
        outline: none;
        background-color: #ecf0f3;
        transition: 0.25s ease;
        border-radius: 8px;
        box-shadow: inset 2px 2px 4px #d1d9e6, inset -2px -2px 4px #f9f9f9;
    }

    .form_input::placeholder {
        font-size: 12px;
    }

    .form_input:focus,
    .email_input:focus {
        box-shadow: inset 4px 4px 4px #d1d9e6, inset -4px -4px 4px #f9f9f9;
    }

    .email_input {
        background-color: rgba(255, 255, 255, 0);
    }

    .email_input:focus {
        outline: none;
        border: none;
    }

    .code_input {
        width: 190px;
    }

    .type_select {
        box-sizing: border-box;
        display: flex;
        justify-content: space-between;
        width: 210px;
        height: 36px;
        margin: 0 3px 15px;
        background: #d7e1e9;
        border-radius: 18px;

        span {
            cursor: pointer;
            display: inline-flex;
            box-sizing: border-box;
            align-items: center;
            width: 70px;
            padding: 0 5px;
            height: 100%;
            border-radius: 18px;
            text-align: center;
            justify-content: center;
        }

        span.active {
            background: #5a99dc;
            color: #fff;
            transition: all 0.5s ease-in-out;
        }
    }

    .form_link {
        color: #181818;
        font-size: 15px;
        border-bottom: 1px solid #a0a5a8;
        line-height: 2;
    }

    .title {
        font-size: 34px;
        font-weight: 700;
        line-height: 3;
        color: #181818;
        letter-spacing: 10px;
    }

    .description {
        font-size: 14px;
        letter-spacing: 0.25px;
        text-align: center;
        line-height: 1.6;
    }

    .button {
        width: 180px;
        height: 50px;
        border-radius: 25px;
        margin-top: 50px;
        font-weight: 700;
        font-size: 14px;
        letter-spacing: 1.15px;
        background-color: #4b70e2;
        color: #f9f9f9;
        box-shadow: 8px 8px 16px #d1d9e6, -8px -8px 16px #f9f9f9;
        border: none;
        outline: none;
    }

    .a-container {
        z-index: 100;
        left: calc(100% - 600px);
    }

    .b-container {
        left: calc(100% - 600px);
        z-index: 0;
    }

    .switch {
        display: flex;
        justify-content: center;
        align-items: center;
        position: absolute;
        top: 0;
        left: 0;
        height: 100%;
        width: 400px;
        padding: 50px;
        z-index: 200;
        transition: 1.25s;
        background-color: #ecf0f3;
        overflow: hidden;
        box-shadow: 4px 4px 10px #d1d9e6, -4px -4px 10px #d1d9e6;
    }

    .switch_circle {
        position: absolute;
        width: 500px;
        height: 500px;
        border-radius: 50%;
        background-color: #ecf0f3;
        box-shadow: inset 8px 8px 12px #b8bec7, inset -8px -8px 12px #fff;
        bottom: -60%;
        left: -60%;
        transition: 1.25s;
    }

    .switch_circle-t {
        top: -30%;
        left: 60%;
        width: 300px;
        height: 300px;
    }

    .switch_container {
        display: flex;
        justify-content: center;
        align-items: center;
        flex-direction: column;
        position: absolute;
        width: 400px;
        padding: 50px 55px;
        transition: 1.25s;
    }

    .switch_button {
        cursor: pointer;
    }

    .switch_button:hover,
    .submit:hover {
        box-shadow: 6px 6px 10px #d1d9e6, -6px -6px 10px #f9f9f9;
        transform: scale(0.985);
        transition: 0.25s;
    }

    .switch_button:active,
    .switch_button:focus {
        box-shadow: 2px 2px 6px #d1d9e6, -2px -2px 6px #f9f9f9;
        transform: scale(0.97);
        transition: 0.25s;
    }

    .is-txr {
        left: calc(100% - 400px);
        transition: 1.25s;
        transform-origin: left;
    }

    .is-txl {
        left: 0;
        transition: 1.25s;
        transform-origin: right;
    }

    .is-z {
        z-index: 200;
        transition: 1.25s;
    }

    .is-hidden {
        visibility: hidden;
        opacity: 0;
        position: absolute;
        transition: 1.25s;
    }

    .is-gx {
        animation: is-gx 1.25s;
    }

    @keyframes is-gx {

        0%,
        10%,
        100% {
            width: 400px;
        }

        30%,
        50% {
            width: 500px;
        }
    }
}
</style>