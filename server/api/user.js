// CommonJS 模块语法
const express = require('express');
const userControl =require('../control/user.js')

const router = express.Router();


// 查找用户（模糊搜索）
router.get('/search', async (req, res) => {
    try {
        const { keyword } = req.query;
        const users = await userControl.searchUsers(keyword);
        res.json(users);
    } catch (error) {
        console.error(error);
        res.status(400).json({ error: error.message });
    }
});

// 删除用户
router.delete('/:username', async (req, res) => {
    try {
        await userControl.deleteUser(req.params.username);
        res.status(200).json({ message: '用户删除成功' });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

// 修改用户分组
router.put('/:username/groups', async (req, res) => {
    try {
        const { groups } = req.body;
        if (!Array.isArray(groups)) {
            return res.status(400).json({ error: 'groups必须是数组' });
        }
        const user = await userControl.updateUserGroups(req.params.username, groups);
        res.json(user);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

module.exports = router;