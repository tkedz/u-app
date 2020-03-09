const mongoose = require('mongoose');
const app = require('./app');

const db = process.env.DATABASE.replace(
    '<password>',
    process.env.DATABASE_PASSWORD
);

mongoose.connect(
    db,
    { useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true },
    () => {
        console.log('Connected to database');
    }
);

const port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log(`Listening on port ${port}`);
});
