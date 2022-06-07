// @ts-check

const express = require('express');
const { verifyAdmin } = require('./auth/admin');
const csrf = require('./auth/csrf');
const { verify } = require('./auth/oauth');
const { verifyEmail } = require('./auth/user');
const { login } = require('./db/login');
const adminRoutes = require('./routes/admin');
const userRoutes = require('./routes/users');
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
app.use('/users', userRoutes)


// admin only zone
app.use(verifyAdmin);
app.use('/admins', adminRoutes);


app.listen(3000, () => {
    console.log(`Example app listening on http://localhost:3000`);
});
