<template>
  <div>
    <!-- 頂部麪包屑標識與導航 -->
    <el-breadcrumb separator-class="el-icon-arrow-right" style="font-size: 16px;">
      <el-breadcrumb-item :to="{ path: '/' }"><i class="el-icon-s-promotion"></i> 後臺管理</el-breadcrumb-item>
      <el-breadcrumb-item :to="{ path: '/admin/product/goods' }">商品管理</el-breadcrumb-item>
      <el-breadcrumb-item :title="{ path: './' }">類別管理</el-breadcrumb-item>
      <el-breadcrumb-item v-for="item in history" :key="item.id"><span v-text="item.name"></span></el-breadcrumb-item>
    </el-breadcrumb>
    <el-divider content-position="left"></el-divider>

    <!-- 操作區域 -->
    <div style="margin: 0 0 20px 0;">
      <el-button type="primary" size="small" @click="$router.push('/admin/product/category/add-new')">添加類別</el-button>
    </div>

    <!-- 數據表格 -->
    <el-divider content-position="left">類別列表</el-divider>
    <el-table :data="tableData" border style="width: 100%">
      <el-table-column prop="id" label="ID" width="60" align="center"></el-table-column>
      <el-table-column label="圖標" width="70" align="center">
        <template slot-scope="scope">
          <el-avatar :size="30" :src="scope.row.icon" fit="contain"></el-avatar>
        </template>
      </el-table-column>
      <el-table-column prop="name" label="名稱" width="200" align="center"
                       :show-overflow-tooltip="true"></el-table-column>
      <el-table-column prop="keywords" label="關鍵詞列表" header-align="center"
                       :show-overflow-tooltip="true"></el-table-column>
      <el-table-column prop="sort" label="排序序號" width="100" align="center"></el-table-column>
      <el-table-column label="是否啓用" width="120" align="center">
        <template slot-scope="scope">
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
      <el-table-column label="顯示在導航欄" width="120" align="center">
        <template slot-scope="scope">
          <el-switch
              @change="toggleDisplay(scope.row)"
              v-model="scope.row.isDisplay"
              :active-value="1"
              :inactive-value="0"
              active-color="#13ce66"
              inactive-color="#ccc">
          </el-switch>
        </template>
      </el-table-column>
      <el-table-column label="子級類別" width="120" align="center">
        <template slot-scope="scope">
          <el-button size="mini" :disabled="scope.row.isParent == 0"
                     @click="showSubCategoryList(scope.row)">查看
          </el-button>
        </template>
      </el-table-column>
      <el-table-column label="操作" width="100" align="center">
        <template slot-scope="scope">
          <el-button type="primary" icon="el-icon-edit" circle size="mini"
                     @click="openEditDialog(scope.row)"></el-button>
          <el-button type="danger" icon="el-icon-delete" circle size="mini"
                     :disabled="scope.row.isParent == 1"
                     @click="openDeleteConfirm(scope.row)"></el-button>
        </template>
      </el-table-column>
    </el-table>

    <!-- 返回上層 -->
    <div v-if="currentParentId != 0" style="margin-top: 10px; text-align: right;">
      <el-button size="small" @click="goBack()">返回</el-button>
    </div>

    <!-- 修改類別的彈出表單Dialog -->
    <el-dialog title="修改類別" :visible.sync="dialogFormVisible">
      <el-form :model="editForm" :rules="editRules" label-width="130px">
        <el-form-item label="名稱" prop="name">
          <el-input v-model="editForm.name"></el-input>
        </el-form-item>
        <el-form-item label="關鍵詞列表" prop="keywords">
          <el-input v-model="editForm.keywords"></el-input>
        </el-form-item>
        <el-form-item label="排序序號" prop="sort">
          <el-input v-model="editForm.sort"></el-input>
        </el-form-item>
        <el-form-item label="圖標" prop="icon">
          <el-input v-model="editForm.icon"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="submitEditForm()">確 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
export default {
  data() {
    return {
      // 表格數據
      tableData: [],
      // 當前類別列表的父級類別ID
      currentParentId: 0,
      // 瀏覽歷史，此數據主要用於返回功能
      history: [],
      // 編輯對話框的可見性
      dialogFormVisible: false,
      // 編輯表單
      editForm: {
        id: '',
        name: '',
        keywords: '',
        sort: '',
        icon: ''
      },
      // 編輯表單的驗證規則
      editRules: {
        name: [
          {required: true, message: '請輸入類別名稱', trigger: 'blur'},
          {min: 2, max: 15, message: '類別名稱長度必須在 2 到 15 個字符', trigger: 'blur'}
        ],
        keywords: [
          {required: true, message: '請輸入關鍵詞列表', trigger: 'blur'},
          {min: 2, max: 50, message: '關鍵詞列表長度必須在 2 到 50 個字符', trigger: 'blur'}
        ],
        icon: [
          {required: true, message: '請輸入圖標圖片的URL', trigger: 'blur'},
          {min: 20, max: 200, message: '圖標圖片的URL長度必須在 20 到 200 個字符', trigger: 'blur'}
        ],
        sort: [
          {required: true, message: '請輸入排序序號', trigger: 'blur'},
          {pattern: /^([0-9]{1}|[1-9]{1}[0-9]{1})$/, message: '排序序號必須是 0~99 之間的數字', trigger: 'blur'}
        ]
      },
    }
  },
  methods: {
    // 返回
    goBack() {
      console.log('goBack, start...');
      for (let i = 0; i < this.history.length; i++) {
        console.log(this.history[i].id + ' ' + this.history[i].name);
      }
      console.log('---------------')

      let parentCategory = this.history[this.history.length - 1];
      this.currentParentId = parentCategory.parentId;
      this.loadCategoryList();
      this.history.pop();

      console.log('goBack, done.');
      for (let i = 0; i < this.history.length; i++) {
        console.log(this.history[i].id + ' ' + this.history[i].name);
      }
      console.log('---------------')
    },
    // 顯示子級類別列表
    showSubCategoryList(category) {
      this.history[category.depth - 1] = category;

      console.log('showSubCategoryList');
      for (let i = 0; i < this.history.length; i++) {
        console.log(this.history[i].id + ' ' + this.history[i].name);
      }
      console.log('---------------')

      this.currentParentId = category.id;
      this.loadCategoryList();
    },
    // 切換啓用狀態
    toggleEnable(category) {
      let enableText = ['禁用', '啓用'];
      let url = 'http://localhost:9080/product/categories/' + category.id;
      let enable = category.enable;
      if (enable == 1) {
        url += '/enable';
      } else {
        url += '/disable';
      }
      console.log('url = ' + url);

      this.axios
          .create({'headers': {'Authorization': localStorage.getItem('localJwt')}})
          .post(url).then((response) => {
        let jsonResult = response.data;
        if (jsonResult.stateCode == 20000) {
          this.$message({
            message: '將【' + category.name + '】的啓用狀態修改爲【' + enableText[enable] + '】成功！',
            type: 'success'
          });
          this.loadCategoryList();
        } else if (jsonResult.stateCode == 40400) {
          let title = '操作失敗';
          this.$alert(jsonResult.message, title, {
            confirmButtonText: '確定',
            callback: action => {
              this.loadCategoryList();
            }
          });
        } else {
          let title = '操作失敗';
          this.$alert(jsonResult.message, title, {
            confirmButtonText: '確定',
            callback: action => {
            }
          });
        }
      }).catch(error => {
        let title = '錯誤';
        let message = '程序執行過程中出現錯誤，請打開瀏覽器的控制檯查看詳細錯誤信息！';
        this.$alert(message, title, {
          confirmButtonText: '確定',
          callback: action => {
          }
        });
        console.log(error);
      });
    },
    // 切換顯示狀態
    toggleDisplay(category) {
      let displayText = ['不顯示在導航欄', '顯示在導航欄'];
      let url = 'http://localhost:9080/product/categories/' + category.id;
      let isDisplay = category.isDisplay;
      if (isDisplay == 1) {
        url += '/display';
      } else {
        url += '/hidden';
      }
      console.log('url = ' + url);

      this.axios
          .create({'headers': {'Authorization': localStorage.getItem('localJwt')}})
          .post(url).then((response) => {
        let jsonResult = response.data;
        if (jsonResult.stateCode == 20000) {
          this.$message({
            message: '將【' + category.name + '】的顯示狀態修改爲【' + displayText[isDisplay] + '】成功！',
            type: 'success'
          });
          this.loadCategoryList();
        } else if (jsonResult.stateCode == 40400) {
          let title = '操作失敗';
          this.$alert(jsonResult.message, title, {
            confirmButtonText: '確定',
            callback: action => {
              this.loadCategoryList();
            }
          });
        } else {
          let title = '操作失敗';
          this.$alert(jsonResult.message, title, {
            confirmButtonText: '確定',
            callback: action => {
            }
          });
        }
      }).catch(error => {
        let title = '錯誤';
        let message = '程序執行過程中出現錯誤，請打開瀏覽器的控制檯查看詳細錯誤信息！';
        this.$alert(message, title, {
          confirmButtonText: '確定',
          callback: action => {
          }
        });
        console.log(error);
      });
    },
    // 打開編輯對話框
    openEditDialog(category) {
      let url = 'http://localhost:9080/product/categories/' + category.id;
      console.log('url = ' + url);

      this.axios
          .create({'headers': {'Authorization': localStorage.getItem('localJwt')}})
          .get(url).then((response) => {
        let jsonResult = response.data;
        if (jsonResult.stateCode == 20000) {
          this.editForm = jsonResult.data;
          this.dialogFormVisible = true;
        } else if (jsonResult.stateCode == 40400) {
          let title = '操作失敗';
          this.$alert(jsonResult.message, title, {
            confirmButtonText: '確定',
            callback: action => {
              this.loadCategoryList();
            }
          });
        } else {
          let title = '操作失敗';
          this.$alert(jsonResult.message, title, {
            confirmButtonText: '確定',
            callback: action => {
            }
          });
        }
      }).catch(error => {
        let title = '錯誤';
        let message = '程序執行過程中出現錯誤，請打開瀏覽器的控制檯查看詳細錯誤信息！';
        this.$alert(message, title, {
          confirmButtonText: '確定',
          callback: action => {
          }
        });
        console.log(error);
      });
    },
    // 提交編輯表單
    submitEditForm() {
      let url = 'http://localhost:9080/product/categories/' + this.editForm.id + '/update';
      console.log('url = ' + url);

      let formData = this.qs.stringify(this.editForm);
      console.log('formData = ' + formData);

      this.axios
          .create({'headers': {'Authorization': localStorage.getItem('localJwt')}})
          .post(url, formData).then((response) => {
        let jsonResult = response.data;
        if (jsonResult.stateCode == 20000) {
          this.$message({
            message: '修改類別成功！',
            type: 'success'
          });
          this.dialogFormVisible = false;
          this.loadCategoryList();
        } else if (jsonResult.stateCode == 40400) {
          let title = '操作失敗';
          this.$alert(jsonResult.message, title, {
            confirmButtonText: '確定',
            callback: action => {
              this.dialogFormVisible = false;
              this.loadCategoryList();
            }
          });
        } else if (jsonResult.stateCode == 40900) {
          this.$message.error(jsonResult.message);
        } else {
          let title = '操作失敗';
          this.$alert(jsonResult.message, title, {
            confirmButtonText: '確定',
            callback: action => {
            }
          });
        }
      }).catch(error => {
        let title = '錯誤';
        let message = '程序執行過程中出現錯誤，請打開瀏覽器的控制檯查看詳細錯誤信息！';
        this.$alert(message, title, {
          confirmButtonText: '確定',
          callback: action => {
          }
        });
        console.log(error);
      });
    },
    // 打開刪除確認框
    openDeleteConfirm(category) {
      let message = '此操作將永久刪除【' + category.name + '】類別，是否繼續？';
      this.$confirm(message, '提示', {
        confirmButtonText: '確定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.handleDelete(category);
      }).catch(() => {
      });
    },
    // 處理刪除
    handleDelete(category) {
      let url = 'http://localhost:9080/product/categories/' + category.id + '/delete';
      console.log('url = ' + url);

      this.axios
          .create({'headers': {'Authorization': localStorage.getItem('localJwt')}})
          .post(url).then((response) => {
        let jsonResult = response.data;
        if (jsonResult.stateCode == 20000) {
          this.$message({
            message: '刪除【' + category.name + '】類別成功！',
            type: 'success'
          });
          this.loadCategoryList();
        } else if (jsonResult.stateCode == 40400) {
          let title = '操作失敗';
          this.$alert(jsonResult.message, title, {
            confirmButtonText: '確定',
            callback: action => {
              this.loadCategoryList();
            }
          });
        } else {
          let title = '操作失敗';
          this.$alert(jsonResult.message, title, {
            confirmButtonText: '確定',
            callback: action => {
            }
          });
        }
      }).catch(error => {
        let title = '錯誤';
        let message = '程序執行過程中出現錯誤，請打開瀏覽器的控制檯查看詳細錯誤信息！';
        this.$alert(message, title, {
          confirmButtonText: '確定',
          callback: action => {
          }
        });
        console.log(error);
      });
    },
    // 加載類別列表
    loadCategoryList() {
      let url = 'http://localhost:9080/product/categories/list-by-parent?queryType=all&parentId=' + this.currentParentId;
      console.log('url = ' + url);

      this.axios
          .create({'headers': {'Authorization': localStorage.getItem('localJwt')}})
          .get(url).then((response) => {
        let jsonResult = response.data;
        if (jsonResult.stateCode == 20000) {
          this.tableData = jsonResult.data.list;
        } else {
          let title = '操作失敗';
          this.$alert(jsonResult.message, title, {
            confirmButtonText: '確定',
            callback: action => {
            }
          });
        }
      }).catch(error => {
        let title = '錯誤';
        let message = '程序執行過程中出現錯誤，請打開瀏覽器的控制檯查看詳細錯誤信息！';
        this.$alert(message, title, {
          confirmButtonText: '確定',
          callback: action => {
          }
        });
        console.log(error);
      });
    }
  },
  mounted() {
    this.loadCategoryList();
  }
}
</script>
