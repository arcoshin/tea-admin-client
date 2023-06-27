<template>
  <div>
    <!-- 頂部的麵包屑導航 -->
    <el-breadcrumb separator-class="el-icon-arrow-right" style="font-size: 16px; color: white">
      <el-breadcrumb-item :to="{ path: '/' }">首頁</el-breadcrumb-item>
      <el-breadcrumb-item>內容管理</el-breadcrumb-item>
      <el-breadcrumb-item>標籤管理</el-breadcrumb-item>
      <el-breadcrumb-item>標籤類別列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 分割線 -->
    <el-divider></el-divider>
    <!-- 表單 -->
    <el-table :data="TagTypeListArr" border style="width: 100%">
      <el-table-column prop="id" label="ID" width="100%" align="center"></el-table-column>
      <el-table-column prop="name" label="名稱" header-align="center" show-overflow-tooltip></el-table-column>
      <el-table-column prop="sort" label="排序序號" width="100px" align="center"></el-table-column>
      <el-table-column label="啟用狀態" width="100px" align="center">
        <template v-slot="scope">
          <el-switch
              @change="toggleEnable(scope.row)"
              v-model="scope.row.enable"
              :disabled="unchangeable(scope.row.id)"
              :active-value="1"
              :inactive-value="0"
              active-color="#13ce66"
              inactive-color="#ccc">
          </el-switch>
        </template>
      </el-table-column>
      <el-table-column label="操作" width="150px" align="center">
        <template v-slot="scope">
          <el-button type="primary" icon="el-icon-edit" circle
                     @click="openEditDialog(scope.row)" :disabled="unchangeable(scope.row.id)"></el-button>
          <el-button type="danger" icon="el-icon-delete" circle
                     @click="openDeleteConfirm(scope.row)" :disabled="unchangeable(scope.row.id)"></el-button>
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
    <!-- 修改數據的表單 -->
    <el-dialog title="編輯標籤數據" :visible.sync="editFormVisible">
      <el-form :model="editForm" :rules="editRules" label-width="120px">
        <el-form-item label="標籤名稱" prop="name">
          <el-input v-model="editForm.name"></el-input>
        </el-form-item>
        <el-form-item label="排序序號" prop="sort">
          <el-input v-model="editForm.sort"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="editFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="handleEdit">確 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
export default {
  data() {
    return {
      //表格數據
      TagTypeListArr: [],
      //分頁相關數據
      currentPage: 0,
      pageSize: 0,
      total: 0,
      //編輯對話框相關數據
      editFormVisible: false,
      editForm: {
        id: "",
        name: '',
        sort: ''
      },
      //編輯表單規則
      editRules: {
        name: [
          {required: true, message: '請輸入標籤名稱', trigger: 'blur'},
          {pattern: /^[a-zA-Z0-9\u4e00-\u9fa5]{2,10}$/, message: '標籤必須是2~10長度的字符組成，且不允許使用標點符號', trigger: 'blur'}
        ],
        sort: [
          {required: true, message: '請輸入排序序號', trigger: 'blur'},
          {pattern: /^(\d{1}|[1-9]{1}[0-9]{1})$/, message: '排序序號必須是0~99之間的值', trigger: 'blur'}
        ]
      },
    }
  },
  methods: {
    unchangeable(id) {
      let changeIndex = (id == 1 ? true : false)
      return changeIndex;
    },
    //切換分頁
    changePage(page) {
      this.$router.replace('?page=' + page);
      this.loadTypeList();
    },
    //切換啟用狀態
    toggleEnable(tableItem) {
      let enableText = ['禁用', '啟用'];
      let url = 'http://localhost:9080/content/tags/type/' + tableItem.id;
      tableItem.enable == 0 ? url += '/disable' : url += '/enable';
      console.log('url = ' + url);
      /**
       * 發出【根據ID查詢標籤(類別)】的請求
       */
      this.axios
          .create({'headers': {'Authorization': localStorage.getItem("localJwt")}})
          .post(url).then((response) => {
        let jsonResult = response.data;
        if (jsonResult.stateCode == 20000) {
          this.$message({
            message: enableText[tableItem.enable] + '標籤類別成功!',
            type: 'success'
          });
        } else {
          let title = '操作失敗';
          this.$alert(jsonResult.message, title, {
            confirmButtonText: '確定',
            callback: action => {
              if (jsonResult.state == 40400) {
                this.loadTypeList();
              }
            }
          });
        }
      });
    },
    //彈出修改對話框
    openEditDialog(tableItem) {
      let url = 'http://localhost:9080/content/tags/type/' + tableItem.id;
      console.log('url = ' + url);
      /**
       * 發出【根據ID查詢標籤(類別)】的請求
       */
      this.axios
          .create({'headers': {'Authorization': localStorage.getItem("localJwt")}})
          .get(url).then((response) => {
        let jsonResult = response.data;
        if (jsonResult.stateCode == 20000) {
          this.editForm = jsonResult.data;
          this.editFormVisible = true;
        } else {
          let title = '操作失敗';
          this.$alert(jsonResult.message, title, {
            confirmButtonText: '確定',
            callback: action => {
              //請求完成後應該刷新頁面
              this.loadTagList();
            }
          });
        }
      });
    },
    //執行修改標籤類別數據
    handleEdit() {
      let url = 'http://localhost:9080/content/tags/type/' + this.editForm.id + '/update/info';
      console.log('url = ' + url);
      let formData = this.qs.stringify(this.editForm);
      console.log('formData = ' + formData);
      /**
       * 發出【修改標籤類別】的請求
       */
      this.axios
          .create({'headers': {'Authorization': localStorage.getItem("localJwt")}})
          .post(url, formData).then((response) => {
        let jsonResult = response.data;
        if (jsonResult.stateCode == 20000) {
          this.$message({
            message: '修改標籤成功！',
            type: 'success'
          });
          this.editFormVisible = false;
          this.loadTypeList();
        } else if (jsonResult.stateCode == 40400) {
          let title = '操作失敗';
          this.$alert(jsonResult.message, title, {
            confirmButtonText: '確定',
            callback: action => {
              this.editFormVisible = false;//修改完畢關閉修改頁面
              this.loadTypeList();//修改完畢刷新標籤列表
            }
          });
        } else {//通常指40900修改錯誤，此時代表更新失敗，不用刷新頁面和退出編輯頁面
          let title = '操作失败';
          this.$alert(jsonResult.message, title, {
            confirmButtonText: '確定',
            callback: action => {
            }
          });
        }
      });
    },
    //彈出刪除確認框
    openDeleteConfirm(tableItem) {
      let message = '此操作將永久刪除【' + tableItem.name + '】標籤，是否繼續?';
      this.$confirm(message, '提示', {
        confirmButtonText: '確定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {//點選確認...
        this.handleDelete(tableItem);//執行刪除標籤數據
      }).catch(() => {//點選取消...
      });
    },
    //執行刪除標籤類別數據
    handleDelete(tableItem) {
      let url = 'http://localhost:9080/content/tags/type/' + tableItem.id + '/delete';
      console.log('url = ' + url);
      /**
       * 發出【刪除標籤】的請求
       */
      this.axios
          .create({'headers': {'Authorization': localStorage.getItem("localJwt")}})
          .post(url).then((response) => {
        let jsonResult = response.data;
        if (jsonResult.stateCode == 20000) {
          this.$message({
            message: '刪除標籤成功!',
            type: 'success'
          });
          this.loadTypeList();
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
    //加載標籤類別列表
    loadTypeList() {
      /**
       * this.$router 全局路由器對象
       * currentRoute 當前路由屬性
       * query表示地址欄中"?"以後的參數內容，不一定存在所以後續需要判定
       * page，地址欄中"?"以後的參數團若視為鍵值隊，則此處的page則表示其中的某一個"key"
       */
      let page = this.$router.currentRoute.query.page;
      //簡易驗證
      if (!page) page = 1;
      let url = 'http://localhost:9080/content/tags/type/list?page=' + page
      console.log('url = ' + url);

      this.axios
          .create({'headers': {'Authorization': localStorage.getItem("localJwt")}})
          .get(url).then((response) => {
        if (response.data.stateCode == 20000) {
          this.TagTypeListArr = response.data.data.list;
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
  },
  mounted() {
    this.loadTypeList()
  }
}
</script>