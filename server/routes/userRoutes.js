const express = require('express');
const User = require('../models/userModel');

const router = express.Router();

router.post('/register', async (req, res, next) => {
    try {
        const newUser = new User({
            email: req.body.email,
            username: req.body.username,
            password: req.body.password,
            passwordConfirm: req.body.passwordConfirm
        });

        await newUser.save();
        res.json({ status: 'Success' });
    } catch (err) {
        console.log(err);
        next(err);
    }
});

module.exports = router;
