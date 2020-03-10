const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/userModel');
const ErrorHandler = require('../utils/error');
const errorController = require('./errorController');

const createJWT = id => {
    return jwt.sign({ id: id }, process.env.JWT_SECRET_KEY, {
        expiresIn: process.env.JWT_EXPIRATION
    });
};

exports.register = async (req, res, next) => {
    try {
        const newUser = new User({
            email: req.body.email,
            username: req.body.username,
            password: req.body.password,
            passwordConfirm: req.body.passwordConfirm,
            discount: req.body.discount
        });

        await newUser.save();
        res.json({
            status: 'Success',
            message: 'User created'
        });
    } catch (err) {
        const appError = errorController.handleMongoError(err);
        next(appError);
    }
};

exports.login = async (req, res, next) => {
    const { email, password } = req.body;
    if (email && password) {
        const user = await User.findOne({
            email
        }).select('+password');

        const passwdComparision = await bcrypt.compare(password, user.password);

        if (!user || !passwdComparision)
            return next(new ErrorHandler(401, 'Invalid email or password'));

        const token = createJWT(user._id);

        res.status(200).json({
            status: 'Success',
            message: 'User logged in',
            token
        });
    } else return next(new ErrorHandler(400, 'Missing email or password'));
};
