# 包权限管理模块

## API接口

### 1. 查找包权限（模糊查询）
```http
GET /api/packages/search?keyword=关键词
```

#### 请求参数
| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| keyword | string | 否 | 搜索关键词，支持包名搜索 |

#### 响应示例
```json
[
    {
        "name": "@lds/*",
        "access": ["admin", "lds"],
        "publish": ["admin", "lds"],
        "proxy": "npmjs"
    },
    {
        "name": "@basic/*",
        "access": ["admin"],
        "publish": ["admin"]
    }
]
```

### 2. 删除包权限
```http
DELETE /api/packages/:name
```

#### 请求参数
| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| name | string | 是 | 包名 |

#### 响应示例
```json
{
    "message": "包权限配置删除成功"
}
```

### 3. 新增包权限
```http
POST /api/packages
```

#### 请求体
```json
{
    "name": "@lds/*",
    "access": ["admin", "lds"],
    "publish": ["admin", "lds"],
    "proxy": "npmjs"
}
```

#### 响应示例
```json
{
    "name": "@lds/*",
    "access": ["admin", "lds"],
    "publish": ["admin", "lds"],
    "proxy": "npmjs"
}
```

### 4. 修改包权限配置
```http
PUT /api/packages/:name
```

#### 请求参数
| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| name | string | 是 | 包名 |

#### 请求体
```json
{
    "access": ["admin", "lds"],
    "publish": ["admin"],
    "proxy": "npmjs"
}
```

#### 响应示例
```json
{
    "name": "@lds/*",
    "access": ["admin", "lds"],
    "publish": ["admin"],
    "proxy": "npmjs"
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
- 400: 请求参数错误
- 404: 包权限配置不存在
- 500: 服务器内部错误

## 特殊说明
1. `**` 通配符配置：
   - 不能添加 `**` 配置
   - 不能修改 `**` 配置
   - 不能删除 `**` 配置
   - 系统会自动维护 `**` 配置为 `{ proxy: "npmjs" }`

2. 数据同步：
   - 包权限数据存储在 `data/packageAuth.json`
   - 系统会自动同步数据到 `config.yaml`
   - 同步时会保持 `**` 配置在最后 