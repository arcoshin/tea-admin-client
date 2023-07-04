import Vue from 'vue'
import VueRouter from 'vue-router'
import HomeView from '../views/HomeView.vue'

Vue.use(VueRouter)

const routes = [
    {
        path: '/',//<----- path屬性 可以視為框架中的識別標籤
        component: HomeView,
        redirect: '/admin/index',
        children: [
            {
                path: '/admin/index',//等價於"/tea/about" (切記不可以"/"開頭，否則不會自動完成拼接)
                component: () => import('../views/admin/AdminIndexView.vue')
            },
            {
                path: '/admin/content/tags/type/add-new',//(切記不可以"/"開頭，否則不會自動完成拼接)
                component: () => import('../views/admin/temp/TagTypeAddNewView.vue')
            },
            {
                path: '/admin/content/tags/type/list',//(切記不可以"/"開頭，否則不會自動完成拼接)
                component: () => import('../views/admin/temp/TagTypeListView.vue')
            },
            {
                path: '/admin/content/tags/add-new',//(切記不可以"/"開頭，否則不會自動完成拼接)
                component: () => import('../views/admin/temp/TagAddNewView.vue')
            },
            {
                path: '/admin/content/tags/list',//(切記不可以"/"開頭，否則不會自動完成拼接)
                component: () => import('../views/admin/temp/TagListView.vue')
            },
            {
                path: '/admin/account/users/add-new',//(切記不可以"/"開頭，否則不會自動完成拼接)
                component: () => import('../views/admin/temp/UserAddNewView.vue')
            },
            {
                path: '/admin/account/users/list',//(切記不可以"/"開頭，否則不會自動完成拼接)
                component: () => import('../views/admin/temp/UserListView.vue')
            },
            {
                path: '/admin/content/categories/add-new',//(切記不可以"/"開頭，否則不會自動完成拼接)
                component: () => import('../views/admin/temp/CategoryAddNewView.vue')
            },
            {
                path: '/admin/content/categories/list',//(切記不可以"/"開頭，否則不會自動完成拼接)
                component: () => import('../views/admin/temp/CategoryListView.vue')
            },,
            {
                path: '/admin/content/comment/add-new',//(切記不可以"/"開頭，否則不會自動完成拼接)
                component: () => import('../views/admin/temp/CategoryAddNewView.vue')
            },
            {
                path: '/admin/content/comment/list',//(切記不可以"/"開頭，否則不會自動完成拼接)
                component: () => import('../views/admin/temp/CategoryListView.vue')
            },
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
