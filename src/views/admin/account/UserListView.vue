<template>
    <div>
        <!-- 頂部麵包屑標識與導航 -->
        <el-breadcrumb separator-class="el-icon-arrow-right"
                       style="font-size: 16px;">
            <el-breadcrumb-item :to="{ path: '/' }">
                <i class="el-icon-s-promotion"></i> 後臺管理
            </el-breadcrumb-item>
            <el-breadcrumb-item class="el-breadcrumb__inner is-link">用戶管理</el-breadcrumb-item>
        </el-breadcrumb>
        <el-divider></el-divider>

        <!-- 操作區域 -->
        <div style="margin: 0 0 20px 0;">
            <el-button type="primary" size="medium"
                       @click="$router.push('/admin/account/users/add-new')">添加用戶
            </el-button>
        </div>

        <!-- 數據表格 -->
        <el-table :data="tableData" border style="width: 100%">
            <el-table-column prop="id" label="ID" width="60" align="center"></el-table-column>
            <el-table-column label="頭像" width="60" align="center">
                <template slot-scope="scope">
                    <el-avatar :size="30" :src="scope.row.avatar"></el-avatar>
                </template>
            </el-table-column>
            <el-table-column prop="username" label="用戶名稱" width="120" header-align="center"
                             :show-overflow-tooltip="true"></el-table-column>
            <el-table-column prop="nickname" label="用戶暱稱" width="100" header-align="center"
                             :show-overflow-tooltip="true"></el-table-column>
            <el-table-column prop="phone" label="手機號碼" width="120" align="center"
                             :show-overflow-tooltip="true"></el-table-column>
            <el-table-column prop="email" label="電子信箱" width="250" header-align="center"
                             :show-overflow-tooltip="true"></el-table-column>
            <el-table-column prop="description" label="簡介" header-align="center"
                             :show-overflow-tooltip="true"></el-table-column>
            <el-table-column label="是否啓用" width="120" align="center">
                <template slot-scope="scope">
                    <el-switch
                            @change="toggleEnable(scope.row)"
                            v-model="scope.row.enable"
                            :active-value="1"
                            :inactive-value="0"
                            active-color="#13ce66"
                            inactive-color="#999">
                    </el-switch>
                </template>
            </el-table-column>
            <el-table-column label="操作" width="100" align="center">
                <template v-slot="scope">
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
                    :hide-on-single-page="true"
                    :page-size="pageSize"
                    :current-page="currentPage"
                    layout="total, prev, pager, next"
                    :total="total">
            </el-pagination>
        </div>

        <!-- 修改數據的表單 -->
        <el-dialog title="編輯用戶數據" :visible.sync="editFormVisible">
            <el-form :model="editForm" :rules="editRules" label-width="120px">
                <el-form-item label="頭像" prop="avatar">
                    <el-input v-model="editForm.avatar"></el-input>
                </el-form-item>
                <el-form-item label="用戶名稱" prop="username">
                    <el-input v-model="editForm.username"></el-input>
                </el-form-item>
                <el-form-item label="用戶暱稱" prop="nickname">
                    <el-input v-model="editForm.nickname"></el-input>
                </el-form-item>
                <el-form-item label="手機號碼" prop="phone">
                    <el-input v-model="editForm.phone"></el-input>
                </el-form-item>
                <el-form-item label="電子信箱" prop="email">
                    <el-input v-model="editForm.email"></el-input>
                </el-form-item>
                <el-form-item label="簡介" prop="description">
                    <el-input v-model="editForm.description"></el-input>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="editFormVisible = false">取 消</el-button>
                <el-button type="primary" @click="handleEdit">確 定</el-button>
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
                //編輯對話框相關數據
                editFormVisible: false,
                editForm: {
                    id: "",
                    username: '',
                    nickname: '',
                    description: '',
                    avatar: '',
                    email: '',
                    phone: '',
                },
                //編輯表單規則
                editRules: {
                    username: [
                        {required: true, message: '請輸入用戶名稱', trigger: 'blur'},
                        {min: 4, max: 15, message: '長度在 4 到 15 個字符', trigger: 'blur'}
                    ],
                    nickname: [
                        {required: true, message: '請輸入用戶暱稱', trigger: 'blur'},
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
                        {required: true, message: '請輸入個人簡介', trigger: 'blur'},
                        {min: 2, max: 35, message: '長度在 4 到 35 個字符', trigger: 'blur'}
                    ]
                }
            }
        },
        methods: {
            // 測試發送一個list
            // sendList() {
            //     let username = 'UN-test111-UN', password = 'PD-123456-PD';
            //
            //     let somethingList = [
            //         {question: 1, answer: '1111'},
            //         {question: 2, answer: '2222'},
            //         {question: 3, answer: '3333'},
            //         {question: 4, answer: '4444'}
            //     ]
            //
            //     let box = {
            //         username: username,
            //         password: password,
            //         somethingList: somethingList,
            //     }
            //
            //     let url = 'http://localhost:9080/account/users/getSomeList';
            //     console.log('url = ' + url);
            //
            //     let formData = JSON.stringify(box);
            //     this.axios
            //         .create({
            //             'headers':
            //                 {
            //                     'Authorization': localStorage.getItem("localJwt"),
            //                     'Content-Type': 'application/json'
            //                 }
            //         })
            //         .post(url, formData)
            // },

            //切換啓用狀態
            toggleEnable(user) {
                let enableText = ['禁用', '啓用'];
                let url = 'http://localhost:9080/account/users/' + user.id;
                user.enable == 1 ? url += '/enable' : url += '/disable';
                console.log('url = ' + url);

                this.axios
                    .create({'headers': {'Authorization': localStorage.getItem("localJwt")}})
                    .post(url).then((response) => {
                    let jsonResult = response.data;
                    if (jsonResult.stateCode == 20000) {
                        this.$message({
                            message: '將【' + user.username + '】的啓用狀態修改爲【' + enableText[enable] + '】成功！',
                            type: 'success'
                        });
                        this.loadUserList();
                    } else if (jsonResult.stateCode == 40400) {
                        this.$alert(jsonResult.message, '操作失敗', {
                            confirmButtonText: '確定',
                            callback: action => {
                                this.loadUserList();
                            }
                        });
                    }
                    else {
                        this.$alert(jsonResult.message, '操作失敗', {
                            confirmButtonText: '確定',
                            callback: action => {
                            }
                        });
                    }
                }).catch(err => {
                    let message = '服務器響應錯誤！';
                    this.$alert(message, '操作失敗', {
                        confirmButtonText: '確定',
                        callback: action => {
                        }
                    });
                });
            },
            //彈出修改對話框
            openEditDialog(tableItem) {
                let url = 'http://localhost:9080/account/users/' + tableItem.id;
                console.log('url = ' + url);
                /**
                 * 發出【根據ID查詢用戶】的請求
                 */
                this.axios
                    .create({'headers': {'Authorization': localStorage.getItem("localJwt")}})
                    .get(url).then((response) => {
                    let jsonResult = response.data;
                    if (jsonResult.stateCode == 20000) {
                        //請求完成後應該刷新頁面
                        this.editForm = jsonResult.data;
                        this.editFormVisible = true;
                    } else {
                        let title = '操作失敗';
                        this.$alert(jsonResult.message, title, {
                            confirmButtonText: '確定',
                            callback: action => {
                                //請求完成後應該刷新頁面
                                this.loadUserList();
                            }
                        });
                    }
                });
            },
            //執行修改用戶數據
            handleEdit() {
                let url = 'http://localhost:9080/account/users/' + this.editForm.id + '/update/info';
                console.log('url = ' + url);
                let formData = this.qs.stringify(this.editForm);
                console.log('formData = ' + formData);
                /**
                 * 發出【修改用戶】的請求
                 */
                this.axios
                    .create({'headers': {'Authorization': localStorage.getItem("localJwt")}})
                    .post(url, formData).then((response) => {
                    let jsonResult = response.data;
                    if (jsonResult.stateCode == 20000) {
                        this.$message({
                            message: '修改用戶成功！',
                            type: 'success'
                        });
                        this.editFormVisible = false;
                        this.loadUserList();
                    } else if (jsonResult.stateCode == 40400) {
                        let title = '操作失敗';
                        this.$alert(jsonResult.message, title, {
                            confirmButtonText: '確定',
                            callback: action => {
                                this.editFormVisible = false;//修改完畢關閉修改頁面
                                this.loadUserList();//修改完畢刷新標籤列表
                            }
                        });
                    } else {//通常指40900修改錯誤，此時代表更新失敗，不用刷新頁面和退出編輯頁面
                        let title = '操作失败';
                        this.$alert(jsonResult.message, title, {
                            confirmButtonText: '確定',
                            callback: action => {
                            }
                        });
                    }
                });
            },
            //彈出刪除確認框
            openDeleteConfirm(user) {
                let message = '此操作將永久刪除【' + user.username + '】用戶，是否繼續？';
                this.$confirm(message, '提示', {
                    confirmButtonText: '確定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    this.handleDelete(user);
                }).catch(() => {
                });
            },
            //執行刪除用戶數據
            handleDelete(user) {
                let url = 'http://localhost:9080/account/users/' + user.id + '/delete';
                console.log('url = ' + url);

                this.axios
                    .create({'headers': {'Authorization': localStorage.getItem("localJwt")}})
                    .post(url).then((response) => {
                    let jsonResult = response.data;
                    if (jsonResult.stateCode == 20000) {
                        this.$message({
                            message: '刪除【' + user.username + '】用戶成功！',
                            type: 'success'
                        });
                        this.loadUserList();
                    } else if (jsonResult.stateCode == 40400) {
                        this.$alert(jsonResult.message, '操作失敗', {
                            confirmButtonText: '確定',
                            callback: action => {
                                this.loadUserList();
                            }
                        });
                    } else {
                        this.$alert(jsonResult.message, '操作失敗', {
                            confirmButtonText: '確定',
                            callback: action => {
                            }
                        });
                    }
                }).catch(err => {
                    let message = '服務器響應錯誤！';
                    this.$alert(message, '操作失敗', {
                        confirmButtonText: '確定',
                        callback: action => {
                        }
                    });
                });
            },
            //切換分頁
            changePage(page) {
                this.$router.replace('?page=' + page);
                this.loadUserList();
            },
            //加載用戶列表
            loadUserList() {
                let page = this.$router.currentRoute.query.page;
                if (!page) page = 1;

                let url = 'http://localhost:9080/account/users?page=' + page;
                console.log('url = ' + url);

                this.axios
                    .create({'headers': {'Authorization': localStorage.getItem("localJwt")}})
                    .get(url).then((response) => {
                    let jsonResult = response.data;
                    if (jsonResult.stateCode == 20000) {
                        this.tableData = jsonResult.data.list;
                        this.currentPage = jsonResult.data.currentPage;
                        this.pageSize = jsonResult.data.pageSize;
                        this.total = jsonResult.data.total;
                    }
                }).catch(err => {
                    let message = '服務器響應錯誤！';
                    this.$alert(message, '操作失敗', {
                        confirmButtonText: '確定',
                        callback: action => {
                        }
                    });
                });
            },
        }
        ,
        mounted() {
            this.loadUserList();
            // this.sendList();
        }
    }
</script>

<style>
    .el-icon-s-promotion {
        color: white;
    }

    .el-breadcrumb__item:last-child .el-breadcrumb__inner, .el-breadcrumb__item:last-child .el-breadcrumb__inner a, .el-breadcrumb__item:last-child .el-breadcrumb__inner a:hover, .el-breadcrumb__item:last-child .el-breadcrumb__inner:hover {
        font-weight: 400;
        color: #ffffff;
        cursor: text;
    }
</style>
