const path = require('path');
const verdaccioPath = path.resolve(__dirname, '../node_modules/verdaccio/bin/verdaccio');
const configPath = path.resolve(__dirname, 'config.yaml');
const logsPath = path.resolve(__dirname, 'logs');

module.exports = {
  apps: [{
    interpreter: 'node',
    name: "verdaccio_core",
    script: verdaccioPath,
    args: "--config " + configPath,
    error_file: logsPath + '/verdaccio-error.log',
    out_file: logsPath + '/verdaccio-out.log',
    log_date_format: 'YYYY-MM-DD HH:mm Z',
    exec_mode: "fork", 
    instances: 1,
    autorestart: true,
    watch: false,
    max_memory_restart: "1G",
  }]
}
