Vue.component('user-management', {
    template: `
        <div class="user-management">
            <div class="search-bar">
                <el-row :gutter="20">
                    <el-col :span="18">
                        <el-input
                            v-model="keyword"
                            placeholder="搜索用户..."
                            @input="handleSearch"
                            clearable>
                            <i slot="prefix" class="el-icon-search"></i>
                        </el-input>
                    </el-col>
                </el-row>
            </div>

            <el-table :data="users" v-loading="loading">
                <el-table-column prop="username" label="用户名"></el-table-column>
                <el-table-column label="所属组">
                    <template slot-scope="scope">
                        <el-tag v-for="group in scope.row.groups" :key="group" type="info" class="mr-1">
                            {{ group }}
                        </el-tag>
                        <span v-if="!scope.row.groups.length" class="text-muted">无所属组</span>
                    </template>
                </el-table-column>
                <el-table-column label="下载权限">
                    <template slot-scope="scope">
                        <el-tag v-for="pkg in getUserAuth(scope.row, 'access')" :key="pkg" type="success" class="mr-1">
                            {{ pkg }}
                        </el-tag>
                        <span v-if="!getUserAuth(scope.row, 'access').length" class="text-muted">无权限</span>
                    </template>
                </el-table-column>
                <el-table-column label="安装权限">
                    <template slot-scope="scope">
                        <el-tag v-for="pkg in getUserAuth(scope.row, 'publish')" :key="pkg" type="warning" class="mr-1">
                            {{ pkg }}
                        </el-tag>
                        <span v-if="!getUserAuth(scope.row, 'publish').length" class="text-muted">无权限</span>
                    </template>
                </el-table-column>
                <el-table-column label="操作" width="200">
                    <template slot-scope="scope">
                        <el-button-group>
                            <el-button type="primary" size="small" @click="showEditDialog(scope.row)">
                                编辑
                            </el-button>
                            <el-button type="danger" size="small" @click="handleDelete(scope.row)">
                                删除
                            </el-button>
                        </el-button-group>
                    </template>
                </el-table-column>
            </el-table>

            <el-dialog title="编辑用户" :visible.sync="dialogVisible">
                <el-form :model="form" :rules="rules" ref="form">
                    <el-form-item label="所属组" prop="groups">
                        <el-select v-model="form.groups" multiple placeholder="选择用户组">
                            <el-option
                                v-for="group in groups"
                                :key="group.name"
                                :label="group.name"
                                :value="group.name">
                            </el-option>
                        </el-select>
                    </el-form-item>
                </el-form>
                <div slot="footer" class="dialog-footer">
                    <el-button @click="dialogVisible = false">取消</el-button>
                    <el-button type="primary" @click="handleSubmit">确定</el-button>
                </div>
            </el-dialog>
        </div>
    `,
    data() {
        return {
            users: [],
            groups: [],
            loading: false,
            keyword: '',
            dialogVisible: false,
            form: {
                username: '',
                groups: []
            },
            rules: {
                groups: [
                    { required: true, message: '请选择用户组', trigger: 'change' }
                ]
            }
        }
    },
    methods: {
        getUserAuth(user, type) {
            if (!user.auth || !user.auth.length) return [];
            return user.auth[0][type] || [];
        },
        async loadUsers() {
            this.loading = true;
            try {
                const response = await API.user.search(this.keyword);
                this.users = response.data;
            } catch (error) {
                this.$message.error('加载用户列表失败');
            } finally {
                this.loading = false;
            }
        },
        async loadGroups() {
            try {
                const response = await API.group.search();
                this.groups = response.data;
            } catch (error) {
                this.$message.error('加载组列表失败');
            }
        },
        handleSearch: _.debounce(function() {
            this.loadUsers();
        }, 300),
        showEditDialog(user) {
            this.form = {
                username: user.username,
                groups: [...user.groups]
            };
            this.dialogVisible = true;
        },
        async handleSubmit() {
            try {
                await this.$refs.form.validate();
                await API.user.updateGroups(this.form.username, this.form.groups);
                this.$message.success('更新成功');
                this.dialogVisible = false;
                this.loadUsers();
            } catch (error) {
                this.$message.error(error.response?.data?.error || '更新失败');
            }
        },
        async handleDelete(user) {
            try {
                await this.$confirm('确认删除该用户吗？', '提示', {
                    type: 'warning'
                });
                await API.user.delete(user.username);
                this.$message.success('删除成功');
                this.loadUsers();
            } catch (error) {
                if (error !== 'cancel') {
                    this.$message.error(error.response?.data?.error || '删除失败');
                }
            }
        }
    },
    created() {
        this.loadUsers();
        this.loadGroups();
    }
}); 