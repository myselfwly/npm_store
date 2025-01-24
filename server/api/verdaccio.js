const express = require('express');
const verdaccioControl = require('../control/verdaccio.js');

const router = express.Router();

// 重启verdaccio
router.get('/restart', async (req, res) => {
    try {
        const result = await verdaccioControl.restartVerdaccio();
        if (result.success) {
            res.json({ success: true, message: result.message, pid: result.pid });
        } else {
            res.status(500).json({ success: false, message: result.message });
        }
    } catch (error) {
        console.error('重启verdaccio失败:', error);
        res.status(500).json({ success: false, message: error.message || '重启verdaccio失败' });
    }
});

// 启动verdaccio
router.get('/start', async (req, res) => {
    try {
        const result = await verdaccioControl.startVerdaccio();
        if (result.success) {
            res.json({ success: true, message: result.message, pid: result.pid });
        } else {
            res.status(500).json({ success: false, message: result.message });
        }
    } catch (error) {
        console.error('启动verdaccio失败:', error);
        res.status(500).json({ success: false, message: error.message || '启动verdaccio失败' });
    }
});

// 停止verdaccio
router.get('/stop', async (req, res) => {
    try {
        const result = await verdaccioControl.stopVerdaccio();
        if (result.success) {
            res.json({ success: true, message: result.message });
        } else {
            res.status(500).json({ success: false, message: result.message });
        }
    } catch (error) {
        console.error('停止verdaccio失败:', error);
        res.status(500).json({ success: false, message: error.message || '停止verdaccio失败' });
    }
});

module.exports = router;