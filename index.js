const express = require('express');
const loginRouter = require('./routes/login');
const seatRouter = require('./routes/seat')
const adminRoutes = require('./routes/admin');
const userRoutes = require('./routes/users');
const errorHandler = require('./auth/error_handler');
const app = express();

app.use(express.static('public'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(require('cookie-parser')('s3cr#t'));

app.get('/', (req, res) => {
    res.sendFile('index.html');
});
app.use(seatRouter)
app.use(loginRouter);
app.use(userRoutes);
app.use(adminRoutes);
app.use(errorHandler);

app.listen(3000, () => {
    console.log(`Example app listening on http://localhost:3000`);
});
