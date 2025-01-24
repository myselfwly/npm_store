const fs = require('fs/promises');
const path = require('path');
const yaml = require('js-yaml');
const groupControl = require('./group.js');
const { uniqueArray } = require('../lib/tools/base.js');

const PACKAGE_AUTH_FILE = path.join(__dirname, '../data/packageAuth.json');
const CONFIG_FILE = path.join(__dirname, '../verdacciorc/config.yaml');
const PACKAGE_LIST_FILE = path.join(__dirname, '../verdacciorc/storage/verdaccio-db.json');
class PackageAuthControl {
  constructor() {
    // 初始化时同步一次
    this.syncAuthToConfig().catch(error => {
      console.error('同步到config.yaml失败:', error);
    });
  }
  async readPackageList() {
    const content = await fs.readFile(PACKAGE_LIST_FILE, 'utf8');
    return JSON.parse(content)?.list || [];
  }
  async readPackageAuth() {
    const content = await fs.readFile(PACKAGE_AUTH_FILE, 'utf8');
    return JSON.parse(content);
  }

  async savePackageAuth(packages) {
    await fs.writeFile(PACKAGE_AUTH_FILE, JSON.stringify(packages, null, 2));
  }

  // 读取config.yaml
  async readConfig() {
    const content = await fs.readFile(CONFIG_FILE, 'utf8');
    return yaml.load(content);
  }

  // 保存config.yaml
  async saveConfig(config) {
    const yamlStr = yaml.dump(config, {
      indent: 2,
      lineWidth: -1
    });
    await fs.writeFile(CONFIG_FILE, yamlStr, 'utf8');
  }

  // 将packageAuth同步到config.yaml
  async syncAuthToConfig() {
    const [packages, config] = await Promise.all([
      this.readPackageAuth(),
      this.readConfig()
    ]);

    // 更新packages配置
    config.packages = {};

    // 添加所有包配置
    for (const pkg of packages) {
      if (pkg.name === '**') continue; // 跳过**配置
      const { name, access = [], publish = []} = pkg;
      const authInfo = {
        access,
        publish
      };
      // 去重 authInfo.access 和 authInfo.publish
      authInfo.access = uniqueArray(authInfo.access).filter(item => item?.length > 0);
      authInfo.publish = uniqueArray(authInfo.publish).filter(item => item?.length > 0);
      const authInfoAccessUser = await Promise.all(authInfo.access.map((group) => {
        return groupControl.getGroupMembers(group);
      }));
      const authInfoPublishUser = await Promise.all(authInfo.publish.map((group) => {
        return groupControl.getGroupMembers(group);
      }));
      const accessUsers = uniqueArray(authInfoAccessUser.filter(item => item?.length > 0))
      const publishUsers = uniqueArray(authInfoPublishUser.filter(item => item?.length > 0))
      if (accessUsers.length <= 0) {
        accessUsers.push('$all')
      }
      if (publishUsers.length <= 0) {
        publishUsers.push('$all')
      }
      config.packages[name] = {
        ...authInfo,
        access: accessUsers.join(' '),
        publish: publishUsers.join(' ')
      };
    }

    // 添加固定的**配置
    config.packages['**'] = {
      proxy: 'npmjs',
      access: '$all',
      publish: '$all'
    };

    await this.saveConfig(config);
  }

  // 查找包权限（根据name模糊查询）
  async searchPackageAuth(keyword = '') {
    const packages = await this.readPackageAuth();
    return packages.filter(pkg =>
      pkg.name.toLowerCase().includes(keyword.toLowerCase())
    );
  }

  // 删除包权限
  async deletePackageAuth(name) {
    const packages = await this.readPackageAuth();
    const index = packages.findIndex(pkg => pkg.name === name);
    if (index === -1) {
      throw new Error('包权限配置不存在');
    }

    // 不允许删除通配符配置
    if (name === '**') {
      throw new Error('不能删除通配符配置');
    }

    packages.splice(index, 1);
    await this.savePackageAuth(packages);
    await this.syncAuthToConfig();
    return true;
  }

  // 新增包权限
  async addPackageAuth(packageData) {
    const { name, access = [], publish = [], proxy = null } = packageData;
    if (!name) {
      throw new Error('包名不能为空');
    }

    // 不允许添加**配置
    if (name === '**') {
      throw new Error('不能添加通配符配置');
    }

    const packages = await this.readPackageAuth();

    // 检查包名是否已存在
    if (packages.find(pkg => pkg.name === name)) {
      throw new Error('包权限配置已存在');
    }

    const newPackage = {
      name,
      access,
      publish,
      proxy
    };

    packages.push(newPackage);
    await this.savePackageAuth(packages);
    await this.syncAuthToConfig();
    return newPackage;
  }

  // 修改包权限配置
  async updatePackageAuth(name, packageData) {
    const packages = await this.readPackageAuth();
    const index = packages.findIndex(pkg => pkg.name === name);
    if (index === -1) {
      throw new Error('包权限配置不存在');
    }

    // 不允许修改通配符配置
    if (name === '**') {
      throw new Error('不能修改通配符配置');
    }

    // 不允许修改包名
    const updatedPackage = {
      ...packages[index],
      ...packageData,
      name: packages[index].name
    };

    packages[index] = updatedPackage;
    await this.savePackageAuth(packages);
    await this.syncAuthToConfig();
    return updatedPackage;
  }
}

module.exports = new PackageAuthControl(); 