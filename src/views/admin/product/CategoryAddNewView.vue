<template>
  <div>
    <!-- 頂部麪包屑標識與導航 -->
    <el-breadcrumb separator-class="el-icon-arrow-right" style="font-size: 16px;">
      <el-breadcrumb-item :to="{ path: '/' }"><i class="el-icon-s-promotion"></i> 後臺管理</el-breadcrumb-item>
      <el-breadcrumb-item :to="{ path: '/admin/product/goods' }">商品管理</el-breadcrumb-item>
      <el-breadcrumb-item :to="{ path: './' }">類別管理</el-breadcrumb-item>
      <el-breadcrumb-item>添加類別</el-breadcrumb-item>
    </el-breadcrumb>
    <el-divider></el-divider>

    <!-- 添加數據的表單 -->
    <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="130px" class="demo-ruleForm">
      <el-form-item label="父級類別" prop="parentId">
        <el-cascader
            style="width: 100%;"
            placeholder="請選擇父級類別，如不選擇，則表示無父級類別"
            :props="{ checkStrictly: true }"
            v-model="ruleForm.parentId"
            :options="parentCategoryOptions"></el-cascader>
        <span>如果父級類別列表不準確，請點擊 <a class="simple-link" href="#" @click="loadCategoryTree">這裏</a> 刷新。</span>
      </el-form-item>
      <el-form-item label="名稱" prop="name">
        <el-input v-model="ruleForm.name"></el-input>
      </el-form-item>
      <el-form-item label="關鍵詞列表" prop="keywords">
        <el-input v-model="ruleForm.keywords"></el-input>
      </el-form-item>
      <el-form-item label="圖標" prop="icon">
        <el-input v-model="ruleForm.icon"></el-input>
      </el-form-item>
      <el-form-item label="排序序號" prop="sort">
        <el-input v-model="ruleForm.sort"></el-input>
      </el-form-item>
      <el-form-item label="是否啓用">
        <el-switch
            v-model="ruleForm.enable"
            :active-value="1"
            :inactive-value="0"
            active-color="#13ce66"
            inactive-color="#999">
        </el-switch>
      </el-form-item>
      <el-form-item label="是否顯示在導航欄">
        <el-switch
            v-model="ruleForm.isDisplay"
            :active-value="1"
            :inactive-value="0"
            active-color="#13ce66"
            inactive-color="#999">
        </el-switch>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="submitForm('ruleForm')">添加</el-button>
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
      parentCategoryOptions: [],
      // 表單
      ruleForm: {
        parentId: '0',
        name: '測試數據001',
        keywords: '測試關鍵詞1,測試關鍵詞2',
        icon: 'https://fuss10.elemecdn.com/e/5d/4a731a90594a4af544c0c25941171jpeg.jpeg',
        sort: '99',
        enable: 1,
        isDisplay: 1
      },
      // 表單規則
      rules: {
        parentId: [
          {required: true, message: '請輸入父級類別ID', trigger: 'blur'},
          {pattern: /^\d+$/, message: '請選擇有效的父級類別', trigger: 'blur'}
        ],
        name: [
          {required: true, message: '請輸入類別名稱', trigger: 'blur'},
          {min: 1, max: 8, message: '長度在 1 到 8 個字符', trigger: 'blur'}
        ],
        keywords: [
          {required: true, message: '請輸入類別關鍵詞列表', trigger: 'blur'},
          {min: 2, max: 35, message: '長度在 2 到 35 個字符', trigger: 'blur'}
        ],
        icon: [
          {required: true, message: '請輸入類別圖標的URL', trigger: 'blur'},
          {min: 20, max: 255, message: '長度在 20 到 255 個字符', trigger: 'blur'}
        ],
        sort: [
          {required: true, message: '請輸入排序序號', trigger: 'blur'},
          {pattern: /^(\d{1}|[1-9]{1}[0-9]?)$/, message: '排序序號必須是 0~99 之間的數字', trigger: 'blur'}
        ]
      }
    };
  },
  methods: {
    // 返回列表
    gotoList() {
      this.$router.push('/admin/product/category');
    },
    // 提交表單
    submitForm(formName) {
      console.log(this.ruleForm.parentId);
      if (Array.isArray(this.ruleForm.parentId)) {
        this.ruleForm.parentId = this.ruleForm.parentId.pop();
      }
      this.$refs[formName].validate((valid) => {
        if (valid) {
          let url = 'http://localhost:9080/product/categories/add-new';
          console.log('url = ' + url);

          let formData = this.qs.stringify(this.ruleForm);
          console.log('formData = ' + formData);

          this.axios
              .create({'headers': {'Authorization': localStorage.getItem('localJwt')}})
              .post(url, formData).then((response) => {
            let jsonResult = response.data;
            console.log(jsonResult);
            if (jsonResult.state == 20000) {
              this.$message({
                showClose: true,
                message: '添加類別成功！',
                type: 'success'
              });
              this.resetForm(formName);
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
        if (jsonResult.state == 20000) {
          this.parentCategoryOptions = jsonResult.data;
          this.parentCategoryOptions.unshift({
            value: 0,
            label: '無父級類別'
          });
          this.ruleForm.parentId = "0";
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
  }
}
</script>

<style>
.simple-link {
  color: #409eff;
  text-decoration: underline;
}
</style>
