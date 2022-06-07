// @ts-check

const express = require('express');
const { verifyAdmin } = require('./auth/admin');
const csrf = require('./auth/csrf');
const { verify } = require('./auth/oauth');
const { verifyEmail } = require('./auth/user');
const client = require('./db');
const { blacklist } = require('./db');
const blackList = require('./db/blacklist');
// const { promoteAdmin } = require('./db/admin');
const { login } = require('./db/login');
const { recept } = require('./db/recept');
const app = express();

app.use(express.static('public'));
app.use(express.urlencoded({ extended: true }));
app.use(require('cookie-parser')('s3cr#t'));

app.get('/', (req, res) => {
    res.sendFile('index.html');
});

app.post('/login', csrf, async (req, res, next) => {
    try {
        const email = await verify(req.body['credential']);
        res.cookie('email', email, {
            maxAge: 1000 * 60 * 60 * 24 * 7,
            signed: true,
        });
        res.status(200);
        res.send(await login(email));
    } catch {
        res.status(400);
        res.send('failed to verify token');
    }
});

// logged in only zone
app.use(verifyEmail);

// get the student who has just logged in
app.get('/users/:uid', (req, res) => {
    // TODO: get user information?
    res.status(200);
    res.send(req.body.user);
});

// add a student with uid to the reception list
app.post('/users/:uid/recept', async (req, res) => {
    const uid = parseInt(req.params.uid);
    if (isNaN(uid)) {
        res.status(400);
        res.send('uid must be a number');
        return;
    } else if(uid === req.body.id) {
        res.status(400);
        res.send('uid not found');
        return;
    }
    const reception = await recept(uid, req.body.user);
    console.log("REQ Body => ", req.body);
    res.status(200);
    res.send(reception);
});

// admin only zone
app.use(verifyAdmin);


app.get('/admins/blacklist', async (req, res) => {
    res.status(200);
    res.send(await blackList.blackListGetAll());
})


    //admin add 1 student to blacklist or delete it from blacklist
app.post('/admins/blacklist/:uid', async (req, res) => {
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

app.delete('/admins/blacklist/:uid', async (req, res) => {
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
    res.send(blacklist);
});

app.delete('/admins/blacklist', async (req, res) => {
    const blacklist = await blackList.blackListDeleteAll();
    // console.log("Admin => ", req.body.user);
    res.status(200);
    res.send(blacklist);
})

app.listen(3000, () => {
    console.log(`Example app listening on http://localhost:3000`);
});
