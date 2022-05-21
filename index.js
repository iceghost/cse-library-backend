// @ts-check

const express = require('express');
const app = express();

app.get('/', (req, res) => {
    res.send('hello world');
});

app.listen(3000, () => {
    console.log(`Example app listening on http://localhost:3000`);
});
