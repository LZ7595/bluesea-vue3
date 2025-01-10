<template>
    <div class="pc-home-content">
        <div class="pc-home-content-top">
            <div class="pc-home-content-top-left">
                <div class="pc-home-content-benner">
                    <el-carousel height="462.5px">
                        <el-carousel-item v-for="(item,index) in bennerList" :key="index">
                            <img :src="item" :alt="index" class="benner-img"/>
                        </el-carousel-item>
                    </el-carousel>
                </div>
            </div>
            <div class="pc-home-content-top-right">
                <div class="pc-home-content-FlashSale">
                    <div class="FlashSale-title">
                        <img src="../../../../../public/icon/时间.png" class="FlashSale-title-img" alt="时间"/>
                        <h2 class="FlashSale-title-font">限时
                            <o>抢</o>
                            购
                        </h2>
                    </div>
                    <div class="FlashSale-content">
                        <ul>
                            <li class="FlashSale-content-item" v-for="(item,index) in FlashSaleList"
                                :key="index">
                                <div class="FlashSale-content-item-content">
                                    <img :src="item.img" :alt="item.title" class="FlashSale-content-item-img"/>
                                    <div class="FlashSale-content-item-info">
                                        <h3 class="FlashSale-content-item-info-title">{{ item.title }}</h3>
                                        <GoodQuality :text="item.quality"/>
                                    </div>
                                </div>
                                <div class="FlashSale-content-item-price">
                                    <span class="FlashSale-content-item-price-now">￥{{ item.price }}</span>
                                    <span class="FlashSale-content-item-price-old">￥{{ item.Oprice }}</span>
                                </div>
                            </li>
                        </ul>
                    </div>
                </div>
                <div class="pc-home-content-top-right-bottom">
                    <div class="pc-home-content-new">
                        <div class="new-title">
                            <img src="../../../../../public/icon/new.png" alt="新品" class="new-title-img"/>
                            <h2 class="new-title-font">
                                <o>新</o>
                                品上架
                            </h2>
                        </div>
                        <div class="new-content">
                            <ul>
                                <li class="new-content-item" v-for="(item,index) in newList" :key="index">
                                    <div class="new-content-item-content">
                                        <img :src="item.img" :alt="item.title" class="new-content-item-img"/>
                                        <div class="new-content-item-info">
                                            <h3 class="new-content-item-info-title">{{ item.title }}</h3>
                                            <div class="new-content-item-info-row">
                                                <div class="new-content-item-info-quality">
                                                    <GoodQuality :text="item.quality"/>
                                                </div>
                                                <div class="new-content-item-info-price">￥{{ item.price }}</div>
                                            </div>
                                        </div>
                                    </div>
                                </li>
                            </ul>
                        </div>
                    </div>
                    <div class="pc-home-content-Promotional">
                        <img src="../../../../../public/icon/宣传图.png" alt="宣传图" class="Promotional-img">
                    </div>
                </div>
            </div>
        </div>
        <div class="pc-home-content-bottom">
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
                        justify-content: center;
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
import {ref} from "vue";
import GoodQuality from "@/components/pc/goodQuality.vue";
import GoodItem from "@/components/pc/goodItem.vue";

const bennerList = ref(["../../../../public/benner/轮播1.jpg", "../../../../public/benner/轮播1.jpg", "../../../../public/benner/轮播1.jpg"])
const FlashSaleList = ref([
    {
        img: "../../../../public/goods/findx7海阔天空.png",
        title: "Find X7 海阔天空 12+256",
        quality: "9",
        Oprice: "3099",
        price: "2399"
    },
    {
        img: "../../../../public/goods/一加12留白.png",
        title: "一加 12 留白 16+512",
        quality: "9",
        Oprice: "3499",
        price: "3099"
    },
    {
        img: "../../../../public/goods/iphone13pro远峰蓝.png",
        title: "iPhone 13 Pro 远峰蓝 256G",
        quality: "9",
        Oprice: "3899",
        price: "3499"
    },
    {
        img: "../../../../public/goods/iphone16pro沙漠色钛金属.png",
        title: "iPhone 16 Pro 沙漠色钛金属 256G",
        quality: "9",
        Oprice: "7999",
        price: "7499"
    }
]);
const newList = ref([
    {
        img: "../../../../public/goods/iphone11绿色.png",
        title: "iPhone 11 绿色 128G",
        quality: "95",
        price: "1999",
    },
    {
        img: "../../../../public/goods/小米14白色.png",
        title: "小米 14 白色 16+512",
        quality: "95",
        price: "2899",
    },
    {
        img: "../../../../public/goods/荣耀MagicVs2绒黑色.png",
        title: "荣耀Magic Vs2 绒黑色 16+512",
        quality: "99",
        price: "5699",
    },
]);
const goodItemList = ref([
    {
        id: "1",
        img: "../../../../public/goods/荣耀MagicVs2绒黑色.png",
        title: "荣耀Magic Vs2 绒黑色 16+512",
        quality: "99",
        price: "5699",
    },
    {
        id: "2",
        img: "../../../../public/goods/findx7海阔天空.png",
        title: "Find X7 海阔天空 12+256",
        quality: "9",
        price: "2399"
    },
    {
        id: "3",
        img: "../../../../public/goods/一加12留白.png",
        title: "一加 12 留白 16+512",
        quality: "9",
        price: "3099"
    },
    {
        id: "4",
        img: "../../../../public/goods/iphone13pro远峰蓝.png",
        title: "iPhone 13 Pro 远峰蓝 256G",
        quality: "9",
        price: "3499"
    },
    {
        id: "5",
        img: "../../../../public/goods/iphone11绿色.png",
        title: "iPhone 11 绿色 128G",
        quality: "95",
        price: "1999",
    },
    {
        id: "6",
        img: "../../../../public/goods/小米14白色.png",
        title: "小米 14 白色 16+512",
        quality: "95",
        price: "2899",
    },
    {
        id: "7",
        img: "../../../../public/goods/iphone16pro沙漠色钛金属.png",
        title: "iPhone 16 Pro 沙漠色钛金属 256G",
        quality: "9",
        price: "7499"
    }
])
</script>