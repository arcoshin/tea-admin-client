<template>
  <div>
      <!-- 頂部的麵包屑導航 -->
      <el-breadcrumb separator-class="el-icon-arrow-right" style="font-size: 16px;">
          <el-breadcrumb-item :to="{ path: '/' }">主頁</el-breadcrumb-item>
          <el-breadcrumb-item>文章管理</el-breadcrumb-item>
      </el-breadcrumb>
      <el-divider></el-divider>

      <!-- 表格 -->
      <el-table :data="tableData" border style="width: 100%">
          <el-table-column prop="id" label="ID" align="center" width="50"></el-table-column>
          <el-table-column label="類別" align="center" width="80">
              <template slot-scope="scope">
                  <el-tag>{{ scope.row.categoryName }}</el-tag>
              </template>
          </el-table-column>
          <el-table-column prop="authorName" label="作者" width="60" align="center"
                           show-overflow-tooltip></el-table-column>
          <el-table-column prop="title" label="標題" width="100" header-align="center"
                           show-overflow-tooltip></el-table-column>
          <el-table-column prop="brief" label="簡介" header-align="center"
                           show-overflow-tooltip></el-table-column>
          <el-table-column prop="sort" label="排序序號" width="80" align="center"></el-table-column>
          <el-table-column prop="clickCount" label="點擊" width="50" align="center"></el-table-column>
          <el-table-column prop="upCount" label="頂" width="50" align="center"></el-table-column>
          <el-table-column prop="downCount" label="踩" width="50" align="center"></el-table-column>
          <el-table-column label="審核狀態" width="80" align="center">
              <template slot-scope="scope">
                  <el-switch
                          @change="toggleCheckState(scope.row)"
                          v-model="scope.row.checkState"
                          :active-value="1"
                          :inactive-value="0"
                          active-color="#13ce66"
                          inactive-color="#999">
                  </el-switch>
              </template>
          </el-table-column>
          <el-table-column label="詳情" width="80" align="center">
              <template slot-scope="scope">
                  <el-button size="mini" @click="showArticleDetail(scope.row)">查看
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

      <!-- 預覽文章詳情的彈出框 -->
      <el-dialog class="article-preview-dialog" title="查看文章詳情" :visible.sync="articlePreviewDialogVisible">
          <el-descriptions :column="1" border label-class-name="description-label">
              <el-descriptions-item label="ID">{{articlePreviewData.id}}</el-descriptions-item>
              <el-descriptions-item label="類別">{{articlePreviewData.categoryName}}</el-descriptions-item>
              <el-descriptions-item label="標題">{{articlePreviewData.title}}</el-descriptions-item>
              <el-descriptions-item label="封面圖">
                  <el-image class="picture-item"
                            :src="articlePreviewData.coverUrl"
                            fit="cover"></el-image>
              </el-descriptions-item>
              <el-descriptions-item label="作者">{{articlePreviewData.authorName}}</el-descriptions-item>
              <el-descriptions-item label="發佈時間">{{articlePreviewData.gmtCreate}}</el-descriptions-item>
              <el-descriptions-item label="發布IP">{{articlePreviewData.ip}}</el-descriptions-item>
              <el-descriptions-item label="最後修改時間">{{articlePreviewData.gmtModified}}</el-descriptions-item>
              <el-descriptions-item label="摘要">{{articlePreviewData.brief}}</el-descriptions-item>
              <!-- v-html：以HTML格式顯示數據 -->
              <el-descriptions-item label="文章詳情"><span v-html="articlePreviewData.detail"></span></el-descriptions-item>
              <el-descriptions-item label="瀏覽量">{{articlePreviewData.clickCount}}</el-descriptions-item>
              <el-descriptions-item label="頂數量">{{articlePreviewData.upCount}}</el-descriptions-item>
              <el-descriptions-item label="踩數量">{{articlePreviewData.downCount}}</el-descriptions-item>
              <el-descriptions-item label="評論量">{{articlePreviewData.commentCount}}</el-descriptions-item>
              <el-descriptions-item label="審核狀態">
                  <el-tag type="success" v-if="articlePreviewData.checkState == 1">通過</el-tag>
                  <el-tag type="info" v-else-if="articlePreviewData.checkState == 0">未審核</el-tag>
                  <el-tag type="danger" v-else>拒絕審核</el-tag>
              </el-descriptions-item>
          </el-descriptions>
      </el-dialog>

      <!-- 修改數據的表單 -->
      <el-dialog title="編輯文章數據" :visible.sync="editFormVisible">
          <el-form :model="editForm" :rules="editRules" label-width="120px">
              <el-form-item label="標籤類別" prop="typeId">
                  <el-select v-model="editForm.typeId" placeholder="請選擇">
                      <el-option
                              v-for="item in tagTypeOptions"
                              :key="item.id"
                              :label="item.name"
                              :value="item.id">
                      </el-option>
                  </el-select>
              </el-form-item>
              <el-form-item label="標籤名稱" prop="name">
                  <el-input v-model="editForm.name"></el-input>
              </el-form-item>
              <el-form-item label="排序序號" prop="sort">
                  <el-input v-model="editForm.sort"></el-input>
              </el-form-item>
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
                // 預覽文章詳情相關數據
                articlePreviewDialogVisible: false,
                articlePreviewData: {},
                // 編輯對話框相關數據
                editFormVisible: false,
                editForm: {
                    id: '',
                    typeId: '',
                    name: '',
                    sort: ''
                },
                // 編輯表單規則
                editRules: {
                    typeId: [
                        {required: true, message: '請選擇標籤類別', trigger: 'blur'}
                    ],
                    name: [
                        {required: true, message: '請輸入標籤名稱', trigger: 'blur'},
                        {pattern: /^[a-zA-Z\u4e00-\u9fa5]{2,10}$/, message: '標籤必須是2~10長度的字符組成，且不允許使用標點符號', trigger: 'blur'}
                    ],
                    sort: [
                        {required: true, message: '請輸入排序序號', trigger: 'blur'},
                        {pattern: /^(\d{1}|[1-9]{1}[0-9]{1})$/, message: '排序序號必須是0~99之間的值', trigger: 'blur'}
                    ]
                }
            };
        },
        methods: {
            // 切換分頁
            changePage(page) {
                this.$router.replace('?page=' + page);
                this.loadArticleList();
            },
            // 切換審核狀態
            toggleCheckState(tableItem) {
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
            // 顯示文章詳情
            showArticleDetail(article) {
                let url = 'http://localhost:9080/articles/' + article.id;
                console.log('url = ' + url);

                this.axios
                    .create({'headers': {'Authorization': localStorage.getItem('localJwt')}})
                    .get(url).then((response) => {
                    let jsonResult = response.data;
                    if (jsonResult.stateCode == 20000) {
                        this.articlePreviewData = jsonResult.data;
                        this.articlePreviewDialogVisible = true;
                    } else {
                        let title = '操作失敗';
                        this.$alert(jsonResult.message, title, {
                            confirmButtonText: '確定',
                            callback: action => {
                                this.loadArticleList();
                            }
                        });
                    }
                });
            },
            // 加載文章列表
            loadArticleList() {
                let page = this.$router.currentRoute.query.page;
                if (!page) {
                    page = 1;
                }

                let url = 'http://localhost:9080/articles?page=' + page;
                console.log('url = ' + url);

                this.axios
                    .create({'headers': {'Authorization': localStorage.getItem('localJwt')}})
                    .get(url).then((response) => {
                    let jsonResult = response.data;
                    if (jsonResult.stateCode == 20000) {
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
                });
            }
        },
        mounted() {
            this.loadArticleList();
        }
    }
</script>

<style>
.article-preview-dialog {
}

.article-preview-dialog .description-label {
  width: 150px;
}

.article-preview-dialog .picture-item {
  width: 160px;
  height: 90px;
  margin-right: 16px;
  margin-bottom: 10px;
  border-radius: 3px;
  float: left;
}
</style>