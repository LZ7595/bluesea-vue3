<template>
        <div class="user-info">
            <img :src="server_URL + review.avatar" alt="用户头像" class="avatar" />
            <span class="username">{{ review.username }}</span>
        </div>
        <div>
            <el-space spacer="|">
                <el-rate
                        v-model="review.rating"
                        disabled
                        show-score
                        text-color="#ff9900"
                        score-template="{value} 分"
                />
                <p class="review-time">{{ formatDate(review.review_time) }}</p>
            </el-space>
            <p class="review-content">{{ review.review_content }}</p>
            <div v-if="review.image_urls" class="image-container">
                <el-image
                        :src="url"
                        alt="评论图片"
                        class="review-image"
                        v-for="(url, index) in processedImageUrls"
                        :key="index"
                        :preview-src-list="processedImageUrls"
                />
            </div>
        </div>
</template>

<script setup>
import {server_URL} from "@/urlConfig.js";
import {computed} from "vue";

const props = defineProps({
    review: {
        type: Object,
        required: true
    }
});

const processedImageUrls = computed(() => {
    if (!props.review.image_urls) {
        return [];
    }
    return props.review.image_urls.split(',').map(url => `${server_URL}${url}`);
});

// 格式化日期的方法
const formatDate = (dateString) => {
    if (dateString) {
        return new Date(dateString).toLocaleDateString();
    }
    return '';
};
</script>

<style scoped>
.user-info {
    display: flex;
    align-items: center;
    gap: 5px;

    .avatar {
        width: 30px;
        height: 30px;
        border-radius: 50%;
    }

    .username {
        font-size: 14px;
        font-weight: bold;
    }
}

.review-content {
    font-size: 15px;
}

.image-container {
    display: flex;
    flex-wrap: wrap;
    margin-top: 10px;
    gap: 10px;

    .review-image {
        width: 100px;
        height: 100px;
        object-fit: cover;
    }
}

.review-time {
    color: #999;
    font-size: 14px;
}
</style>