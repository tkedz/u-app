const express = require('express');
const mongoSanitize = require('express-mongo-sanitize');
const userRouter = require('./routes/userRoutes');
const movieRouter = require('./routes/movieRoutes');

const app = express();
app.use(express.json());
app.use(mongoSanitize());
app.use('/api/users', userRouter);
app.use('/api/movies', movieRouter);

app.use((err, req, res, next) => {
    // eslint-disable-next-line no-console
    console.log(err);
    res.status(err.statusCode).json({
        status: 'error',
        messsage: err.message
    });
});

module.exports = app;
