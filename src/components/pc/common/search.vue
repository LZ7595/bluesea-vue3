<template>
    <div class="search">
        <div class="search-box">
            <el-input
                v-model="searchVal"
                size="large"
                placeholder="请输入搜索内容"
            />
            <el-button type="primary" size="large" :icon="Search" color="#5a99dc" @click="searchAction">搜索</el-button>
        </div>
    </div>
</template>

<style scoped>
.search {
    .search-box {
        border: 1px solid #5a99dc;
        border-radius: 4px;

        .el-input {
            width: 540px;
        }

        .el-button {
            color: #ffffff;
            border-radius: 0 4px 4px 0;
        }
    }
}
</style>

<script setup>
import { Search } from '@element-plus/icons-vue';
import { ref } from 'vue';
import { ElMessage } from "element-plus";
import { useRouter } from 'vue-router';

const searchVal = ref('');
const router = useRouter();

const showWarningMessage = () => {
    ElMessage({
        message: '搜索内容不能为空',
        type: 'warning',
    })
}

const navigateToSearchPage = (searchVal) => {
    router.push({
        name: '搜索',
        query: {
            searchVal: searchVal
        }
    })
}

const searchAction = () => {
    if (searchVal.value.trim() === '') {
        showWarningMessage();
        return;
    }
    navigateToSearchPage(searchVal.value.trim());
}
</script>