// @ts-check

const express = require('express');
const app = express();

app.get('/', (req, res) => {
    res.send('hello world');
});

app.post('/login', (req, res) => {
    // TODO: login user
});

app.get('/users/:uid', (req, res) => {
    // TODO: get user information?
});

app.post('/users/:uid/recept', (req, res) => {
    // TODO: check-in/check-out user
});

app.put('/admins/:uid', (req, res) => {
    // TODO: add user as admin
});

app.listen(3000, () => {
    console.log(`Example app listening on http://localhost:3000`);
});
