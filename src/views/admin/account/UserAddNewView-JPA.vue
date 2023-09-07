<template>
    <div>
        <!-- 頂部麵包屑標識與導航 -->
        <el-breadcrumb separator-class="el-icon-arrow-right" style="font-size: 16px;">
            <el-breadcrumb-item :to="{ path: '/' }">
                <i class="el-icon-s-promotion"></i> 後臺管理
            </el-breadcrumb-item>
            <el-breadcrumb-item :to="{ path: '/sys-admin/permission/admin' }">用戶管理</el-breadcrumb-item>
            <el-breadcrumb-item>添加用戶(JPA)</el-breadcrumb-item>
        </el-breadcrumb>
        <el-divider></el-divider>

        <!-- 添加數據的表單 -->
        <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="100px" class="demo-ruleForm">
            <el-form-item label="用戶名稱" prop="username">
                <el-input v-model="ruleForm.username"></el-input>
            </el-form-item>
            <el-form-item label="用戶密碼" prop="password">
                <el-input v-model="ruleForm.password"></el-input>
            </el-form-item>
            <el-form-item label="用戶暱稱" prop="nickname">
                <el-input v-model="ruleForm.nickname"></el-input>
            </el-form-item>
            <el-form-item label="用戶頭像" prop="avatar">
                <el-input v-model="ruleForm.avatar"></el-input>
            </el-form-item>
            <el-form-item label="手機號碼" prop="phone">
                <el-input v-model="ruleForm.phone"></el-input>
            </el-form-item>
            <el-form-item label="電子信箱" prop="email">
                <el-input v-model="ruleForm.email"></el-input>
            </el-form-item>
            <el-form-item label="用戶簡介" prop="description">
                <el-input v-model="ruleForm.description"></el-input>
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
            <el-form-item label="用戶角色">
                <el-select v-model="ruleForm.roleIds" multiple placeholder="請選擇">
                    <el-option
                            v-for="item in roleListOptions"
                            :key="item.id"
                            :label="item.name"
                            :value="item.id">
                    </el-option>
                </el-select>
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
                // 角色的下拉菜單的選項數據
                roleListOptions: [],
                // 表單
                ruleForm: {
                    username: 'test-user-095',
                    password: '123456',
                    nickname: '測試用戶095',
                    avatar: 'https://img2.baidu.com/it/u=4244269751,4000533845&fm=253&fmt=auto&app=138&f=JPEG?w=500&h=500',
                    phone: '13700137095',
                    email: '13700137001@163.com.95',
                    description: '測試用戶的簡介',
                    enable: 1,
                    roleIds: []
                },
                // 表單驗證規則
                rules: {
                    username: [
                        {required: true, message: '請輸入用戶名', trigger: 'blur'},
                        {min: 4, max: 15, message: '長度在 4 到 15 個字符', trigger: 'blur'}
                    ],
                    password: [
                        {required: true, message: '請輸入密碼', trigger: 'blur'},
                        {min: 4, max: 15, message: '長度在 4 到 15 個字符', trigger: 'blur'}
                    ],
                    nickname: [
                        {required: true, message: '請輸入暱稱', trigger: 'blur'},
                        {min: 2, max: 15, message: '長度在 2 到 15 個字符', trigger: 'blur'}
                    ],
                    avatar: [
                        {required: true, message: '請輸入頭像的URL', trigger: 'blur'},
                        {min: 10, max: 255, message: '長度在 10 到 255 個字符', trigger: 'blur'}
                    ],
                    phone: [
                        {required: true, message: '請輸入手機號碼', trigger: 'blur'},
                        {min: 8, max: 15, message: '長度在 8 到 15 個字符', trigger: 'blur'}
                    ],
                    email: [
                        {required: true, message: '請輸入電子郵箱', trigger: 'blur'},
                        {min: 8, max: 35, message: '長度在 8 到 35 個字符', trigger: 'blur'}
                    ],
                    description: [
                        {required: true, message: '請輸入相冊簡介', trigger: 'blur'},
                        {min: 2, max: 35, message: '長度在 4 到 35 個字符', trigger: 'blur'}
                    ]
                }
            };
        },
        methods: {
            // 返回列表
            gotoList() {
                this.$router.push('/admin/account/users/list/jpa');
            },
            // 提交表單
            submitForm(formName) {
                this.$refs[formName].validate((valid) => {
                    if (valid) {
                        let url = 'http://localhost:9080/account/tester/jpa/add-new';
                        console.log('url = ' + url);

                        let formData = this.qs.stringify(this.ruleForm);
                        console.log('formData = ' + formData);

                        this.axios
                            .create({'headers': {'Authorization': localStorage.getItem("localJwt")}})
                            .post(url, formData).then((response) => {
                            let jsonResult = response.data;
                            console.log(jsonResult);
                            if (jsonResult.stateCode == 20000) {
                                this.$message({
                                    showClose: true,
                                    message: '添加用戶成功！',
                                    type: 'success'
                                });
                                this.resetForm(formName);
                            } else {
                                this.$message({
                                    showClose: true,
                                    message: jsonResult.message,
                                    type: 'error'
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
            // 加載角色列表
            loadRoleList() {
                let url = 'http://localhost:9080/account/roles';
                console.log('url = ' + url);

                this.axios
                    .create({'headers': {'Authorization': localStorage.getItem("localJwt")}})
                    .get(url).then((response) => {
                    let jsonResult = response.data;
                    this.roleListOptions = jsonResult.data.list;
                });
            }
        },
        mounted() {
            this.loadRoleList();
        }
    }
</script>

<style>
</style>