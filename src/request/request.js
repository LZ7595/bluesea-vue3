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
            // 从 cookie 中检查 jwtToken 是否存在
            console.log(config.url)
            const jwtToken = Cookies.get('token');
            if (!jwtToken) {
                console.log("No jwtToken found in cookie.");
                alert('Token 过期，需要重新登录');
                Auth.logout();
                router.push('/Auth/Login');
                // 直接打断请求并抛出错误
                return Promise.reject(new Error("No jwtToken found in cookie. Please log in."));
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
            router.push('/Auth/Login');
        }
        return Promise.reject(error);
    }
);


export default request;