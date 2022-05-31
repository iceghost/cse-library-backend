// @ts-check

const express = require('express');
const { verifyAdmin } = require('./auth/admin');
const csrf = require('./auth/csrf');
const { verify } = require('./auth/oauth');
const { verifyEmail } = require('./auth/user');
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

app.get('/users/:uid', (req, res) => {
    // TODO: get user information?
    res.status(200);
    res.send(req.body.user);
});

// admin only zone
app.use(verifyAdmin);

app.post('/users/:uid/recept', async (req, res) => {
    const uid = parseInt(req.params.uid);
    if (isNaN(uid)) {
        res.status(400);
        res.send('uid must be a number');
        return;
    }
    const reception = await recept(uid, req.body.user);
    res.status(200);
    res.send(reception);
});

// app.put('/admins/:uid', async (req, res) => {
//     const uid = parseInt(req.params.uid);
//     if (isNaN(uid)) {
//         res.status(400);
//         res.send('uid must be a number');
//         return;
//     }
//     const admin = await promoteAdmin(uid);
//     res.status(200);
//     res.send(admin);
// });

app.listen(3000, () => {
    console.log(`Example app listening on http://localhost:3000`);
});
