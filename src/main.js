import { createApp } from 'vue';
import { createPinia } from 'pinia';
import router from './router';
import ElementPlus from 'element-plus';
import 'element-plus/dist/index.css';
import './style.css';
import Viewer from 'viewerjs';
import 'viewerjs/dist/viewer.css';
import App from './App.vue';

// 创建 Pinia 实例
const pinia = createPinia();

// 创建 viewer 自定义指令
const viewerDirective = {
    mounted(el, binding) {
        new Viewer(el, binding.value || {});
    },
    beforeUnmount(el) {
        const viewer = el.viewer;
        if (viewer) {
            viewer.destroy();
        }
    }
};

const app = createApp(App)
    .use(pinia) // 全局挂载 Pinia，使得所有组件都能访问 Pinia 仓库
    .use(router)
    .use(ElementPlus)
    .directive('viewer', viewerDirective)
    .mount('#app');