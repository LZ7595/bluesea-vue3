<template>
    <div class="NotFoundPage">
        <div class="NotFoundPage-div">
            <div class="NotFoundPage-content">
                <h1>404</h1>
                <h2>页面找不到了</h2>
                <p>抱歉，您访问的页面不存在或已被删除。</p>
                <router-link to="/">返回首页</router-link>
            </div>
            <img class="NotFoundPage-img" :src="server_URL + '/icon/404.png'">
        </div>
    </div>
</template>

<script setup>
import {server_URL} from "@/urlConfig.js";
</script>

<style lang="scss" scoped>
// 提取公共部分
.NotFoundPage {
    width: 100%;
    height: 100vh;
    display: flex;
    justify-content: center;
    align-items: center;
}

.NotFoundPage-div {
    display: flex;
    justify-content: center;
    align-items: center;
}

.NotFoundPage-content {
    display: flex;
    flex-direction: column;
    justify-content: center;
    gap: 10px;

    h1 {
        color: #333;
    }

    h2 {
        color: #666;
    }

    p {
        color: #999;
    }

    a {
        color: #5a99dc;
        text-decoration: none;
    }
}

.NotFoundPage-img {
    height: auto;
    margin-top: 20px;
}


// 大屏桌面端样式（例如屏幕宽度大于等于 1200px）
@media screen and (min-width: 1200px) {
    .NotFoundPage-div {
        width: 900px;

        .NotFoundPage-content {
            width: 400px;

            h1 {
                font-size: 100px;
            }

            h2 {
                font-size: 30px;
            }

            p {
                font-size: 20px;
            }

            a {
                font-size: 20px;
            }
        }

        .NotFoundPage-img {
            width: 500px;
            height: 500px;
        }
    }
}

// 平板端样式（例如屏幕宽度在 768px 到 1199px 之间）
@media screen and (min-width: 768px) and (max-width: 1199px) {
    .NotFoundPage-div {
        width: 700px;

        .NotFoundPage-content {
            width: 350px;

            h1 {
                font-size: 80px;
            }

            h2 {
                font-size: 25px;
            }

            p {
                font-size: 18px;
            }

            a {
                font-size: 18px;
            }
        }

        .NotFoundPage-img {
            width: 350px;
            height: 350px;
        }
    }
}

// 移动端样式（例如屏幕宽度小于 768px）
@media screen and (max-width: 767px) {
    .NotFoundPage-div {
        width: 100%;
        flex-direction: column;
        text-align: center;
        align-items: center;

        .NotFoundPage-content {
            width: 80%;

            h1 {
                font-size: 60px;
            }

            h2 {
                font-size: 20px;
            }

            p {
                font-size: 16px;
            }

            a {
                font-size: 16px;
            }
        }

        .NotFoundPage-img {
            width: 50%;
        }
    }
}
</style>