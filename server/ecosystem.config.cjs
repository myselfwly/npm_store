const path = require('path');
// 获取当前文件的绝对路径
const indexPath = path.resolve(__dirname, './index.js');
const logsPath = path.resolve(__dirname, './logs');
module.exports = {
  apps: [{
    interpreter: 'node',
    name: "verdaccio_control",
    script: indexPath,
    error_file: logsPath + '/control-error.log',
    out_file: logsPath + '/control-out.log',
    log_date_format: 'YYYY-MM-DD HH:mm Z',
    exec_mode: "fork",
    instances: 1,
    autorestart: true,
    watch: false,
    max_memory_restart: "1G",
  }]
}
