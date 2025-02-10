<template>
    <div class="div-page">
        <div class="viewport">
            <div class="user-page">
                <div class="user-page-content">
                    <div class="user-page-content-left">
                        <div class="user-page-content-left-item">
                            <h3>我的订单</h3>
                            <ul>
                                <li><a href="#">全部订单</a></li>
                                <li><a href="#">待付款</a></li>
                                <li><a href="#">待收货</a></li>
                                <li><a href="#">待评价</a></li>
                                <li><a href="#">退货/退款</a></li>
                            </ul>
                        </div>
                        <div class="user-page-content-left-item">
                            <h3>我的收藏</h3>
                            <ul>
                                <li><a href="#">商品收藏</a></li>
                                <li><a href="#">店铺收藏</a></li>
                            </ul>
                        </div>
                        <div class="user-page-content-left-item">
                            <h3>我的地址</h3>
                            <ul>
                                <li><a href="#">收货地址</a></li>
                            </ul>
                        </div>
                        <div class="user-page-content-left-item">
                            <h3>我的账户</h3>
                            <ul>
                                <li><a href="#">个人信息</a></li>
                                <li><a href="#">账户安全</a></li>
                            </ul>
                        </div>
                    </div>
                    <div class="user-page-content-right">
                        <router-view></router-view>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>
<script setup>
</script>
<style scoped>
.user-page {
    width: 100%;
    height: 100%;
    padding: 20px;
    box-sizing: border-box;

    .user-page-content {
        display: flex;
        justify-content: space-between;

        .user-page-content-left {
            width: 170px;

            .user-page-content-left-item {
                padding: 10px 20px;
                background-color: #fff;

                h3 {
                    font-size: 16px;
                    font-weight: bold;
                    margin-bottom: 10px;
                }

                ul {
                    list-style: none;
                    padding: 0;
                    font-size: 14px;

                    li {
                        margin-bottom: 10px;
                    }
                }

            }
        }

        .user-page-content-right {
            width: calc(100% - 190px);
            background-color: #fff;
            box-sizing: border-box;
        }
    }
}

</style>