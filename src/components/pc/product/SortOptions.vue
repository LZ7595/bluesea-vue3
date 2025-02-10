<template>
    <div class="list-sort">
        <label class="title">排序方式</label>
        <el-link
                v-for="sortOption in sortOptions"
                :key="sortOption.field"
                :underline="false"
                @click="handleSortChange(sortOption.field)"
                :class="{ 'active': currentSortField === sortOption.field }"
        >
            {{ sortOption.label }}
            <el-icon class="el-icon--right" v-if="currentSortField === sortOption.field && currentSortOrder === 'ASC'">
                <ArrowUp />
            </el-icon>
            <el-icon class="el-icon--right" v-if="currentSortField === sortOption.field && currentSortOrder === 'DESC'">
                <ArrowDown />
            </el-icon>
        </el-link>
    </div>
</template>

<script setup>
import { ref, defineEmits } from 'vue';
import { ArrowUp, ArrowDown } from '@element-plus/icons-vue';

const props = defineProps({
    sortOptions: {
        type: Array,
        default: () => []
    },
    initialSortField: {
        type: String,
        default: 'create_time'
    },
    initialSortOrder: {
        type: String,
        default: 'DESC'
    }
});

const emits = defineEmits(['sortChange']);

const currentSortField = ref(props.initialSortField);
const currentSortOrder = ref(props.initialSortOrder);

const handleSortChange = (field) => {
    if (currentSortField.value === field) {
        currentSortOrder.value = currentSortOrder.value === 'ASC' ? 'DESC' : 'ASC';
    } else {
        currentSortField.value = field;
        currentSortOrder.value = 'DESC';
    }
    emits('sortChange', {
        sortField: currentSortField.value,
        sortOrder: currentSortOrder.value
    });
};
</script>

<style scoped>
.list-sort {
    width: 100%;
    height: 40px;
    font-size: 16px;
    font-weight: 400;
    background: #fff;
    display: flex;
    align-items: center;
    border: var(--el-border-color) 1px solid;
}

.title {
    width: 120px;
    height: 40px;
    display: flex;
    align-items: center;
    justify-content: center;
    border-right: var(--el-border-color) 1px solid;
}

.el-link {
    padding: 0 15px;
    font-size: 12px;
    --el-link-hover-text-color: #5a99dc;
}

.el-link.active {
    color: #5a99dc;
}
</style>