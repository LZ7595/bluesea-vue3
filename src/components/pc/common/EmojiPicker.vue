<template>
    <div class="emoji-picker-div">
    <div class="emoji-picker">
    <span
            v-for="emoji in emojis"
            :key="emoji"
            @click="$emit('select-emoji', emoji)"
            class="emoji-item"
    >{{ emoji }}</span>
    </div>
    </div>
</template>

<script>
export default {
    data() {
        return {
            emojis: [
                '😀', '😃', '😄', '😁', '😆', '😅', '😂', '🤣',
                '😊', '😇', '🙂', '🙃', '😉', '😌', '😍', '🥰',
                '😘', '😗', '😙', '😚', '😋', '😛', '😝', '😜',
                '🤪', '🤨', '🧐', '🤓', '😎', '🥸', '🤩', '🥳'
            ]
        };
    }
};
</script>

<style scoped>
.emoji-picker {
    display: flex;
    flex-wrap: wrap;
    gap: 8px;
}

.emoji-item {
    cursor: pointer;
    font-size: 24px;
    padding: 4px;
    transition: transform 0.2s;
    &:hover {
        transform: scale(1.2);
    }
}
</style>