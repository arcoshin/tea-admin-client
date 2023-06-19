import Vue from 'vue'
import VueRouter from 'vue-router'
import HomeView from '../views/HomeView.vue'

Vue.use(VueRouter)

const routes = [
    {
        path: '/',
        component: HomeView,
        redirect: '/admin/index',
        children: [
            {
                path: '/admin/index',//等價於"/tea/about" (切記不可以"/"開頭，否則不會自動完成拼接)
                component: () => import('../views/admin/AdminIndexView.vue')
            },
            {
                path: '/admin/content/tags/type/add-new',//(切記不可以"/"開頭，否則不會自動完成拼接)
                component: () => import('../views/admin/content/TagTypeAddNewView.vue')
            },
            {
                path: '/admin/content/tags/type/list',//(切記不可以"/"開頭，否則不會自動完成拼接)
                component: () => import('../views/admin/content/TagTypeListView.vue')
            },
            {
                path: '/admin/content/tags/',//(切記不可以"/"開頭，否則不會自動完成拼接)
                component: () => import('../views/admin/content/TagListView.vue')
            },
            {
                path: '/admin/content/tags/add-new',//(切記不可以"/"開頭，否則不會自動完成拼接)
                component: () => import('../views/admin/content/TagAddNewView.vue')
            }
        ]
    },
    {
        path: '/login',//(切記不可以"/"開頭，否則不會自動完成拼接)
        component: () => import('../views/LoginView.vue')
    },

]

const router = new VueRouter({
    mode: 'history',
    base: process.env.BASE_URL,
    routes
})

export default router
