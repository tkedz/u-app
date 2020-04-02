const express = require('express');
const cors = require('cors');
const mongoSanitize = require('express-mongo-sanitize');
const userRouter = require('./routes/userRoutes');
const movieRouter = require('./routes/movieRoutes');
const ratingRouter = require('./routes/ratingRoutes');

const app = express();
app.use(cors());
app.use(express.json());
app.use(mongoSanitize());
app.use('/api/users', userRouter);
app.use('/api/movies', movieRouter);
app.use('/api/ratings', ratingRouter);

app.use((err, req, res, next) => {
    // eslint-disable-next-line no-console
    console.log(err);
    res.status(err.statusCode).send({
        status: 'error',
        message: err.message
    });
});

module.exports = app;
