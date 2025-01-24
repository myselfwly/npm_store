
const express = require('express');
const groupControl = require('../control/group.js');
const router = express.Router();

// 新增group
router.post('/', async (req, res) => {
    try {
        const { name, description } = req.body;
        if (!name) {
            return res.status(400).json({ error: 'Group name is required' });
        }
        const newGroup = await groupControl.addGroup(name, description);
        res.status(201).json(newGroup);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

// 删除group
router.delete('/:name', async (req, res) => {
    try {
        await groupControl.deleteGroup(req.params.name);
        res.status(200).json({ message: 'Group deleted successfully' });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

// 查找group（模糊查询）
router.get('/search', async (req, res) => {
    try {
        const { keyword } = req.query;
        const groups = await groupControl.searchGroups(keyword);
        res.json(groups);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

// 查找组成员
router.get('/:name/members', async (req, res) => {
    try {
        const members = await groupControl.getGroupMembers(req.params.name);
        res.json(members);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

module.exports = router;