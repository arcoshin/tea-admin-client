<template>
  <div>
    <!-- 頂部麪包屑標識與導航 -->
    <el-breadcrumb separator-class="el-icon-arrow-right" style="font-size: 16px;">
      <el-breadcrumb-item :to="{ path: '/' }"><i class="el-icon-s-promotion"></i> 後臺管理</el-breadcrumb-item>
      <el-breadcrumb-item :to="{ path: '/admin/product/goods' }">商品管理</el-breadcrumb-item>
      <el-breadcrumb-item :to="{ path: './' }">商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>發佈商品</el-breadcrumb-item>
    </el-breadcrumb>
    <el-divider></el-divider>

    <!-- 添加數據的表單 -->
    <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="120px" class="demo-ruleForm">
      <el-form-item label="商品類別" prop="categoryId">
        <el-cascader
            clearable
            style="width: 100%;"
            placeholder="請選擇商品類別"
            v-model="ruleForm.categoryId"
            :options="categoryOptions"></el-cascader>
      </el-form-item>
      <el-form-item label="條形碼" prop="barCode">
        <el-input v-model="ruleForm.barCode"></el-input>
      </el-form-item>
      <el-form-item label="標題" prop="title">
        <el-input v-model="ruleForm.title"></el-input>
      </el-form-item>
      <el-form-item label="售價" prop="salePrice">
        <el-input v-model="ruleForm.salePrice"></el-input>
      </el-form-item>
      <el-form-item label="摘要" prop="brief">
        <el-input type="textarea" v-model="ruleForm.brief"
                  :autosize="{ minRows: 3, maxRows: 5}"
                  maxlength="255" show-word-limit></el-input>
      </el-form-item>
      <el-form-item label="商品詳情">
        <div id="wangEditor"></div>
      </el-form-item>
      <el-form-item label="關鍵詞列表" prop="keywords">
        <el-input v-model="ruleForm.keywords"></el-input>
      </el-form-item>
      <el-form-item label="排序序號" prop="sort">
        <el-input v-model="ruleForm.sort"></el-input>
      </el-form-item>
      <el-form-item label="是否上架">
        <el-switch
            v-model="ruleForm.status"
            :active-value="1"
            :inactive-value="0"
            active-color="#13ce66"
            inactive-color="#999">
        </el-switch>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="submitForm('ruleForm')">發佈</el-button>
        <el-button @click="resetForm('ruleForm')">重置</el-button>
        <el-button type="warning" @click="gotoList">返回列表</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
export default {
  data() {
    return {
      // 父級類別的下拉菜單的選項數據
      categoryOptions: [],
      // 表單
      ruleForm: {
        categoryId: [],
        barCode: '',
        title: '',
        brief: '',
        salePrice: '',
        keywords: '',
        sort: '',
        status: 0
      },
      // 表單規則
      rules: {
        categoryId: [
          {required: true, message: '請選擇商品類別', trigger: 'change'}
        ],
        barCode: [
          {required: true, message: '請輸入條形碼', trigger: 'blur'},
          {min: 2, max: 150, message: '長度在 2 到 150 個字符', trigger: 'blur'}
        ],
        title: [
          {required: true, message: '請輸入標題', trigger: 'blur'},
          {min: 2, max: 150, message: '長度在 2 到 150 個字符', trigger: 'blur'}
        ],
        brief: [
          {required: true, message: '請輸入摘要', trigger: 'blur'},
          {min: 2, max: 255, message: '長度在 2 到 255 個字符', trigger: 'blur'}
        ],
        salePrice: [
          {required: true, message: '請輸入售價', trigger: 'blur'}
        ],
        keywords: [
          {required: true, message: '請輸入關鍵詞列表', trigger: 'blur'}
        ],
        sort: [
          {required: true, message: '請輸入排序序號', trigger: 'blur'},
          {pattern: /^(\d{1}|[1-9]{1}[0-9]{1})$/, message: '排序序號必須是0~99之間的值', trigger: 'blur'}
        ]
      },
      // 富文本編輯器
      editor: {}
    };
  },
  methods: {
    // 返回列表
    gotoList() {
      this.$router.push('/admin/product/goods');
    },
    // 初始化富文本編輯器
    initWangEditor() {
      this.editor = new this.wangEditor('#wangEditor');
      this.editor.config.uploadImgServer = 'http://localhost:9080/resources/upload/image/goods';
      this.editor.config.uploadFileName = 'file';
      this.editor.config.uploadImgHooks = {
        customInsert: function(insertImgFn, result) {
          insertImgFn(result.data.url);
        }
      }
      this.editor.config.zIndex = 1;
      this.editor.create();
    },
    // 提交表單
    submitForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          let url = 'http://localhost:9080/product/goods/add-new';
          console.log('url = ' + url);

          if (Array.isArray(this.ruleForm.categoryId)) {
            this.ruleForm.categoryId = this.ruleForm.categoryId[this.ruleForm.categoryId.length - 1];
          }

          this.ruleForm.detail = this.editor.txt.html();
          let formData = this.qs.stringify(this.ruleForm);
          console.log('formData = ' + formData);

          this.axios
              .create({'headers': {'Authorization': localStorage.getItem('localJwt')}})
              .post(url, formData).then((response) => {
            let jsonResult = response.data;
            if (jsonResult.stateCode == 20000) {
              let message = '發佈商品成功！';
              this.$alert(message, '提示', {
                confirmButtonText: '確定',
                callback: action => {
                  this.resetForm(formName);
                  this.editor.txt.clear();
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
        } else {
          console.log('請求參數格式錯誤！');
          return false;
        }
      });
    },
    // 重置表單
    resetForm(formName) {
      this.$refs[formName].resetFields();
    },
    // 加載類別樹的數據
    loadCategoryTree() {
      let url = 'http://localhost:9080/product/categories/tree';
      console.log('url = ' + url);

      this.axios
          .create({'headers': {'Authorization': localStorage.getItem('localJwt')}})
          .get(url).then((response) => {
        let jsonResult = response.data;
        if (jsonResult.stateCode == 20000) {
          this.categoryOptions = jsonResult.data;
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
    this.loadCategoryTree();
    this.initWangEditor();
  }
}
</script>
