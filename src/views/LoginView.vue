<template>
  <div class="login">
    <h1 style="text-align: center;color: #fff;">用戶登入頁面</h1><br><br><br>
    <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="100px" class="demo-ruleForm">
      <el-form-item label="用戶名稱" prop="userName">
        <el-input v-model="ruleForm.userName" style="width: 400px;"></el-input>
      </el-form-item>
      <el-form-item label="用戶密碼" prop="password">
        <el-input v-model="ruleForm.password" style="width: 400px;"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="submitForm('ruleForm')">登入</el-button>
        <el-button @click="resetForm('ruleForm')">清除</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>
<style>
body {
  background-color: #2c3e50;
  margin: 0;
}

.login {
  position: absolute;
  top: 25%;
  left: 35%;
}
</style>
<script>
export default {
  data() {
    return {
      //表單
      ruleForm: {
        userName: 'root',
        password: '123456',
      },
      //表單規則
      rules: {
        userName: [
          { required: true, message: '請輸入用戶名稱', trigger: 'blur' },
          { min: 3, max: 15, message: '長度必須在 3 到 15 個字符', trigger: 'blur' }
        ],
        password: [
          { required: true, message: '請輸入用戶密碼', trigger: 'blur' },
          { min: 4, max: 15, message: '長度必須在 4 到 15 個字符', trigger: 'blur' }
        ],
      }
    };
  },
  methods: {
    //提交表單
    submitForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          // 暫不處理頁面，直接跳轉頁面
          this.$router.push('/');
        }
      })
    },
    //重置表單
    resetForm(formName) {
      this.$refs[formName].resetFields();
    }
  }
}
</script>