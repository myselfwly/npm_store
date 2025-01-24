# Verdaccio 服务管理模块

## API接口

### 1. 启动服务
```http
GET /api/verdaccio/start
```

#### 响应示例
```json
{
    "message": "verdaccio启动成功"
}
```

### 2. 停止服务
```http
GET /api/verdaccio/stop
```

#### 响应示例
```json
{
    "message": "verdaccio停止成功"
}
```

### 3. 重启服务
```http
GET /api/verdaccio/restart
```

#### 响应示例
```json
{
    "message": "verdaccio重启成功"
}
```

## 错误处理
所有接口在发生错误时会返回以下格式：
```json
{
    "error": "错误信息"
}
```

常见错误：
- 500: 服务操作失败

## 服务配置
服务通过 PM2 进行管理，配置文件位于 `ecosystem.config.js`：

```javascript
{
  apps: [{
    name: "verdaccio",
    interpreter: "node",
    script: "verdaccio",
    args: "--config ./config.yaml",
    error_file: './logs/verdaccio-error.log',
    out_file: './logs/verdaccio-out.log',
    log_date_format: 'YYYY-MM-DD HH:mm Z',
    exec_mode: "fork",
    instances: 1,
    autorestart: true,
    watch: false,
    max_memory_restart: "1G"
  }]
}
```

## 特殊说明
1. 服务操作前的准备：
   - 启动/重启前会同步用户数据
   - 启动/重启前会同步包权限配置

2. 日志文件：
   - 错误日志：`logs/verdaccio-error.log`
   - 输出日志：`logs/verdaccio-out.log`

3. 自动重启：
   - 服务异常退出时自动重启
   - 内存超过1G时自动重启 