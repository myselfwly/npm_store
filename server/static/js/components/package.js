Vue.component('package-management', {
    template: `
        <div class="package-management">
            <div class="search-bar">
                <el-row :gutter="20">
                    <el-col :span="18">
                        <el-input
                            v-model="keyword"
                            placeholder="搜索包..."
                            @input="handleSearch"
                            clearable>
                            <i slot="prefix" class="el-icon-search"></i>
                        </el-input>
                    </el-col>
                    <el-col :span="6">
                        <el-button type="primary" @click="showCreateDialog">
                            添加包权限
                        </el-button>
                    </el-col>
                </el-row>
            </div>

            <el-table :data="packages" v-loading="loading">
                <el-table-column prop="name" label="包名"></el-table-column>
                <el-table-column label="访问权限">
                    <template slot-scope="scope">
                        <el-tag v-for="group in scope.row.access" :key="group" type="success">
                            {{ group }}
                        </el-tag>
                    </template>
                </el-table-column>
                <el-table-column label="发布权限">
                    <template slot-scope="scope">
                        <el-tag v-for="group in scope.row.publish" :key="group" type="warning">
                            {{ group }}
                        </el-tag>
                    </template>
                </el-table-column>
                <el-table-column prop="proxy" label="代理"></el-table-column>
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

            <el-dialog :title="dialogTitle" :visible.sync="dialogVisible">
                <el-form :model="form" :rules="rules" ref="form">
                    <el-form-item label="包名" prop="name" v-if="!isEdit">
                        <el-input v-model="form.name" placeholder="例如：@lds/*"></el-input>
                    </el-form-item>
                    <el-form-item label="访问权限" prop="access">
                        <el-select v-model="form.access" multiple placeholder="选择可访问的组">
                            <el-option
                                v-for="group in groups"
                                :key="group.name"
                                :label="group.name"
                                :value="group.name">
                            </el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="发布权限" prop="publish">
                        <el-select v-model="form.publish" multiple placeholder="选择可发布的组">
                            <el-option
                                v-for="group in groups"
                                :key="group.name"
                                :label="group.name"
                                :value="group.name">
                            </el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="代理" prop="proxy">
                        <el-input v-model="form.proxy" placeholder="例如：npmjs"></el-input>
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
            packages: [],
            groups: [],
            loading: false,
            keyword: '',
            dialogVisible: false,
            isEdit: false,
            form: {
                name: '',
                access: [],
                publish: [],
                proxy: ''
            },
            rules: {
                name: [
                    { required: true, message: '请输入包名', trigger: 'blur' }
                ]
            }
        }
    },
    computed: {
        dialogTitle() {
            return this.isEdit ? '编辑包权限' : '添加包权限';
        }
    },
    methods: {
        async loadPackages() {
            this.loading = true;
            try {
                const response = await API.package.search(this.keyword);
                this.packages = response.data;
            } catch (error) {
                this.$message.error('加载包列表失败');
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
            this.loadPackages();
        }, 300),
        showCreateDialog() {
            this.isEdit = false;
            this.form = {
                name: '',
                access: [],
                publish: [],
                proxy: ''
            };
            this.dialogVisible = true;
        },
        showEditDialog(pkg) {
            this.isEdit = true;
            this.form = {
                name: pkg.name,
                access: [...pkg.access],
                publish: [...pkg.publish],
                proxy: pkg.proxy || ''
            };
            this.dialogVisible = true;
        },
        async handleSubmit() {
            try {
                await this.$refs.form.validate();
                if (this.isEdit) {
                    await API.package.update(encodeURIComponent(this.form.name), this.form);
                } else {
                    await API.package.create(this.form);
                }
                this.$message.success(this.isEdit ? '更新成功' : '创建成功');
                this.dialogVisible = false;
                this.loadPackages();
            } catch (error) {
                this.$message.error(error.response?.data?.error || (this.isEdit ? '更新失败' : '创建失败'));
            }
        },
        async handleDelete(pkg) {
            try {
                await this.$confirm('确认删除该包权限配置吗？', '提示', {
                    type: 'warning'
                });
                await API.package.delete(encodeURIComponent(pkg.name));
                this.$message.success('删除成功');
                this.loadPackages();
            } catch (error) {
                if (error !== 'cancel') {
                    this.$message.error(error.response?.data?.error || '删除失败');
                }
            }
        }
    },
    created() {
        this.loadPackages();
        this.loadGroups();
    }
}); 