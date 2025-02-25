import { createRouter, createWebHistory } from "vue-router";
import { useLoadingStore } from '@/store/loading';
import { parseJwt } from '@/utils/cookieJwt';
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
                meta: { isPC: true },
                children: [
                    {
                        path: '',
                        name: "推荐",
                        component: () => import('@/views/front/Home/recommend/index.vue'),
                    },
                    {
                        path: '/pc/home/:category',
                        name: "商品列表页",
                        component: () => import('@/views/front/Home/productPage/index.vue'),
                    }
                ]
            },
            {
                path: "productDetails/:product_id",
                name: "详情",
                component: () => import('@/views/front/ProductDetails/index.vue'),
                meta: { requiresAuth: true }
            },
            {
                path: "cart",
                name: "购物车",
                component: () => import('@/views/front/Cart/index.vue'),
                meta: { requiresAuth: true }
            },
            {
                path: "user",
                name: "个人中心",
                component: () => import('@/views/front/User/index.vue'),
                meta: { requiresAuth: true },
                children: [
                    {
                        path: "",
                        name: "账号",
                        component: () => import('@/views/front/User/userCenter/index.vue')
                    },
                    {
                        path: "address",
                        name: "地址管理",
                        component: () => import('@/views/front/User/address/index.vue')
                    }
                ]
            },
            {
                path: "search",
                name: "搜索",
                component: () => import('@/views/front/Search/index.vue'),
            },
            {
                path: "security",
                name: "安全中心",
                component: () => import('@/views/front/Security/index.vue'),
            }
        ]
    },
    {
        path: '/pc/Auth/:action',
        name: 'Auth',
        component: () => import('@/views/front/Auth/index.vue'),
    },
    {
        path: '/im',
        name: 'Im',
        component: () => import("@/views/front/Im/Im.vue"),
    },

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
                meta: { isMobile: true }
            },
        ]
    }
];
// 新增404页面路由配置
const notFoundRouter = [
    {
        path: '/:pathMatch(.*)*',
        name: 'NotFound',
        component: () => import('@/views/NotFoundPage.vue')
    }
];
const adminRouter = [
    {
        path: '/admin',
        component: () => import('@/views/back/index.vue'),
        redirect: '/admin/home',
        name: "admin",
        children: [
            {
                path: 'home',
                name: "管理后台首页",
                component: () => import('@/views/back/Home/index.vue'),
                meta: { requiresAdmin: true }
            },
            {
                path: 'product',
                name: "商品管理",
                component: () => import('@/views/back/Product/index.vue'),
                meta: { requiresAdmin: true }
            },
            {
                path: 'order',
                name: "订单管理",
                component: () => import('@/views/back/Order/index.vue'),
                meta: { requiresAdmin: true }
            },
            {
                path: 'user',
                name: "用户管理",
                component: () => import('@/views/back/User/index.vue'),
                meta: { requiresAdmin: true }
            },
            {
                path: 'category',
                name: "分类管理",
                component: () => import('@/views/back/Category/index.vue'),
                meta: { requiresAdmin: true }
            },
            {
                path: 'promotion',
                name: "促销管理",
                component: () => import('@/views/back/Promotion/index.vue'),
                meta: { requiresAdmin: true }
            },
            {
                path: 'service',
                name:'客服对话',
                component:()=>import('@/views/back/Service/index.vue'),
                meta:{requiresAdmin:true}
            },
            {
                path:'setting',
                name:'系统设置',
                component:()=>import('@/views/back/Setting/index.vue'),
                meta:{requiresAdmin:true}
            }
        ]
    }
];
// 判断设备是否为移动端的函数
function isMobileDevice() {
    let isMobile = false;
    if (/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|ipad|iris|kindle|Android|Silk|lge |maemo|midp|mmp|netfront|opera m(ob| in )i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows (ce|phone)|xda|xiino/i.test(navigator.userAgent)
        || /1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob| do (c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de| do |t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(navigator.userAgent.substr(0, 4))) {
        isMobile = true;
    }
    return isMobile;
}
// 根据设备类型更新路由的函数
function updateRoutesByDevice(role) {
    const isMobile = isMobileDevice();
    router.getRoutes().forEach(route => router.removeRoute(route.name));
    if (isMobile) {
        mobileUserRouter.forEach(route => router.addRoute(route));
        notFoundRouter.forEach(route => router.addRoute(route));
    } else {
        pcUserRouter.forEach(route => router.addRoute(route));
        notFoundRouter.forEach(route => router.addRoute(route));
    }
    if (role === 'Admin') {
        adminRouter.forEach(route => router.addRoute(route));
    }
    console.log(router.getRoutes());
}
// 检查用户是否登录的函数
function isUserLoggedIn() {
    const cookieToken = document.cookie.split('; ').find(row => row.startsWith('token='));
    return !!cookieToken;
}
// 获取用户角色信息
function getUserRole() {
    const cookieToken = document.cookie.split('; ').find(row => row.startsWith('token='));
    if (cookieToken) {
        const token = cookieToken.split('=')[1];
        const decodedToken = parseJwt(token);
        return decodedToken.role || null;
    }
    return null;
}
const router = createRouter({
    history: createWebHistory(),
    routes: []
});
// 新增：退出登录时更新路由配置的函数
export function logoutAndUpdateRoutes() {
    // 清除 cookie 中的 token
    document.cookie = 'token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
    updateRoutesByDevice(null);
}
// 在路由模块加载时，立即根据设备类型和用户角色设置初始路由
const userRole = getUserRole();
updateRoutesByDevice(userRole);

// 在路由守卫中根据设备类型进行重定向及其他逻辑处理
let initialDeviceType = isMobileDevice();
router.beforeEach((to, from, next) => {
    console.log(to);
    const loadingStore = useLoadingStore();
    loadingStore.startLoading();
    const currentDeviceType = isMobileDevice();
    const userRole = getUserRole();

    if (currentDeviceType !== initialDeviceType) {
        updateRoutesByDevice(userRole);
        initialDeviceType = currentDeviceType;
    }

    const isMobile = isMobileDevice();
    // 处理根路径的重定向
    if (isMobile && to.path === '/') {
        next({ path: '/mobile/home' });
    } else if (!isMobile && to.path === '/') {
        next({ path: '/pc/home' });
    } else {
        // 检查要访问的路由是否存在于当前设备对应的路由配置中
        const currentRoutes = router.getRoutes();
        const targetRoute = currentRoutes.find(route => {
            // 检查是否是动态路由
            if (route.path.includes(':')) {
                // 提取动态部分的匹配规则
                const routeSegments = route.path.split('/').filter(segment => segment);
                const targetSegments = to.path.split('/').filter(segment => segment);

                if (routeSegments.length === targetSegments.length) {
                    let match = true;
                    for (let i = 0; i < routeSegments.length; i++) {
                        if (routeSegments[i].startsWith(':')) {
                            // 动态部分，不检查具体值，只检查存在性
                            continue;
                        } else if (routeSegments[i]!== targetSegments[i]) {
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
            // 检查该路由是否需要登录
            if (to.meta.requiresAuth &&!isUserLoggedIn()) {
                // 如果需要登录且用户未登录，重定向到登录页面
                next({ path: '/pc/Auth/Login' });
            } else if (to.meta.requiresAdmin && (userRole!== 'Admin')) {
                // 如果需要管理员权限且用户不是管理员，可重定向到404或者其他提示页面
                next({ path: '/404' });
            } else {
                // 如果路由存在且不需要登录或者用户已登录，直接进入
                next();
            }
        } else {
            next({ path: '/404' });
        }
    }

    router.afterEach(() => {
        const loadingStore = useLoadingStore();
        loadingStore.stopLoading();
    });
});

export default router;