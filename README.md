# 环境准备

1. 安装nodejs
[nodejs](https://nodejs.org/zh-cn/)
1. 安装pm2
```
npm install -g pm2
```
1. 安装pm2-windows-service
```
npm install -g pm2-windows-service
```
1. 注册pm2-windows-service
```
pm2-startup install
```
# 依赖安装
```
cd server
npm install
```
# 启动服务
```
cd server
npm run start
```
# 停止服务
```
pm2 stop verdaccio_control verdaccio_core
```
# 重启服务
```
pm2 restart verdaccio_control
```
# 查看服务状态
```
pm2 list
#or
pm2 status
```
# 查看服务日志
```
pm2 logs verdaccio_control
#or
pm2 logs verdaccio_core
```
# 查看服务配置
```
pm2 show verdaccio_control
#or
pm2 show verdaccio_core
```
# 移除服务
```
pm2 delete verdaccio_control
#or
pm2 delete verdaccio_core
```
# 验证服务

## 访问verdaccio
```
http://[ip]:4000/
```
## 访问verdaccio-control
```
http://[ip]:3000/
```
