require('dotenv').config();

const express = require('express');
const app = express();

app.use(require('cors')());
app.use(express.static('public'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(require('cookie-parser')(process.env['COOKIE_SECRET'] || 's3cr#t'));
app.use(require('./auth/assert').decodeEmail);

app.get('/', (req, res) => {
    res.sendFile('index.html');
});
app.post('/users', require('./routes/session/signup'));
app.use('/session', require('./routes/session/login'));
app.use(['/seat', '/seats'], require('./routes/seat'));
app.use(['/user', '/users'], require('./routes/user'));
app.use('/blacklist', require('./routes/blacklist'));
app.use(require('./auth/error_handler'));

const PORT = process.env['PORT'] || 8080;
app.listen(PORT, () => {
    console.log(`Example app listening on http://localhost:${PORT}`);
});
