const { assertAdmin } = require('../../auth/assert');
const express = require('express');
const client = require('../../db');
const blackList = require('../../db/blacklist');
// const { verifyAdmin } = require('../../auth/admin');

/**
 * get all user in blacklist
 * @type {import('express').Handler}
 */
const getAllHandler = async (req, res) => {
    assertAdmin(req.user);
    res.status(200);
    res.send(await blackList.blackListGetAll());
};

/**
 * admin add 1 user to blacklist or delete it from blacklist
 * @type {import('express').Handler}
 */
const postOneHandler = async (req, res) => {
    assertAdmin(req.user);
    const uid = parseInt(req.params.uid);
    if (isNaN(uid)) {
        res.status(400);
        res.send('uid must be a number');
        return;
    }
    try {
        var blacklist = await blackList.blackListCreate(uid, req.user.admin);
        // const blacklist = await blackList.blackListDeleteAll();
        // console.log("Admin => ", req.body.user);
        res.status(200);
        res.send(blacklist);
    } catch (e) {
        res.status(400).send("user already in blacklist");
    }
};

/** @type {import('express').Handler} */
const deleteOneHandler = async (req, res) => {
    assertAdmin(req.user);
    const uid = parseInt(req.params.uid);
    if (isNaN(uid)) {
        res.status(400);
        res.send('uid must be a number');
        return;
    }
    // const admin = await promoteAdmin(uid);
    var blacklist;
    var user = await blackList.blackListGetOne(uid);
    if (user && uid === user.userId) {
        blacklist = await blackList.blackListDeleteOne(uid, req.user.admin);
    } else {
        res.status(400);
        res.send('user is not in the list');
    }
    // const blacklist = await blackList.blackListDeleteAll();
    console.log('After delete 1 stu ', blacklist);
    res.status(200);
    res.send(client.blacklist);
};

/** @type {import('express').Handler} */
const deleteAllHandler = async (req, res) => {
    assertAdmin(req.user);
    const blacklist = await blackList.blackListDeleteAll(req.user.admin);
    // console.log("Admin => ", req.body.user);
    res.status(200);
    res.send(blacklist);
};

const blacklistRouter = express.Router();
blacklistRouter.get('/', getAllHandler);
blacklistRouter.post('/:uid', postOneHandler);
blacklistRouter.delete('/:uid', deleteOneHandler);
blacklistRouter.delete('/', deleteAllHandler);
module.exports = blacklistRouter;
