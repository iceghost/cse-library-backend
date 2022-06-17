require('dotenv').config();

const express = require('express');
const app = express();

const whitelist = [
    'http://localhost:3000',
    'https://eb2d-123-20-186-132.ap.ngrok.io',
];

app.use(
    require('cors')({
        credentials: true,
        origin: function (origin, callback) {
            if (!origin || whitelist.indexOf(origin) !== -1) {
                callback(null, true);
            } else {
                callback(new Error(`${origin} not allowed by CORS`));
            }
        },
    })
);

app.use(express.static('public'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(require('cookie-parser')(process.env['COOKIE_SECRET'] || 's3cr#t'));
app.use(require('./auth/assert').decodeEmail);

app.get('/', (req, res) => {
    res.sendFile('index.html');
});
app.post('/users', require('./routes/session/signup'));
app.delete('/session', require('./routes/session/logout'));
app.use('/session', require('./routes/session/login'));
app.use(['/seat', '/seats'], require('./routes/seat'));
app.use(['/user', '/users'], require('./routes/user'));
app.use(['/checkin', '/checkins'], require('./routes/checkin'));
app.use('/blacklist', require('./routes/blacklist'));
app.use(require('./auth/error_handler'));

const PORT = process.env['PORT'] || 8080;
app.listen(PORT, () => {
    console.log(`Example app listening on http://localhost:${PORT}`);
});
