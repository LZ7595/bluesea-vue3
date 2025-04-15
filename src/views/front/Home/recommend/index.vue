<template>
    <div class="pc-home-content">
        <div class="pc-home-content-top">
            <div class="pc-home-content-top-left">
                <div class="pc-home-content-benner">
                    <el-carousel height="462.5px">
                        <el-carousel-item v-for="(item,index) in bennerList" :key="index">
                            <router-link :to="`/pc/productDetails/${item.product_id}`">
                                <img :src="server_URL + item.image" :alt="index" class="benner-img"/>
                            </router-link>
                        </el-carousel-item>
                    </el-carousel>
                </div>
            </div>
            <div class="pc-home-content-top-right">
                <div class="pc-home-content-FlashSale">
                    <div class="FlashSale-title">
                        <img :src="server_URL + '/icon/时间.png'" class="FlashSale-title-img" alt="时间"/>
                        <h2 class="FlashSale-title-font">限时
                            <o>抢</o>
                            购
                        </h2>
                    </div>
                    <div class="FlashSale-content">
                        <ul>
                            <li class="FlashSale-content-item" v-for="(item,index) in FlashSaleList" :key="index">
                                <router-link :to="`/pc/productDetails/${item.product_id}`">
                                    <div class="FlashSale-content-item-content">
                                        <img :src="server_URL + item.product_main_image" :alt="item.product_name"
                                             class="FlashSale-content-item-img"/>
                                        <div class="FlashSale-content-item-info">
                                            <h3 class="FlashSale-content-item-info-title">{{ item.product_name }}</h3>
                                            <GoodQuality :text="item.quality"/>
                                        </div>
                                    </div>
                                    <div class="FlashSale-content-item-price">
                                        <span class="FlashSale-content-item-price-now">￥{{ item.discount_price }}</span>
                                        <span class="FlashSale-content-item-price-old">￥{{ item.price }}</span>
                                    </div>
                                </router-link>
                            </li>
                        </ul>
                    </div>
                </div>
                <div class="pc-home-content-top-right-bottom">
                    <div class="pc-home-content-new">
                        <div class="new-title">
                            <img :src="server_URL +'/icon/new.png'" alt="新品" class="new-title-img"/>
                            <h2 class="new-title-font">
                                <o>新</o>
                                品上架
                            </h2>
                        </div>
                        <div class="new-content">
                            <ul>
                                <li class="new-content-item" v-for="(item,index) in newList" :key="index">
                                    <router-link :to="`/pc/productDetails/${item.product_id}`">
                                        <div class="new-content-item-content">
                                            <img :src="server_URL + item.product_main_image" :alt="item.product_name"
                                                 class="new-content-item-img"/>
                                            <div class="new-content-item-info">
                                                <h3 class="new-content-item-info-title">{{ item.product_name }}</h3>
                                                <div class="new-content-item-info-row">
                                                    <div class="new-content-item-info-quality">
                                                        <GoodQuality :text="item.quality"/>
                                                    </div>
                                                    <div class="new-content-item-info-price">￥{{ item.price }}</div>
                                                </div>
                                            </div>
                                        </div>
                                    </router-link>
                                </li>
                            </ul>
                        </div>
                    </div>
                    <div class="pc-home-content-Promotional">
                        <img :src="server_URL + '/icon/宣传图.png'" alt="宣传图" class="Promotional-img">
                    </div>
                </div>
            </div>
        </div>
        <div class="pc-home-content-bottom">
            <div class="pc-home-content-bottom-title">
                <h2 class="pc-home-content-bottom-title-font">推荐商品</h2>
            </div>
            <div class="pc-home-content-bottom-list">
                <GoodItem v-for="item in goodItemList" :goodItem="item" :key="item.id"/>
            </div>
        </div>
    </div>
</template>

<style scoped>
.pc-home-content {
    .pc-home-content-top {
        display: flex;
        gap: 20px;
        height: 482.5px;
        padding: 10px 0;

        .pc-home-content-top-left {
            .pc-home-content-benner {
                width: 350px;
                height: 462.5px;
                border-radius: 20px;

                :deep(.el-carousel__indicator--horizontal) {
                    padding: 12px 0 !important;
                }

                .benner-img {
                    width: 100%;
                    height: 100%;
                    border-radius: 20px;
                }

            }
        }

        .pc-home-content-top-right {
            display: flex;
            gap: 20px;
            flex-direction: column;

            .pc-home-content-FlashSale {
                width: 830px;
                height: 220px;
                border-radius: 20px;
                background: #fff;
                padding: 10px 15px;

                .FlashSale-content {
                    padding-top: 10px;

                    ul {
                        display: flex;
                        justify-content: flex-start;
                        align-items: center;

                        li.FlashSale-content-item {
                            width: 200px;
                            height: 160px;

                            .FlashSale-content-item-content {
                                display: flex;

                                img.FlashSale-content-item-img {
                                    height: 130px;
                                }

                                .FlashSale-content-item-info {
                                    display: flex;
                                    flex-direction: column;
                                    justify-content: space-between;

                                    .FlashSale-content-item-info-title {
                                        width: 66px;
                                        height: 100px;
                                        font-size: 15px;
                                        overflow: hidden;
                                    }
                                }
                            }

                            .FlashSale-content-item-price {
                                padding-left: 15px;
                                height: 30px;
                                font-size: 16px;
                                font-weight: 600;
                                display: flex;
                                align-items: center;
                                gap: 10px;

                                .FlashSale-content-item-price-old {
                                    font-size: 14px;
                                    text-decoration: line-through;
                                    color: #999;
                                }
                            }
                        }
                    }
                }
            }

            .pc-home-content-top-right-bottom {
                display: flex;
                gap: 20px;

                .pc-home-content-new {
                    width: 478px;
                    height: 222.5px;
                    background: #fff;
                    border-radius: 20px;
                    padding: 10px 15px;

                    .new-content {
                        padding-top: 10px;

                        ul {
                            display: flex;
                            flex-wrap: wrap;
                            justify-content: center;
                            gap: 14px;

                            li.new-content-item {
                                width: 140px;

                                .new-content-item-content {
                                    display: flex;
                                    flex-direction: column;
                                    align-items: center;

                                    img.new-content-item-img {
                                        width: 90px;
                                        height: 90px;
                                    }

                                    h3.new-content-item-info-title {
                                        width: 140px;
                                        height: 40px;
                                        display: -webkit-box;
                                        -webkit-line-clamp: 2;
                                        -webkit-box-orient: vertical;
                                        overflow: hidden;
                                        text-overflow: ellipsis;
                                    }

                                    .new-content-item-info-row {
                                        display: flex;
                                        align-items: center;
                                        justify-content: space-evenly;

                                        .new-content-item-info-quality {
                                            width: 50px;
                                        }

                                        .new-content-item-info-price {
                                            font-size: 16px;
                                            font-weight: 600;
                                        }
                                    }
                                }
                            }
                        }
                    }
                }

                .pc-home-content-Promotional {
                    width: 332px;
                    height: 222.5px;
                    border-radius: 20px;

                    img.Promotional-img {
                        width: 100%;
                        height: 100%;
                        float: left;
                    }
                }
            }

            .FlashSale-title, .new-title {
                width: 100%;
                height: 30px;
                display: flex;
                align-items: center;
                padding: 0 15px;

                img.FlashSale-title-img, img.new-title-img {
                    height: 100%;
                }

                h2.FlashSale-title-font, h2.new-title-font {
                    margin-left: 10px;
                    letter-spacing: .2em;
                    display: flex;
                    align-items: center;

                    o {
                        font-size: 20px;
                        color: #5a99dc;
                    }
                }
            }

            .FlashSale-content-item-price-now, .new-content-item-info-price {
                color: #e4393c;
            }
        }
    }

    .pc-home-content-bottom {
        padding: 10px 0 40px;

        .pc-home-content-bottom-title {
            width: 100%;
            height: 50px;
            display: flex;
            align-items: center;
            padding-left: 20px;
            font-size: 15px;
        }

        .pc-home-content-bottom-title::before {
            content: '';
            display: block;
            width: 10px;
            height: 25px;
            margin-right: 10px;
            background-color: #5a99dc;
        }

        .pc-home-content-bottom-list {
            width: 100%;
            display: grid;
            grid-template-columns: repeat(5, 1fr);
            row-gap: 10px;
        }
    }
}
</style>

<script setup>
import {onMounted, ref} from "vue";
import GoodQuality from "@/components/pc/product/goodQuality.vue";
import GoodItem from "@/components/pc/product/goodItem.vue";
import request from "@/request/request";
import {getFirstImageUrl, getImageUrlArray} from "@/utils/imgArray.js";
import {server_URL} from "@/urlConfig.js";

const bennerList = ref([{image: "/banner/轮播1.jpg"}, {image: "/banner/轮播1.jpg"}, {image: "/banner/轮播1.jpg"}])
const FlashSaleList = ref([
    {
        product_main_image: "/goods/findx7海阔天空.png",
        product_name: "Find X7 海阔天空 12+256",
        quality: "9",
        price: "3099",
        discount_price: "2399"
    },
    {
        product_main_image: "/goods/一加12留白.png",
        product_name: "一加 12 留白 16+512",
        quality: "9",
        price: "3499",
        discount_price: "3099"
    },
    {
        product_main_image: "/goods/iphone13pro远峰蓝.png",
        product_name: "iPhone 13 Pro 远峰蓝 256G",
        quality: "9",
        price: "3899",
        discount_price: "3499"
    },
    {
        product_main_image: "/goods/iphone16pro沙漠色钛金属.png",
        product_name: "iPhone 16 Pro 沙漠色钛金属 256G",
        quality: "9",
        price: "7999",
        discount_price: "7499"
    }
]);
const newList = ref([
    {
        product_main_image: "/goods/iphone11绿色.png",
        product_name: "iPhone 11 绿色 128G",
        quality: "95",
        price: "1999",
    },
    {
        product_main_image: "/goods/小米14白色.png",
        product_name: "小米 14 白色 16+512",
        quality: "95",
        price: "2899",
    },
    {
        product_main_image: "/goods/荣耀MagicVs2绒黑色.png",
        product_name: "荣耀Magic Vs2 绒黑色 16+512",
        quality: "99",
        price: "5699",
    },
]);
const goodItemList = ref([])

const getBannerList = async () => {
    try {
        const res = await request({
            url: "/api/banner",
            method: "get",
        });
        console.log(res.data);
        bennerList.value = res.data;
    } catch (err) {
        console.log(err);
    }
};

const getRecommendList = async () => {
    try {
        const res = await request({
            url: "/api/recommend/15",
            method: "get",
        });
        console.log(res.data);
        goodItemList.value = res.data;
    } catch (err) {
        console.log(err);
    }
};
const getNewList = async () => {
    try {
        const res = await request({
            url: "/api/product/newList",
            params: {
                num: 3
            },
            method: "get",
        });
        console.log(res.data);
        // 检查并裁剪 res.data 数组
        let newData = res.data;
        if (newData.length > 3) {
            newData = newData.slice(0, 3);
        }
        newList.value = newData;
    } catch (err) {
        console.log(err);
    }
};
const getFlashSalesList = async () => {
    try {
        const res = await request({
            url: "/api/product/flashSalesList",
            params: {
                num: 4
            },
            method: "get",
        });
        console.log(res.data);
        // 检查并裁剪 res.data 数组
        let newData = res.data;
        if (newData.length > 4) {
            newData = newData.slice(0, 4);
        }
        FlashSaleList.value = newData;
    } catch (err) {
        console.log(err);
    }
}
onMounted(() => {
    getNewList();
    getFlashSalesList();
    getRecommendList();
    getBannerList();
});
</script>