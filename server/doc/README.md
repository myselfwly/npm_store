# Verdaccio 服务器文档

## 项目结构
```
server/
  ├── api/          # API接口层
  ├── control/      # 业务控制层
  ├── data/         # 数据存储
  └── doc/          # 文档
```

## 模块说明

### 1. 用户管理模块
- [用户管理文档](./user.md)
- 用户查询、删除、修改分组等功能
- 支持与htpasswd文件同步

### 2. 组管理模块
- [组管理文档](./group.md)
- 组的增删改查功能
- 组成员管理

### 3. 包权限管理模块
- [包权限管理文档](./packageAuth.md)
- 包权限配置的增删改查
- 支持与config.yaml同步

### 4. Verdaccio服务管理模块
- [服务管理文档](./verdaccio.md)
- 服务的启动、停止、重启功能
- PM2进程管理

## 技术栈
- Node.js
- Express
- PM2
- Verdaccio 