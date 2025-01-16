<template>
    <div class="goodItemList">
        <GoodItem v-for="item in AppleGoodList" :key="item.id" :goodItem="item"></GoodItem>
    </div>
</template>

<script setup>
import {onMounted, ref} from "vue";
import GoodItem from "@/components/pc/product/goodItem.vue";
import request from "@/request/request";

const AppleGoodList = ref([])
const getAppleGoodList = async () => {
    try {
        const res = await request({
            url: "/api/product/applePhoneList",
            method: "get",
            params: {
                num: 15,
            }
        });
        console.log(res.data);
        AppleGoodList.value = res.data;
    } catch (err) {
        console.log(err);
    }
};
onMounted(() => {
    getAppleGoodList();
});
</script>

<style lang="scss">
.goodItemList {
    width: 100%;
    display: grid;
    grid-template-columns: repeat(5, 1fr);
    row-gap: 10px;
    padding-bottom: 20px;
}
</style>