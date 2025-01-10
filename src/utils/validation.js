export const validateUsername = (value) => {
    const usernameRegex = /^[a-zA-Z0-9\u4e00-\u9fa5]+$/;
    if (!value) {
        return '用户名不能为空';
    }else if (!usernameRegex.test(value)) {
        return '用户名只能包含字母、数字和汉字';
    }else if (value.length > 16) {
        return '用户名长度不能超过16位';
    } else {
        return '';
    }
};

export const validateEmail = (value) => {
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!value) {
        return '邮箱不能为空';
    } else if (!emailRegex.test(value)) {
        return '请输入正确的邮箱格式';
    } else {
        return '';
    }
};

export const validateCode = (value) => {
    if (!value) {
        return '验证码不能为空';
    } else {
        return '';
    }
};

export const validatePassword = (value) => {
    const specialChars = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]+/;
    if (!value) {
        return '密码不能为空';
    } else if (value.length < 8 || value.length > 12) {
        return '密码长度必须在 8 到 12 位之间';
    } else if (specialChars.test(value)) {
        return '密码不允许包含特殊符号';
    } else {
        return '';
    }
};