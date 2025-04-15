<template>
    <div class="carousel-container">
        <div class="carousel">
            <div class="carousel-item" ref="target">
                <img :src="server_URL + imageUrlArray[currentIndex]" alt="carousel image"/>
                <!-- 蒙层小滑块 -->
                <div class="layer" :style="{ left: `${left}px`, top: `${top}px` }" v-show="!isOutside"></div>
                <!-- 放大镜大图 -->
                <div class="large" :style="[
      {
        backgroundImage: `url(${server_URL + imageUrlArray[currentIndex]})`,
        backgroundPositionX: `${positionX}px`,
        backgroundPositionY: `${positionY}px`,
      },
    ]" v-show="!isOutside"></div>
            </div>
        </div>
        <div class="thumbnails-controls">
            <button @click="prevSlide" v-if="imgLength">
                <el-icon>
                    <ArrowLeft/>
                </el-icon>
            </button>
            <div class="thumbnails-container">
                <div class="thumbnails" :style="{ transform: `translateX(${-thumbnailIndex * thumbnailWidth}px) ` }">
                    <div v-for="(item, index) in imageUrlArray" :key="index"
                         :class="['thumbnail', index === currentIndex? 'active' : '']" @click="currentIndex = index">
                        <img :src="server_URL + item" alt="thumbnail image"/>
                    </div>
                </div>
            </div>
            <button @click="nextSlide" v-if="imgLength">
                <el-icon>
                    <ArrowRight/>
                </el-icon>
            </button>
        </div>
    </div>
</template>

<script setup>
import {computed, ref, watch} from 'vue';
import {ArrowLeft, ArrowRight} from "@element-plus/icons-vue";
import {useMouseInElement} from '@vueuse/core'
import {server_URL} from "@/urlConfig.js";


// 接收父组件传递的图片数组
const props =defineProps({
    carouselItems: {
        required: true
    },
    // showType:{
    //     type: String,
    //     default: 'array'
    // }
});

const imageUrlArray = computed(() => {
    if (typeof props.carouselItems === 'string') {
        // 使用正则表达式匹配字符串中的图片路径，并将其转换为数组
        const matches = props.carouselItems.match(/\/goods\/[^'"\[\]]+/g);
        return matches ? matches : [];
    } else {
        return props.carouselItems;
    }
});
const currentIndex = ref(0);
const thumbnailWidth = 68 + 5;
const thumbnailIndex = ref(0);
const visibleThumbnails = 5;

const imgLength = ref(imageUrlArray.value.length < 5 ? false : true);
const prevSlide = () => {
    if (currentIndex.value > 0) {
        currentIndex.value--;
    } else {
        currentIndex.value = iimageUrlArray.value.length - 1;
    }
    updateThumbnailIndex();
};

const nextSlide = () => {
    if (currentIndex.value < imageUrlArray.value.length - 1) {
        currentIndex.value++;
    } else {
        currentIndex.value = 0;
    }
    updateThumbnailIndex();
};

const updateThumbnailIndex = () => {
    if (currentIndex.value >= thumbnailIndex.value + visibleThumbnails) {
        thumbnailIndex.value++;
    } else if (currentIndex.value < thumbnailIndex.value) {
        thumbnailIndex.value = Math.max(0, currentIndex.value - visibleThumbnails + 1);
    }
};


// 放大图片位置
const positionX = ref(0)
const positionY = ref(0)
let top = ref(0)
let left = ref(0)
const target = ref(null)
const {elementX, elementY, isOutside} = useMouseInElement(target)
watch([elementX, elementY], () => {
    if (!isOutside) {
        return
    }
    // 横向
    if (elementX.value > 100 && elementX.value < 400) {
        left.value = elementX.value - 100
    }
    // 纵向
    if (elementY.value > 100 && elementY.value < 400) {
        top.value = elementY.value - 100
    }
    // 处理便捷
    if (elementX.value < 100) {
        left.value = 0
    }
    if (elementX.value > 400) {
        left.value = 300
    }
    if (elementY.value < 100) {
        top.value = 0
    }
    if (elementY.value > 400) {
        top.value = 300
    }
// 放大镜位置
    positionX.value = -left.value * 1.5
    positionY.value = -top.value * 1.5
})
</script>

<style scoped>
.carousel-container {
    width: 500px;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    position: relative; /* 相对定位，为放大图提供定位上下文 */
    margin-bottom: 10px;


    .carousel {
        width: 500px;
        height: 500px;
        position: relative;

        .carousel-item {
            width: 100%;
            height: 100%;

            img {
                width: 100%;
                height: 100%;
                object-fit: cover;
            }

            .large {
                position: absolute;
                top: 20px;
                left: 502px;
                width: 300px;
                height: 300px;
                z-index: 500;
                box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
                background-repeat: no-repeat;
                background-size: 750px 750px;
                background-color: #f8f8f8;
            }

            .layer {
                width: 200px;
                height: 200px;
                background: rgba(0, 0, 0, 0.2);
                left: 0;
                top: 0;
                position: absolute;
            }
        }
    }

    .thumbnails-controls {
        display: flex;
        align-items: center;
        margin: 10px 0;
        gap: 5px;


        button {
            width: 45px;
            height: 70px;
            font-size: 45px;
            display: flex;
            align-items: center;
            background: none;
        }


        .thumbnails-container {
            max-width: 370px;
            overflow: hidden;


            .thumbnails {
                display: flex;
                gap: 5px;
                transition: transform 0.5s ease-in-out;


                .thumbnail {
                    width: 70px;
                    height: 70px;
                    cursor: pointer;
                    border: 1px solid transparent;
                    display: inline-block;


                    img {
                        width: 68px;
                        height: 68px;
                    }
                }


                .thumbnail.active {
                    border: 1px solid red;
                }
            }
        }
    }

}
</style>