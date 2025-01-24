const fs = require('fs/promises');
const path = require('path');

const GROUP_FILE = path.join(__dirname, '../data/group.json');
const AUTH_FILE = path.join(__dirname, '../data/packageAuth.json');
const USER_FILE = path.join(__dirname, '../data/user.json');

class GroupControl {
  async readGroups() {
    const content = await fs.readFile(GROUP_FILE, 'utf8');
    return JSON.parse(content);
  }

  async readAuth() {
    const content = await fs.readFile(AUTH_FILE, 'utf8');
    return JSON.parse(content);
  }

  async readUser() {
    const content = await fs.readFile(USER_FILE, 'utf8');
    return JSON.parse(content);
  }

  async saveGroups(groups) {
    await fs.writeFile(GROUP_FILE, JSON.stringify(groups, null, 4));
  }

  async addGroup(name, description) {
    const groups = await this.readGroups();
    if (groups.find(g => g.name === name)) {
      throw new Error('Group already exists');
    }

    const newGroup = {
      name,
      description,
      created_at: new Date().toISOString().split('T')[0]
    };

    groups.push(newGroup);
    await this.saveGroups(groups);
    return newGroup;
  }

  async deleteGroup(name) {
    const groups = await this.readGroups();
    const index = groups.findIndex(g => g.name === name);
    if (index === -1) {
      throw new Error('Group not found');
    }

    groups.splice(index, 1);
    await this.saveGroups(groups);
  }

  async searchGroups(keyword = '') {
    const groups = await this.readGroups();
    const result = await Promise.all(groups.filter(g =>
      g.name.toLowerCase().includes(keyword.toLowerCase()) ||
      g.description.toLowerCase().includes(keyword.toLowerCase())
    ).map(async group => {
      // 获取组成员
      const members = await this.getGroupMembers(group.name);
      // 获取组权限
      const auth = await this.getGroupAuth(group.name);

      return {
        ...group,
        members,
        auth
      };
    }));

    return result;
  }

  async getGroupMembers(groupName) {
    
    // 读取user.json文件获取组成员信息
    const userData = await this.readUser();

    // 过滤出属于指定组的用户，只返回用户名
    const members = userData.filter((user) => user.groups.includes(groupName))
      .map((user) => user.username);
    return members;
  }

  async getGroupAuth(groupName) {
    const authData = await this.readAuth();
    let auth = {
      access: [],
      publish: []
    };

    authData.forEach(pkg => {
      if (Array.isArray(pkg.access) && (pkg.access.includes(groupName) || pkg.access.includes("$all"))) {
        auth.access.push(pkg.name);
      }
      if (Array.isArray(pkg.publish) && (pkg.publish.includes(groupName) || pkg.publish.includes("$all"))) {
        auth.publish.push(pkg.name);
      }
    });

    return auth;
  }
}

module.exports = new GroupControl();