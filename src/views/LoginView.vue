<template>
  <div class="login">
    <h1 style="text-align: center;color: #fff;">用戶登入頁面</h1><br><br><br>
    <!-- 登入表單 -->
    <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="100px" class="demo-ruleForm">
      <el-form-item label="用戶名稱" prop="username">
        <el-input v-model="ruleForm.username" style="width: 400px;"></el-input>
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
        username: 'root',
        password: '123456',
      },
      //表單規則
      rules: {
        username: [
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
            /**
             * 發送登入請求時
             * 要注意發請求時"應攜帶憑證相關消息"以供服務器識別(Security框架無法識別)
             * axios.defaults.withCredentials = true;
             */
          let url = 'http://localhost:9080/account/users/login';
          console.log('url = ' + url);
          let formData = this.qs.stringify(this.ruleForm);
          console.log('formData = ' + formData);

          this.axios.post(url, formData).then((response) => {
            let jsonResult = response.data;
            if (jsonResult.stateCode == 20000) {
              this.$message({
                message: '登入成功！',
                type: 'success'
              });

              //請求成果返回的結果會包含JWT
              //保存數據至localStorage以便全局取用
              let loginResult = jsonResult.data;
              localStorage.setItem("localJwt",loginResult.token);
              localStorage.setItem("currentUserId",loginResult.id);
              localStorage.setItem("currentUserName",loginResult.username);
              localStorage.setItem("currentUserAvatar",loginResult.avatar);

              this.$router.push('/admin/index');
            } else if (jsonResult.stateCode == 40100) {
              this.$message.error(jsonResult.message);
            } else {
              let title = '操作失败';
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
    //重置表單
    resetForm(formName) {
      this.$refs[formName].resetFields();
    }
  }
}
</script>
