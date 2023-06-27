<template>
    <div>
        <el-container>
            <el-header class="tea-index-header">
                <!-- 頂欄右側的當前用戶訊息及下拉菜單 -->
                <div class="login-user">
                    <span class="welcome">歡迎回來，<b>{{ currentUserName }}</b>！</span>
                    <el-dropdown @command="handleCommand">
                        <el-avatar size="medium" :src="currentUserAvatar"></el-avatar>
                        <el-dropdown-menu slot="dropdown">
                            <el-dropdown-item icon="el-icon-user" command='openEditInfoDialog'>修改資料</el-dropdown-item>
                            <el-dropdown-item icon="el-icon-view" command='openEditAvatarDialog'>修改頭像</el-dropdown-item>
                            <el-dropdown-item icon="el-icon-key" command='openEditPasswordDialog'>修改密碼
                            </el-dropdown-item>
                            <el-dropdown-item icon="el-icon-plus" command='openLogoutConfirm' divided>登出
                            </el-dropdown-item>
                        </el-dropdown-menu>
                    </el-dropdown>
                </div>
                <!-- 頂欄的標題文字 -->
                <h1>學茶商城後台管理系統</h1>
            </el-header>
            <!-- 下半區域 -->
            <el-container class="tea-index-inside-container">
                <el-aside class="tea-index-aside">
                    <!-- $router.currentRoute.path : 當前路由網址 -->
                    <!-- $router        表示整個路由對象(index.js內部routes對象) -->
                    <!-- currentRoute   表示當前路由(routes對象中的"about"元素塊) -->
                    <!-- path           表示路徑(該元素中的path屬性) -->
                    <el-menu
                            style="border: 0"
                            :default-active="$router.currentRoute.path"
                            background-color="#2c3e50"
                            text-color="#fff"
                            router
                            active-text-color="#ffd04b">
                        <el-menu-item index="/admin/index">
                            <i class="el-icon-menu"></i>
                            <span slot="title">首頁</span>
                        </el-menu-item>
                        <el-menu-item index="/login">
                            <i class="el-icon-menu"></i>
                            <span slot="title">登入</span>
                        </el-menu-item>
                        <el-submenu index="/admin/index">
                            <template slot="title">
                                <i class="el-icon-location"></i>
                                <span>臨時頁面</span>
                            </template>
                            <!-- 標籤管理開始 -->
                            <el-menu-item-group>
                                <template slot="title">標籤管理</template>
                                <el-menu-item index="/admin/content/tags/type/add-new">
                                    <i class="el-icon-circle-plus"></i>
                                    <span slot="title">新增標籤類別</span>
                                </el-menu-item>
                                <el-menu-item index="/admin/content/tags/type/list">
                                    <i class="el-icon-circle-plus"></i>
                                    <span slot="title">標籤類別列表</span>
                                </el-menu-item>
                                <el-menu-item index="/admin/content/tags/add-new">
                                    <i class="el-icon-circle-plus"></i>
                                    <span slot="title">新增標籤</span>
                                </el-menu-item>
                                <el-menu-item index="/admin/content/tags/list">
                                    <i class="el-icon-circle-plus"></i>
                                    <span slot="title">標籤列表</span>
                                </el-menu-item>
                            </el-menu-item-group>
                            <!-- 標籤管理結束 -->
                            <!-- 類別管理開始 -->
                            <el-menu-item-group>
                                <template slot="title">類別管理</template>
                                <el-menu-item index="/admin/temp/category/add-new">
                                    <i class="el-icon-circle-plus"></i>
                                    <span slot="title">新增類別</span>
                                </el-menu-item>
                                <el-menu-item index="/admin/temp/category/list">
                                    <i class="el-icon-circle-plus"></i>
                                    <span slot="title">類別列表</span>
                                </el-menu-item>
                            </el-menu-item-group>
                            <!-- 類別管理結束 -->
                            <!-- 用戶管理開始 -->
                            <el-menu-item-group>
                                <template slot="title">用戶管理</template>
                                <el-menu-item index="/admin/account/users/add-new">
                                    <i class="el-icon-circle-plus"></i>
                                    <span slot="title">新增用戶</span>
                                </el-menu-item>
                                <el-menu-item index="/admin/account/users/list">
                                    <i class="el-icon-circle-plus"></i>
                                    <span slot="title">用戶列表</span>
                                </el-menu-item>
                            </el-menu-item-group>
                            <!-- 用戶管理結束 -->
                        </el-submenu>
                    </el-menu>
                </el-aside>
                <el-main class="tea-index-main">
                    <router-view/>
                </el-main>
            </el-container>
        </el-container>
    </div>
</template>
<style>
    .tea-index-header {
        background-color: #1e2c36;
        color: #fff;
        line-height: 60px
    }

    .tea-index-header .login-user {
        float: right;
        margin-top: 12px;
        display: flex;
    }

    .tea-index-header .login-user .welcome {
        line-height: 36px;
        color: #ffd04b;
        margin-right: 10px;
    }

    .tea-index-inside-container {
        position: absolute;
        top: 60px;
        bottom: 0;
        left: 0;
        right: 0;
    }

    .tea-index-aside {
        border: 0;
        background-color: #2c3e50;
    }

    .tea-index-main {

    }

    .el-menu-item.is-active {
        background-color: black !important;
    }

</style>
<script>
    export default {
        data() {
            return {
                currentUserName: '',
                currentUserAvatar: ''
            }
        },
        methods: {
            handleCommand(command) {
                switch (command) {
                    case 'openEditInfoDialog':
                        this.openEditInfoDialog()
                        break
                    case 'openEditAvatarDialog':
                        this.openEditAvatarDialog()
                        break
                    case 'openEditPasswordDialog':
                        this.openEditPasswordDialog()
                        break
                    case 'openLogoutConfirm':
                        this.openLogoutConfirm();
                        break


                }
            },
            openEditInfoDialog() {
                console.log('準備彈出修改當前用戶資料的對話框');
            },
            openEditAvatarDialog() {
                console.log('準備彈出修改當前用戶頭像的對話框');
            },
            openEditPasswordDialog() {
                console.log('準備彈出修改當前用戶密碼的對話框');
            },
            openLogoutConfirm() {
                let message = '是否確定要登出?'
                this.$confirm(message, '提示', {
                    confirmButtonText: '確定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {//點選確認...
                    localStorage.removeItem("localJwt");
                    this.$router.push('/login');
                }).catch(() => {//點選取消...
                });
            },
            loadCurrentUserInfo() {
                this.currentUserName = localStorage.getItem('currentUserName');
                this.currentUserAvatar = localStorage.getItem('currentUserAvatar');
            }
        },
        mounted() {
            this.loadCurrentUserInfo();
        }

    }
</script>
