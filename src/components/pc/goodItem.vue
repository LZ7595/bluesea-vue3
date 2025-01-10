<template>
    <div class="goodItem">
        <router-link class="picbox">
            <img :src="img" :alt="title" class="goodItem-img">
        </router-link>
        <div class="title">
            <router-link>{{ quality + "新 " + title }}</router-link>
        </div>
        <div class="price">
            <router-link>￥{{ price }}</router-link>
        </div>
        <div class="goodItem-bottom">
            <button class="addCart">加入购物车</button>
            <i class="line"></i>
            <button class="buyNow">立即购买</button>
        </div>
    </div>
</template>

<script setup>
import {defineOptions, defineProps, toRefs} from 'vue';

const props = defineProps({
    goodItem: {
        type: Object,
        default: () => ({})
    }
})

const {id, img, title, price, quality} = toRefs(props.goodItem)

defineOptions({
    name: 'goodItem'
})
</script>

<style scoped>
.goodItem {
    width: 235px;
    border-radius: 10px;
    border: 2px solid #fff;
    background: #fff;

    .picbox {
        display: block;
        padding: 20px;
    }

    .goodItem-img {
        width: 100%;
        height: 100%;
        display: block;
    }

    .title {
        padding: 0 10px;
        height: 36px;
        overflow: hidden;
        margin: 10px 0;
        font-size: 12px;

        a {
            line-height: 18px;
        }
        a:hover{
            color: #5a99dc;
        }
    }

    .price {
        padding: 0 10px;
        font-size: 18px;
        font-weight: 600;

        a {
            color: #e4393c;
        }
    }

    .goodItem-bottom {
        height: 42px;
        line-height: 42px;
        border-top: 1px solid #eee;

        button {
            width: 49%;
            height: 100%;
            display: block;
            float: left;
            text-align: center;
            background: none;
            font-size: 14px;
            color: #8c8c8c;
        }

        button:hover {
            color: #e4393c;
        }

        i {
            display: block;
            width: 1px;
            height: 20px;
            background: #eee !important;
            float: left;
            margin-top: 11px;
        }
    }
}

.goodItem:hover {
    border: 2px solid #5a99dc;
}
</style>