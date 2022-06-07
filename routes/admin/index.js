const express = require('express');
const adminRoutes = express.Router();
const client = require('../../db');
const { blacklist } = require('../../db');
const blackList = require('../../db/blacklist');
// const { verifyAdmin } = require('../../auth/admin');

// adminRoutes.use(verifyAdmin);

adminRoutes.get('/blacklist', async (req, res) => {
    res.status(200);
    res.send(await blackList.blackListGetAll());
})

    //admin add 1 student to blacklist or delete it from blacklist
adminRoutes.post('/blacklist/:uid', async (req, res) => {
    const uid = parseInt(req.params.uid);
    if (isNaN(uid)) {
        res.status(400);
        res.send('uid must be a number');
        return;
    }
      var blacklist = await blackList.blackListCreate(uid);
    // const blacklist = await blackList.blackListDeleteAll();
    // console.log("Admin => ", req.body.user);
    res.status(200);
    res.send(blacklist);
});

adminRoutes.delete('/blacklist/:uid', async (req, res) => {
  const uid = parseInt(req.params.uid);
  if (isNaN(uid)) {
      res.status(400);
      res.send('uid must be a number');
      return;
  }
  // const admin = await promoteAdmin(uid);
  var blacklist;
  var student = await blackList.blackListGetOne(uid)
  if (student && uid === student.studentId) {
      blacklist = await blackList.blackListDeleteOne(uid)
    } else {
        res.status(400);
        res.send('student is not in the list');
    }
    // const blacklist = await blackList.blackListDeleteAll();
      console.log("After delete 1 stu ", blacklist);
    res.status(200);
    res.send(client.blacklist);
});

adminRoutes.delete('/blacklist', async (req, res) => {
    const blacklist = await blackList.blackListDeleteAll();
    // console.log("Admin => ", req.body.user);
    res.status(200);
    res.send(blacklist);
})

module.exports = adminRoutes;