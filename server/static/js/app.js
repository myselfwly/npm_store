new Vue({
    el: '#app',
    data: {
        activeMenu: 'users',
        loading: false
    },
    computed: {
        currentComponent() {
            return {
                'users': 'user-management',
                'groups': 'group-management',
                'packages': 'package-management'
            }[this.activeMenu];
        }
    },
    methods: {
        handleMenuSelect(index) {
            this.activeMenu = index;
        },
        async startServer() {
            this.loading = true;
            try {
                const response = await API.server.start();
                if (response.data.success) {
                    this.$message.success('服务启动成功');
                } else {
                    this.$message.error(response.data.message);
                }
            } catch (error) {
                this.$message.error(error.response?.data?.message || '服务启动失败');
            } finally {
                this.loading = false;
            }
        },
        async stopServer() {
            this.loading = true;
            try {
                const response = await API.server.stop();
                if (response.data.success) {
                    this.$message.success('服务停止成功');
                } else {
                    this.$message.error(response.data.message);
                }
            } catch (error) {
                this.$message.error(error.response?.data?.message || '服务停止失败');
            } finally {
                this.loading = false;
            }
        },
        async restartServer() {
            this.loading = true;
            try {
                const response = await API.server.restart();
                if (response.data.success) {
                    this.$message.success('服务重启成功');
                } else {
                    this.$message.error(response.data.message);
                }
            } catch (error) {
                this.$message.error(error.response?.data?.message || '服务重启失败');
            } finally {
                this.loading = false;
            }
        }
    }
}); 