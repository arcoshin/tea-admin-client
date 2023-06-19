<template>
  <div>
    <el-container>
      <el-header class="tea-index-header">
        <h1>學茶商城後台管理系統</h1>
      </el-header>
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
            <el-menu-item index="/tea/">
              <i class="el-icon-menu"></i>
              <span slot="title">首頁</span>
            </el-menu-item>
            <el-submenu index="2">
              <template slot="title">
                <i class="el-icon-location"></i>
                <span>臨時頁面</span>
              </template>
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
              <el-menu-item index="/admin/content/tags">
                <i class="el-icon-circle-plus"></i>
                <span slot="title">標籤列表</span>
              </el-menu-item>
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
  name: 'HomeView',
  components: {}
}
</script>
