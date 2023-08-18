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
            /**
             * 首頁
             */
            {
                path: '/admin/index',//等價於"/tea/about" (切記不可以"/"開頭，否則不會自動完成拼接)
                component: () => import('../views/admin/AdminIndexView.vue')
            },
            /**
             * 帳號管理
             */
            {
                path: '/admin/account/users/add-new',//(切記不可以"/"開頭，否則不會自動完成拼接)
                component: () => import('../views/admin/account/UserAddNewView.vue')
            },
            {
                path: '/admin/account/users/list',//(切記不可以"/"開頭，否則不會自動完成拼接)
                component: () => import('../views/admin/account/UserListView.vue')
            },
            /**
             * 內容管理
             */
            {
                path: '/admin/content/tags/type/add-new',//(切記不可以"/"開頭，否則不會自動完成拼接)
                component: () => import('../views/admin/content/TagTypeAddNewView.vue')
            },
            {
                path: '/admin/content/tags/type/list',//(切記不可以"/"開頭，否則不會自動完成拼接)
                component: () => import('../views/admin/content/TagTypeListView.vue')
            },
            {
                path: '/admin/content/tags/add-new',//(切記不可以"/"開頭，否則不會自動完成拼接)
                component: () => import('../views/admin/content/TagAddNewView.vue')
            },
            {
                path: '/admin/content/tags/list',//(切記不可以"/"開頭，否則不會自動完成拼接)
                component: () => import('../views/admin/content/TagListView.vue')
            },
            {
                path: '/admin/content/categories/add-new',//(切記不可以"/"開頭，否則不會自動完成拼接)
                component: () => import('../views/admin/content/CategoryAddNewView.vue')
            },
            {
                path: '/admin/content/categories/list',//(切記不可以"/"開頭，否則不會自動完成拼接)
                component: () => import('../views/admin/content/CategoryListView.vue')
            },
            {
                path: '/admin/content/comments/add-new',//(切記不可以"/"開頭，否則不會自動完成拼接)
                component: () => import('../views/admin/content/CategoryAddNewView.vue')
            },
            {
                path: '/admin/content/comments/list',//(切記不可以"/"開頭，否則不會自動完成拼接)
                component: () => import('../views/admin/content/CategoryListView.vue')
            },
            {
                path: '/admin/content/articles/add-new',
                component: () => import('../views/admin/content/ArticleAddNewView.vue')
            },
            {
                path: '/admin/content/articles/list',
                component: () => import('../views/admin/content/ArticleListView.vue')
            },
            /**
             * 商品管理
             */

            {
                path: '/admin/product/categories/add-new',
                component: () => import('../views/admin/product/CategoryAddNewView.vue')
            },
            {
                path: '/admin/product/categories/list',
                component: () => import('../views/admin/product/CategoryListView.vue')
            },
            {
                path: '/admin/product/goods/add-new',
                component: () => import('../views/admin/product/GoodsAddNewView.vue')
            },
            {
                path: '/admin/product/goods/list',
                component: () => import('../views/admin/product/GoodsListView.vue')
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
