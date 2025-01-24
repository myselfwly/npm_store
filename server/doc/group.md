# 组管理模块

## API接口

### 1. 新增组
```http
POST /api/groups
```

#### 请求体
```json
{
    "name": "组名",
    "description": "组描述"
}
```

#### 响应示例
```json
{
    "name": "developer",
    "description": "开发者组",
    "created_at": "2024-01-23"
}
```

### 2. 删除组
```http
DELETE /api/groups/:name
```

#### 请求参数
| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| name | string | 是 | 组名 |

#### 响应示例
```json
{
    "message": "组删除成功"
}
```

### 3. 查找组（模糊查询）
```http
GET /api/groups/search?keyword=关键词
```

#### 请求参数
| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| keyword | string | 否 | 搜索关键词，支持组名和描述搜索 |

#### 响应示例
```json
[
    {
        "name": "admin",
        "description": "管理员组",
        "created_at": "2024-01-23",
        "members": ["lds-wangliuyuan"],
        "auth": {
            "access": ["@lds/*", "@basic/*"],
            "publish": ["@lds/*"]
        }
    }
]
```

### 4. 查找组成员
```http
GET /api/groups/:name/members
```

#### 请求参数
| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| name | string | 是 | 组名 |

#### 响应示例
```json
[
    "lds-wangliuyuan",
    "wly"
]
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
- 404: 组不存在
- 500: 服务器内部错误

## 数据说明
- 组数据存储在 `data/group.json`
- 组与用户的关联关系通过用户的 groups 字段维护
- 组的权限信息通过 packageAuth 模块管理 