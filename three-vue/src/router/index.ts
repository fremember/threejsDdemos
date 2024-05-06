import { createRouter, createWebHashHistory, RouteRecordRaw } from 'vue-router'

const routes: Array<RouteRecordRaw> = [
    {
        path: '/',
        redirect: '/login'
    },
    {
        path: '/login',
        name: 'LoginView',
        component: () => import('@/views/login/index.vue')
    },
    {
        path: '/home',
        name: 'homeView',
        component: () => import('@/views/home/index.vue')
    }
]

const router = createRouter({
    history: createWebHashHistory('/'),
    routes: routes,
    strict: true,
    scrollBehavior: () => ({ left: 0, top: 0 })
})

export default router