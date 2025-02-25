import axios from "axios";
import router from "@/router/index";
import Cookies from 'js-cookie';
import Auth from "@/request/auth";

const request = axios.create({
    timeout: 5000,
    headers: {
        'Content-Type': 'application/json;charset=UTF-8'
    }
});

const interceptPaths = ['/api/user'];

request.interceptors.request.use(
    config => {
        // 检查请求的 URL 是否在拦截路径数组中
        if (interceptPaths.some(path => config.url.startsWith(path))) {
            console.log(config.url);
            // 从 cookie 中获取 token
            const cookieToken = Cookies.get('token');
            // 从本地存储中获取 token
            let localToken = localStorage.getItem('token');

            // 去除 localToken 两端的双引号（如果存在）
            if (localToken && localToken.startsWith('"') && localToken.endsWith('"')) {
                localToken = localToken.slice(1, -1);
            }

            // 检查 token 是否存在且一致
            if (!localToken || !cookieToken || localToken!== cookieToken) {
                console.log("Token information is inconsistent or missing.");
                alert('Token 信息不一致或缺失，需要重新登录');
                // 调用退出登录方法
                Auth.logout();
                // 移除本地存储的 token 和用户数据
                localStorage.removeItem('token');
                localStorage.removeItem('UserData');
                // 跳转到登录页面
                router.push('/Auth/Login');
                // 直接打断请求并抛出错误
                return Promise.reject(new Error("Token information is inconsistent or missing. Please log in."));
            }
        }
        return config;
    },
    error => {
        return Promise.reject(error);
    }
);

request.interceptors.response.use(
    response => response,
    error => {
        if (error.response && error.response.status === 401 && interceptPaths.some(path => error.response.config.url.startsWith(path))) {
            alert('Token 过期，需要重新登录');
            Auth.logout();
            localStorage.removeItem('token');
            localStorage.removeItem('UserData');
            router.push('/Auth/Login');
        }
        return Promise.reject(error);
    }
);


export default request;