<template>
    <div>
        <!-- 頂部麵包屑標識與導航 -->
        <el-breadcrumb separator-class="el-icon-arrow-right" style="font-size: 16px;">
            <el-breadcrumb-item :to="{ path: '/' }">
                <i class="el-icon-s-promotion"></i> 後台管理
            </el-breadcrumb-item>
            <el-breadcrumb-item :to="{ path: '/admin/temp/category/list' }">文章管理</el-breadcrumb-item>
            <el-breadcrumb-item>發布文章</el-breadcrumb-item>
        </el-breadcrumb>
        <el-divider></el-divider>

        <!-- 添加數據的表單 -->
        <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="130px" class="demo-ruleForm">
            <el-form-item label="文章類別" prop="parentId">
                <el-cascader
                        style="width: 100%;"
                        placeholder="請選擇文章類別"
                        v-model="ruleForm.categoryId"
                        :options="categoryOptions"></el-cascader>
            </el-form-item>
            <el-form-item label="標題" prop="title">
                <el-input v-model="ruleForm.title"></el-input>
            </el-form-item>
            <el-form-item label="摘要" prop="brief">
                <el-input type="textarea" v-model="ruleForm.brief"
                          :autosize="{ minRows: 3, maxRows: 5}"
                          maxlength="255" show-word-limit></el-input>
            </el-form-item>
            <el-form-item label="封面圖" prop="coverUrl">
                <div class="picture-preview" v-if="ruleForm.coverUrl">
                    <el-image class="image"
                              :src="ruleForm.coverUrl"
                              fit="cover"></el-image>
                </div>
                <!-- show-file-list 是否顯示上傳後的檔案名 -->
                <el-upload
                        class="picture-uploader"
                        action="http://localhost:9080/resources/upload/image/article"
                        :show-file-list="false"
                        :on-success="handleUploadSuccess">
                    <i class="el-icon-upload picture-uploader-icon"></i>
                    <div class="picture-uploader-text">僅允許上傳 <i>JPG</i> / <i>PNG</i> 格式的圖片</div>
                    <div class="picture-uploader-text">僅允許上傳不超過 <i>5MB</i> 的圖片</div>
                </el-upload>
            </el-form-item>
            <el-form-item label="文章詳情">
                <div id="wangEditor"></div>
            </el-form-item>
            <el-form-item label="標籤" prop="tags">
                <el-input v-model="ruleForm.tags"></el-input>
            </el-form-item>
            <el-form-item label="排序序號" prop="sort">
                <el-input v-model="ruleForm.sort"></el-input>
            </el-form-item>
            <el-form-item>
                <el-button type="primary" @click="submitForm('ruleForm')">發布</el-button>
                <el-button @click="resetForm('ruleForm')">重置</el-button>
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
                    categoryId: '0',
                    title: '測試標題001',
                    brief: '測試摘要001',
                    tags: '[{\"id\":10, \"name\":\"Spring\"},{\"id\":11, \"name\":\"Spring MVC\"}]',
                    sort: '99',
                    coverUrl: ''
                },
                // 表單規則
                rules: {
                },
                // 富文本編輯器
                editor: {}
            };
        },
        methods: {
            // 初始化富文本編輯器
            initWangEditor() {
                this.editor = new this.wangEditor('#wangEditor');
                this.editor.config.zIndex = 1;
                this.editor.create();
            },
            // 上傳成功後的回調
            handleUploadSuccess(response) {
                this.ruleForm.coverUrl = response.data.url;
            },
            // 提交表單
            submitForm(formName) {
                this.$refs[formName].validate((valid) => {
                    if (valid) {
                        let url = 'http://localhost:9080/articles/add-new';
                        console.log('url = ' + url);

                        if (Array.isArray(this.ruleForm.categoryId)) {
                            this.ruleForm.categoryId = this.ruleForm.categoryId.pop();
                        }

                        this.ruleForm.detail = this.editor.txt.html();
                        let formData = this.qs.stringify(this.ruleForm);
                        console.log('formData = ' + formData);

                        this.axios
                            .create({'headers': {'Authorization': localStorage.getItem('localJwt')}})
                            .post(url, formData).then((response) => {
                            let jsonResult = response.data;
                            if (jsonResult.stateCode == 20000) {
                                let message = '發布文章成功！ ';
                                this.$alert(message, '提示', {
                                    confirmButtonText: '確定',
                                    callback: action => {
                                        this.resetForm(formName);
                                    }
                                });
                            } else {
                                let message = jsonResult.message;
                                this.$alert(message, '警告', {
                                    confirmButtonText: '確定',
                                    callback: action => {
                                    }
                                });
                            }
                        });
                    } else {
                        console.log('error submit!!');
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
                let url = 'http://localhost:9080/categories/tree';
                console.log('url = ' + url);

                this.axios
                    .create({'headers': {'Authorization': localStorage.getItem('localJwt')}})
                    .get(url).then((response) => {
                    let jsonResult = response.data;
                    if (jsonResult.stateCode == 20000) {
                        this.categoryOptions = jsonResult.data;
                    }
                });
            }
        },
        mounted() {
            this.loadCategoryTree();
            this.initWangEditor();
        }
    }
</script>

<style>
.picture-uploader {
  float: left;
  width: 240px;
  height: 135px;
  margin-right: 20px;
  border: 1px dashed #d9d9d9;
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
}

.picture-uploader .picture-uploader-icon {
  width: 240px;
  height: 80px;
  font-size: 58px;
  color: #8c939d;
  line-height: 80px;
  text-align: center;
}

.picture-uploader .picture-uploader-text {
  width: 240px;
  height: 20px;
  line-height: 20px;
  text-align: center;
  font-size: 10px;
  color: #8c939d;
}

.picture-uploader .picture-uploader-text i {
  font-size: 10px;
  font-weight: bold;
  font-style: normal;
  color: #F56C6C;
}

.picture-preview {
  width: 240px;
  height: 135px;
  margin-right: 20px;
  border: 1px solid #e8e6e6;
  border-radius: 6px;
  float: left;
  display: inline;
  position: relative;
}

.picture-preview .image {
  width: 240px;
  height: 135px;
  border-radius: 6px;
}
</style>