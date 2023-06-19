<template>
  <div>
    <!-- 頂部的麵包屑導航 -->
    <el-breadcrumb separator-class="el-icon-arrow-right" style="font-size: 16px; color: white">
      <el-breadcrumb-item :to="{ path: '/' }">首頁</el-breadcrumb-item>
      <el-breadcrumb-item>內容管理</el-breadcrumb-item>
      <el-breadcrumb-item>標籤管理</el-breadcrumb-item>
      <el-breadcrumb-item>新增標籤類型</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 分割線 -->
    <el-divider></el-divider>
    <!-- 表單 -->
    <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="120px" class="demo-ruleForm">
      <el-form-item label="標籤類別" prop="typeId">
        <el-select v-model="ruleForm.typeId" placeholder="請選擇標籤類別">
          <el-option
              v-for="item in tagTypeOptions"
              :key="item.id"
              :label="item.name"
              :value="item.id">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="標籤名稱" prop="name">
        <el-input v-model="ruleForm.name" style="width: 400px;"></el-input>
      </el-form-item>
      <el-form-item label="排序序號" prop="sort">
        <el-input v-model="ruleForm.sort" style="width: 400px;"></el-input>
      </el-form-item>
      <el-form-item label="是否啟用" prop="sort">
        <!-- 服務器端對於使否啟用屬性的規則是 1:啟用 2:關閉 因此需要在此設定控件輸出的數據類型
            :active-value="1"
            :inactive-value="0"-->
        <el-switch
            v-model="ruleForm.enable"
            :active-value="1"
            :inactive-value="0"
            active-color="#13ce66"
            inactive-color="#ccc">
        </el-switch>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="submitForm('ruleForm')">保存</el-button>
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
</style>


<script>
import qs from "qs";

export default {
  data() {
    return {
      //表單
      ruleForm: {
        name: '測試標籤類型名稱X',
        sort: '99',
        enable: 0,//雖然控件預設類型為布爾類型，但應該要根據服務器所設定的類型進行設定默認值
        typeId: ''
      },
      //表單規則
      rules: {
        name: [
          {required: true, message: '請輸入標籤類型名稱', trigger: 'blur'},
          {pattern: /^[a-zA-Z\u4e00-\u9fa5]{2,10}$/, message: '標籤類型必須是2~10長度的字符組成，且不允許使用標點符號', trigger: 'blur'}
        ],
        sort: [
          {required: true, message: '請輸入排序序號', trigger: 'blur'},
          {pattern: /^(\d{1}|[1-9]{1}[0-9]{1})$/, message: '排序序號必須為介於0~99之間的整數值', trigger: 'blur'}
        ],//enable已經設置為switch控件，不需要設計規則
      }
    }
        ;
  },
  methods: {
    //提交表單
    submitForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          let url = 'http://localhost:9080/content/tags/add-new';
          console.log('url = ' + url);

          /**
           * 基於元素的變量名去拼接格式訊息不優雅，建議安裝qs
           * npm i qs -S
           * 該API可以將Json對象訊息轉變為服務器可以接受的formData格式訊息
           */
              // let formData = 'name=' + this.ruleForm.name
              //     + '&sort=' + this.ruleForm.sort
              //     + '&enable=' + this.ruleForm.enable;
              // console.log('formData = ' + formData);
          let formData = qs.stringify(this.ruleForm)
          console.log('formData = ' + formData);

          /**
           * 提交請求
           */
          this.axios.post(url, formData).then((response) => {
            let jsonResult = response.data;
            if (jsonResult.stateCode == 20000) {
              this.tagTypeOptions = jsonResult.data.list;
              if (this.tagTypeOptions && this.tagTypeOptions[0]) {
                this.ruleForm.typeId = this.tagTypeOptions[0].id;
              }
              //彈出訊息提示
              this.$message({
                message: '新增標籤類型成功!',
                type: 'success'
              })
            } else {
              //彈出訊息提示框提示
              let title = '操作失敗';
              this.$alert(jsonResult.message, title, {
                confirmButtonText: '確定',
                callback: action => {
                }//保留點擊'確定'之後的callback屬性，方便後期擴展開發
              });
            }
          })


          this.axios.post(url, formData);
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