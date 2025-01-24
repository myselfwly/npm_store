Vue.component('group-management', {
    template: `
        <div class="group-management">
            <div class="search-bar">
                <el-row :gutter="20">
                    <el-col :span="18">
                        <el-input
                            v-model="keyword"
                            placeholder="搜索组..."
                            @input="handleSearch"
                            clearable>
                            <i slot="prefix" class="el-icon-search"></i>
                        </el-input>
                    </el-col>
                    <el-col :span="6">
                        <el-button type="primary" @click="showCreateDialog">
                            创建组
                        </el-button>
                    </el-col>
                </el-row>
            </div>

            <el-table :data="groups" v-loading="loading">
                <el-table-column prop="name" label="组名"></el-table-column>
                <el-table-column prop="description" label="描述"></el-table-column>
                <el-table-column prop="created_at" label="创建时间"></el-table-column>
                <el-table-column label="成员">
                    <template slot-scope="scope">
                        <el-popover
                            placement="top"
                            width="200"
                            trigger="hover"
                            :content="scope.row.members ? scope.row.members.join(', ') : '无成员'">
                            <el-tag slot="reference">
                                {{ scope.row.members ? scope.row.members.length : 0 }} 个成员
                            </el-tag>
                        </el-popover>
                    </template>
                </el-table-column>
                <el-table-column label="操作" width="150">
                    <template slot-scope="scope">
                        <el-button type="danger" size="small" @click="handleDelete(scope.row)">
                            删除
                        </el-button>
                    </template>
                </el-table-column>
            </el-table>

            <el-dialog title="创建组" :visible.sync="dialogVisible">
                <el-form :model="form" :rules="rules" ref="form">
                    <el-form-item label="组名" prop="name">
                        <el-input v-model="form.name"></el-input>
                    </el-form-item>
                    <el-form-item label="描述" prop="description">
                        <el-input type="textarea" v-model="form.description"></el-input>
                    </el-form-item>
                </el-form>
                <div slot="footer" class="dialog-footer">
                    <el-button @click="dialogVisible = false">取消</el-button>
                    <el-button type="primary" @click="handleCreate">确定</el-button>
                </div>
            </el-dialog>
        </div>
    `,
    data() {
        return {
            groups: [],
            loading: false,
            keyword: '',
            dialogVisible: false,
            form: {
                name: '',
                description: ''
            },
            rules: {
                name: [
                    { required: true, message: '请输入组名', trigger: 'blur' },
                    { min: 2, max: 20, message: '长度在 2 到 20 个字符', trigger: 'blur' }
                ],
                description: [
                    { required: true, message: '请输入描述', trigger: 'blur' }
                ]
            }
        }
    },
    methods: {
        async loadGroups() {
            this.loading = true;
            try {
                const response = await API.group.search(this.keyword);
                this.groups = response.data;
                // 加载每个组的成员
                await Promise.all(this.groups.map(async group => {
                    const membersResponse = await API.group.getMembers(group.name);
                    this.$set(group, 'members', membersResponse.data);
                }));
            } catch (error) {
                this.$message.error('加载组列表失败');
            } finally {
                this.loading = false;
            }
        },
        handleSearch: _.debounce(function() {
            this.loadGroups();
        }, 300),
        showCreateDialog() {
            this.form = {
                name: '',
                description: ''
            };
            this.dialogVisible = true;
        },
        async handleCreate() {
            try {
                await this.$refs.form.validate();
                await API.group.create(this.form);
                this.$message.success('创建成功');
                this.dialogVisible = false;
                this.loadGroups();
            } catch (error) {
                if (error.response) {
                    this.$message.error(error.response.data.error || '创建失败');
                }
            }
        },
        async handleDelete(group) {
            try {
                await this.$confirm('确认删除该组吗？', '提示', {
                    type: 'warning'
                });
                await API.group.delete(group.name);
                this.$message.success('删除成功');
                this.loadGroups();
            } catch (error) {
                if (error !== 'cancel') {
                    this.$message.error(error.response?.data?.error || '删除失败');
                }
            }
        }
    },
    created() {
        this.loadGroups();
    }
}); 