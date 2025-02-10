<template>
    <div class="pc-home">
        <div class="viewport">
            <div class="pc-home-title">
                <ul class="pc-home-title-ul">
                    <li
                            v-for="(item, index) in categories"
                            :key="index"
                            :class="{ active: activeIndex === index }"
                            @click="changeActiveIndex(index)"
                    >
                        {{ item.name }}
                    </li>
                </ul>
            </div>
            <router-view></router-view>
        </div>
    </div>
</template>

<style scoped>
.pc-home {
    width: 100%;
    min-width: 1200px;
    height: 100%;
    background-color: #f6f6f6;

    .pc-home-title {
        padding: 10px 0;

        .pc-home-title-ul {
            display: flex;
            justify-content: center;
            align-items: center;
            width: 100%;
            height: 50px;
            background: #fff;
            box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
            border-radius: 5px;

            li {
                cursor: pointer;
                float: left;
                min-width: 100px;
                box-sizing: border-box;
                padding: 10px 40px;
                border-radius: 5px;
                font-size: 16px;
                font-weight: 600;
                letter-spacing: 0.4em;
                transition: font-size 0.3s ease, font-weight 0.3s ease, color 0.3s ease, background 0.3s ease;
            }

            li.active {
                font-size: 20px;
                font-weight: 800;
                color: #5a99dc;
            }

            li:hover {
                color: #5a99dc;
                background: #f6f6f6;
            }

            li.active:hover {
                color: #5a99dc;
                background: #fff;
            }
        }
    }
}
</style>

<script setup>
import {ref, computed} from 'vue';
import {useRouter, useRoute} from 'vue-router';

const categories = ref([
    {name: '推荐', url: '/pc/home'},
    {name: '苹果', url: '/pc/home/apple'},
    {name: '国产', url: '/pc/home/android'},
    {name: '平板', url: '/pc/home/pad'},
    {name: '电脑', url: '/pc/home/computer'},
    {name: '生活', url: '/pc/home/life'}]);
const router = useRouter();
const route = useRoute();

const activeIndex = computed(() => {
    return categories.value.findIndex(category => category.url === route.path);
});

const changeActiveIndex = (index) => {
    router.push(categories.value[index].url);
};
</script>