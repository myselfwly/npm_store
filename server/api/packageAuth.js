const express = require('express');
const packageAuthControl = require('../control/packageAuth.js');

const router = express.Router();

// 查找包权限（根据name模糊查询）
router.get('/search', async (req, res) => {
    try {
        const { keyword } = req.query;
        const packages = await packageAuthControl.searchPackageAuth(keyword);
        res.json(packages);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

// 删除包权限
router.delete('/:name', async (req, res) => {
    try {
        const name = decodeURIComponent(req.params.name);
        await packageAuthControl.deletePackageAuth(name);
        res.status(200).json({ message: '包权限配置删除成功' });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

// 新增包权限
router.post('/', async (req, res) => {
    try {
        const newPackage = await packageAuthControl.addPackageAuth(req.body);
        res.status(201).json(newPackage);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

// 修改包权限配置
router.put('/:name', async (req, res) => {
    try {
        const name = decodeURIComponent(req.params.name);
        const updatedPackage = await packageAuthControl.updatePackageAuth(
            name,
            req.body
        );
        res.json(updatedPackage);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

module.exports = router; 