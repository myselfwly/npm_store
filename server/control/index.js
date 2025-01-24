const userControl = require('./user');
const groupControl = require('./group');
const packageAuthControl = require('./packageAuth');
const verdaccioControl = require('./verdaccio');

class ControlManager {
    constructor() {
        this.controls = {
            user: userControl,
            group: groupControl,
            packageAuth: packageAuthControl,
            verdaccio: verdaccioControl
        };
    }

    async initialize() {
        try {
            console.log('开始初始化控制层...');

            // 按顺序初始化各个控制层
            // 1. 用户组控制层
            console.log('初始化用户组控制层...');
            // console.log('组列表:', await this.controls.group.searchGroups(""));
            console.log('用户组控制层初始化完成');

            // 2. 用户控制层
            console.log('初始化用户控制层...');
            await this.controls.user.syncHtpasswdUsers();
            console.log('用户列表:', await this.controls.user.searchUsers(""));
            console.log('用户控制层初始化完成');

            // 3. 包权限控制层
            console.log('初始化包权限控制层...');
            await this.controls.packageAuth.syncAuthToConfig();
            console.log('包权限列表:', await this.controls.packageAuth.searchPackageAuth(""));
            console.log('包权限控制层初始化完成');

            console.log('所有控制层初始化完成');
            return true;
        } catch (error) {
            console.error('控制层初始化失败:', error);
            throw error;
        }
    }
}

module.exports = new ControlManager();