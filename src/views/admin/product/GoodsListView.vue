<template>
  <div>
    <!-- 頂部的麪包屑導航 -->
    <el-breadcrumb separator-class="el-icon-arrow-right" style="font-size: 16px;">
      <el-breadcrumb-item :to="{ path: '/' }"><i class="el-icon-s-promotion"></i> 後臺管理</el-breadcrumb-item>
      <el-breadcrumb-item :to="{ path: '/admin/product/goods' }">商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
    </el-breadcrumb>
    <el-divider content-position="left"></el-divider>

    <!-- 操作區域 -->
    <div style="margin: 0 0 20px 0;">
      <el-button type="primary" size="small" @click="$router.push('/admin/product/goods/add-new')">發佈商品</el-button>
    </div>

    <!-- 表格 -->
    <el-divider content-position="left">商品列表</el-divider>
    <el-table :data="tableData" border style="width: 100%">
      <el-table-column prop="id" label="ID" align="center" width="50"></el-table-column>
      <el-table-column label="類別" align="center" width="80">
        <template slot-scope="scope">
          <el-tag>{{ scope.row.categoryName }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="barCode" label="條形碼" width="120" align="center"
                       show-overflow-tooltip></el-table-column>
      <el-table-column prop="title" label="標題" header-align="center"
                       show-overflow-tooltip></el-table-column>
      <el-table-column prop="brief" label="簡介" width="120" header-align="center"
                       show-overflow-tooltip></el-table-column>
      <el-table-column prop="salePrice" label="售價" width="80" align="center"></el-table-column>
      <el-table-column prop="keywords" label="關鍵詞列表" width="120" header-align="center"
                       show-overflow-tooltip></el-table-column>
      <el-table-column prop="sort" label="排序序號" width="80" align="center"></el-table-column>
      <el-table-column label="上架狀態" width="80" align="center">
        <template slot-scope="scope">
          <el-switch
              @change="toggleStatus(scope.row)"
              v-model="scope.row.status"
              :active-value="1"
              :inactive-value="0"
              active-color="#13ce66"
              inactive-color="#999">
          </el-switch>
        </template>
      </el-table-column>
      <el-table-column label="詳情" width="80" align="center">
        <template slot-scope="scope">
          <el-button size="mini" @click="showGoodsDetail(scope.row)">查看
          </el-button>
        </template>
      </el-table-column>
      <el-table-column label="操作" width="100" align="center">
        <template slot-scope="scope">
          <el-button type="primary" icon="el-icon-edit" circle size="mini"
                     @click="openEditDialog(scope.row)"></el-button>
          <el-button type="danger" icon="el-icon-delete" circle size="mini"
                     @click="openDeleteConfirm(scope.row)"></el-button>
        </template>
      </el-table-column>
    </el-table>

    <!-- 分頁控件 -->
    <div style="margin: 10px 0; text-align: right;">
      <el-pagination
          @current-change="changePage"
          layout="total, prev, pager, next"
          :hide-on-single-page="true"
          :page-size="pageSize"
          :current-page="currentPage"
          :total="total">
      </el-pagination>
    </div>

    <!-- 預覽商品詳情的彈出框 -->
    <el-dialog class="goods-preview-dialog" title="查看商品詳情" :visible.sync="goodsPreviewDialogVisible">
      <el-descriptions :column="1" border label-class-name="description-label">
        <el-descriptions-item label="ID">{{ goodsPreviewData.id }}</el-descriptions-item>
        <el-descriptions-item label="類別">{{ goodsPreviewData.categoryName }}</el-descriptions-item>
        <el-descriptions-item label="條形碼">{{ goodsPreviewData.barCode }}</el-descriptions-item>
        <el-descriptions-item label="標題">{{ goodsPreviewData.title }}</el-descriptions-item>
        <el-descriptions-item label="摘要">{{ goodsPreviewData.brief }}</el-descriptions-item>
        <el-descriptions-item label="售價">{{ goodsPreviewData.salePrice }}</el-descriptions-item>
        <el-descriptions-item label="關鍵詞列表">{{ goodsPreviewData.keywords }}</el-descriptions-item>
        <el-descriptions-item label="排序序號">{{ goodsPreviewData.sort }}</el-descriptions-item>
        <el-descriptions-item label="商品詳情"><span v-html="goodsPreviewData.detail"></span></el-descriptions-item>
        <el-descriptions-item label="上架狀態">
          <el-tag type="success" v-if="goodsPreviewData.status == 1">上架</el-tag>
          <el-tag type="info" v-else-if="goodsPreviewData.status == 0">下架</el-tag>
          <el-tag type="danger" v-else>拒絕審覈</el-tag>
        </el-descriptions-item>
        <el-descriptions-item label="發佈時間">{{ goodsPreviewData.gmtCreate }}</el-descriptions-item>
        <el-descriptions-item label="最後修改時間">{{ goodsPreviewData.gmtModified }}</el-descriptions-item>
      </el-descriptions>
    </el-dialog>

    <!-- 修改數據的表單 -->
    <el-dialog title="編輯商品數據" :visible.sync="editFormVisible">
      <el-form :model="editForm" :rules="editRules" label-width="120px">

      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="editFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="handleEdit()">確 定</el-button>
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
      // 分頁相關數據
      currentPage: this.$router.currentRoute.query.page ? parseInt(this.$router.currentRoute.query.page) : 1,
      pageSize: 20,
      total: 0,
      // 預覽商品詳情相關數據
      goodsPreviewDialogVisible: false,
      goodsPreviewData: {},
      // 編輯對話框相關數據
      editFormVisible: false,
      editForm: {},
      // 編輯表單規則
      editRules: {}
    };
  },
  methods: {
    // 切換分頁
    changePage(page) {
      this.$router.replace('?page=' + page);
      this.loadGoodsList();
    },
    // 切換審覈狀態
    toggleStatus(tableItem) {
      let statusText = ['下架', '上架'];
      let url = 'http://localhost:9080/product/goods/' + tableItem.id;
      if (tableItem.status == 0) {
        url += '/pull-off';
      } else {
        url += '/put-on';
      }
      console.log('url = ' + url);

      this.axios
          .create({'headers': {'Authorization': localStorage.getItem('localJwt')}})
          .post(url).then((response) => {
        let jsonResult = response.data;
        if (jsonResult.state == 20000) {
          this.$message({
            message: statusText[tableItem.status] + '商品成功！',
            type: 'success'
          });
        } else {
          let title = '操作失敗';
          this.$alert(jsonResult.message, title, {
            confirmButtonText: '確定',
            callback: action => {
              if (jsonResult.state == 40400) {
                this.loadGoodsList();
              }
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
    // 彈出修改對話框
    openEditDialog(tableItem) {
    },
    // 執行修改
    handleEdit() {
    },
    // 彈出刪除確認框
    openDeleteConfirm(tableItem) {
    },
    // 執行刪除
    handleDelete(tableItem) {
    },
    // 顯示商品詳情
    showGoodsDetail(goods) {
      let url = 'http://localhost:9080/product/goods/' + goods.id;
      console.log('url = ' + url);

      this.axios
          .create({'headers': {'Authorization': localStorage.getItem('localJwt')}})
          .get(url).then((response) => {
        let jsonResult = response.data;
        if (jsonResult.state == 20000) {
          this.goodsPreviewData = jsonResult.data;
          this.goodsPreviewDialogVisible = true;
        } else {
          let title = '操作失敗';
          this.$alert(jsonResult.message, title, {
            confirmButtonText: '確定',
            callback: action => {
              this.loadGoodsList();
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
    // 加載商品列表
    loadGoodsList() {
      let page = this.$router.currentRoute.query.page;
      if (!page) {
        page = 1;
      }

      let url = 'http://localhost:9080/product/goods?page=' + page;
      console.log('url = ' + url);

      this.axios
          .create({'headers': {'Authorization': localStorage.getItem('localJwt')}})
          .get(url).then((response) => {
        let jsonResult = response.data;
        if (jsonResult.state == 20000) {
          this.tableData = jsonResult.data.list;
          this.currentPage = jsonResult.data.currentPage;
          this.pageSize = jsonResult.data.pageSize;
          this.total = jsonResult.data.total;
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
    this.loadGoodsList();
  }
}
</script>

<style>
.goods-preview-dialog {
}

.goods-preview-dialog .description-label {
  width: 150px;
}

.goods-preview-dialog .picture-item {
  width: 160px;
  height: 90px;
  margin-right: 16px;
  margin-bottom: 10px;
  border-radius: 3px;
  float: left;
}
</style>
