<template>
    <div class="back-home">
        <div class="back-div">
            <div class="home-container">
                <!-- 头部信息 -->
                <div class="header">
                    <h1>商场后台主页</h1>
                    <p>欢迎使用商场后台管理系统</p>
                    <p>这里是后台主页的内容，您可以通过以下功能高效管理商场业务。</p>
                </div>

                <!-- 功能模块展示 -->
                <div class="function-container">
                    <!-- 用户管理 -->
                    <div class="function-card">
                        <div class="card-icon">
                            <i class="fa-solid fa-users"></i>
                        </div>
                        <h2>用户管理</h2>
                        <p>管理商场用户信息，包括用户注册、登录、权限设置等。</p>
                    </div>

                    <!-- 订单管理 -->
                    <div class="function-card">
                        <div class="card-icon">
                            <i class="fa-solid fa-shopping-cart"></i>
                        </div>
                        <h2>订单管理</h2>
                        <p>处理商场订单，包括订单状态更新、订单查询等。</p>
                    </div>

                    <!-- 商品管理 -->
                    <div class="function-card">
                        <div class="card-icon">
                            <i class="fa-solid fa-boxes-stacked"></i>
                        </div>
                        <h2>商品管理</h2>
                        <p>管理商场商品信息，包括商品添加、编辑、删除、库存管理等。</p>
                    </div>

                    <!-- 营销活动管理 -->
                    <div class="function-card">
                        <div class="card-icon">
                            <i class="fa-solid fa-percent"></i>
                        </div>
                        <h2>营销活动管理</h2>
                        <p>创建和管理商场营销活动，满减活动、限时折扣等。</p>
                    </div>

<!--                    &lt;!&ndash; 数据分析 &ndash;&gt;-->
<!--                    <div class="function-card">-->
<!--                        <div class="card-icon">-->
<!--                            <i class="fa-solid fa-chart-line"></i>-->
<!--                        </div>-->
<!--                        <h2>数据分析</h2>-->
<!--                        <p>查看商场销售数据、用户行为数据等，为决策提供数据支持。</p>-->
<!--                    </div>-->

<!--                    &lt;!&ndash; 系统设置 &ndash;&gt;-->
<!--                    <div class="function-card">-->
<!--                        <div class="card-icon">-->
<!--                            <i class="fa-solid fa-cog"></i>-->
<!--                        </div>-->
<!--                        <h2>系统设置</h2>-->
<!--                        <p>进行系统基础设置，如网站信息、支付设置、物流设置等。</p>-->
<!--                    </div>-->
                </div>

                <!-- 底部信息 -->
                <div class="footer">
                    <p>祝您使用愉快！</p>
                </div>
            </div>
        </div>
    </div>
</template>

<style scoped>
.back-home {
    width: 100%;
    display: flex;
    justify-content: center;
}

.back-div {
    display: flex;
    flex-wrap: wrap;
    flex-direction: column;
    width: 100%;
    max-width: 1200px;
}

/* 主页容器样式 */
.home-container {
    max-width: 1200px;
    padding: 20px;
}

/* 头部样式 */
.header {
    background-color: #fff;
    padding: 20px;
    border-radius: 8px;
    box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
    margin-bottom: 20px;
}

.header h1 {
    font-size: 28px;
    color: #333;
    margin-bottom: 10px;
}

.header p {
    font-size: 16px;
    color: #666;
    margin-bottom: 5px;
}

/* 功能模块容器样式，改为 flex 布局 */
.function-container {
    display: flex;
    flex-wrap: wrap;
    gap: 20px; /* 卡片之间的间距 */
    margin-bottom: 20px;
}

/* 功能卡片样式 */
.function-card {
    background-color: #fff;
    padding: 20px;
    border-radius: 8px;
    box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
    transition: transform 0.3s ease;
    /* 让卡片在容器中根据宽度自适应排列，每列至少 300px 宽 */
    flex: 1 1 calc(50% - 20px);
    min-width: 300px;
}

.function-card:hover {
    transform: translateY(-5px);
}

.card-icon {
    font-size: 36px;
    margin-bottom: 10px;
}

.card-icon i {
    color: #007bff;
}

.function-card h2 {
    font-size: 20px;
    color: #333;
    margin-bottom: 10px;
}

.function-card p {
    font-size: 14px;
    color: #666;
}

/* 底部样式 */
.footer {
    text-align: center;
    margin-top: 20px;
    color: #666;
}
</style>