const express = require('express');
const groupRouter = require('./group');
const userRouter = require('./user');
const packageAuthRouter = require('./packageAuth');
const verdaccioRouter = require('./verdaccio');

const router = express.Router();

// 允许跨域请求
router.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Content-Type');
    if (req.method === 'OPTIONS') {
        return res.sendStatus(200);
    }
    next();
});

// 注册路由
router.use('/groups', groupRouter);
router.use('/users', userRouter);
router.use('/packages', packageAuthRouter);
router.use('/verdaccio', verdaccioRouter);

module.exports = router; 