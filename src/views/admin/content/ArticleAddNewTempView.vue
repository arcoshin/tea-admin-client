<!-- 臨時使用 -->
<!-- 階段1：全部使用普通input控件 -->
<!-- 階段2：調整類別的下拉菜單控件和摘要的文本域控件 -->
<!-- 階段3：調整封面圖的上傳控件 -->
<!-- 階段4：使用富文本編輯器 -->
<!-- 4.1. 使用 npm i wangeditor -S 安裝-->
<!-- 4.2. 在 main.js 中添加配置（2行代碼） -->
<!-- 4.3. 在需要顯示富文本編輯器的位置添加一個容器標籤，不再需要使用別的控件，例如第53行 -->
<!-- 4.4. 創建初始化富文本編輯器的方法，例如第96行和第100行 -->
<!-- 4.5. 在mounted中調用初始化富文本編輯器的方法 -->
<!-- 4.6. 在提交表單時，通過富文本編輯器對象的 txt.html() 獲取內容的HTML源代碼，並賦值給 ruleForm 的 detail 屬性 -->
<!-- -->
<!-- -->

<template>
    <div>
        <!-- 表單 -->
        <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="120px" class="demo-ruleForm">
            <el-form-item label="文章類別" prop="categoryId">
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
                <el-input v-model="ruleForm.brief"
                          type="textarea"
                          :autosize="{ minRows: 3, maxRows: 5}"
                          maxlength="255"
                          show-word-limit></el-input>
            </el-form-item>
            <el-form-item label="封面圖" prop="coverUrl">
                <el-upload
                        class="picture-uploader"
                        action="http://localhost:9080/resources/upload/image/article"
                        :show-file-list="false"
                        :on-success="handleUploadSuccess">
                    <i class="el-icon-upload picture-uploader-icon"></i>
                    <div class="picture-uploader-text">僅允許上傳 <i>JPG</i> / <i>PNG</i> 格式的圖片</div>
                    <div class="picture-uploader-text">僅允許上傳不超過 <i>5MB</i> 的圖片</div>
                </el-upload>
                <div class="picture-preview" v-if="ruleForm.coverUrl">
                    <el-image class="image"
                              :src="ruleForm.coverUrl"
                              fit="cover"></el-image>
                </div>
            </el-form-item>
            <el-form-item label="正文" prop="detail">
                <div id="wangEditorXXX"></div>
            </el-form-item>
            <el-form-item label="標籤" prop="tags">
                <el-input v-model="ruleForm.tags"></el-input>
            </el-form-item>
            <el-form-item label="排序序號" prop="sort">
                <el-input v-model="ruleForm.sort"></el-input>
            </el-form-item>
            <el-form-item>
                <el-button type="primary" @click="submitForm('ruleForm')">提交</el-button>
                <el-button @click="resetForm('ruleForm')">重置</el-button>
            </el-form-item>
        </el-form>
    </div>
</template>

<script>
    export default {
        data() {
            return {
                // 類別的下拉菜單的選項數據
                categoryOptions: [],
                // 表單
                ruleForm: {
                    categoryId: '',
                    title: '',
                    brief: '',
                    coverUrl: '',
                    detail: '',
                    tags: '',
                    sort: '',
                },
                // 表單規則
                rules: {
                    categoryId: [],
                    title: [],
                    brief: [],
                    coverUrl: [],
                    detail: [],
                    tags: [],
                    sort: [],
                },
                // 富文本編輯器
                editor: ''
            };
        },
        methods: {
            // 初始化富文本編輯器
            initWangEditor() {
                this.editor = new this.wangEditor('#wangEditorXXX');
                this.editor.config.zIndex = 1;//修正與確認框的層級問題
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
                        //解決類別提交數組值的問題(只須提交最底層)
                        if (Array.isArray(this.ruleForm.categoryId)) {
                            this.ruleForm.categoryId = this.ruleForm.categoryId.pop();
                        }

                        //獲取富文本編輯器中的HTML文本，並與detail綁定
                        this.ruleForm.detail = this.editor.txt.html();
                        console.log(this.ruleForm.detail);

                        let url = 'http://localhost:9080/articles/add-new';
                        console.log('url = ' + url);
                        let formData = this.qs.stringify(this.ruleForm);
                        console.log('formData = ' + formData);

                        this.axios
                            .create({'headers': {'Authorization': localStorage.getItem('localJwt')}})
                            .post(url, formData).then((response) => {
                            let jsonResult = response.data;
                            if (jsonResult.stateCode == 20000) {
                                this.$message({
                                    message: '成功！ ',
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
                        });
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
        width: 230px;
        height: 230px;
        margin-right: 20px;
        margin-bottom: 20px;
        border: 1px dashed #d9d9d9;
        border-radius: 6px;
        cursor: pointer;
        position: relative;
        overflow: hidden;
    }

    .picture-uploader .picture-uploader-icon {
        width: 230px;
        height: 150px;
        font-size: 88px;
        color: #8c939d;
        line-height: 150px;
        text-align: center;
    }

    .picture-uploader .picture-uploader-text {
        width: 230px;
        height: 24px;
        line-height: 24px;
        text-align: center;
        font-size: 12px;
        color: #8c939d;
    }

    .picture-uploader .picture-uploader-text i {
        font-size: 12px;
        font-weight: bold;
        font-style: normal;
        color: #F56C6C;
    }

    .picture-preview {
        width: 230px;
        height: 230px;
        margin-right: 20px;
        margin-bottom: 20px;
        border: 1px solid #e8e6e6;
        border-radius: 6px;
        float: left;
        display: inline;
        position: relative;
    }

    .picture-preview .image {
        width: 230px;
        height: 230px;
        border-radius: 6px;
    }
</style>