# 用户管理模块

## API接口

### 1. 查找用户（模糊搜索）
```http
GET /api/users/search?keyword=关键词
```

#### 请求参数
| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| keyword | string | 否 | 搜索关键词，支持用户名和组名搜索 |

#### 响应示例
```json
[
    {
        "username": "lds-wangliuyuan",
        "groups": ["admin", "lds"]
    },
    {
        "username": "wly",
        "groups": ["developer"],
        "auth": {
          "access": ["@lds/cef-bridge"],
          "publish": ["@lds/cef-bridge"]
        }
    }
]
```

### 2. 删除用户
```http
DELETE /api/users/:username
```

#### 请求参数
| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| username | string | 是 | 用户名 |

#### 响应示例
```json
{
    "message": "用户删除成功"
}
```

### 3. 修改用户分组
```http
PUT /api/users/:username/groups
```

#### 请求参数
| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| username | string | 是 | 用户名 |
| groups | array | 是 | 新的组列表 |

#### 请求体示例
```json
{
    "groups": ["admin", "developer"]
}
```

#### 响应示例
```json
{
    "username": "lds-wangliuyuan",
    "groups": ["admin", "developer"]
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
- 404: 用户不存在
- 500: 服务器内部错误

## 数据同步
- 用户数据存储在 `data/user.json`
- 用户认证信息存储在 `htpasswd`
- 系统会自动同步两个文件的数据 