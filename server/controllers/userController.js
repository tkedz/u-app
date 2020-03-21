const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const User = require('../models/userModel');
const ErrorHandler = require('../utils/error');
const errorController = require('./errorController');
const Email = require('../utils/email');

const createJWT = id => {
    return jwt.sign({ id: id }, process.env.JWT_SECRET_KEY, {
        expiresIn: process.env.JWT_EXPIRATION
    });
};

const createResetToken = user => {
    const token = crypto.randomBytes(16).toString('hex');
    user.passwordResetToken = crypto
        .createHash('sha256')
        .update(token)
        .digest('hex');

    user.passwordResetTokenExpiration = Date.now() + 3600000;
    return token;
};

exports.register = async (req, res, next) => {
    try {
        //checking if email or username are not taken
        let user = await User.findOne({ email: req.body.email });
        if (user) return next(new ErrorHandler(200, 'Email is already taken'));
        user = await User.findOne({ username: req.body.username });
        if (user)
            return next(new ErrorHandler(200, 'Username is already taken'));

        const newUser = new User({
            email: req.body.email,
            username: req.body.username,
            password: req.body.password,
            passwordConfirm: req.body.passwordConfirm,
            discount: req.body.discount,
            unlimited: req.body.unlimited
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

        if (!user)
            return next(new ErrorHandler(404, 'Invalid email or passowrd'));

        const passwdComparision = await bcrypt.compare(password, user.password);

        if (!passwdComparision)
            return next(new ErrorHandler(404, 'Invalid email or password'));

        const token = createJWT(user._id);

        res.status(200).json({
            status: 'Success',
            message: 'User logged in',
            token
        });
    } else return next(new ErrorHandler(400, 'Missing email or password'));
};

exports.forgotPassword = async (req, res, next) => {
    const user = await User.findOne({ email: req.body.email });
    if (!user) return next(new ErrorHandler(404, 'User not found'));

    //create reset token
    const token = createResetToken(user);

    //try to send an email
    try {
        const url = `${req.protocol}://localhost:8080/reset-password/${token}`;
        await Email.sendPasswordReset(user.email, url);
        //save user with reset token when sending an email went good
        await user.save({ validateBeforeSave: false });

        res.status(200).json({
            status: 'success',
            message: 'Reset token sent to email'
        });
    } catch (err) {
        console.log(err);
        return next(
            new ErrorHandler(500, 'Something went wrong with sending an email')
        );
    }
};

exports.resetPassword = async (req, res, next) => {
    const token = crypto
        .createHash('sha256')
        .update(req.params.token)
        .digest('hex');

    try {
        const user = await User.findOne({
            passwordResetToken: token,
            passwordResetExpires: { $gt: Date.now() }
        });

        if (!user) {
            return next(
                new ErrorHandler(401, 'Token is invalid or has expired')
            );
        }
        user.password = req.body.password;
        user.passwordConfirm = req.body.passwordConfirm;
        user.passwordResetToken = undefined;
        user.passwordResetTokenExpiration = undefined;
        await user.save();

        res.status(200).json({
            status: 'success',
            message: 'Password changed'
        });
    } catch (err) {
        const appError = errorController.handleMongoError(err);
        next(appError);
    }
};
