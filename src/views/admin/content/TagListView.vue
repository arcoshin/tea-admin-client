<template>
  <div>
    <!-- 頂部的麵包屑導航 -->
    <el-breadcrumb separator-class="el-icon-arrow-right" style="font-size: 16px; color: white">
      <el-breadcrumb-item :to="{ path: '/' }">首頁</el-breadcrumb-item>
      <el-breadcrumb-item>內容管理</el-breadcrumb-item>
      <el-breadcrumb-item>標籤管理</el-breadcrumb-item>
      <el-breadcrumb-item>標籤列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 分割線 -->
    <el-divider></el-divider>
    <!-- 表單 -->
    <el-table :data="TagListArr" border style="width: 100%">
      <el-table-column prop="id" label="ID" width="100%" align="center"></el-table-column>
      <el-table-column prop="name" label="名稱" header-align="center" show-overflow-tooltip></el-table-column>
      <el-table-column label="類別" align="center" width="150px">
        <template slot-scope="scope">
          <el-tag>{{ scope.row.typeName }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="sort" label="排序序號" width="100px" align="center"></el-table-column>
      <el-table-column label="啟用狀態" width="100px" align="center">
        <template v-slot="scope">
          <el-switch
              @change="toggleEnable(scope.row)"
              v-model="scope.row.enable"
              :active-value="1"
              :inactive-value="0"
              active-color="#13ce66"
              inactive-color="#ccc">
          </el-switch>
        </template>
      </el-table-column>
      <el-table-column label="操作" width="150px" align="center">
        <template v-slot="scope">
          <el-button type="primary" icon="el-icon-edit" circle @click="openEditDialog(scope.row)"></el-button>
          <el-button type="danger" icon="el-icon-delete" circle @click="openDeleteConfirm(scope.row)"></el-button>
        </template>
      </el-table-column>
    </el-table>
    <!-- 分頁控件 -->
    <div style="margin: 10px 0;text-align: right;">
      <el-pagination
          @current-change="changePage"
          layout="total, prev, pager, next"
          :hide-on-single-page="true"
          :page-size="pageSize"
          :current-page="currentPage"
          :total="total">
      </el-pagination>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      //表格數據
      TagListArr: [],
      //分頁相關數據
      currentPage: 0,
      pageSize: 0,
      total: 0
    }
  },
  methods: {
    //執行刪除標籤數據
    handleDelete(tableItem){
      let url = 'http://localhost:9080/content/tags/' + tableItem.id + '/delete';
      console.log('url = ' + url);
      this.axios.post(url).then((response) => {
        let jsonResult = response.data;
        if (jsonResult.stateCode == 20000) {
          this.$message({
            message: '刪除標籤成功!',
            type: 'success'
          });
          this.loadTagList();
        } else {
          let title = '操作失敗';
          this.$alert(jsonResult.message, title, {
            confirmButtonText: '確定',
            callback: action => {
            }
          });
        }
      });
    },
    //切換分頁
    changePage(page) {
      this.$router.replace('?page=' + page);
      this.loadTagList();
    },
    //切換啟用狀態
    toggleEnable(item) {
      alert("即將切換" + item.id + " - " + item.name + "的啟用狀態，敬請期待!")
    },
    //彈出修改對話框
    openEditDialog(item) {
      alert("即將編輯" + item.id + " - " + item.name + "敬請期待!")
    },
    //彈出刪除確認框
    openDeleteConfirm(tableItem) {
      let message = '此操作將永久刪除【' + tableItem.name + '】標籤，是否繼續?';
      this.$confirm(message, '提示', {
        confirmButtonText: '確定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {//點選確認...
        this.handleDelete(tableItem);
      }).catch(() => {//點選取消...
      });
    },
    //加載標籤類別列表
    loadTagList() {
      /**
       * this.$router 全局路由器對象
       * currentRoute 當前路由屬性
       * query表示地址欄中"?"以後的參數內容，不一定存在所以後續需要判定
       * page，地址欄中"?"以後的參數團若視為鍵值隊，則此處的page則表示其中的某一個"key"
       */
      let page = this.$router.currentRoute.query.page;
      //簡易驗證
      if (!page) page = 1;
      let url = 'http://localhost:9080/content/tags?page=' + page;
      console.log('url = ' + url);


      this.axios.get(url).then((response) => {
        if (response.data.stateCode == 20000) {
          this.TagListArr = response.data.data.list;
          this.currentPage = response.data.data.currentPage;
          this.pageSize = response.data.data.pageSize;
          this.total = response.data.data.total;

        } else {
          let title = '操作失敗';
          this.$alert(response.data.message, title, {
            confirmButtonText: '確定',
            callback: action => {
            }
          })
        }
      })
    },

  }, mounted() {
    this.loadTagList()
  }
}
</script>