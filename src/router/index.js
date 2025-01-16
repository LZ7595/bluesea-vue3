import {createRouter, createWebHistory} from "vue-router";
import {useLoadingStore} from '@/store/loading';


// 定义PC端路由配置
const pcUserRouter = [
    {
        path: '/pc',
        component: () => import('@/views/front/index.vue'),
        redirect: '/pc/home',
        name: "pc",
        children: [
            {
                path: 'home',
                component: () => import('@/views/front/Home/index.vue'),
                meta: {isPC: true},
                children: [
                    {
                        path: '',
                        name: "推荐",
                        component: () => import('@/views/front/Home/recommend/index.vue'),
                    },
                    {
                        path: 'apple',
                        name: "苹果",
                        component: () => import('@/views/front/Home/apple/index.vue'),
                    },
                    {
                        path: "android",
                        name: "安卓",
                        component: () => import('@/views/front/Home/android/index.vue'),
                    },
                    {
                        path: "pad",
                        name: "平板",
                        component: () => import('@/views/front/Home/pad/index.vue'),
                    },
                    {
                        path: "computer",
                        name: "电脑",
                        component: () => import('@/views/front/Home/computer/index.vue'),
                    },
                    {
                        path: "life",
                        name: "生活",
                        component: () => import('@/views/front/Home/life/index.vue'),
                    }
                ]
            },
            {
                path: "productDetails/:product_id",
                name: "详情",
                component: () => import('@/views/front/Home/productDetails/index.vue'),
            }
        ]
    },
    {
        path: '/pc/Auth/:action',
        name: 'Auth',
        component: () => import('@/views/front/Auth/index.vue'),
    }
];

// 定义移动端路由配置
const mobileUserRouter = [
    {
        path: '/mobile',
        component: () => import('@/views/front_mobile/index.vue'),
        redirect: '/mobile/home',
        name: "mobile",
        children: [
            {
                path: 'home',
                component: () => import('@/views/front_mobile/Home/index.vue'),
                meta: {isMobile: true}
            },
        ]
    }
];

// 新增404页面路由配置，这里假设404页面组件为NotFoundPage.vue，你可根据实际情况替换组件路径
const notFoundRouter = [
    {
        path: '/:pathMatch(.*)*',
        name: 'NotFound',
        component: () => import('@/views/NotFoundPage.vue')
    }
];

// 先合并通用路由和PC端路由（初始默认当作PC端情况，后续根据设备类型调整）
let allRoutes = [...pcUserRouter];

const router = createRouter({
    history: createWebHistory(),
    routes: allRoutes
});

// 判断设备是否为移动端的函数，复用之前的userAgent判断逻辑
function isMobileDevice() {
    var isMobile = false;
    // 检测userAgent
    if (/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|ipad|iris|kindle|Android|Silk|lge |maemo|midp|mmp|netfront|opera m(ob| in )i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows (ce|phone)|xda|xiino/i.test(navigator.userAgent)
        || /1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob| do (c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de| do |t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(navigator.userAgent.substr(0, 4))) {
        isMobile = true;
    }
    return isMobile;
}

// 根据设备类型更新路由的函数
function updateRoutesByDevice() {
    const isMobile = isMobileDevice();
    console.log(isMobile);
    console.log(router.getRoutes());
    router.getRoutes().forEach(route => router.removeRoute(route.name));
    if (isMobile) {
        // 如果是移动端，先移除所有现有路由（可选操作，根据实际需求决定是否要先清空路由）
        mobileUserRouter.forEach(route => router.addRoute(route));
        // 添加移动端的404页面路由
        notFoundRouter.forEach(route => router.addRoute(route));
    } else {
        // 如果是PC端，同样先移除现有路由（可选）
        pcUserRouter.forEach(route => router.addRoute(route));
        // 添加PC端的404页面路由
        notFoundRouter.forEach(route => router.addRoute(route));
    }
}

// 在路由模块加载时，立即根据设备类型设置初始路由
updateRoutesByDevice();

// 在路由守卫中根据设备类型进行重定向及其他逻辑处理（比如对不存在路由的处理等）
let initialDeviceType = isMobileDevice();
router.beforeEach((to, from, next) => {
    const loadingStore = useLoadingStore();
    loadingStore.startLoading();
    const currentDeviceType = isMobileDevice();
    if (currentDeviceType !== initialDeviceType) {
        updateRoutesByDevice();
        initialDeviceType = currentDeviceType;
    }
    const isMobile = isMobileDevice();
    // 以下是原有的路由守卫逻辑，保持不变
    if (isMobile && to.path === '/') {
        // 如果是移动端且访问的是根路径，重定向到移动端首页
        next({path: '/mobile/home'});
    } else if (!isMobile && to.path === '/') {
        // 如果是PC端且访问的是根路径，重定向到PC端首页
        next({path: '/pc/home'});
    } else {
        // 检查要访问的路由是否存在于当前设备对应的路由配置中
        const currentRoutes = router.getRoutes();
        const targetRoute = currentRoutes.find(route => {
            // 检查是否是动态路由
            if (route.path.includes(':')) {
                // 提取动态部分的匹配规则
                const routeSegments = route.path.split('/').filter(segment => segment);
                const targetSegments = to.path.split('/').filter(segment => segment);
                console.log(targetSegments)

                if (routeSegments.length === targetSegments.length) {
                    let match = true;
                    for (let i = 0; i < routeSegments.length; i++) {
                        if (routeSegments[i].startsWith(':')) {
                            // 动态部分，不检查具体值，只检查存在性
                            continue;
                        } else if (routeSegments[i] !== targetSegments[i]) {
                            match = false;
                            break;
                        }
                    }
                    return match;
                }
            } else {
                // 检查静态路由
                return route.path === to.path;
            }
        });

        if (targetRoute) {
            console.log("666")
            // 如果路由存在，直接进入
            next();
        } else {
            // 如果路由不存在，直接进入404路由，这里不需要额外的重定向判断了，因为已经添加了通用的404路由匹配规则
            next({path: '/404'});
        }
    }
    router.afterEach(() => {
        const loadingStore = useLoadingStore();
        loadingStore.stopLoading();
    });
});


export default router;