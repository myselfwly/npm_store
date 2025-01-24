const { exec } = require('child_process');
const path = require('path');

const userControl = require('./user.js');
const authControl = require('./packageAuth.js');

const beforeStart = async () => {
  await userControl.syncHtpasswdUsers();
  await authControl.syncAuthToConfig();
  return true;
}

const execCommand = (command) => {
  return new Promise((resolve, reject) => {
    exec(command, (error, stdout, stderr) => {
      if (error) {
        reject(new Error(`执行命令失败: ${error.message}`));
        return;
      }
      resolve(stdout);
    });
  });
};

const startVerdaccio = async () => {
  try {
    await beforeStart();
    const configPath = path.join(__dirname, '../verdacciorc/ecosystem.config.cjs');
    const startCommand = `pm2 start ${configPath}`;
    await execCommand(startCommand);
    return { success: true, message: 'verdaccio启动成功' };
  } catch (error) {
    return { success: false, message: `verdaccio启动失败: ${error.message}` };
  }
};

const stopVerdaccio = async () => {
  try {
    const configPath = path.join(__dirname, '../verdacciorc/ecosystem.config.cjs');
    const config = require(configPath);
    const processName = config.apps[0].name;
    const stopCommand = `pm2 stop "${processName}"`;
    await execCommand(stopCommand);
    return { success: true, message: 'verdaccio停止成功' };
  } catch (error) {
    return { success: false, message: `verdaccio停止失败: ${error.message}` };
  }
};

const restartVerdaccio = async () => {
  try {
    await beforeStart();
    const configPath = path.join(__dirname, '../verdacciorc/ecosystem.config.cjs');
    const config = require(configPath);
    const processName = config.apps[0].name;
    const restartCommand = `pm2 restart "${processName}"`;
    await execCommand(restartCommand);
    return { success: true, message: 'verdaccio重启成功' };
  } catch (error) {
    return { success: false, message: `verdaccio重启失败: ${error.message}` };
  }
};

module.exports = { startVerdaccio, stopVerdaccio, restartVerdaccio };