const express = require('express');
const cors = require('cors');
const path = require('path');
const apiRouter = require('./api/index');
const controlManager = require('./control/index');
const fs = require('fs/promises');
const yaml = require('js-yaml');


async function updateConfigPaths() {
    const configPath = path.join(__dirname, 'verdacciorc', 'config.yaml');
    const configContent = await fs.readFile(configPath, 'utf8');
    
    // 解析YAML
    const config = yaml.load(configContent);
    
    // 处理存储路径
    if (config.storage === './storage') {
        config.storage = path.join(__dirname, 'verdacciorc', 'storage');
    }
    
    // 处理htpasswd路径
    if (config.auth?.htpasswd?.file === './htpasswd') {
        config.auth.htpasswd.file = path.join(__dirname, 'verdacciorc', 'htpasswd');
    }
    
    // 转换回YAML并写入文件
    const updatedContent = yaml.dump(config, {
        lineWidth: -1,  // 禁用行宽限制
        noRefs: true    // 避免别名引用
    });
    
    await fs.writeFile(configPath, updatedContent, 'utf8');
}

const app = express();
const port = process.env.PORT || 3000;

async function startServer() {
    try {
        // 更新配置文件路径
        await updateConfigPaths();
        
        // 初始化控制层
        await controlManager.initialize();

        // 中间件
        app.use(cors());
        app.use(express.json());

        // 静态文件
        app.use(express.static(path.join(__dirname, 'static')));

        // API路由
        app.use('/api', apiRouter);

        // 启动服务器
        app.listen(port, () => {
            console.log(`Server is running on port ${port}`);
        });
    } catch (error) {
        console.error('服务器启动失败:', error);
        process.exit(1);  // 如果初始化失败，退出进程
    }
}

// 启动服务器
startServer(); 