const fs = require('fs/promises');
const path = require('path');
const groupControl = require('./group.js');

const USER_FILE = path.join(__dirname, '../data/user.json');
const HTPASSWD_FILE = path.join(__dirname, '../verdacciorc/htpasswd');

class UserControl {
  constructor() {
    // 初始化时同步用户
    this.syncHtpasswdUsers().catch(error => {
      console.error('同步htpasswd用户失败:', error);
    });
  }

  async readGroup() {
    return await groupControl.readGroups();
  }
  
  async readUsers() {
    const content = await fs.readFile(USER_FILE, 'utf8');
    return JSON.parse(content);
  }

  async saveUsers(users) {
    await fs.writeFile(USER_FILE, JSON.stringify(users, null, 2));
  }
  
  async createUser(username=[]) {
    const users = await this.readUsers();
    username.forEach(user => {
      users.push({ username: user, groups: [] });
    });
    return users;
  }
  // 获取htpasswd中的用户名列表
  async getHtpasswdUsers() {
    try {
      const content = await fs.readFile(HTPASSWD_FILE, 'utf8');
      return content
        .split('\n')
        .filter(line => line.trim())  // 过滤空行
        .map(line => line.split(':')[0]); // 获取用户名部分
    } catch (error) {
      if (error.code === 'ENOENT') {
        return [];
      }
      throw error;
    }
  }
  // 删除htpasswd中的用户
  async deleteHtpasswdUsers(username) {
    const htpasswdUsers = await this.getHtpasswdUsers();
    if (htpasswdUsers.includes(username)) {
      const content = await fs.readFile(HTPASSWD_FILE, 'utf8');
      // 使用正则表达式匹配整行（包括末尾的换行符）
      const regex = new RegExp(`${username}:.*\\n`, 'g');
      const newContent = content.replace(regex, '');
      await fs.writeFile(HTPASSWD_FILE, newContent);
      return true;
    }
    return false;
  }
  // 同步htpasswd中的用户名列表
  async syncHtpasswdUsers() {
    const [users, htpasswdUsers] = await Promise.all([
      this.readUsers(),
      this.getHtpasswdUsers()
    ]);

    // 添加htpasswd中存在但user.json中不存在的用户
    htpasswdUsers.forEach(username => {
      if (!users.find(u => u.username === username)) {
        users.push({
          username,
          groups: []
        });
      }
    });

    // 只保留htpasswd中存在的用户
    const filteredUsers = users.filter(user => htpasswdUsers.includes(user.username));
    
    // 保存更新后的用户列表
    await this.saveUsers(filteredUsers);
    return filteredUsers;
  }
  // 查找用户（模糊搜索）
  async searchUsers(keyword = '') {
    const users = await this.readUsers();
    const userResult = users.filter(user =>
      user.username.toLowerCase().includes(keyword.toLowerCase()) ||
      user.groups.some(group =>
        group.toLowerCase().includes(keyword.toLowerCase())
      )
    );
    // 这里使用 async/await 是合理的,因为:
    // 1. 需要等待每个用户的权限信息都获取完成
    // 2. Promise.all 可以并行处理多个异步操作
    // 3. groupControl.getGroupAuth 是异步方法
    const result = await Promise.all(userResult.map(async user => {
      const auth = await Promise.all(user.groups.map(group => groupControl.getGroupAuth(group)));
      return {
        ...user,
        auth
      };
    }));
    return result;
  }

  // 删除用户
  async deleteUser(username) {
    const users = await this.readUsers();
    const index = users.findIndex(u => u.username === username);
    if (index === -1) {
      throw new Error('用户不存在');
    }

    // 检查用户是否在htpasswd中
    const htpasswdUsers = await this.getHtpasswdUsers();
    if (htpasswdUsers.includes(username)) {
      throw new Error('不能删除htpasswd中存在的用户');
    }

    users.splice(index, 1);
    await this.deleteHtpasswdUsers(username);
    await this.saveUsers(users);
  }

  // 修改用户分组
  async updateUserGroups(username, groups) {
    const users = await this.readUsers();
    const index = users.findIndex(u => u.username === username);
    if (index === -1) {
      throw new Error('用户不存在');
    }

    users[index].groups = groups;
    await this.saveUsers(users);
    // 步用户
    return await this.syncHtpasswdUsers();
  }
}

module.exports = new UserControl(); 