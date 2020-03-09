const express = require('express');
const mongoSanitize = require('express-mongo-sanitize');
const userRouter = require('./routes/userRoutes');

const app = express();
app.use(express.json());
app.use(mongoSanitize());
app.use('/api/users', userRouter);

app.use((err, req, res, next) => {});

module.exports = app;
