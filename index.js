const express = require('express');
const app = express();

app.use(express.static('public'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(require('cookie-parser')('s3cr#t'));

app.use(require('./auth/assert').decodeEmail);

app.get('/', (req, res) => {
    res.sendFile('index.html');
});
app.post('/users', require('./routes/session/signup'));
app.post('/session', require('./routes/session/login'));
app.use(['/seat', '/seats'], require('./routes/seat'));
app.use(['/user', '/users'], require('./routes/users'));
app.use('/blacklist', require('./routes/blacklist'));
app.use(require('./auth/error_handler'));

app.listen(3000, () => {
    console.log(`Example app listening on http://localhost:3000`);
});
