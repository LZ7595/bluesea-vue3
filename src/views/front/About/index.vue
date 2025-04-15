<template>
    <div class="about-container">
        <!-- 页面标题 -->
        <h1 class="page-title">关于蓝海商城</h1>

        <!-- 关于我们部分 -->
        <section class="about-section">
            <h2>我们的使命</h2>
            <p>蓝海商城致力于为消费者提供一个高品质、多元化、便捷的购物平台。我们的使命是通过创新的技术和优质的服务，连接全球优质商品与消费者，让购物变得更加轻松和愉悦。</p>
            <h2>我们的愿景</h2>
            <p>成为全球领先的电商平台，为消费者带来无与伦比的购物体验，为商家创造无限的商业机会。</p>
            <h2>我们的价值观</h2>
            <ul>
                <li>诚信：始终坚持诚信经营，为消费者和商家提供可靠的服务。</li>
                <li>创新：不断探索新的技术和商业模式，为用户带来更好的体验。</li>
                <li>共赢：与合作伙伴共同成长，实现互利共赢。</li>
            </ul>
        </section>

        <!-- 联系我们部分 -->
        <section class="contact-section">
            <h2>联系我们</h2>
            <p>如果您有任何问题、建议或合作意向，欢迎通过以下方式联系我们：</p>
            <ul>
                <li><i class="fa-solid fa-envelope"></i> 邮箱：support@lanhaishop.com</li>
                <li><i class="fa-solid fa-phone"></i> 客服电话：400 - 888 - 6666</li>
                <li><i class="fa-solid fa-map-marker-alt"></i> 公司地址：XX 市 XX 区 XX 路 XX 号</li>
            </ul>
        </section>

        <!-- 加入我们部分 -->
        <section class="join-section">
            <h2>加入我们</h2>
            <p>蓝海商城诚邀各界优秀人才加入我们的团队。我们提供具有竞争力的薪酬待遇、良好的工作环境和广阔的发展空间。如果您对电商行业充满热情，并且具备相关的专业技能和经验，欢迎将您的简历发送至 careers@lanhaishop.com。</p>
        </section>
    </div>
</template>

<script setup>
// 这里可以添加 JavaScript 逻辑，例如接口调用等
</script>

<style scoped>
/* 全局样式 */
body {
    font-family: Arial, sans-serif;
    margin: 0;
    padding: 0;
    background-color: #f4f4f4;
}

/* 页面容器样式 */
.about-container {
    max-width: 1200px;
    margin: 0 auto;
    padding: 20px;
}

/* 页面标题样式 */
.page-title {
    font-size: 32px;
    text-align: center;
    color: #333;
    margin-bottom: 20px;
}

/* 各部分样式 */
.about-section,
.contact-section,
.join-section {
    background-color: #fff;
    padding: 20px;
    border-radius: 8px;
    box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
    margin-bottom: 20px;
}

.about-section h2,
.contact-section h2,
.join-section h2 {
    font-size: 24px;
    color: #333;
    margin-bottom: 10px;
}

.about-section p,
.contact-section p,
.join-section p {
    font-size: 16px;
    color: #666;
    line-height: 1.6;
    margin-bottom: 10px;
}

.about-section ul,
.contact-section ul {
    list-style-type: none;
    padding: 0;
}

.about-section ul li,
.contact-section ul li {
    font-size: 16px;
    color: #666;
    margin-bottom: 5px;
}

.contact-section ul li i {
    margin-right: 10px;
    color: #007bff;
}
</style>