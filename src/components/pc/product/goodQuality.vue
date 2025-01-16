<template>
    <div class="goodQuality">
        {{text}}新
    </div>
</template>

<style>
.goodQuality {
    width: 100%;
    height: 30px;
    border: 1px solid #000;
    font-size: 16px;
    font-weight: bolder;
    border-radius: 5px;
    display: flex;
    align-items: center;
    justify-content: center;
    letter-spacing: .1em;
}
</style>

<script setup>
import {defineOptions, defineProps} from 'vue';

defineProps({
text: {
        type: String,
        default: 'none'
    }
})

defineOptions({
        name: 'goodQuality'
    })

</script>